
export interface SearchQuery {
  id: string;
  name: string;
  topic: string;
  keywords: string;
  region1: string;
  region2: string;
  subject: string;
  userSources: string;
}

export interface StatisticalSource {
  name: string;
  credibilityScore: number;
  credibilityAnalysis: string;
  statisticalPopulation: string;
  surveyType: string;
  participantCount: number;
  methodology: string;
  year: string;
  isStillValid: boolean;
  link: string;
}

export interface RelatedResearch {
  title: string;
  summary: string;
  source: string;
  link: string;
}

export interface VisualDataPoint {
  name: string;
  [key: string]: string | number;
}

export interface SearchResult {
  keywords: string[];
  comparisonSummary: string;
  visualData: VisualDataPoint[];
  sources: StatisticalSource[];
  relatedResearch: RelatedResearch[];
}

export type Theme = {
  name: string;
  colors: {
    '--color-primary': string;
    '--color-secondary': string;
    '--color-accent': string;
    '--color-base-100': string;
    '--color-base-200': string;
    '--color-base-300': string;
    '--color-text-primary': string;
    '--color-text-secondary': string;
  };
};

export type ActiveTab = 'analysis' | 'related' | 'sources';
