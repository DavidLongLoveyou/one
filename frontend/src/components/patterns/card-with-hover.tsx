'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Spotlight } from '../reactbits/spotlight';

interface CardWithHoverProps {
  children: React.ReactNode;
  className?: string;
  enableSpotlight?: boolean;
  hoverScale?: number;
}

export function CardWithHover({
  children,
  className,
  enableSpotlight = true,
  hoverScale = 1.02,
}: CardWithHoverProps) {
  return (
    <motion.div
      className={cn(
        'relative rounded-xl border border-green-200 bg-white p-6 shadow-sm transition-all',
        'hover:border-green-400 hover:shadow-lg hover:shadow-green-200/50',
        className
      )}
      whileHover={{ scale: hoverScale }}
      transition={{ type: 'spring', stiffness: 300, damping: 20 }}
    >
      {enableSpotlight && (
        <Spotlight
          className="absolute inset-0 rounded-xl"
          size={300}
          intensity={0.2}
        />
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

