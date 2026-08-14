import React from 'react';
import { 
  Stethoscope, 
  Heart, 
  Activity, 
  Baby, 
  ShieldAlert,
  Droplet,
  Droplets,
  Wind,
  Home,
  Ear,
  Smile,
  Scissors,
  ScanLine,
  HeartHandshake,
  Utensils,
  Bone,
  Siren,
  LucideProps
} from 'lucide-react';

export interface DepartmentTheme {
  primary: string;       // Primary specialty accent color
  bg: string;            // Soft clinical background
  dark: string;          // Dark accent for text/badges
  bgTint: string;        // Tailwind class for soft bg
  borderTint: string;    // Tailwind class for subtle border
  textTint: string;      // Tailwind class for dark accent text
  iconColor: string;     // Tailwind class for primary icon color
  badgeBg: string;       // Tailwind class for badge bg
  badgeText: string;     // Tailwind class for badge text
  badgeBorder: string;   // Tailwind class for badge border
  hoverBorder: string;   // Tailwind class for hover border
}

export const DEFAULT_DEPARTMENT_THEME: DepartmentTheme = {
  primary: '#22A25A',
  bg: '#EFF8F1',
  dark: '#168A4A',
  bgTint: 'bg-[#EFF8F1]',
  borderTint: 'border-[#22A25A]/20',
  textTint: 'text-[#168A4A]',
  iconColor: 'text-[#22A25A]',
  badgeBg: 'bg-[#EFF8F1]',
  badgeText: 'text-[#168A4A]',
  badgeBorder: 'border-[#22A25A]/20',
  hoverBorder: 'hover:border-[#22A25A]/40'
};

