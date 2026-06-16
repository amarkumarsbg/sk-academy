import type { SiteContent } from "@/types/site-content";
import { heroSlides } from "@/data/mock/hero-slides";
import { highlights } from "@/data/mock/highlights";
import {
  stats,
  newsItems,
  events,
  galleryAlbums,
  academics,
  admissionsSteps,
  notices,
} from "@/data/mock/index";

export const defaultSiteContent: SiteContent = {
  settings: {
    name: "SK Academy",
    tagline: "Learn • Grow • Excel",
    description:
      "A premier institution in Kahalgaon, Bhagalpur, dedicated to nurturing young minds through quality education, holistic development, and strong values.",
    location: "Kahalgaon, Bhagalpur",
    establishedYear: 2010,
    email: "info@skacademy.edu",
    admissionsEmail: "admissions@skacademy.edu",
    phone: "+91 98765 43210",
    address: "SK Academy, Kahalgaon, Bhagalpur, Bihar, India",
    logo: "/logo.png?v=2",
    academicSession: "2026–27",
    sessionStartDate: "2026-04-01",
    social: {
      facebook: "https://facebook.com",
      instagram: "https://instagram.com",
      youtube: "https://youtube.com",
    },
  },
  announcement: {
    message: "Admissions Open 2026-27",
    linkText: "Download School Brochure",
    linkHref: "/admissions",
  },
  heroSlides,
  highlights,
  highlightsSection: {
    label: "Campus Life",
    title: "Highlights",
    description: "Moments from events, achievements, and everyday learning at SK Academy.",
  },
  stats,
  homepage: {
    introExtra:
      "From primary to senior secondary, we offer a comprehensive CBSE-aligned curriculum with modern infrastructure, dedicated faculty, and a nurturing environment.",
    whyChooseTitle: "Why Choose SK Academy?",
    whyChooseDescription:
      "We provide a nurturing environment where every student can thrive academically and personally.",
    features: [
      { title: "Academic Excellence", description: "CBSE curriculum with proven board results year after year." },
      { title: "Expert Faculty", description: "Dedicated teachers with years of experience and passion for teaching." },
      { title: "Modern Infrastructure", description: "Smart classrooms, labs, library, and sports facilities." },
      { title: "Holistic Development", description: "Sports, arts, clubs, and leadership programs for all-round growth." },
    ],
    newsSectionTitle: "Latest News",
    newsSectionDescription: "Stay updated with the latest happenings at our school.",
    eventsSectionTitle: "Upcoming Events",
    eventsSectionDescription: "Mark your calendar for these important dates.",
    ctaTitle: "Ready to Join SK Academy?",
    ctaDescription: "Admissions are open for the academic year 2026–27. Start your journey with us today.",
    ctaButton: "Start Application",
  },
  news: newsItems,
  events,
  notices,
  gallery: galleryAlbums,
  about: {
    hero: {
      title: "About Us",
      description: "Discover our mission, values, and the legacy of excellence that defines SK Academy.",
    },
    storyTitle: "Our Story",
    storyDescription: "",
    storyParagraphs: [
      "What began as a small institution with a vision to transform education has grown into one of the region's most respected schools. We believe every child is unique and deserves an environment that nurtures curiosity, creativity, and character.",
      "Our alumni have gone on to excel in diverse fields — from medicine and engineering to arts and entrepreneurship — carrying forward the values instilled during their formative years.",
    ],
    mission: "To provide holistic education that empowers students to become responsible global citizens.",
    vision: "To be the most trusted name in school education, known for academic rigor and human values.",
    values: [
      { title: "Integrity", description: "Honesty and ethical conduct in all we do." },
      { title: "Excellence", description: "Striving for the highest standards in education." },
      { title: "Respect", description: "Valuing diversity and treating everyone with dignity." },
      { title: "Innovation", description: "Embracing new ideas and modern teaching methods." },
    ],
    leadership: [
      { name: "Dr. R.K. Sharma", role: "Principal", bio: "Ph.D. in Education, 25+ years of leadership experience." },
      { name: "Mrs. Poonam Agarwal", role: "Vice Principal", bio: "M.Ed., specialist in curriculum development." },
      { name: "Mr. Sanjay Mehra", role: "Academic Director", bio: "Former CBSE examiner, 20+ years in academics." },
    ],
  },
  academics: {
    hero: {
      title: "Academics",
      description: "A comprehensive CBSE-affiliated curriculum designed for every stage of learning.",
    },
    levelsTitle: "Academic Levels",
    levelsDescription: "Structured programs from primary through senior secondary.",
    featuresTitle: "What Sets Us Apart",
    featuresDescription: "Beyond textbooks — we focus on experiential learning and real-world skills.",
    levels: academics.levels,
    features: academics.features,
  },
  admissions: {
    hero: {
      title: "Admissions",
      description: "Join SK Academy — admissions open for academic year 2026–27.",
    },
    steps: admissionsSteps,
    eligibilityItems: [
      "Age-appropriate grade as per CBSE norms",
      "Birth certificate (original + copy)",
      "Previous school transfer certificate",
      "Passport-size photographs (4 nos.)",
      "Aadhaar card of student and parent",
      "Previous class report card / mark sheet",
    ],
    importantDates: [
      { label: "Application Opens", date: "January 1, 2026" },
      { label: "Last Date to Apply", date: "March 31, 2026" },
      { label: "Entrance Interaction", date: "April 15–30, 2026" },
      { label: "Session Begins", date: "April 1, 2026" },
    ],
  },
  contact: {
    hero: {
      title: "Contact Us",
      description: "We'd love to hear from you. Reach out for admissions, inquiries, or general information.",
    },
    officeHours: [
      "Monday – Friday: 8:00 AM – 3:00 PM",
      "Saturday: 8:00 AM – 12:00 PM (Admissions only)",
      "Sunday & Public Holidays: Closed",
    ],
  },
  footer: {
    backgroundImage: "/images/assembly-hall.png",
  },
  pageHeroes: {
    events: {
      title: "Events & Calendar",
      description: "Stay informed about upcoming school events, meetings, and celebrations.",
    },
    news: {
      title: "News & Notices",
      description: "Latest updates, achievements, and announcements from SK Academy.",
    },
    gallery: {
      title: "Photo Gallery",
      description: "Glimpses of life at SK Academy — events, campus, and student activities.",
    },
  },
};

export const STORAGE_KEY = "sk-academy-site-content";
export const CONTENT_VERSION_KEY = "sk-academy-content-version";
export const CONTENT_VERSION = 2;
