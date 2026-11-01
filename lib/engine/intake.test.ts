import { describe, it, expect } from 'vitest';
import { resolveBusinessInput, ExtractedDocument } from './intake';

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
