import React, { useState, useEffect, useCallback } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import ResultsDisplay from './components/ResultsDisplay';
import Loader from './components/Loader';
import SavedSearches from './components/SavedSearches';
import { Icon } from './components/icons';
import { THEMES } from './constants';
import type { SearchQuery, SearchResult, Theme } from './types';
import { fetchStatisticalAnalysis } from './services/geminiService';
import useLocalStorage from './hooks/useLocalStorage';

const initialQuery: SearchQuery = {
  id: '',
  name: '',
  topic: '',
  keywords: '',
  region1: 'آمریکا',
  region2: 'چین',
  subject: 'اقتصاد',
  userSources: '',
  emphasis: '',
  exclusions: '',
};

const AiSettings = () => (
    <div className="p-6 bg-base-200/30 rounded-2xl border border-base-300">
        <h3 className="text-lg font-bold text-text-primary mb-4">تنظیمات هوش مصنوعی</h3>
        <div className="space-y-3 text-sm">
            <div className='flex justify-between items-center'>
                <span className="font-semibold text-text-primary">مدل در حال استفاده:</span>
                <span className='bg-base-300 px-2 py-1 rounded-md text-text-secondary font-mono'>gemini-2.5-flash</span>
            </div>
             <div className='flex justify-between items-center'>
                <span className="font-semibold text-text-primary">کلید API:</span>
                <span className='text-text-secondary'>به صورت امن بارگذاری شده</span>
            </div>
            <p className="text-xs text-text-secondary/70 pt-2">
                برای امنیت، کلید API به صورت خودکار از متغیرهای محیطی بارگیری می‌شود و در اینجا نمایش داده نمی‌شود.
            </p>
        </div>
    </div>
);

const SuggestedQueries: React.FC<{ suggestions: string[]; onSuggestionClick: (topic: string) => void }> = ({ suggestions, onSuggestionClick }) => (
    <div className="mt-6">
        <h3 className="text-lg font-bold text-accent mb-3">جستجوهای پیشنهادی</h3>
        <div className="flex flex-wrap gap-2">
            {suggestions.map((s, i) => (
                <button
                    key={i}
                    onClick={() => onSuggestionClick(s)}
                    className="bg-accent/10 text-accent text-sm font-semibold px-3 py-1.5 rounded-full hover:bg-accent/30 transition-colors"
                >
                    {s}
                </button>
            ))}
        </div>
    </div>
);

