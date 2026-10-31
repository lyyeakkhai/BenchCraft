'use client';

import { Printer } from 'lucide-react';

export function ReportPrintTrigger() {
  return (
    <button
      onClick={() => window.print()}
      className="inline-flex items-center gap-1.5 px-4 py-2 bg-[#0C3838] text-white rounded-lg text-xs font-semibold hover:bg-[#164E4E] transition cursor-pointer"
    >
      <Printer className="w-4 h-4" /> Print or Save as PDF
    </button>
  );
}
