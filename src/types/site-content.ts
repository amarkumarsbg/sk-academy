export interface SiteSettings {
  name: string;
  tagline: string;
  description: string;
  location: string;
  establishedYear: number;
  email: string;
  admissionsEmail: string;
  phone: string;
  address: string;
  logo: string;
  academicSession: string;
  sessionStartDate: string;
  social: {
    facebook: string;
    instagram: string;
    youtube: string;
  };
}

export interface AnnouncementContent {
  message: string;
  linkText: string;
  linkHref: string;
}

export interface HeroSlide {
  id: string;
  image: string;
  title: string;
  subtitle: string;
  cta: string;
  ctaHref: string;
}

export interface HighlightItem {
  id: string;
  title: string;
  excerpt: string;
  image: string;
}

export interface StatItem {
  label: string;
  value: string;
}

export interface FeatureItem {
  title: string;
  description: string;
}

export interface HomepageContent {
  introExtra: string;
  whyChooseTitle: string;
  whyChooseDescription: string;
  features: FeatureItem[];
  newsSectionTitle: string;
  newsSectionDescription: string;
  eventsSectionTitle: string;
  eventsSectionDescription: string;
  ctaTitle: string;
  ctaDescription: string;
  ctaButton: string;
}

export interface PageHeroContent {
  title: string;
  description: string;
}

export interface NewsItem {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  category: string;
  image: string;
}

export interface EventItem {
  id: string;
  title: string;
  date: string;
  time: string;
  location: string;
  type: string;
}

export interface NoticeItem {
  id: string;
  title: string;
  date: string;
  audience: string;
  status: string;
}

export interface GalleryAlbum {
  id: string;
  title: string;
  count: number;
  cover: string;
}

export interface AcademicLevel {
  name: string;
  description: string;
  subjects: string[];
}

export interface AdmissionsStep {
  step: number;
  title: string;
  description: string;
}

export interface ImportantDate {
  label: string;
  date: string;
}

export interface AboutContent {
  hero: PageHeroContent;
  storyTitle: string;
  storyDescription: string;
  storyParagraphs: string[];
  mission: string;
  vision: string;
  values: FeatureItem[];
  leadership: { name: string; role: string; bio: string }[];
}

export interface AcademicsContent {
  hero: PageHeroContent;
  levelsTitle: string;
  levelsDescription: string;
  featuresTitle: string;
  featuresDescription: string;
  levels: AcademicLevel[];
  features: string[];
}

export interface AdmissionsContent {
  hero: PageHeroContent;
  steps: AdmissionsStep[];
  eligibilityItems: string[];
  importantDates: ImportantDate[];
}

export interface ContactContent {
  hero: PageHeroContent;
  officeHours: string[];
}

export interface FooterContent {
  backgroundImage: string;
}

export interface HighlightsSection {
  label: string;
  title: string;
  description: string;
}

export interface SiteContent {
  settings: SiteSettings;
  announcement: AnnouncementContent;
  heroSlides: HeroSlide[];
  highlights: HighlightItem[];
  highlightsSection: HighlightsSection;
  stats: StatItem[];
  homepage: HomepageContent;
  news: NewsItem[];
  events: EventItem[];
  notices: NoticeItem[];
  gallery: GalleryAlbum[];
  about: AboutContent;
  academics: AcademicsContent;
  admissions: AdmissionsContent;
  contact: ContactContent;
  footer: FooterContent;
  pageHeroes: {
    events: PageHeroContent;
    news: PageHeroContent;
    gallery: PageHeroContent;
  };
}
