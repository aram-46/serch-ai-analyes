
import type { Theme } from './types';

export const COUNTRIES = [
  'ایران', 'عربستان سعودی', 'روسیه', 'چین', 'کره جنوبی', 'کره شمالی',
  'خاورمیانه', 'کشورهای اسلامی', 'آسیا', 'اروپا', 'آمریکا', 'آمریکای جنوبی',
  'کشورهای غربی', 'کل جهان'
];

export const SUBJECTS = [
  'تاریخ', 'دین', 'عمومی', 'اجتماعی', 'علوم انسانی', 'جغرافیا',
  'روانشناسی', 'فیزیک', 'زمین شناسی', 'پزشکی', 'آسیب های اجتماعی', 'مسائل نژادی',
  'جدایی طلبی', 'ادیان تطبیقی', 'شبه علم', 'خرافات',
  'فقر', 'آزار جنسی', 'روابط زناشویی', 'اقتصاد', 'فساد',
  'مسائل جنسی', 'پورنوگرافی', 'سینما', 'درآمد'
];

export const THEMES: Theme[] = [
    {
        name: 'Neon Abstract',
        colors: {
            '--color-primary': '#f0f',
            '--color-secondary': '#6a0dad',
            '--color-accent': '#0ff',
            '--color-base-100': '#0d0c1d',
            '--color-base-200': '#1a1a3d',
            '--color-base-300': '#2c2c54',
            '--color-text-primary': '#f0f0f0',
            '--color-text-secondary': '#a0a0c0',
        },
    },
    {
        name: 'Indigo Dream',
        colors: {
            '--color-primary': '#5c6ac4',
            '--color-secondary': '#3f51b5',
            '--color-accent': '#a3bffa',
            '--color-base-100': '#1A202C',
            '--color-base-200': '#2D3748',
            '--color-base-300': '#4A5568',
            '--color-text-primary': '#E2E8F0',
            '--color-text-secondary': '#A0AEC0',
        },
    },
    {
        name: 'Crimson Sunset',
        colors: {
            '--color-primary': '#e53e3e',
            '--color-secondary': '#c53030',
            '--color-accent': '#fed7d7',
            '--color-base-100': '#2d1d1d',
            '--color-base-200': '#4d2d2d',
            '--color-base-300': '#6d3d3d',
            '--color-text-primary': '#f7fafc',
            '--color-text-secondary': '#e2e8f0',
        },
    },
    {
        name: 'Emerald Forest',
        colors: {
            '--color-primary': '#38a169',
            '--color-secondary': '#2f855a',
            '--color-accent': '#9ae6b4',
            '--color-base-100': '#1a2a23',
            '--color-base-200': '#2a4838',
            '--color-base-300': '#3a634d',
            '--color-text-primary': '#f0fff4',
            '--color-text-secondary': '#c6f6d5',
        },
    },
];