'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { NumberTicker } from './number-ticker';

interface DockItem {
  id: string;
  label: string;
  value: string | number;
  icon?: React.ReactNode;
  suffix?: string;
  prefix?: string;
}

interface DockProps {
  items: DockItem[];
  className?: string;
  orientation?: 'horizontal' | 'vertical';
}

export function Dock({ items, className, orientation = 'horizontal' }: DockProps) {
  return (
    <motion.div
      className={cn(
        'flex gap-4',
        orientation === 'horizontal' ? 'flex-row' : 'flex-col',
        className
      )}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {items.map((item, index) => (
        <motion.div
          key={item.id}
          className="flex flex-col items-center gap-2"
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
        >
          {item.icon && (
            <div className="text-green-600 mb-1">{item.icon}</div>
          )}
          <div className="text-2xl md:text-3xl font-bold font-serif text-green-800">
            <NumberTicker
              value={item.value}
              prefix={item.prefix}
              suffix={item.suffix}
              direction="up"
              delay={index * 0.1}
            />
          </div>
          <div className="text-sm text-green-700 text-center">{item.label}</div>
        </motion.div>
      ))}
    </motion.div>
  );
}

