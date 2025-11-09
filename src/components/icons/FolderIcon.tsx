import React from 'react';

const FolderIcon: React.FC<React.SVGProps<SVGSVGElement>> = (props) => (
    <svg 
        viewBox="0 0 32 32"
        xmlns="http://www.w3.org/2000/svg"
        {...props}
    >
        <defs>
            <filter id="folderShadow" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#000" floodOpacity="0.3"/>
            </filter>
        </defs>
        <g filter="url(#folderShadow)">
            <path d="M3,10 L3,26 L29,26 L29,13 L16,13 L14,10 L3,10 Z" fill="#4299E1" />
            <path d="M4,9 L4,25 L28,25 L28,12 L15,12 L13,9 L4,9 Z" fill="white" />
            <path d="M4.5,9.5 L13,9.5 L15,12.5 L27.5,12.5 L27.5,24.5 L4.5,24.5 Z" fill="none" stroke="#a0aec0" strokeWidth="0.5" />
        </g>
    </svg>
);

export default FolderIcon;
