import React, { useEffect, useState, useCallback } from 'react';

// Scales children to fit the viewport while preserving a base design size/aspect.
// Defaults target a Galaxy S20 Ultra portrait viewport (~412x915 CSS px).
export default function ScalingViewport({
  baseWidth = 412,
  baseHeight = 915,
  children,
}) {
  const [scale, setScale] = useState(1);

  const computeScale = useCallback(() => {
    const vw = window.innerWidth;
    const vh = window.innerHeight;
    const s = Math.min(vw / baseWidth, vh / baseHeight);
    return Math.max(0.1, Math.min(s, 3));
  }, [baseWidth, baseHeight]);

  useEffect(() => {
    const update = () => setScale(computeScale());
    let raf = 0;
    const onResize = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener('resize', onResize);
    window.addEventListener('orientationchange', onResize);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      window.removeEventListener('orientationchange', onResize);
    };
  }, [computeScale]);

  return (
    <div
      style={{
        width: '100vw',
        height: '100vh',
        overflow: 'auto',
        WebkitOverflowScrolling: 'touch',
        background: 'transparent',
      }}
    >
      <div
        style={{
          width: `${baseWidth}px`,
          height: `${baseHeight}px`,
          transform: `scale(${scale})`,
          transformOrigin: 'top center',
          margin: '0 auto',
          willChange: 'transform',
          position: 'relative',
        }}
      >
        {children}
      </div>
    </div>
  );
}