export const DEPARTMENT_THEMES: Record<string, DepartmentTheme> = {
  // 1. General OPD & Internal Medicine
  'gen-physician': {
    primary: '#3B82F6',
    bg: '#EFF6FF',
    dark: '#1D4ED8',
    bgTint: 'bg-[#EFF6FF]',
    borderTint: 'border-[#3B82F6]/20',
    textTint: 'text-[#1D4ED8]',
    iconColor: 'text-[#3B82F6]',
    badgeBg: 'bg-[#EFF6FF]',
    badgeText: 'text-[#1D4ED8]',
    badgeBorder: 'border-[#3B82F6]/20',
    hoverBorder: 'hover:border-[#3B82F6]/40'
  },
  'gen-opd': {
    primary: '#3B82F6',
    bg: '#EFF6FF',
    dark: '#1D4ED8',
    bgTint: 'bg-[#EFF6FF]',
    borderTint: 'border-[#3B82F6]/20',
    textTint: 'text-[#1D4ED8]',
    iconColor: 'text-[#3B82F6]',
    badgeBg: 'bg-[#EFF6FF]',
    badgeText: 'text-[#1D4ED8]',
    badgeBorder: 'border-[#3B82F6]/20',
    hoverBorder: 'hover:border-[#3B82F6]/40'
  },
  // 2. Cardiology & Heart Care
  'cardiology': {
    primary: '#E05252',
    bg: '#FEF2F2',
    dark: '#B91C1C',
    bgTint: 'bg-[#FEF2F2]',
    borderTint: 'border-[#E05252]/20',
    textTint: 'text-[#B91C1C]',
    iconColor: 'text-[#E05252]',
    badgeBg: 'bg-[#FEF2F2]',
    badgeText: 'text-[#B91C1C]',
    badgeBorder: 'border-[#E05252]/20',
    hoverBorder: 'hover:border-[#E05252]/40'
  },
  // 3. Orthopedics & Joint Care
  'orthopedics': {
    primary: '#D9A441',
    bg: '#FFF8E7',
    dark: '#A16207',
    bgTint: 'bg-[#FFF8E7]',
    borderTint: 'border-[#D9A441]/25',
    textTint: 'text-[#A16207]',
    iconColor: 'text-[#D9A441]',
    badgeBg: 'bg-[#FFF8E7]',
    badgeText: 'text-[#A16207]',
    badgeBorder: 'border-[#D9A441]/25',
    hoverBorder: 'hover:border-[#D9A441]/40'
  },
  // 4. General, Laparoscopic & Surgical Care
  'gen-lap-surgery': {
    primary: '#8B5CF6',
    bg: '#F5F3FF',
    dark: '#6D28D9',
    bgTint: 'bg-[#F5F3FF]',
    borderTint: 'border-[#8B5CF6]/20',
    textTint: 'text-[#6D28D9]',
    iconColor: 'text-[#8B5CF6]',
    badgeBg: 'bg-[#F5F3FF]',
    badgeText: 'text-[#6D28D9]',
    badgeBorder: 'border-[#8B5CF6]/20',
    hoverBorder: 'hover:border-[#8B5CF6]/40'
  },
  'breast-lap-surgery': {
    primary: '#8B5CF6',
    bg: '#F5F3FF',
    dark: '#6D28D9',
    bgTint: 'bg-[#F5F3FF]',
    borderTint: 'border-[#8B5CF6]/20',
    textTint: 'text-[#6D28D9]',
    iconColor: 'text-[#8B5CF6]',
    badgeBg: 'bg-[#F5F3FF]',
    badgeText: 'text-[#6D28D9]',
    badgeBorder: 'border-[#8B5CF6]/20',
    hoverBorder: 'hover:border-[#8B5CF6]/40'
  },
  // 5. Pediatrics & Child Health
  'pediatrics': {
    primary: '#EC72A5',
    bg: '#FFF1F7',
    dark: '#BE185D',
    bgTint: 'bg-[#FFF1F7]',
    borderTint: 'border-[#EC72A5]/25',
    textTint: 'text-[#BE185D]',
    iconColor: 'text-[#EC72A5]',
    badgeBg: 'bg-[#FFF1F7]',
    badgeText: 'text-[#BE185D]',
    badgeBorder: 'border-[#EC72A5]/25',
    hoverBorder: 'hover:border-[#EC72A5]/40'
  },
  // 6. Obstetrics & Gynaecology / Maternity Care
  'obs-gyn': {
    primary: '#D9467A',
    bg: '#FFF1F5',
    dark: '#BE185D',
    bgTint: 'bg-[#FFF1F5]',
    borderTint: 'border-[#D9467A]/25',
    textTint: 'text-[#BE185D]',
    iconColor: 'text-[#D9467A]',
    badgeBg: 'bg-[#FFF1F5]',
    badgeText: 'text-[#BE185D]',
    badgeBorder: 'border-[#D9467A]/25',
    hoverBorder: 'hover:border-[#D9467A]/40'
  },
  // 7. Radiology & Diagnostic Sonology
  'radiology-sonology': {
    primary: '#06A6C8',
    bg: '#ECFEFF',
    dark: '#0E7490',
    bgTint: 'bg-[#ECFEFF]',
    borderTint: 'border-[#06A6C8]/20',
    textTint: 'text-[#0E7490]',
    iconColor: 'text-[#06A6C8]',
    badgeBg: 'bg-[#ECFEFF]',
    badgeText: 'text-[#0E7490]',
    badgeBorder: 'border-[#06A6C8]/20',
    hoverBorder: 'hover:border-[#06A6C8]/40'
  },
  // 8. Diabetology & Endocrinology
  'diabetology': {
    primary: '#0F9D8A',
    bg: '#ECFDF8',
    dark: '#087F70',
    bgTint: 'bg-[#ECFDF8]',
    borderTint: 'border-[#0F9D8A]/20',
    textTint: 'text-[#087F70]',
    iconColor: 'text-[#0F9D8A]',
    badgeBg: 'bg-[#ECFDF8]',
    badgeText: 'text-[#087F70]',
    badgeBorder: 'border-[#0F9D8A]/20',
    hoverBorder: 'hover:border-[#0F9D8A]/40'
  },
  // 9. General & Chest Medicine / Pulmonology
  'chest-pulmonology': {
    primary: '#F28C45',
    bg: '#FFF4EA',
    dark: '#C2410C',
    bgTint: 'bg-[#FFF4EA]',
    borderTint: 'border-[#F28C45]/25',
    textTint: 'text-[#C2410C]',
    iconColor: 'text-[#F28C45]',
    badgeBg: 'bg-[#FFF4EA]',
    badgeText: 'text-[#C2410C]',
    badgeBorder: 'border-[#F28C45]/25',
    hoverBorder: 'hover:border-[#F28C45]/40'
  },
  // 10. Gastroenterology & Hepatology
  'gastroenterology': {
    primary: '#C58A32',
    bg: '#FFF8E8',
    dark: '#92400E',
    bgTint: 'bg-[#FFF8E8]',
    borderTint: 'border-[#C58A32]/25',
    textTint: 'text-[#92400E]',
    iconColor: 'text-[#C58A32]',
    badgeBg: 'bg-[#FFF8E8]',
    badgeText: 'text-[#92400E]',
    badgeBorder: 'border-[#C58A32]/25',
    hoverBorder: 'hover:border-[#C58A32]/40'
  },
  // 11. Family Medicine & Primary Care
  'family-medicine': {
    primary: '#22A25A',
    bg: '#EFF8F1',
    dark: '#168A4A',
    bgTint: 'bg-[#EFF8F1]',
    borderTint: 'border-[#22A25A]/20',
    textTint: 'text-[#168A4A]',
    iconColor: 'text-[#22A25A]',
    badgeBg: 'bg-[#EFF8F1]',
    badgeText: 'text-[#168A4A]',
    badgeBorder: 'border-[#22A25A]/20',
    hoverBorder: 'hover:border-[#22A25A]/40'
  },
  // 12. Dialysis & Nephrology Unit
  'dialysis': {
    primary: '#6366D9',
    bg: '#EEF2FF',
    dark: '#4338CA',
    bgTint: 'bg-[#EEF2FF]',
    borderTint: 'border-[#6366D9]/20',
    textTint: 'text-[#4338CA]',
    iconColor: 'text-[#6366D9]',
    badgeBg: 'bg-[#EEF2FF]',
    badgeText: 'text-[#4338CA]',
    badgeBorder: 'border-[#6366D9]/20',
    hoverBorder: 'hover:border-[#6366D9]/40'
  },
  // 13. ENT — Ear, Nose & Throat
  'ent': {
    primary: '#38A8D6',
    bg: '#EFF9FF',
    dark: '#0369A1',
    bgTint: 'bg-[#EFF9FF]',
    borderTint: 'border-[#38A8D6]/20',
    textTint: 'text-[#0369A1]',
    iconColor: 'text-[#38A8D6]',
    badgeBg: 'bg-[#EFF9FF]',
    badgeText: 'text-[#0369A1]',
    badgeBorder: 'border-[#38A8D6]/20',
    hoverBorder: 'hover:border-[#38A8D6]/40'
  },
  // 14. Dental Surgery & Oral Care
  'dental': {
    primary: '#F07878',
    bg: '#FFF1F1',
    dark: '#C24141',
    bgTint: 'bg-[#FFF1F1]',
    borderTint: 'border-[#F07878]/25',
    textTint: 'text-[#C24141]',
    iconColor: 'text-[#F07878]',
    badgeBg: 'bg-[#FFF1F1]',
    badgeText: 'text-[#C24141]',
    badgeBorder: 'border-[#F07878]/25',
    hoverBorder: 'hover:border-[#F07878]/40'
  },
  // 15. 24/7 Emergency & Casualty Care
  'emergency-247': {
    primary: '#DC4B4B',
    bg: '#FEF2F2',
    dark: '#991B1B',
    bgTint: 'bg-[#FEF2F2]',
    borderTint: 'border-[#DC4B4B]/25',
    textTint: 'text-[#991B1B]',
    iconColor: 'text-[#DC4B4B]',
    badgeBg: 'bg-[#FEF2F2]',
    badgeText: 'text-[#991B1B]',
    badgeBorder: 'border-[#DC4B4B]/25',
    hoverBorder: 'hover:border-[#DC4B4B]/40'
  }
};

