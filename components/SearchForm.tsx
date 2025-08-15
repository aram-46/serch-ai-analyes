import React, { useState } from 'react';
import { COUNTRIES, SUBJECTS } from '../constants';
import type { SearchQuery } from '../types';
import { generateKeywordsFromTopic } from '../services/geminiService';
import { Icon } from './icons';

interface SearchFormProps {
  onSearch: (query: Omit<SearchQuery, 'id' | 'name'>) => void;
  isLoading: boolean;
  query: SearchQuery;
  setQuery: React.Dispatch<React.SetStateAction<SearchQuery>>;
}

const SearchForm: React.FC<SearchFormProps> = ({ onSearch, isLoading, query, setQuery }) => {
  const [isGenerating, setIsGenerating] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setQuery(prev => ({ ...prev, [name]: value }));
  };

  const handleGenerateKeywords = async () => {
    if (!query.topic) {
      alert('Please enter a topic first to generate keywords.');
      return;
    }
    setIsGenerating(true);
    try {
      const keywords = await generateKeywordsFromTopic(query.topic);
      setQuery(prev => ({ ...prev, keywords: keywords.join(', ') }));
    } catch (error) {
      console.error(error);
      alert('Failed to generate keywords.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.topic || !query.region1 || !query.region2 || !query.subject) {
      alert("Please fill in Topic, both Regions, and Subject fields.");
      return;
    }
    const { id, name, ...searchData } = query;
    onSearch(searchData);
  };

  const commonInputClass = "w-full bg-base-200 border border-base-300 rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 placeholder-text-secondary/50";
  const commonLabelClass = "block text-sm font-medium text-text-secondary mb-2";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className={commonLabelClass}>Research Topic</label>
        <input type="text" id="topic" name="topic" value={query.topic} onChange={handleChange} className={commonInputClass} placeholder="e.g., Impact of renewable energy on GDP" required />
      </div>

      <div>
        <label htmlFor="keywords" className={commonLabelClass}>Keywords</label>
        <div className="relative">
          <input type="text" id="keywords" name="keywords" value={query.keywords} onChange={handleChange} className={commonInputClass + " pr-28"} placeholder="AI will generate these if left blank" />
          <button type="button" onClick={handleGenerateKeywords} disabled={isGenerating || isLoading} className="absolute inset-y-0 right-0 flex items-center px-3 text-sm bg-primary/20 text-accent font-semibold rounded-r-lg hover:bg-primary/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Icon name="generate" className="w-4 h-4 mr-1" />}
            Generate
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="region1" className={commonLabelClass}>Compare Region 1</label>
          <input list="country-list" id="region1" name="region1" value={query.region1} onChange={handleChange} className={commonInputClass} placeholder="Select or type a country" required />
        </div>
        <div>
          <label htmlFor="region2" className={commonLabelClass}>With Region 2</label>
          <input list="country-list" id="region2" name="region2" value={query.region2} onChange={handleChange} className={commonInputClass} placeholder="Select or type a country" required />
        </div>
        <datalist id="country-list">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div>
        <label htmlFor="subject" className={commonLabelClass}>Subject Area</label>
        <select id="subject" name="subject" value={query.subject} onChange={handleChange} className={commonInputClass} required>
          <option value="">-- Select a subject --</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      <div>
        <label htmlFor="userSources" className={commonLabelClass}>Limit to Specific Sources (Optional)</label>
        <textarea id="userSources" name="userSources" value={query.userSources} onChange={handleChange} className={commonInputClass} rows={3} placeholder="Enter URLs, one per line, to narrow the search."></textarea>
      </div>

      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 shadow-lg hover:shadow-primary/50">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            Analyzing...
          </>
        ) : (
          <>
            <Icon name="search" className="w-6 h-6" />
            Analyze & Compare Statistics
          </>
        )}
      </button>
    </form>
  );
};

export default SearchForm;