
import React from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SearchResult } from '../types';

interface AnalysisTabProps {
  results: SearchResult;
  region1: string;
  region2: string;
}

const ChartTooltip: React.FC<any> = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
        return (
            <div className="p-4 bg-base-300 border border-primary/50 rounded-lg shadow-xl text-text-primary">
                <p className="label font-bold text-lg">{`${label}`}</p>
                {payload.map((pld: any) => (
                    <p key={pld.dataKey} style={{ color: pld.color }}>
                        {`${pld.name}: ${pld.value.toLocaleString()}`}
                    </p>
                ))}
            </div>
        );
    }
    return null;
};

const AnalysisTab: React.FC<AnalysisTabProps> = ({ results, region1, region2 }) => {
  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 bg-base-200/50 rounded-2xl border border-base-300">
        <h3 className="text-2xl font-bold text-text-primary mb-4">AI Comparison Summary</h3>
        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">{results.comparisonSummary}</p>
      </div>
      
      <div className="p-6 bg-base-200/50 rounded-2xl border border-base-300">
        <h3 className="text-2xl font-bold text-text-primary mb-4">Visual Comparison</h3>
        <div className="w-full h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={results.visualData}
              margin={{ top: 5, right: 20, left: 20, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" />
              <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
              <YAxis stroke="var(--color-text-secondary)" tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value }/>
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-base-300)', opacity: 0.6 }} />
              <Legend wrapperStyle={{ color: 'var(--color-text-primary)' }} />
              <Bar dataKey={region1} fill="var(--color-primary)" name={region1} radius={[4, 4, 0, 0]} />
              <Bar dataKey={region2} fill="var(--color-accent)" name={region2} radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default AnalysisTab;
