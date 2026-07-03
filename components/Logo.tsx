export function Logo({ className = "" }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        viewBox="0 0 1000 1000" 
        width="40" 
        height="40" 
        className="flex-shrink-0"
      >
        <rect width="1000" height="1000" fill="#1a1b26" rx="20" />
        
        <g fill="none" stroke="#7bf5e8" strokeWidth="12" strokeLinecap="butt" strokeLinejoin="round">
            <path d="M 235 140 L 412 643" />
            <path d="M 530 140 L 458 385" />
            <path d="M 565 270 C 480 270, 420 320, 420 390 C 420 460, 500 500, 580 540 C 680 590, 740 640, 740 700 C 740 770, 680 840, 580 840 C 510 840, 430 790, 400 660" />
            <path d="M 235 140 L 280 140" strokeWidth="8" />
            <path d="M 530 140 L 560 140" strokeWidth="8" />
            <path d="M 630 280 C 670 300, 710 340, 715 400" strokeWidth="14" />
        </g>
        
        <path d="M 458 385 L 470 450" fill="none" stroke="#1a1b26" strokeWidth="16" />
        <path d="M 412 643 L 430 630" fill="none" stroke="#1a1b26" strokeWidth="16" />
        
        <g fill="none" stroke="#7bf5e8" strokeWidth="12" strokeLinecap="butt" strokeLinejoin="round">
            <path d="M 235 140 L 412 643" />
            <path d="M 530 140 L 458 385" />
            <path d="M 235 140 L 280 140" strokeWidth="8" />
            <path d="M 530 140 L 560 140" strokeWidth="8" />
        </g>
        
        <path d="M 420 530 L 440 580" fill="none" stroke="#7bf5e8" strokeWidth="8" />
      </svg>

      <div className="leading-tight">
        <p className="font-display text-[17px] font-medium text-[var(--color-pine-700)]">
          FisioVS
        </p>
      </div>
    </div>
  );
}
