'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface GradientTextProps {
  children: React.ReactNode;
  className?: string;
  gradient?: string;
  animate?: boolean;
  duration?: number;
}

export function GradientText({
  children,
  className,
  gradient = 'from-green-600 via-green-500 to-green-700',
  animate = true,
  duration = 3,
}: GradientTextProps) {
  if (!animate) {
    return (
      <span
        className={cn(
          'bg-gradient-to-r bg-clip-text text-transparent',
          gradient,
          className
        )}
      >
        {children}
      </span>
    );
  }

  return (
    <motion.span
      className={cn(
        'bg-gradient-to-r bg-clip-text text-transparent',
        gradient,
        className
      )}
      animate={{
        backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
      }}
      style={{
        backgroundSize: '200% 200%',
      }}
    >
      {children}
    </motion.span>
  );
}

