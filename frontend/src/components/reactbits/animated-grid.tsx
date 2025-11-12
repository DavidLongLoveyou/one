'use client';

import { useEffect, useRef } from 'react';
import { cn } from '@/lib/utils';

interface AnimatedGridProps {
  className?: string;
  squares?: number;
  size?: number;
  gap?: number;
  color?: string;
  opacity?: number;
}

export function AnimatedGrid({
  className,
  squares = 20,
  size = 60,
  gap = 4,
  color = '#059669',
  opacity = 0.1,
}: AnimatedGridProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let time = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    resize();
    window.addEventListener('resize', resize);

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.strokeStyle = color;
      ctx.globalAlpha = opacity;
      ctx.lineWidth = 1;

      const cols = Math.ceil(canvas.width / (size + gap));
      const rows = Math.ceil(canvas.height / (size + gap));

      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const x = i * (size + gap);
          const y = j * (size + gap);

          // Animate with sine wave
          const offsetX = Math.sin(time * 0.001 + i * 0.1) * 2;
          const offsetY = Math.cos(time * 0.001 + j * 0.1) * 2;

          ctx.beginPath();
          ctx.rect(x + offsetX, y + offsetY, size, size);
          ctx.stroke();
        }
      }

      time += 16; // ~60fps
      animationFrameId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      window.removeEventListener('resize', resize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [size, gap, color, opacity]);

  return (
    <canvas
      ref={canvasRef}
      className={cn('absolute inset-0 pointer-events-none', className)}
      style={{ width: '100%', height: '100%' }}
    />
  );
}

