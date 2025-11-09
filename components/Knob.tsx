
import React, { useState, useRef, useCallback, useEffect } from 'react';

interface KnobProps {
  label: string;
  value: number; // 0-100
  onChange: (value: number) => void;
}

const MIN_DEG = -150;
const MAX_DEG = 150;

const Knob: React.FC<KnobProps> = ({ label, value, onChange }) => {
  const knobRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ y: 0, value: 0 });

  const handleMouseMove = useCallback((e: MouseEvent) => {
    if (!isDragging) return;
    const dy = dragStart.y - e.clientY;
    const newValue = Math.round(dragStart.value + dy * 0.5); // Sensitivity factor
    const clampedValue = Math.max(0, Math.min(100, newValue));
    onChange(clampedValue);
  }, [isDragging, dragStart, onChange]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
    document.body.style.cursor = 'default';
  }, []);

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      document.body.style.cursor = 'ns-resize';
    }
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isDragging, handleMouseMove, handleMouseUp]);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
    setDragStart({ y: e.clientY, value });
  };

  const rotation = MIN_DEG + (value / 100) * (MAX_DEG - MIN_DEG);

  return (
    <div className="flex flex-col items-center space-y-2 select-none">
      <div
        ref={knobRef}
        className="w-16 h-16 rounded-full cursor-pointer relative flex items-center justify-center bg-gradient-to-br from-yellow-400 via-yellow-500 to-yellow-600 shadow-md border-2 border-yellow-700/50"
        onMouseDown={handleMouseDown}
        aria-valuenow={value}
        aria-valuemin={0}
        aria-valuemax={100}
        role="slider"
        aria-label={`${label} control`}
      >
        <div 
          className="absolute w-full h-full"
          style={{ transform: `rotate(${rotation}deg)` }}
        >
          <div className="w-2.5 h-2.5 bg-neutral-800 rounded-full absolute top-1.5 left-1/2 -ml-1 shadow-inner"></div>
        </div>
      </div>
      <label 
        className="font-sans text-white text-xl lowercase font-semibold"
      >
          {label}
      </label>
    </div>
  );
};

export default Knob;