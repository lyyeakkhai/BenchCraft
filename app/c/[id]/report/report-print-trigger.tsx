'use client';

import { Printer } from 'lucide-react';

export function ReportPrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-ledger px-4 py-2 text-xs cursor-pointer"
    >
      <Printer className="w-4 h-4" /> Print or Save as PDF
    </button>
  );
}
