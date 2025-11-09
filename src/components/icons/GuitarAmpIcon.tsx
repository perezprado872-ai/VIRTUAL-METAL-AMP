import React from 'react';

const GuitarAmpIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    stroke="currentColor"
    strokeWidth="1.5"
    {...props}
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M4 4h16a2 2 0 012 2v12a2 2 0 01-2 2H4a2 2 0 01-2-2V6a2 2 0 012-2z"
    />
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M2 10h20M9 4v2m6-2v2M8 16a4 4 0 108 0 4 4 0 00-8 0z"
    />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 14v4" />
  </svg>
);

export default GuitarAmpIcon;
