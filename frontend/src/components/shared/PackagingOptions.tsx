import { Package } from 'lucide-react';

interface PackagingOption {
  type: string;
  size: string;
  description?: string;
  minimum_order?: string;
}

interface PackagingOptionsProps {
  packaging: PackagingOption[] | any;
}

export function PackagingOptions({ packaging }: PackagingOptionsProps) {
  if (!packaging || (Array.isArray(packaging) && packaging.length === 0)) {
    return null;
  }

  const options = Array.isArray(packaging) ? packaging : [packaging];

  return (
    <div className="grid md:grid-cols-2 gap-6">
      {options.map((option: any, index: number) => {
        const type = option.type || option.packaging_type || '';
        const size = option.size || '';
        const description = option.description || '';
        const minimumOrder = option.minimum_order || option.minimumOrder || '';

        return (
          <div
            key={index}
            className="p-6 bg-green-50 rounded-xl border border-green-200"
          >
            <div className="flex items-start gap-4">
              <div className="flex-shrink-0">
                <Package className="h-6 w-6 text-green-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-green-800 mb-2 capitalize">
                  {type}
                </h3>
                <p className="text-green-700 mb-2">
                  <span className="font-medium">Size: </span>
                  {size}
                </p>
                {description && (
                  <p className="text-green-700 mb-2">{description}</p>
                )}
                {minimumOrder && (
                  <p className="text-sm text-green-600">
                    <span className="font-medium">Minimum Order: </span>
                    {minimumOrder}
                  </p>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

