
import React from 'react';
import { THEMES } from '../constants';
import type { Theme } from '../types';
import { Icon } from './icons';

interface HeaderProps {
  onThemeChange: (theme: Theme) => void;
}

const ThemeSwitcher: React.FC<{ onThemeChange: (theme: Theme) => void }> = ({ onThemeChange }) => {
  return (
    <div className="relative group">
       <button className="flex items-center gap-2 px-3 py-2 bg-base-300/50 rounded-lg text-text-secondary hover:bg-base-300 hover:text-text-primary transition-all duration-200">
           <Icon name="theme" className="w-5 h-5"/>
           <span className="hidden sm:inline">پوسته</span>
       </button>
       <div className="absolute left-0 mt-2 w-48 bg-base-200 border border-base-300 rounded-lg shadow-xl p-2 z-20 opacity-0 group-hover:opacity-100 pointer-events-none group-hover:pointer-events-auto transition-opacity duration-300">
           {THEMES.map((theme) => (
               <button
                   key={theme.name}
                   onClick={() => onThemeChange(theme)}
                   className="w-full text-right px-3 py-2 rounded-md hover:bg-base-300 text-text-secondary hover:text-text-primary flex items-center gap-3 transition-colors"
               >
                  <span className="w-4 h-4 rounded-full" style={{ backgroundColor: theme.colors['--color-primary'] }}></span>
                  {theme.name}
               </button>
           ))}
       </div>
    </div>
  );
};


const Header: React.FC<HeaderProps> = ({ onThemeChange }) => {
  return (
    <header className="w-full p-4 flex justify-between items-center bg-base-100/50 backdrop-blur-lg border-b border-base-300 sticky top-0 z-10">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
            <Icon name="chart" className="w-6 h-6 text-white"/>
        </div>
        <h1 className="text-xl md:text-2xl font-bold text-text-primary">
          تحلیلگر آماری هوش مصنوعی
        </h1>
      </div>
      <ThemeSwitcher onThemeChange={onThemeChange} />
    </header>
  );
};

export default Header;