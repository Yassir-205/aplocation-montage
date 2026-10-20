/**
 * ╔══════════════════════════════════════════════════════════════╗
 * ║                    SITE CONFIGURATION                       ║
 * ║  Single source of truth for all personal / contact info.    ║
 * ║  Edit this file to update every page at once.               ║
 * ╚══════════════════════════════════════════════════════════════╝
 */

// ── Identity ────────────────────────────────────────────────────
export const OWNER_NAME       = 'Aymane';
export const BRAND_NAME       = 'Neditiw';
export const OWNER_TITLE      = 'Professional Video Editor';
export const YEARS_EXPERIENCE = 4;

// ── Contact ─────────────────────────────────────────────────────
// Phone: digits only, with country code, no + or spaces
// e.g. Morocco +212 6 00 00 00 00  →  '212600000000'
export const PHONE_RAW        = '212600000000';
export const PHONE_DISPLAY    = '+212 6 00 00 00 00';   // human-readable label
export const EMAIL            = 'hello@neditiw.com';

// ── WhatsApp ─────────────────────────────────────────────────────
export const WHATSAPP_NUMBER  = PHONE_RAW;   // reuse phone — change if different
const WA_TEXT                 = encodeURIComponent("Hi! I'd like to discuss a video editing project.");
export const WHATSAPP_URL     = `https://wa.me/${WHATSAPP_NUMBER}?text=${WA_TEXT}`;

// ── tel: and WhatsApp helper links ───────────────────────────────
export const TEL_HREF         = `tel:+${PHONE_RAW}`;
export const MAILTO_HREF      = `mailto:${EMAIL}`;

// ── Social links ─────────────────────────────────────────────────
export const SOCIALS = [
  { icon: 'ri-instagram-line',    href: 'https://instagram.com',  label: 'Instagram' },
  { icon: 'ri-youtube-line',      href: 'https://youtube.com',    label: 'YouTube'   },
  { icon: 'ri-twitter-x-line',    href: 'https://twitter.com',    label: 'Twitter'   },
  { icon: 'ri-linkedin-box-fill', href: 'https://linkedin.com',   label: 'LinkedIn'  },
  { icon: 'ri-tiktok-line',       href: 'https://tiktok.com',     label: 'TikTok'    },
];

// ── Hero stats ───────────────────────────────────────────────────
export const HERO_STATS = [
  { num: '120+', label: 'Projects'   },
  { num: '5★',   label: 'Rated'      },
  { num: `${YEARS_EXPERIENCE}yr`, label: 'Experience' },
];

// ── About — bio paragraphs ────────────────────────────────────────
export const BIO = [
  `I'm a professional video editor with ${YEARS_EXPERIENCE}+ years of experience crafting cinematic
   narratives for brands, artists, and storytellers worldwide. I believe every frame
   has a purpose — and my job is to find it.`,
  `From 30-second social hooks to 20-minute documentary cuts, I bring the same
   obsessive attention to pacing, colour, and emotion. My work has been watched
   by millions and helped clients grow their audience, close deals, and move people.`,
];

// ── About — skills ────────────────────────────────────────────────
export const SKILLS = [
  { name: 'Adobe Premiere Pro', pct: 95 },
  { name: 'DaVinci Resolve',    pct: 92 },
  { name: 'After Effects',      pct: 88 },
  { name: 'Color Grading',      pct: 93 },
  { name: 'Sound Design',       pct: 82 },
  { name: 'Motion Graphics',    pct: 85 },
];

// ── About — gear / software tags ─────────────────────────────────
export const GEAR = [
  'Adobe Premiere Pro', 'DaVinci Resolve', 'After Effects',
  'Audition', 'Photoshop', 'Frame.io', 'LUTs Library', 'ProRes / DCI',
];

// ── About — awards ────────────────────────────────────────────────
export const AWARDS = [
  { icon: 'ri-trophy-line',  label: 'Best Edit — Regional Film Fest 2023'  },
  { icon: 'ri-star-line',    label: '5★ Rated on Fiverr (200+ reviews)'    },
  { icon: 'ri-medal-line',   label: 'Top Editor — Vimeo Staff Pick 2022'   },
  { icon: 'ri-heart-line',   label: 'Trusted by 60+ brands worldwide'      },
];

// ── About — floating stat cards ───────────────────────────────────
// The "Projects" count is merged with live video stats at render time.
export const ABOUT_STATS = [
  { key: 'projects', num: '8+',   label: 'Projects'    },  // overridden by live stats
  { key: 'exp',      num: `${YEARS_EXPERIENCE}yr`, label: 'Experience' },
  { key: 'clients',  num: '60+',  label: 'Clients'     },
];

// ── Availability ─────────────────────────────────────────────────
export const AVAILABLE         = true;
export const AVAILABILITY_TEXT = 'Currently accepting projects';
export const RESPONSE_TIME     = 'Within 24 hours';
export const LOCATION_TEXT     = 'Available Worldwide · Remote';
