import React from 'react';
import {
  Briefcase,
  Home,
  Car,
  UserCheck,
  Tv,
  ShoppingBag,
  Utensils,
  GraduationCap,
  Activity,
  Wrench,
  Sprout,
  Calendar,
  Layers,
  Tag,
  MapPin,
  Phone,
  MessageCircle,
  Share2,
  Bookmark,
  Eye,
  CheckCircle,
  AlertTriangle,
  Clock,
  Sparkles,
  ExternalLink,
  ChevronRight,
  Search,
  Filter,
  SlidersHorizontal,
  Building2,
  Navigation,
  Globe
} from 'lucide-react';

const iconMap = {
  Briefcase,
  Home,
  Car,
  UserCheck,
  Tv,
  ShoppingBag,
  Utensils,
  GraduationCap,
  Activity,
  Wrench,
  Sprout,
  Calendar,
  Layers,
  Tag,
  MapPin,
  Building2,
  Sparkles
};

export function getCategoryIcon(iconName, className = 'w-5 h-5') {
  const IconComponent = iconMap[iconName] || Tag;
  return <IconComponent className={className} />;
}
