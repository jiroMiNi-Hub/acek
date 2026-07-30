import React, { useState, useRef, useEffect } from 'react';

interface BeforeAfterSliderProps {
  beforeImage: string;
  afterImage: string;
  title: string;
  category: string;
  description: string;
}

export default function BeforeAfterSlider({
  beforeImage,
  afterImage,
  title,
  category,
  description,
}: BeforeAfterSliderProps) {
  const [sliderPosition, setSliderPosition] = useState(50); // percentage (0 to 100)
  const containerRef = useRef<HTMLDivElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (clientX: number) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = clientX - rect.left;
    const position = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(position);
  };

  const handleTouchMove = (e: TouchEvent) => {
    if (!isDragging) return;
    if (e.touches.length > 0) {
      handleMove(e.touches[0].clientX);
    }
  };

  const handleMouseMove = (e: MouseEvent) => {
    if (!isDragging) return;
    handleMove(e.clientX);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      window.addEventListener('touchmove', handleTouchMove, { passive: true });
      window.addEventListener('touchend', handleMouseUp);
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
      window.removeEventListener('touchmove', handleTouchMove);
      window.removeEventListener('touchend', handleMouseUp);
    };
  }, [isDragging]);

  const handleMouseDown = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleTouchStart = () => {
    setIsDragging(true);
  };

  return (
    <div className="bg-white rounded-xl border border-gray-200 p-4 shadow-sm transition-all duration-300 hover:border-[#D4AF37]/50 hover:shadow-md">
      <div className="mb-3">
        <span className="text-[10px] uppercase tracking-widest text-[#B8860B] font-medium font-mono">{category}</span>
        <h4 className="text-lg font-serif text-[#333333] font-semibold leading-tight">{title}</h4>
      </div>

      {/* Interactive Drag Stage */}
      <div
        id={`before-after-${title.toLowerCase().replace(/\s+/g, '-')}`}
        ref={containerRef}
        className="relative h-64 sm:h-72 w-full select-none overflow-hidden rounded-lg bg-gray-150 cursor-ew-resize border border-gray-150"
        onMouseDown={handleMouseDown}
        onTouchStart={handleTouchStart}
      >
        {/* Before Image (Background underneath) */}
        <img
          src={beforeImage}
          alt="Before result"
          className="absolute inset-0 h-full w-full object-cover pointer-events-none"
          referrerPolicy="no-referrer"
        />
        
        <div className="absolute top-2 left-2 bg-black/70 px-2 py-0.5 rounded text-[10px] font-mono text-white border border-white/20 pointer-events-none">
          BEFORE
        </div>

        {/* After Image (Overlays on top, width controlled by sliderPosition) */}
        <div
          className="absolute inset-y-0 left-0 overflow-hidden pointer-events-none border-r-2 border-[#D4AF37]"
          style={{ width: `${sliderPosition}%` }}
        >
          {/* We must specify a fixed width on the inner image that is identical to the container 
              so it does not scale down awkwardly as width reduces */}
          <div className="absolute top-0 left-0 h-full w-[1000px]" style={{ width: containerRef.current?.getBoundingClientRect().width || '100%' }}>
            <img
              src={afterImage}
              alt="After result"
              className="absolute inset-0 h-full w-full object-cover"
              style={{ width: containerRef.current?.getBoundingClientRect().width || '100%', height: '100%' }}
              referrerPolicy="no-referrer"
            />
          </div>
          
          <div className="absolute top-2 right-2 bg-[#D4AF37] px-2 py-0.5 rounded text-[10px] font-mono text-white font-bold pointer-events-none">
            GLOWING
          </div>
        </div>

        {/* Slider Handle (Floating center bar widget) */}
        <div
          className="absolute inset-y-0 -ml-3 pointer-events-none flex items-center justify-center"
          style={{ left: `${sliderPosition}%` }}
        >
          <div className="h-10 w-6 rounded-full bg-[#D4AF37] text-white flex flex-col items-center justify-center shadow-lg border border-white/40 gap-1">
            <span className="block w-1.5 h-1.5 border-l-2 border-b-2 border-white transform rotate-45 ml-1"></span>
          </div>
        </div>
      </div>

      <p className="mt-3 text-xs text-gray-500 font-sans leading-relaxed">
        {description}
      </p>
    </div>
  );
}
