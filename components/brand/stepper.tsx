interface StepperProps {
  currentStep: 1 | 2 | 3;
  comparisonId?: string;
  businessTitle?: string;
  isSample?: boolean;
}

export function Stepper({ currentStep, businessTitle, isSample = false }: StepperProps) {
  return (
    <div className="w-full glass-card px-4 sm:px-6 py-3.5 flex items-center justify-between gap-4">
      <div className="steps">
        <div className={`step ${currentStep === 1 ? 'on' : currentStep > 1 ? 'done' : ''}`}>
          <span className="n font-outlier">
            {currentStep > 1 ? (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2.5 7.5l3 3 6-6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              '01'
            )}
          </span>
          <span>Formulate</span>
        </div>

        <span className="sep" aria-hidden="true" />

        <div className={`step ${currentStep === 2 ? 'on' : currentStep > 2 ? 'done' : ''}`}>
          <span className="n font-outlier">
            {currentStep > 2 ? (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none" aria-hidden="true">
                <path
                  d="M2.5 7.5l3 3 6-6.5"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ) : (
              '02'
            )}
          </span>
          <span>Blinded Arena</span>
        </div>

        <span className="sep" aria-hidden="true" />

        <div className={`step ${currentStep === 3 ? 'on' : ''}`}>
          <span className="n font-outlier">03</span>
          <span>Right-Size Decision</span>
        </div>
      </div>

      {businessTitle && (
        <div className="flex items-center gap-2 text-xs text-muted">
          <span className="pill emerald hidden sm:inline-flex text-[11px]">
            {isSample ? 'Sample Audit' : 'Empirical Audit'}
          </span>
          <span className="font-semibold text-ink truncate max-w-[160px] sm:max-w-[220px]">
            {businessTitle}
          </span>
          <span className="w-6 h-6 rounded-pill bg-accent text-accent-ink text-xs font-outlier font-bold flex items-center justify-center flex-shrink-0">
            {businessTitle.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
