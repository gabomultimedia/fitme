interface FitMeLogoProps {
  className?: string;
  size?: number;
}

export function FitMeLogo({ className, size = 40 }: FitMeLogoProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 100 100"
      fill="none"
      width={size}
      height={size}
      className={className}
      aria-label="FitMe Logo"
    >
      <circle cx="50" cy="50" r="46" fill="var(--color-primary)" />
      {/* Pesas laterales */}
      <rect x="30" y="45" width="6" height="10" rx="1" fill="#FFFFFF" />
      <rect x="64" y="45" width="6" height="10" rx="1" fill="#FFFFFF" />
      <rect x="24" y="40" width="4" height="20" rx="1" fill="#FFFFFF" />
      <rect x="72" y="40" width="4" height="20" rx="1" fill="#FFFFFF" />
      {/* Barra */}
      <rect x="36" y="48" width="28" height="4" rx="1" fill="#FFFFFF" />
      {/* Chispa naranja (momentum) */}
      <path
        d="M50 24C46 30 52 35 48 40C54 38 56 32 50 24Z"
        fill="var(--color-secondary-container)"
      />
    </svg>
  );
}
