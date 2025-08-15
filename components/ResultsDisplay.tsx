import React, { useState } from 'react';
import type { SearchResult, ActiveTab, StatisticalSource } from '../types';
import { Icon } from './icons';
import AnalysisTab from './AnalysisTab';
import RelatedResearchTab from './RelatedResearchTab';

interface ResultsDisplayProps {
  results: SearchResult;
  query: { region1: string, region2: string };
}

const TabButton: React.FC<{
  label: string;
  icon: 'chart' | 'research' | 'source';
  isActive: boolean;
  onClick: () => void;
}> = ({ label, icon, isActive, onClick }) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 text-sm font-semibold rounded-t-lg border-b-2 transition-all duration-300 ${
      isActive
        ? 'border-accent text-accent'
        : 'border-transparent text-text-secondary hover:text-text-primary'
    }`}
  >
    <Icon name={icon} className="w-5 h-5" />
    {label}
  </button>
);

const SourceCard: React.FC<{ source: StatisticalSource }> = ({ source }) => {
    const credibilityColor = source.credibilityScore > 7 ? 'text-green-400' : source.credibilityScore > 4 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="bg-base-200/50 p-5 rounded-xl border border-base-300 space-y-3">
            <div className="flex justify-between items-start">
                <h4 className="text-lg font-bold text-text-primary pr-4">{source.name}</h4>
                <a href={source.link} target="_blank" rel="noopener noreferrer" className="text-primary hover:underline flex-shrink-0">
                    <Icon name="export" className="w-5 h-5" />
                </a>
            </div>
            <div className={`flex items-center gap-2 font-bold ${credibilityColor}`}>
                <div className="font-mono text-xl">{source.credibilityScore}/10</div>
                <span className="text-sm">Credibility</span>
            </div>
            <p className="text-sm text-text-secondary italic">{source.credibilityAnalysis}</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 text-sm pt-2">
                <div className="text-text-secondary"><span className="font-semibold text-text-primary block">Year:</span> {source.year}</div>
                <div className="text-text-secondary"><span className="font-semibold text-text-primary block">Survey Type:</span> {source.surveyType || 'N/A'}</div>
                <div className="text-text-secondary"><span className="font-semibold text-text-primary block">Participants:</span> {source.participantCount ? source.participantCount.toLocaleString() : 'N/A'}</div>
                <div className="text-text-secondary col-span-2 sm:col-span-3"><span className="font-semibold text-text-primary block">Methodology:</span> {source.methodology || 'N/A'}</div>
            </div>
             <p className={`text-xs font-semibold ${source.isStillValid ? 'text-green-400' : 'text-yellow-500'}`}>
                Data is considered {source.isStillValid ? 'still valid' : 'outdated'}.
            </p>
        </div>
    );
};

const SourcesTab: React.FC<{ sources: StatisticalSource[] }> = ({ sources }) => (
    <div className="space-y-4 animate-fade-in">
         <h3 className="text-2xl font-bold text-text-primary mb-4">Data Sources</h3>
        {sources.length > 0 ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {sources.map((source, index) => <SourceCard key={index} source={source} />)}
            </div>
        ) : (
            <p className="text-center text-text-secondary py-10">No sources were provided in the analysis.</p>
        )}
    </div>
);

const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ results, query }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('analysis');

  return (
    <div className="w-full">
      <div className="border-b border-base-300 mb-6">
        <nav className="flex items-center -mb-px">
          <TabButton label="Analysis" icon="chart" isActive={activeTab === 'analysis'} onClick={() => setActiveTab('analysis')} />
          <TabButton label="Related Research" icon="research" isActive={activeTab === 'related'} onClick={() => setActiveTab('related')} />
          <TabButton label="Sources" icon="source" isActive={activeTab === 'sources'} onClick={() => setActiveTab('sources')} />
        </nav>
      </div>

      <div>
        {activeTab === 'analysis' && <AnalysisTab results={results} region1={query.region1} region2={query.region2} />}
        {activeTab === 'related' && <RelatedResearchTab results={results} />}
        {activeTab === 'sources' && <SourcesTab sources={results.sources} />}
      </div>
    </div>
  );
};

export default ResultsDisplay;