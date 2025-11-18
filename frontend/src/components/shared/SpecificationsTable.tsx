interface Specification {
  spec_name: string;
  spec_value: string;
  spec_unit?: string;
}

interface SpecificationsTableProps {
  specifications: Specification[] | any;
}

export function SpecificationsTable({ specifications }: SpecificationsTableProps) {
  // Handle both array format and object format
  const specs = Array.isArray(specifications) 
    ? specifications 
    : Object.entries(specifications || {}).map(([name, value]) => ({
        spec_name: name,
        spec_value: String(value),
      }));

  if (!specs || specs.length === 0) {
    return null;
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="bg-green-50">
            <th className="border border-green-200 px-6 py-3 text-left text-sm font-semibold text-green-800">
              Specification
            </th>
            <th className="border border-green-200 px-6 py-3 text-left text-sm font-semibold text-green-800">
              Value
            </th>
          </tr>
        </thead>
        <tbody>
          {specs.map((spec: any, index: number) => {
            const specName = spec.spec_name || spec.name || '';
            const specValue = spec.spec_value || spec.value || '';
            const specUnit = spec.spec_unit || spec.unit || '';
            const displayValue = specUnit ? `${specValue} ${specUnit}` : specValue;

            return (
              <tr
                key={index}
                className={index % 2 === 0 ? 'bg-white' : 'bg-green-50'}
              >
                <td className="border border-green-200 px-6 py-4 text-sm font-medium text-green-800">
                  {specName}
                </td>
                <td className="border border-green-200 px-6 py-4 text-sm text-green-700">
                  {displayValue}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

