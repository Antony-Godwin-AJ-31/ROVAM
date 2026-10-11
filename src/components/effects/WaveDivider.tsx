import React from 'react';

type WaveDividerVariant = 'wave' | 'curve' | 'floral';

export interface WaveDividerProps {
  variant?: WaveDividerVariant;
  colorFrom?: string;
  colorTo?: string;
  flip?: boolean;
  className?: string;
}

export function WaveDivider({
  variant = 'wave',
  colorFrom = 'var(--color-ivory)',
  colorTo = 'var(--color-paper)',
  flip = false,
  className = '',
}: WaveDividerProps) {
  const containerStyle: React.CSSProperties = {
    backgroundColor: colorFrom,
    display: 'block',
    lineHeight: 0, // Prevent whitespace below SVG
    width: '100%',
    position: 'relative',
    zIndex: 1,
  };

  const svgStyle: React.CSSProperties = {
    width: '100%',
    height: variant === 'curve' ? '60px' : '80px',
    display: 'block',
    marginTop: '-1px', // prevent gap
    transform: flip ? 'scaleY(-1)' : 'none',
  };

  const renderPath = () => {
    switch (variant) {
      case 'curve':
        return <path d="M0,0 Q720,120 1440,0 L1440,60 L0,60 Z" fill={colorTo} />;
      case 'floral':
        return (
          <>
            <path d="M0,50 C360,80 540,10 720,30 C900,50 1080,80 1440,50 L1440,80 L0,80 Z" fill={colorTo} />
            <path
              d="M720,25 C715,20 705,20 705,28 C705,35 720,45 720,45 C720,45 735,35 735,28 C735,20 725,20 720,25 Z"
              fill={colorFrom}
            />
          </>
        );
      case 'wave':
      default:
        return <path d="M0,40 C360,80 720,0 1080,40 C1260,60 1380,40 1440,40 L1440,80 L0,80 Z" fill={colorTo} />;
    }
  };

  return (
    <div className={className} style={containerStyle} aria-hidden="true">
      <svg
        viewBox={`0 0 1440 ${variant === 'curve' ? '60' : '80'}`}
        preserveAspectRatio="none"
        style={svgStyle}
        xmlns="http://www.w3.org/2000/svg"
      >
        {renderPath()}
      </svg>
    </div>
  );
}
