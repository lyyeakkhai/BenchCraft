'use client';

import { Printer } from 'lucide-react';

export function ReportPrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="btn-ledger text-xs px-4 py-2 cursor-pointer shadow-xs"
    >
      <Printer className="w-4 h-4" /> Print or Save Executive PDF
    </button>
  );
}
