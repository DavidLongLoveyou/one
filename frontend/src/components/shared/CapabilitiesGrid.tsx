import * as LucideIcons from 'lucide-react';
import { cn } from '@/lib/utils';

interface Capability {
  title: string;
  description: string;
  metric_value: string;
  metric_label: string;
  icon_name?: string;
}

interface CapabilitiesGridProps {
  capabilities: Capability[];
  className?: string;
}

// Dynamic icon loader
function getIcon(iconName: string | undefined) {
  if (!iconName) return LucideIcons.TrendingUp;
  const IconComponent = (LucideIcons as any)[iconName] || LucideIcons.TrendingUp;
  return IconComponent;
}

export function CapabilitiesGrid({ capabilities, className }: CapabilitiesGridProps) {
  if (!capabilities || capabilities.length === 0) {
    return null;
  }

  return (
    <div className={cn('grid md:grid-cols-2 lg:grid-cols-3 gap-6', className)}>
      {capabilities.map((capability, index) => {
        const Icon = getIcon(capability.icon_name);

        return (
          <div
            key={index}
            className="p-6 bg-green-50 rounded-xl border border-green-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start gap-4 mb-4">
              <div className="flex-shrink-0">
                <div className="w-12 h-12 rounded-lg bg-green-600 flex items-center justify-center">
                  <Icon className="h-6 w-6 text-white" />
                </div>
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-1">
                  {capability.title}
                </h3>
                <p className="text-sm text-green-700 leading-relaxed">
                  {capability.description}
                </p>
              </div>
            </div>
            <div className="pt-4 border-t border-green-200">
              <div className="text-2xl font-bold text-green-600">
                {capability.metric_value}
              </div>
              <div className="text-sm text-green-700">
                {capability.metric_label}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

