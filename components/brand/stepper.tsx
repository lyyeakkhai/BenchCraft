import Link from 'next/link';

interface StepperProps {
  currentStep: 1 | 2 | 3;
  comparisonId?: string;
  businessTitle?: string;
  isSample?: boolean;
}

export function Stepper({ currentStep, comparisonId, businessTitle, isSample = false }: StepperProps) {
  return (
    <div className="w-full bg-white border-b border-[#D3DDD8] px-4 sm:px-6 py-2.5 flex items-center justify-between gap-4">
      {/* Steps Indicator */}
      <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm">
        {/* Step 1 */}
        <div
          className={`flex items-center gap-2 ${
            currentStep === 1 ? 'font-semibold text-[#0A2E2B]' : currentStep > 1 ? 'text-[#0A2E2B]' : 'text-[#4B605C]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              currentStep === 1
                ? 'bg-[#0A2E2B] text-white'
                : currentStep > 1
                ? 'bg-[#1F5C55] text-white'
                : 'border border-[#A9BDB7] text-[#4B605C]'
            }`}
          >
            {currentStep > 1 ? (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              '1'
            )}
          </span>
          <span>Describe</span>
        </div>

        <span className="w-4 sm:w-6 h-[1.5px] bg-[#A9BDB7]" />

        {/* Step 2 */}
        <div
          className={`flex items-center gap-2 ${
            currentStep === 2 ? 'font-semibold text-[#0A2E2B]' : currentStep > 2 ? 'text-[#0A2E2B]' : 'text-[#4B605C]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              currentStep === 2
                ? 'bg-[#0A2E2B] text-white'
                : currentStep > 2
                ? 'bg-[#1F5C55] text-white'
                : 'border border-[#A9BDB7] text-[#4B605C]'
            }`}
          >
            {currentStep > 2 ? (
              <svg width="12" height="12" viewBox="0 0 14 14" fill="none">
                <path d="M2.5 7.5l3 3 6-6.5" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            ) : (
              '2'
            )}
          </span>
          <span>Compare</span>
        </div>

        <span className="w-4 sm:w-6 h-[1.5px] bg-[#A9BDB7]" />

        {/* Step 3 */}
        <div
          className={`flex items-center gap-2 ${
            currentStep === 3 ? 'font-semibold text-[#0A2E2B]' : 'text-[#4B605C]'
          }`}
        >
          <span
            className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold ${
              currentStep === 3
                ? 'bg-[#0A2E2B] text-white'
                : 'border border-[#A9BDB7] text-[#4B605C]'
            }`}
          >
            3
          </span>
          <span>Decide</span>
        </div>
      </div>

      {/* Business Identity Tag */}
      {businessTitle && (
        <div className="flex items-center gap-2 text-xs text-[#4B605C]">
          <span className="border border-[#D3DDD8] rounded-full px-2.5 py-0.5 text-[11px] font-medium hidden sm:inline-block">
            {isSample ? 'Sample data' : 'Empirical audit'}
          </span>
          <span className="font-semibold text-[#0A2E2B] truncate max-w-[140px] sm:max-w-[200px]">
            {businessTitle}
          </span>
          <span className="w-6 h-6 rounded-full bg-[#0A2E2B] text-white text-xs font-semibold flex items-center justify-center flex-shrink-0">
            {businessTitle.charAt(0).toUpperCase()}
          </span>
        </div>
      )}
    </div>
  );
}
