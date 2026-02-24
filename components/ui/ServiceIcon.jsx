import { JSX } from "react";
const icons = {
  road: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 40h40" />
      <path d="M14 40V12" />
      <path d="M34 40V12" />
      <path d="M14 12C14 12 19 8 24 8s10 4 10 4" />
      <path d="M24 8V4" />
      <rect x="22" y="20" width="4" height="6" rx="1" />
      <rect x="22" y="30" width="4" height="6" rx="1" />
      <path d="M4 40l10-8M44 40l-10-8" />
    </svg>
  ),

  building: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="6" y="14" width="36" height="30" />
      <path d="M2 14l22-10 22 10" />
      <path d="M18 44V30h12v14" />
      <rect x="11" y="20" width="6" height="6" />
      <rect x="31" y="20" width="6" height="6" />
      <rect x="11" y="30" width="6" height="6" />
      <rect x="31" y="30" width="6" height="6" />
    </svg>
  ),

  infrastructure: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M4 38h40" />
      <path d="M8 38V26" />
      <path d="M40 38V26" />
      <path d="M8 26h32" />
      <path d="M24 26V14" />
      <path d="M16 20l8-8 8 8" />
      <path d="M4 44h40" />
      <path d="M12 38v6M36 38v6" />
      <line x1="8" y1="30" x2="40" y2="30" strokeDasharray="3 3" />
    </svg>
  ),

  engineering: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <circle cx="24" cy="22" r="8" />
      <path d="M24 6v8M24 30v8M8 22h8M32 22h8" />
      <path d="M12.7 10.7l5.6 5.6M29.7 27.7l5.6 5.6" />
      <path d="M35.3 10.7l-5.6 5.6M18.3 27.7l-5.6 5.6" />
      <circle cx="24" cy="22" r="3" fill="currentColor" opacity="0.3" />
    </svg>
  ),

  structural: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <path d="M6 42h36" />
      <rect x="8" y="16" width="8" height="26" />
      <rect x="32" y="16" width="8" height="26" />
      <path d="M8 16h32" />
      <path d="M16 42V28h16v14" />
      <path d="M8 28h32" />
      <path d="M16 16V8M32 16V8" />
      <path d="M12 8h24" />
      <line x1="8" y1="20" x2="40" y2="20" strokeDasharray="3 3" />
    </svg>
  ),

  management: (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      aria-hidden="true"
    >
      <rect x="6" y="8" width="36" height="32" rx="1" />
      <path d="M6 16h36" />
      <path d="M16 8v8M32 8v8" />
      <path d="M12 24h10M12 30h10M12 36h8" />
      <circle cx="33" cy="30" r="6" />
      <path d="M30.5 30l2 2 4-4" />
    </svg>
  ),
};

export function ServiceIcon({ name, className }) {
  const icon = icons[name] ?? icons.building;

  return (
    <span
      className={className}
      style={{ display: "block", width: "100%", height: "100%" }}
    >
      {icon}
    </span>
  );
}
