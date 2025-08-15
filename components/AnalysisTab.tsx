import React, { useState } from 'react';
import { BarChart, Bar, LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import type { SearchResult } from '../types';
import { Icon } from './icons';
import { translateText } from '../services/geminiService';
import DataTableView from './DataTableView';

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

const ViewSwitcher: React.FC<{
  currentView: string;
  onViewChange: (view: 'bar' | 'line' | 'area' | 'table') => void;
}> = ({ currentView, onViewChange }) => {
    const views = [
        { id: 'bar', name: 'میله‌ای' },
        { id: 'line', name: 'خطی' },
        { id: 'area', name: 'سطحی' },
        { id: 'table', name: 'جدول' },
    ];
    return (
        <div className="flex items-center bg-base-300/50 rounded-lg p-1 space-i-1">
            {views.map((view) => (
                <button
                    key={view.id}
                    onClick={() => onViewChange(view.id as any)}
                    className={`px-3 py-1.5 text-sm font-semibold rounded-md transition-colors ${
                        currentView === view.id
                            ? 'bg-accent text-white shadow'
                            : 'text-text-secondary hover:bg-base-200'
                    }`}
                >
                    {view.name}
                </button>
            ))}
        </div>
    );
};

const AnalysisTab: React.FC<AnalysisTabProps> = ({ results, region1, region2 }) => {
    const [view, setView] = useState<'bar' | 'line' | 'area' | 'table'>('bar');
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(false);

    const handleTranslate = async () => {
        if (!results.comparisonSummary) return;
        setIsTranslating(true);
        try {
            const translation = await translateText(results.comparisonSummary, "Persian");
            setTranslatedSummary(translation);
            setShowOriginal(false);
        } catch (error) {
            console.error(error);
            alert("ترجمه با خطا مواجه شد. لطفاً دوباره تلاش کنید.");
        } finally {
            setIsTranslating(false);
        }
    };

    const renderChart = () => {
        const commonChartComponents = (
            <>
                <defs>
                    <linearGradient id="colorRegion1" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="colorRegion2" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="var(--color-accent)" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="var(--color-accent)" stopOpacity={0.1}/>
                    </linearGradient>
                </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--color-base-300)" />
              <XAxis dataKey="name" stroke="var(--color-text-secondary)" />
              <YAxis stroke="var(--color-text-secondary)" tickFormatter={(value) => typeof value === 'number' ? value.toLocaleString() : value }/>
              <Tooltip content={<ChartTooltip />} cursor={{ fill: 'var(--color-base-300)', opacity: 0.6 }} />
              <Legend wrapperStyle={{ color: 'var(--color-text-primary)' }} />
            </>
        );

        const chartMargin = { top: 5, right: 20, left: 20, bottom: 5 };

        if (view === 'bar') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={results.visualData} margin={chartMargin}>
                        {commonChartComponents}
                        <Bar dataKey={region1} name={region1} fill="url(#colorRegion1)" stroke="var(--color-primary)" radius={[4, 4, 0, 0]} />
                        <Bar dataKey={region2} name={region2} fill="url(#colorRegion2)" stroke="var(--color-accent)" radius={[4, 4, 0, 0]} />
                    </BarChart>
                </ResponsiveContainer>
            );
        }

        if (view === 'line') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={results.visualData} margin={chartMargin}>
                        {commonChartComponents}
                        <Line dataKey={region1} name={region1} fill="url(#colorRegion1)" stroke="var(--color-primary)" type="monotone" />
                        <Line dataKey={region2} name={region2} fill="url(#colorRegion2)" stroke="var(--color-accent)" type="monotone" />
                    </LineChart>
                </ResponsiveContainer>
            );
        }

        if (view === 'area') {
            return (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={results.visualData} margin={chartMargin}>
                        {commonChartComponents}
                        <Area dataKey={region1} name={region1} fill="url(#colorRegion1)" stroke="var(--color-primary)" type="monotone" />
                        <Area dataKey={region2} name={region2} fill="url(#colorRegion2)" stroke="var(--color-accent)" type="monotone" />
                    </AreaChart>
                </ResponsiveContainer>
            );
        }

        return null;
    };


  return (
    <div className="space-y-8 animate-fade-in">
      <div className="p-6 bg-base-200/50 rounded-2xl border border-base-300">
        <div className="flex justify-between items-center mb-4">
            <h3 className="text-2xl font-bold text-text-primary">خلاصه مقایسه هوش مصنوعی</h3>
            {!translatedSummary && (
                <button onClick={handleTranslate} disabled={isTranslating} className="flex items-center gap-2 text-sm bg-base-300 text-text-secondary font-semibold py-2 px-3 rounded-lg hover:text-primary transition-colors disabled:opacity-50">
                    {isTranslating ? <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div> : 'ترجمه به فارسی'}
                </button>
            )}
            {translatedSummary && (
                 <button onClick={() => setShowOriginal(!showOriginal)} className="flex items-center gap-2 text-sm bg-base-300 text-text-secondary font-semibold py-2 px-3 rounded-lg hover:text-primary transition-colors">
                    {showOriginal ? 'نمایش ترجمه' : 'نمایش متن اصلی'}
                </button>
            )}
        </div>
        <p className="text-text-secondary whitespace-pre-wrap leading-relaxed">
            {showOriginal ? results.comparisonSummary : (translatedSummary || results.comparisonSummary)}
        </p>
      </div>
      
      <div className="p-6 bg-base-200/50 rounded-2xl border border-base-300">
        <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
            <h3 className="text-2xl font-bold text-text-primary">مقایسه بصری</h3>
            <ViewSwitcher currentView={view} onViewChange={setView} />
        </div>
        <div className="w-full h-96">
          {view === 'table' ? (
            <DataTableView data={results.visualData} region1={region1} region2={region2} />
          ) : (
            renderChart()
          )}
        </div>
      </div>
    </div>
  );
};

export default AnalysisTab;
