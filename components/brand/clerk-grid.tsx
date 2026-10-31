'use client';

import React from 'react';

interface ClerkCrosshairProps {
  position?: 'tl' | 'tr' | 'bl' | 'br';
  className?: string;
}

export function ClerkCrosshair({ position = 'tl', className = '' }: ClerkCrosshairProps) {
  const posClasses = {
    tl: '-top-2 -left-2',
    tr: '-top-2 -right-2',
    bl: '-bottom-2 -left-2',
    br: '-bottom-2 -right-2',
  }[position];

  return (
    <div
      aria-hidden="true"
      className={`absolute w-4 h-4 pointer-events-none select-none z-20 flex items-center justify-center text-accent/60 group-hover:text-accent transition-colors ${posClasses} ${className}`}
    >
      <svg
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className="w-full h-full stroke-current"
      >
        <path d="M8 1V15M1 8H15" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
}

interface ClerkLaserDividerProps {
  label?: string;
  sublabel?: string;
  dashed?: boolean;
  className?: string;
}

export function ClerkLaserDivider({
  label,
  sublabel,
  dashed = false,
  className = '',
}: ClerkLaserDividerProps) {
  return (
    <div className={`relative w-full my-6 sm:my-10 ${className}`}>
      {/* 4 Intersection Crosshairs */}
      <ClerkCrosshair position="tl" />
      <ClerkCrosshair position="tr" />

      {/* Main Divider Line */}
      <div
        className={`w-full h-[1px] relative overflow-hidden ${
          dashed ? 'border-t border-dashed border-rule-2 dark:border-white/10' : 'bg-rule'
        }`}
      >
        {/* Animated Emerald Laser Beam */}
        <div className="absolute inset-y-0 w-48 bg-gradient-to-r from-transparent via-accent to-transparent opacity-85 blur-[0.5px] animate-laser-sweep" />
      </div>

      {/* Optional Coordinate Badge in Center */}
      {label && (
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 px-3 py-1 rounded-full glass-card border border-rule text-[11px] font-outlier font-semibold uppercase tracking-wider text-muted flex items-center gap-2 shadow-xs">
          <span className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse-dot" />
          <span>{label}</span>
          {sublabel && (
            <>
              <span className="text-rule">/</span>
              <span className="text-ink font-mono">{sublabel}</span>
            </>
          )}
        </div>
      )}
    </div>
  );
}

interface ClerkBentoChassisProps {
  children: React.ReactNode;
  className?: string;
  laser?: boolean;
}

export function ClerkBentoChassis({
  children,
  className = '',
  laser = true,
}: ClerkBentoChassisProps) {
  return (
    <div
      className={`clerk-bento-chassis bg-dot-matrix group relative transition-all duration-300 ${className}`}
    >
      {/* 4 Precision Corner Crosshairs */}
      <ClerkCrosshair position="tl" />
      <ClerkCrosshair position="tr" />
      <ClerkCrosshair position="bl" />
      <ClerkCrosshair position="br" />

      {/* Glowing Emerald Top Laser Accent */}
      {laser && (
        <div className="absolute inset-x-8 top-0 h-[1.5px] bg-gradient-to-r from-transparent via-accent to-transparent opacity-70 group-hover:opacity-100 transition-opacity" />
      )}

      {/* Inner Elevated Specimen */}
      <div className="relative z-10 w-full h-full">{children}</div>
    </div>
  );
}
