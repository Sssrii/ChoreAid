import { Zap, Wrench, Hammer, Wind, Sparkles, Settings } from 'lucide-react';

// Maps a service category name to an icon + color tint.
// Falls back to a generic icon if the name doesn't match anything known.
export const getServiceIcon = (name = '') => {
  const key = name.toLowerCase();

  if (key.includes('electric')) return { icon: Zap, bg: 'var(--tint-yellow-bg)', color: 'var(--tint-yellow-icon)' };
  if (key.includes('plumb')) return { icon: Wrench, bg: 'var(--tint-blue-bg)', color: 'var(--tint-blue-icon)' };
  if (key.includes('carpen')) return { icon: Hammer, bg: 'var(--tint-orange-bg)', color: 'var(--tint-orange-icon)' };
if (key.includes('appliance')) return { icon: Settings, bg: 'var(--tint-purple-bg)', color: 'var(--tint-purple-icon)' };
if (key.includes('ac repair') || key.includes('air condition')) return { icon: Wind, bg: 'var(--tint-blue-bg)', color: 'var(--tint-blue-icon)' };  if (key.includes('clean')) return { icon: Sparkles, bg: 'var(--tint-teal-bg)', color: 'var(--tint-teal-icon)' };
  return { icon: Settings, bg: 'var(--tint-teal-bg)', color: 'var(--tint-teal-icon)' };
};