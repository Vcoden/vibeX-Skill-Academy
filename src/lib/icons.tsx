import {
  AudioLines,
  BookOpen,
  Briefcase,
  Clapperboard,
  Coins,
  Code2,
  GraduationCap,
  Headset,
  LayoutTemplate,
  Megaphone,
  Music2,
  Palette,
  Search,
  ShoppingBag,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from 'lucide-react'

export const PROGRAM_ICONS: Record<string, LucideIcon> = {
  TrendingUp,
  Megaphone,
  Music2,
  Palette,
  AudioLines,
  Search,
  BookOpen,
  Code2,
  LayoutTemplate,
  Clapperboard,
  Coins,
  Headset,
  ShoppingBag,
  Briefcase,
  GraduationCap,
  Sparkles,
}

export const iconOptions = Object.keys(PROGRAM_ICONS)

export function ProgramIcon({
  name,
  className,
}: {
  name: string
  className?: string
}) {
  const Icon = PROGRAM_ICONS[name] ?? Sparkles
  return <Icon className={className} aria-hidden="true" />
}
