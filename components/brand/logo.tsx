export function Logo({ className = 'h-8' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-2.5 font-serif font-bold text-xl tracking-tight text-[#0C3838] ${className}`}>
      {/* 3-bar ascending chart logo from BenchCraft cover page */}
      <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <rect x="3" y="14" width="4" height="7" rx="1" fill="#D97706" />
        <rect x="10" y="8" width="4" height="13" rx="1" fill="#164E4E" />
        <rect x="17" y="3" width="4" height="18" rx="1" fill="#0C3838" />
      </svg>
      <span className="font-semibold text-lg text-[#0C3838] tracking-tight">BenchCraft</span>
    </div>
  );
}