export function getDepartmentTheme(deptId?: string): DepartmentTheme {
  if (!deptId) return DEFAULT_DEPARTMENT_THEME;
  const normalizedId = deptId.toLowerCase().trim();
  
  if (DEPARTMENT_THEMES[normalizedId]) {
    return DEPARTMENT_THEMES[normalizedId];
  }

  // Keyword-based fallback matching
  if (normalizedId.includes('cardio') || normalizedId.includes('heart')) return DEPARTMENT_THEMES['cardiology'];
  if (normalizedId.includes('ortho') || normalizedId.includes('joint') || normalizedId.includes('bone')) return DEPARTMENT_THEMES['orthopedics'];
  if (normalizedId.includes('pediatric') || normalizedId.includes('child') || normalizedId.includes('peds')) return DEPARTMENT_THEMES['pediatrics'];
  if (normalizedId.includes('obs') || normalizedId.includes('gyn') || normalizedId.includes('maternity')) return DEPARTMENT_THEMES['obs-gyn'];
  if (normalizedId.includes('radio') || normalizedId.includes('sono') || normalizedId.includes('ultra')) return DEPARTMENT_THEMES['radiology-sonology'];
  if (normalizedId.includes('diabet') || normalizedId.includes('endo') || normalizedId.includes('sugar')) return DEPARTMENT_THEMES['diabetology'];
  if (normalizedId.includes('chest') || normalizedId.includes('pulmon') || normalizedId.includes('lung')) return DEPARTMENT_THEMES['chest-pulmonology'];
  if (normalizedId.includes('gastro') || normalizedId.includes('hepat') || normalizedId.includes('liver') || normalizedId.includes('stomach')) return DEPARTMENT_THEMES['gastroenterology'];
  if (normalizedId.includes('family')) return DEPARTMENT_THEMES['family-medicine'];
  if (normalizedId.includes('dialysis') || normalizedId.includes('nephro') || normalizedId.includes('kidney')) return DEPARTMENT_THEMES['dialysis'];
  if (normalizedId.includes('ent') || normalizedId.includes('ear') || normalizedId.includes('throat') || normalizedId.includes('nose')) return DEPARTMENT_THEMES['ent'];
  if (normalizedId.includes('dent') || normalizedId.includes('oral') || normalizedId.includes('tooth')) return DEPARTMENT_THEMES['dental'];
  if (normalizedId.includes('emerg') || normalizedId.includes('casualty') || normalizedId.includes('trauma')) return DEPARTMENT_THEMES['emergency-247'];
  if (normalizedId.includes('surg') || normalizedId.includes('lap')) return DEPARTMENT_THEMES['gen-lap-surgery'];
  if (normalizedId.includes('physician') || normalizedId.includes('internal') || normalizedId.includes('gen')) return DEPARTMENT_THEMES['gen-physician'];

  return DEFAULT_DEPARTMENT_THEME;
}

