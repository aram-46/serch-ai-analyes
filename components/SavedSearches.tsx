
import React from 'react';
import type { SearchQuery } from '../types';
import { Icon } from './icons';

interface SavedSearchesProps {
  savedSearches: SearchQuery[];
  onLoad: (query: SearchQuery) => void;
  onDelete: (id: string) => void;
  onSave: (name: string) => void;
}

const SavedSearches: React.FC<SavedSearchesProps> = ({ savedSearches, onLoad, onDelete, onSave }) => {
  const handleSave = () => {
    const name = prompt("یک نام برای این جستجو وارد کنید:");
    if (name) {
      onSave(name);
    }
  };

  return (
    <div className="p-6 bg-base-200/30 rounded-2xl border border-base-300">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-bold text-text-primary">جستجوهای ذخیره شده</h3>
        <button
          onClick={handleSave}
          className="flex items-center gap-2 text-sm bg-primary/20 text-accent font-semibold py-2 px-3 rounded-lg hover:bg-primary/40 transition-colors"
        >
          <Icon name="save" className="w-4 h-4" /> ذخیره جستجوی فعلی
        </button>
      </div>
      <div className="space-y-3 max-h-60 overflow-y-auto pl-2">
        {savedSearches.length > 0 ? (
          savedSearches.map(query => (
            <div key={query.id} className="flex items-center justify-between bg-base-200 p-3 rounded-lg">
              <span className="text-text-secondary font-medium truncate pl-2">{query.name}</span>
              <div className="flex items-center gap-2 flex-shrink-0">
                <button onClick={() => onLoad(query)} className="p-1.5 text-text-secondary hover:text-primary transition-colors" title="بارگذاری جستجو">
                  <Icon name="load" className="w-4 h-4" />
                </button>
                <button onClick={() => onDelete(query.id)} className="p-1.5 text-text-secondary hover:text-red-500 transition-colors" title="حذف جستجو">
                  <Icon name="delete" className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-sm text-text-secondary py-4">هنوز جستجوی ذخیره شده‌ای ندارید.</p>
        )}
      </div>
    </div>
  );
};

export default SavedSearches;