
import React from 'react';

const CrossIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="currentColor"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <path d="M10 22H14V16H20V12H14V2H10V12H4V16H10V22Z" />
  </svg>
);

export default CrossIcon;