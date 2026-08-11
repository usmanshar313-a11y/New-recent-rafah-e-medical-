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
  bgTint: string;        // Soft pastel tint background for header/icon block
  borderTint: string;    // Soft border tint for header/icon block
  textTint: string;      // Dark accent text color
  iconColor: string;     // Matching icon color
  badgeBg: string;       // Badge background tint
  badgeText: string;     // Badge text color
}

export const DEPARTMENT_THEMES: Record<string, DepartmentTheme> = {
  'cardiology': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'orthopedics': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'pediatrics': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'obs-gyn': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'radiology-sonology': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'diabetology': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'chest-pulmonology': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'gastroenterology': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'family-medicine': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'dialysis': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'ent': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'dental': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'emergency-247': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'gen-physician': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  },
  'gen-lap-surgery': {
    bgTint: 'bg-[#C9DABF]/30',
    borderTint: 'border-[#8DAA91]/40',
    textTint: 'text-[#3A362E]',
    iconColor: 'text-[#4A7C59]',
    badgeBg: 'bg-[#C9DABF]',
    badgeText: 'text-[#3D6B4A]'
  }
};

export const DEFAULT_DEPARTMENT_THEME: DepartmentTheme = {
  bgTint: 'bg-[#C9DABF]/30',
  borderTint: 'border-[#8DAA91]/40',
  textTint: 'text-[#3A362E]',
  iconColor: 'text-[#4A7C59]',
  badgeBg: 'bg-[#C9DABF]',
  badgeText: 'text-[#3D6B4A]'
};

export function getDepartmentTheme(deptId: string): DepartmentTheme {
  const normalizedId = deptId.toLowerCase();
  return DEPARTMENT_THEMES[normalizedId] || DEFAULT_DEPARTMENT_THEME;
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

