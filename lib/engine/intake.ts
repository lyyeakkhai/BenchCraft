import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

export interface ExtractedDocument {
  name: string;
  type: string;
  size: number;
  content: string;
}

export async function processUploadedFile(file: File): Promise<ExtractedDocument> {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    throw new Error(`File "${file.name}" exceeds the 10MB size limit.`);
  }

  const name = file.name;
  const type = file.type || 'text/plain';
  const buffer = Buffer.from(await file.arrayBuffer());

  let content = '';

  if (name.endsWith('.docx') || type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
    try {
      const result = await mammoth.extractRawText({ buffer });
      content = result.value;
    } catch {
      throw new Error(`Could not parse DOCX file: ${name}`);
    }
  } else if (name.endsWith('.xlsx') || name.endsWith('.xls') || type.includes('spreadsheet') || type.includes('excel')) {
    try {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetTexts: string[] = [];
      for (const sheetName of workbook.SheetNames) {
        const sheet = workbook.Sheets[sheetName];
        if (sheet) {
          const csv = XLSX.utils.sheet_to_csv(sheet);
          if (csv && csv.trim()) {
            sheetTexts.push(`[Sheet: ${sheetName}]\n${csv.trim()}`);
          }
        }
      }
      content = sheetTexts.join('\n\n');
    } catch (err) {
      console.warn(`Could not parse Excel spreadsheet: ${name}`, err);
      content = `[Excel Spreadsheet: ${name}, Size: ${(file.size / 1024).toFixed(1)} KB]`;
    }
  } else if (name.endsWith('.csv') || type === 'text/csv') {
    content = buffer.toString('utf-8');
  } else if (name.endsWith('.txt') || name.endsWith('.md') || type.includes('text')) {
    content = buffer.toString('utf-8');
  } else if (name.endsWith('.pdf') || type === 'application/pdf') {
    // For PDF files, extract basic readable text streams or metadata
    const rawStr = buffer.toString('utf-8');
    // Extract readable text chunks if uncompressed
    const textMatches = rawStr.match(/\(([^()]+)\)[\s]*Tj/g);
    if (textMatches && textMatches.length > 5) {
      content = textMatches.map((m) => m.replace(/[\(\)Tj\s]/g, '')).join(' ');
    } else {
      content = `[PDF Document: ${name}, Size: ${(file.size / 1024).toFixed(1)} KB. PDF business context submitted.]`;
    }
  } else {
    content = buffer.toString('utf-8').slice(0, 50000);
  }

  return {
    name,
    type,
    size: file.size,
    content: content.trim().slice(0, 60000), // Cap context to avoid token overflow
  };
}

export interface ResolveBusinessInputParams {
  description?: string | null;
  documents: ExtractedDocument[];
}

export interface ResolveBusinessInputResult {
  isValid: boolean;
  effectiveDescription: string;
  error?: string;
}

export function resolveBusinessInput(params: ResolveBusinessInputParams): ResolveBusinessInputResult {
  const rawDesc = (params.description || '').trim();
  const hasDocuments = params.documents && params.documents.length > 0;

  if (rawDesc.length < 10 && !hasDocuments) {
    return {
      isValid: false,
      effectiveDescription: '',
      error: 'Please describe your business use case (at least 10 characters) or upload a business document.',
    };
  }

  if (rawDesc.length >= 10 && !hasDocuments) {
    return {
      isValid: true,
      effectiveDescription: rawDesc,
    };
  }

  const docSummaryBlock = params.documents
    .map((doc) => `[Document: ${doc.name}]\n${doc.content.slice(0, 500)}`)
    .join('\n\n');

  if (rawDesc.length >= 10) {
    return {
      isValid: true,
      effectiveDescription: `${rawDesc}\n\nAttached Business Documents:\n${docSummaryBlock}`,
    };
  }

  const prefix = rawDesc ? `${rawDesc}\n\n` : '';
  return {
    isValid: true,
    effectiveDescription: `${prefix}Business details derived from uploaded documents:\n${docSummaryBlock}`,
  };
}

