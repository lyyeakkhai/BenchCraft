import { describe, it, expect } from 'vitest';
import * as XLSX from 'xlsx';
import { resolveBusinessInput, processUploadedFile, ExtractedDocument } from './intake';

describe('resolveBusinessInput', () => {
  it('accepts valid text description without files', () => {
    const desc = 'We sell coffee and pastries in Phnom Penh via delivery app.';
    const result = resolveBusinessInput({ description: desc, documents: [] });
    expect(result.isValid).toBe(true);
    expect(result.effectiveDescription).toContain('We sell coffee and pastries');
  });

  it('accepts empty text description if valid documents are uploaded', () => {
    const docs: ExtractedDocument[] = [
      {
        name: 'Business-Workflow.pdf',
        type: 'application/pdf',
        size: 1024,
        content: 'Customer ordering workflow for retail apparel store with telegram bot.',
      },
    ];
    const result = resolveBusinessInput({ description: '', documents: docs });
    expect(result.isValid).toBe(true);
    expect(result.effectiveDescription).toContain('Business-Workflow.pdf');
    expect(result.effectiveDescription).toContain('Customer ordering workflow');
  });

  it('rejects when both description and documents are missing or empty', () => {
    const result = resolveBusinessInput({ description: '   ', documents: [] });
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please describe your business use case (at least 10 characters) or upload a business document.');
  });

  it('rejects when description is under 10 characters and no documents uploaded', () => {
    const result = resolveBusinessInput({ description: 'Shop', documents: [] });
    expect(result.isValid).toBe(false);
    expect(result.error).toBe('Please describe your business use case (at least 10 characters) or upload a business document.');
  });

  it('combines text description and uploaded documents when both are present', () => {
    const desc = 'We sell women fashion online in Cambodia.';
    const docs: ExtractedDocument[] = [
      {
        name: 'FAQ.docx',
        type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        size: 2048,
        content: 'Q: What is delivery time? A: 1-2 days inside Phnom Penh.',
      },
    ];
    const result = resolveBusinessInput({ description: desc, documents: docs });
    expect(result.isValid).toBe(true);
    expect(result.effectiveDescription).toContain(desc);
  });
});

describe('processUploadedFile formats', () => {
  it('processes CSV file correctly', async () => {
    const csvContent = 'Customer,Issue,Resolution\nJohn,Order Delay,Expedited\nAlice,Size Exchange,Approved';
    const file = new File([csvContent], 'support-cases.csv', { type: 'text/csv' });
    const doc = await processUploadedFile(file);
    expect(doc.name).toBe('support-cases.csv');
    expect(doc.content).toContain('Order Delay');
    expect(doc.content).toContain('Size Exchange');
  });

  it('processes XLSX spreadsheet correctly', async () => {
    const wb = XLSX.utils.book_new();
    const ws = XLSX.utils.aoa_to_sheet([
      ['Product', 'SKU', 'DeliveryPolicy'],
      ['Silk Dress', 'SKU-001', 'Free in Cambodia'],
    ]);
    XLSX.utils.book_append_sheet(wb, ws, 'Catalog');
    const buffer = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' });
    const file = new File([buffer], 'catalog.xlsx', {
      type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    });

    const doc = await processUploadedFile(file);
    expect(doc.name).toBe('catalog.xlsx');
    expect(doc.content).toContain('[Sheet: Catalog]');
    expect(doc.content).toContain('Silk Dress');
    expect(doc.content).toContain('Free in Cambodia');
  });
});