function App() {
  const [activeTheme, setActiveTheme] = useLocalStorage<Theme>('app-theme', THEMES[0]);
  const [query, setQuery] = useState<SearchQuery>(initialQuery);
  const [results, setResults] = useState<SearchResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [savedSearches, setSavedSearches] = useLocalStorage<SearchQuery[]>('saved-searches', []);
  const [showCopied, setShowCopied] = useState(false);

  useEffect(() => {
    document.documentElement.lang = 'fa';
    document.documentElement.dir = 'rtl';
    Object.entries(activeTheme.colors).forEach(([key, value]) => {
      document.documentElement.style.setProperty(key, value);
    });
  }, [activeTheme]);

  const handleSearch = useCallback(async (searchQuery: Omit<SearchQuery, 'id' | 'name'>) => {
    setIsLoading(true);
    setError(null);
    setResults(null);
    try {
      const apiResults = await fetchStatisticalAnalysis(searchQuery);
      setResults(apiResults);
      setQuery(prev => ({...prev, keywords: apiResults.keywords.join(', ')}));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'یک خطای ناشناخته رخ داد.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleSuggestionSearch = (topic: string) => {
    const newQuery = {...initialQuery, topic: topic, region1: query.region1, region2: query.region2, subject: query.subject };
    setQuery(newQuery);
    const { id, name, ...searchData } = newQuery;
    handleSearch(searchData);
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const sharedQueryData = urlParams.get('q');
    if (sharedQueryData) {
      try {
        const decodedQuery = JSON.parse(atob(sharedQueryData));
        const newQuery = { ...initialQuery, ...decodedQuery, id: '', name: 'Shared Query' };
        setQuery(newQuery);
        const { id, name, ...searchData } = newQuery;
        handleSearch(searchData);
      } catch (e) {
        console.error("Failed to parse shared query:", e);
      }
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [handleSearch]);
  
  const handleSaveSearch = (name: string) => {
    const newSavedSearch: SearchQuery = { ...query, id: new Date().toISOString(), name };
    setSavedSearches(prev => [newSavedSearch, ...prev]);
    alert(`جستجوی "${name}" ذخیره شد!`);
  };

  const handleLoadSearch = (loadedQuery: SearchQuery) => {
    setQuery(loadedQuery);
    setResults(null);
    setError(null);
  };

  const handleDeleteSearch = (id: string) => {
    if (window.confirm("آیا از حذف این جستجوی ذخیره شده مطمئن هستید؟")) {
      setSavedSearches(prev => prev.filter(q => q.id !== id));
    }
  };

  const handleShare = () => {
    const { id, name, ...dataToShare } = query;
    const baseUrl = window.location.origin + window.location.pathname;
    const encodedQuery = btoa(JSON.stringify(dataToShare));
    const shareableUrl = `${baseUrl}?q=${encodedQuery}`;
    
    navigator.clipboard.writeText(shareableUrl).then(() => {
        setShowCopied(true);
        setTimeout(() => setShowCopied(false), 2000);
    });
  };

  return (
    <div className="min-h-screen bg-base-100 bg-gradient-radial from-secondary/20 to-base-100 font-sans text-text-primary transition-colors duration-500">
      <Header onThemeChange={setActiveTheme} />
      <main className="container mx-auto p-4 md:p-6 grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
        <div className="lg:col-span-1 space-y-6 lg:sticky lg:top-24">
          <div className="bg-base-200/50 p-6 rounded-2xl border border-base-300 backdrop-blur-sm">
             <SearchForm onSearch={handleSearch} isLoading={isLoading} query={query} setQuery={setQuery} />
          </div>
          <SavedSearches savedSearches={savedSearches} onLoad={handleLoadSearch} onDelete={handleDeleteSearch} onSave={handleSaveSearch} />
           <AiSettings />
        </div>

        <div className="lg:col-span-2 bg-base-200/50 p-4 sm:p-6 rounded-2xl border border-base-300 backdrop-blur-sm min-h-[60vh]">
          {isLoading && <Loader />}
          {error && (
            <div className="flex flex-col items-center justify-center h-full text-center text-red-400 p-4">
              <Icon name="warning" className="w-16 h-16 mb-4" />
              <h2 className="text-xl font-bold mb-2">تحلیل با شکست مواجه شد</h2>
              <p className="text-base-100 bg-red-400/80 px-4 py-2 rounded-md">{error}</p>
            </div>
          )}
          {!isLoading && !error && !results && (
            <div className="flex flex-col items-center justify-center h-full text-center text-text-secondary p-4">
              <Icon name="search" className="w-16 h-16 mb-4 opacity-30" />
              <h2 className="text-xl font-bold mb-2">آماده برای تحلیل</h2>
              <p>فرم را پر کرده و روی "تحلیل" کلیک کنید تا تحقیق خود را شروع کنید.</p>
            </div>
          )}
          {results && (
             <div className="animate-fade-in">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-bold text-text-primary">نتایج تحلیل</h2>
                    <div className="flex gap-2">
                        <button onClick={handleShare} className="flex items-center gap-2 text-sm bg-base-300 text-text-secondary font-semibold py-2 px-3 rounded-lg hover:text-primary transition-colors">
                            <Icon name={showCopied ? 'copy' : 'share'} className="w-4 h-4" />
                            {showCopied ? 'کپی شد!' : 'اشتراک‌گذاری'}
                        </button>
                         <button onClick={() => window.print()} className="flex items-center gap-2 text-sm bg-base-300 text-text-secondary font-semibold py-2 px-3 rounded-lg hover:text-primary transition-colors">
                            <Icon name="export" className="w-4 h-4" />
                            خروجی
                        </button>
                    </div>
                </div>
                <ResultsDisplay results={results} query={{ region1: query.region1, region2: query.region2 }} />
                {results.suggestedQueries?.length > 0 && (
                    <SuggestedQueries suggestions={results.suggestedQueries} onSuggestionClick={handleSuggestionSearch} />
                )}
             </div>
          )}
        </div>
      </main>
    </div>
  );
}

export default App;