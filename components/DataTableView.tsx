import React from 'react';
import type { VisualDataPoint } from '../types';

interface DataTableViewProps {
  data: VisualDataPoint[];
  region1: string;
  region2: string;
}

const DataTableView: React.FC<DataTableViewProps> = ({ data, region1, region2 }) => {
  return (
    <div className="w-full h-full overflow-auto">
      <table className="w-full text-sm text-left text-text-secondary">
        <thead className="text-xs text-text-primary uppercase bg-base-300/50 sticky top-0">
          <tr>
            <th scope="col" className="px-6 py-3 rounded-tr-lg">
              متریک
            </th>
            <th scope="col" className="px-6 py-3">
              {region1}
            </th>
            <th scope="col" className="px-6 py-3 rounded-tl-lg">
              {region2}
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((item, index) => (
            <tr key={index} className="bg-base-200/50 border-b border-base-300">
              <th scope="row" className="px-6 py-4 font-medium text-text-primary whitespace-nowrap">
                {item.name}
              </th>
              <td className="px-6 py-4">
                {typeof item[region1] === 'number' ? (item[region1] as number).toLocaleString() : item[region1]}
              </td>
              <td className="px-6 py-4">
                {typeof item[region2] === 'number' ? (item[region2] as number).toLocaleString() : item[region2]}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DataTableView;
