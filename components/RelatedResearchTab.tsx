
import React, { useState } from 'react';
import type { RelatedResearch } from '../types';
import { Icon } from './icons';
import { translateText } from '../services/geminiService';

interface RelatedResearchTabProps {
  results: { relatedResearch: RelatedResearch[] };
}

const ResearchCard: React.FC<{ item: RelatedResearch }> = ({ item }) => {
    const [isTranslating, setIsTranslating] = useState(false);
    const [translatedSummary, setTranslatedSummary] = useState<string | null>(null);
    const [showOriginal, setShowOriginal] = useState(true);

    const handleTranslate = async () => {
        if (!item.summary) return;
        setIsTranslating(true);
        try {
            const translation = await translateText(item.summary, "Persian");
            setTranslatedSummary(translation);
            setShowOriginal(false);
        } catch (error) {
            alert("ترجمه با خطا مواجه شد.");
        } finally {
            setIsTranslating(false);
        }
    };

    const credibilityColor = item.credibilityScore > 7 ? 'text-green-400' : item.credibilityScore > 4 ? 'text-yellow-400' : 'text-red-400';

    return (
        <div className="p-5 bg-base-200/50 rounded-2xl border border-base-300 transition-shadow hover:shadow-lg hover:border-accent/50 space-y-4">
            <div className="flex justify-between items-start gap-4">
                <h4 className="text-xl font-bold text-accent mb-1">{item.title}</h4>
                <a href={item.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary font-semibold hover:underline flex-shrink-0">
                    <Icon name="export" className="w-5 h-5" />
                </a>
            </div>
            
            <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-text-secondary">
                <span><span className="font-semibold">منبع:</span> {item.source}</span>
                <span><span className="font-semibold">سال:</span> {item.year}</span>
                 <p className={`font-semibold ${item.isStillValid ? 'text-green-400' : 'text-yellow-500'}`}>
                    {item.isStillValid ? 'هنوز معتبر' : 'منسوخ'}
                </p>
            </div>
            
            <div>
                 <div className="flex justify-between items-center mb-2">
                    <h5 className="font-bold text-text-primary">خلاصه</h5>
                    {translatedSummary ? (
                        <button onClick={() => setShowOriginal(!showOriginal)} className="text-xs text-accent font-semibold">
                            {showOriginal ? 'نمایش ترجمه' : 'نمایش اصلی'}
                        </button>
                    ) : (
                         <button onClick={handleTranslate} disabled={isTranslating} className="flex items-center gap-1 text-xs text-accent font-semibold disabled:opacity-50">
                             {isTranslating && <div className="w-3 h-3 border-2 border-current border-t-transparent rounded-full animate-spin"></div>}
                             ترجمه
                         </button>
                    )}
                </div>
                <p className="text-text-secondary text-sm leading-relaxed">{showOriginal ? item.summary : translatedSummary}</p>
            </div>

            <div className="border-t border-base-300 pt-4 space-y-4">
                <h5 className="font-bold text-text-primary">تحلیل اعتبار</h5>
                <div className={`flex items-center gap-2 font-bold ${credibilityColor}`}>
                    <div className="font-mono text-lg">{item.credibilityScore}/10</div>
                    <span className="text-sm">امتیاز اعتبار</span>
                </div>
                <p className="text-sm text-text-secondary italic">{item.credibilityAnalysis}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 border-t border-base-300 pt-4">
                <div>
                    <h5 className="font-bold text-text-primary mb-2 text-green-400">دیدگاه‌های موافق</h5>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.proponentViews}</p>
                </div>
                 <div>
                    <h5 className="font-bold text-text-primary mb-2 text-red-400">دیدگاه‌های مخالف</h5>
                    <p className="text-sm text-text-secondary leading-relaxed">{item.opposingViews}</p>
                </div>
            </div>
        </div>
    );
};


const RelatedResearchTab: React.FC<RelatedResearchTabProps> = ({ results }) => {
  return (
    <div className="space-y-6 animate-fade-in">
      {results.relatedResearch.length > 0 ? (
        results.relatedResearch.map((item, index) => (
          <ResearchCard key={index} item={item} />
        ))
      ) : (
        <p className="text-center text-text-secondary py-10">تحقیق مرتبطی یافت نشد.</p>
      )}
    </div>
  );
};

export default RelatedResearchTab;
