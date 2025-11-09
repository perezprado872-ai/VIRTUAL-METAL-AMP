import React from 'react';

const PentagramIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="1.2"
    strokeLinecap="round"
    strokeLinejoin="round"
    xmlns="http://www.w3.org/2000/svg"
    {...props}
  >
    <circle cx="12" cy="12" r="10" />
    <path d="M12 21L17.29 4.72L3.44 14.78L20.56 14.78L6.71 4.72Z" />
  </svg>
);

export default PentagramIcon;
