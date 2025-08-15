
import type { Theme } from './types';

export const COUNTRIES = [
  'Iran', 'Saudi Arabia', 'Russia', 'China', 'South Korea', 'North Korea',
  'Middle East', 'Islamic Countries', 'Asia', 'Europe', 'USA', 'South America',
  'Western Countries', 'Whole World'
];

export const SUBJECTS = [
  'History', 'Religion', 'General', 'Social', 'Humanities', 'Geography',
  'Psychology', 'Physics', 'Geology', 'Medicine', 'Social Harm', 'Racial Issues',
  'Separatism', 'Comparative Religion', 'Pseudoscience', 'Superstitions',
  'Poverty', 'Sexual Abuse', 'Marital Relations', 'Economics', 'Corruption',
  'Sexuality', 'Pornography', 'Cinema', 'Income'
];

export const THEMES: Theme[] = [
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
    {
        name: 'Royal Purple',
        colors: {
            '--color-primary': '#805ad5',
            '--color-secondary': '#6b46c1',
            '--color-accent': '#d6bcfa',
            '--color-base-100': '#241b3a',
            '--color-base-200': '#3d2c5a',
            '--color-base-300': '#573d7a',
            '--color-text-primary': '#f7fafc',
            '--color-text-secondary': '#e9d8fd',
        },
    },
    {
        name: 'Golden Hour',
        colors: {
            '--color-primary': '#dd6b20',
            '--color-secondary': '#c05621',
            '--color-accent': '#fbd38d',
            '--color-base-100': '#382b1c',
            '--color-base-200': '#5c462e',
            '--color-base-300': '#7f6141',
            '--color-text-primary': '#fffff0',
            '--color-text-secondary': '#fde68a',
        },
    },
];
