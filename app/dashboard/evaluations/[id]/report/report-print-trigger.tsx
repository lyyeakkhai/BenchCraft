'use client';

import { Printer } from 'lucide-react';

export function ReportPrintTrigger() {
  return (
    <button
      type="button"
      onClick={() => window.print()}
      className="btn-ledger btn-sm"
    >
      <Printer className="w-4 h-4" aria-hidden="true" /> Print PDF
    </button>
  );
}
