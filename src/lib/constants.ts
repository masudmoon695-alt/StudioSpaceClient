import type { LucideIcon } from "lucide-react";
import {
  Building2,
  CalendarDays,
  Camera,
  Clapperboard,
  LayoutDashboard,
  Mic,
  Music4,
  Palette,
  Plus,
} from "lucide-react";

export const SITE = {
  name: "StudioSpace",
  tagline: "Rent the room your next shoot needs, by the hour.",
  description:
    "A booking marketplace for photography cyc walls, film stages, podcast lounges, music suites and art workshops.",
} as const;

export const NAV_LINKS = [
  { href: "/", label: "Home" },
  { href: "/studios", label: "Explore Studios" },
  { href: "/how-it-works", label: "How It Works" },
  { href: "/about", label: "About Us" },
] as const;

export const PRIVATE_NAV_LINKS = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/add-studio", label: "Add New Studio", icon: Plus },
  { href: "/my-listings", label: "My Studio Listings", icon: Building2 },
  { href: "/my-bookings", label: "My Bookings", icon: CalendarDays },
] as const;

export type CategoryValue =
  | "Photo Studio"
  | "Film Stage"
  | "Podcast Lounge"
  | "Music Suite"
  | "Workshop";

export interface CategoryMeta {
  value: CategoryValue;
  label: string;
  plural: string;
  colorVar: string;
  /** Ink that keeps the tape label readable on that gel. */
  ink: "#FFFFFF" | "#16213A";
  icon: LucideIcon;
}

export const CATEGORIES: readonly CategoryMeta[] = [
  {
    value: "Photo Studio",
    label: "Photo studio",
    plural: "Photo studios",
    colorVar: "--category-photo",
    ink: "#FFFFFF",
    icon: Camera,
  },
  {
    value: "Film Stage",
    label: "Film stage",
    plural: "Sound stages",
    colorVar: "--category-film",
    ink: "#FFFFFF",
    icon: Clapperboard,
  },
  {
    value: "Podcast Lounge",
    label: "Podcast lounge",
    plural: "Podcast rooms",
    colorVar: "--category-podcast",
    ink: "#16213A",
    icon: Mic,
  },
  {
    value: "Music Suite",
    label: "Music suite",
    plural: "Music suites",
    colorVar: "--category-music",
    ink: "#FFFFFF",
    icon: Music4,
  },
  {
    value: "Workshop",
    label: "Workshop",
    plural: "Art workshops",
    colorVar: "--category-workshop",
    ink: "#16213A",
    icon: Palette,
  },
] as const;

export function categoryMeta(value: string): CategoryMeta | undefined {
  return CATEGORIES.find((category) => category.value === value);
}