interface DepartmentIconProps extends LucideProps {
  iconType: string;
  deptId?: string;
}

export const DepartmentIcon: React.FC<DepartmentIconProps> = ({ iconType, deptId, ...props }) => {
  const normalized = (deptId || iconType || '').toLowerCase();

  if (normalized.includes('cardiology') || iconType === 'heart') {
    return <Heart {...props} />;
  }
  if (normalized.includes('orthopedics') || iconType === 'bone') {
    return <Bone {...props} />;
  }
  if (normalized.includes('pediatrics') || iconType === 'baby') {
    return <Baby {...props} />;
  }
  if (normalized.includes('obs-gyn') || normalized.includes('gynaec')) {
    return <HeartHandshake {...props} />;
  }
  if (normalized.includes('radiology') || iconType === 'flask') {
    return <ScanLine {...props} />;
  }
  if (normalized.includes('diabetology')) {
    return <Droplet {...props} />;
  }
  if (normalized.includes('chest') || normalized.includes('pulmonology')) {
    return <Wind {...props} />;
  }
  if (normalized.includes('gastro')) {
    return <Utensils {...props} />;
  }
  if (normalized.includes('family')) {
    return <Home {...props} />;
  }
  if (normalized.includes('dialysis')) {
    return <Droplets {...props} />;
  }
  if (normalized.includes('ent')) {
    return <Ear {...props} />;
  }
  if (normalized.includes('dental')) {
    return <Smile {...props} />;
  }
  if (normalized.includes('emergency') || iconType === 'shield-alert') {
    return <Siren {...props} />;
  }
  if (normalized.includes('surgery') || normalized.includes('surgical')) {
    return <Scissors {...props} />;
  }
  if (iconType === 'activity') {
    return <Activity {...props} />;
  }

  return <Stethoscope {...props} />;
};

