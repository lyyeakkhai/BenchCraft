import Image from 'next/image';

export function Logo({
  variant = 'light',
  className = 'h-8',
}: {
  variant?: 'light' | 'dark';
  className?: string;
}) {
  return (
    <div className={`flex items-center gap-2 select-none ${className}`}>
      {/* Official BenchCraft SVG Mark from Brand Assets */}
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 4 96 90"
        className="h-8 w-auto flex-shrink-0"
        role="img"
        aria-label="BenchCraft"
      >
        <defs>
          <mask id="bc-cut" maskUnits="userSpaceOnUse" x="0" y="0" width="96" height="96">
            <rect width="96" height="96" fill="#fff" />
            <rect x="8" y="28.4" width="24" height="3.2" fill="#000" />
          </mask>
        </defs>
        <path d="M10 78V14A6 6 0 0 1 16 8H24A6 6 0 0 1 30 14V78Z" fill="#0A2E2B" mask="url(#bc-cut)" />
        <path d="M38 78V36A6 6 0 0 1 44 30H52A6 6 0 0 1 58 36V78Z" fill="#B87A14" />
        <path d="M66 78V58A6 6 0 0 1 72 52H80A6 6 0 0 1 86 58V78Z" fill="#0A2E2B" />
        <rect x="4" y="83" width="88" height="7" rx="3.5" fill="#0A2E2B" />
      </svg>
      <span className="font-serif font-bold text-xl tracking-tight text-[#0A2E2B]">
        BenchCraft
      </span>
    </div>
  );
}
