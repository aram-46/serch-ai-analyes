
import React from 'react';
import type { SearchResult } from '../types';
import { Icon } from './icons';

interface RelatedResearchTabProps {
  results: SearchResult;
}

const RelatedResearchTab: React.FC<RelatedResearchTabProps> = ({ results }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {results.relatedResearch.length > 0 ? (
        results.relatedResearch.map((item, index) => (
          <div key={index} className="p-5 bg-base-200/50 rounded-2xl border border-base-300 transition-shadow hover:shadow-xl">
            <h4 className="text-xl font-bold text-accent mb-2">{item.title}</h4>
            <p className="text-text-secondary mb-3 leading-relaxed">{item.summary}</p>
            <div className="flex items-center justify-between text-sm">
                <span className="text-text-secondary font-medium">{item.source}</span>
                <a 
                    href={item.link} 
                    target="_blank" 
                    rel="noopener noreferrer" 
                    className="inline-flex items-center gap-2 text-primary font-semibold hover:underline"
                >
                    Read More
                    <Icon name="export" className="w-4 h-4" />
                </a>
            </div>
          </div>
        ))
      ) : (
        <p className="text-center text-text-secondary py-10">No related research found.</p>
      )}
    </div>
  );
};

export default RelatedResearchTab;
