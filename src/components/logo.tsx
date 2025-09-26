
import type { SVGProps } from "react";

const Logo = (props: SVGProps<SVGSVGElement>) => (
  <svg
    width="48"
    height="48"
    viewBox="0 0 48 48"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="24" cy="24" r="24" fill="hsl(var(--primary))" />
    <path
      d="M20.5 21.5H30.5M20.5 16.5H30.5M22.5 16.5V13.5C22.5 12.3954 23.3954 11.5 24.5 11.5H26.5M25.5 21.5V31.5L20.5 26.5"
      stroke="hsl(var(--primary-foreground))"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

export default Logo;
