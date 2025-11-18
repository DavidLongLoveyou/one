'use client';

import Image from 'next/image';
import { getStrapiImageUrl } from '@/lib/cms-client';
import { cn } from '@/lib/utils';
import * as LucideIcons from 'lucide-react';

interface ProcessStep {
  step_number: number;
  title: string;
  description: string;
  icon_name?: string;
  illustration?: any;
}

interface ProcessTimelineProps {
  steps: ProcessStep[];
  className?: string;
}

// Dynamic icon loader
function getIcon(iconName: string | undefined) {
  if (!iconName) return null;
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.Circle;
  return IconComponent;
}

export function ProcessTimeline({ steps, className }: ProcessTimelineProps) {
  if (!steps || steps.length === 0) {
    return null;
  }

  return (
    <div className={cn('relative', className)}>
      {/* Timeline line - Desktop only */}
      <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-green-200 hidden lg:block" />

      <div className="space-y-12">
        {steps
          .sort((a, b) => (a.step_number || 0) - (b.step_number || 0))
          .map((step, index) => {
            const Icon = getIcon(step.icon_name);
            const illustrationUrl = step.illustration
              ? getStrapiImageUrl(step.illustration)
              : null;

            return (
              <div key={index} className="relative flex gap-8">
                {/* Step number circle */}
                <div className="flex-shrink-0 relative z-10">
                  <div className="w-16 h-16 rounded-full bg-green-600 text-white flex items-center justify-center font-bold text-lg shadow-lg">
                    {step.step_number || index + 1}
                  </div>
                  {Icon && (
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 rounded-full bg-green-800 flex items-center justify-center">
                      <Icon className="h-3 w-3 text-white" />
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 pb-12">
                  <h3 className="text-2xl font-bold text-green-800 mb-3">
                    {step.title}
                  </h3>
                  <p className="text-green-700 leading-relaxed mb-4">
                    {step.description}
                  </p>
                  {illustrationUrl && (
                    <div className="mt-4 relative aspect-video rounded-lg overflow-hidden bg-green-50">
                      <Image
                        src={illustrationUrl}
                        alt={step.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            );
          })}
      </div>
    </div>
  );
}

