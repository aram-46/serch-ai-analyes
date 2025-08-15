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
      alert('لطفاً برای ایجاد کلمات کلیدی، ابتدا یک موضوع وارد کنید.');
      return;
    }
    setIsGenerating(true);
    try {
      const keywords = await generateKeywordsFromTopic(query.topic);
      setQuery(prev => ({ ...prev, keywords: keywords.join(', ') }));
    } catch (error) {
      console.error(error);
      alert('ایجاد کلمات کلیدی با شکست مواجه شد.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.topic || !query.region1 || !query.region2 || !query.subject) {
      alert("لطفاً فیلدهای موضوع، هر دو منطقه و حوزه موضوع را پر کنید.");
      return;
    }
    const { id, name, ...searchData } = query;
    onSearch(searchData);
  };

  const commonInputClass = "w-full bg-base-200/50 border border-base-300 rounded-lg p-3 text-text-primary focus:ring-2 focus:ring-accent focus:border-accent transition-all duration-200 placeholder-text-secondary/50 focus:shadow-neon-accent";
  const commonLabelClass = "block text-sm font-medium text-accent mb-2 tracking-wider";

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label htmlFor="topic" className={commonLabelClass}>موضوع تحقیق</label>
        <input type="text" id="topic" name="topic" value={query.topic} onChange={handleChange} className={commonInputClass} placeholder="مثال: تأثیر انرژی‌های تجدیدپذیر بر تولید ناخالص داخلی" required />
      </div>

      <div>
        <label htmlFor="keywords" className={commonLabelClass}>کلمات کلیدی</label>
        <div className="relative">
          <input type="text" id="keywords" name="keywords" value={query.keywords} onChange={handleChange} className={commonInputClass + " pl-28"} placeholder="در صورت خالی بودن، هوش مصنوعی تولید می‌کند" />
          <button type="button" onClick={handleGenerateKeywords} disabled={isGenerating || isLoading} className="absolute inset-y-0 left-0 flex items-center px-3 text-sm bg-accent/20 text-accent font-semibold rounded-l-lg hover:bg-accent/40 disabled:opacity-50 disabled:cursor-not-allowed transition-colors">
            {isGenerating ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div> : <Icon name="generate" className="w-4 h-4 ml-1" />}
            ایجاد
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="region1" className={commonLabelClass}>مقایسه منطقه ۱</label>
          <input list="country-list" id="region1" name="region1" value={query.region1} onChange={handleChange} className={commonInputClass} placeholder="یک کشور را انتخاب یا تایپ کنید" required />
        </div>
        <div>
          <label htmlFor="region2" className={commonLabelClass}>با منطقه ۲</label>
          <input list="country-list" id="region2" name="region2" value={query.region2} onChange={handleChange} className={commonInputClass} placeholder="یک کشور را انتخاب یا تایپ کنید" required />
        </div>
        <datalist id="country-list">
          {COUNTRIES.map(c => <option key={c} value={c} />)}
        </datalist>
      </div>

      <div>
        <label htmlFor="subject" className={commonLabelClass}>حوزه موضوع</label>
        <select id="subject" name="subject" value={query.subject} onChange={handleChange} className={commonInputClass} required>
          <option value="">-- یک موضوع انتخاب کنید --</option>
          {SUBJECTS.map(s => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>
      
      <div>
        <label htmlFor="emphasis" className={commonLabelClass}>تاکید بر (اختیاری)</label>
        <textarea id="emphasis" name="emphasis" value={query.emphasis} onChange={handleChange} className={commonInputClass} rows={2} placeholder="مواردی که اهمیت بیشتری دارند و جستجو باید حول آن‌ها انجام شود."></textarea>
      </div>

      <div>
        <label htmlFor="exclusions" className={commonLabelClass}>جستجو نشود (اختیاری)</label>
        <textarea id="exclusions" name="exclusions" value={query.exclusions} onChange={handleChange} className={commonInputClass} rows={2} placeholder="مواردی که نباید جستجو شوند. مثال: منابع دینی، سایت‌های داخل ایران."></textarea>
      </div>

      <div>
        <label htmlFor="userSources" className={commonLabelClass}>محدود به منابع خاص (اختیاری)</label>
        <textarea id="userSources" name="userSources" value={query.userSources} onChange={handleChange} className={commonInputClass} rows={2} placeholder="برای محدود کردن جستجو، URLها را وارد کنید (هر کدام در یک خط)."></textarea>
      </div>

      <button type="submit" disabled={isLoading} className="w-full flex justify-center items-center gap-3 bg-gradient-to-r from-primary to-accent text-white font-bold py-3 px-4 rounded-lg hover:scale-105 disabled:opacity-60 disabled:cursor-not-allowed disabled:scale-100 transition-all duration-300 shadow-lg hover:shadow-primary/50">
        {isLoading ? (
          <>
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            در حال تحلیل...
          </>
        ) : (
          <>
            <Icon name="search" className="w-6 h-6" />
            تحلیل و مقایسه آمار
          </>
        )}
      </button>
    </form>
  );
};

export default SearchForm;