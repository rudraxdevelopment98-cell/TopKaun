import type { Listing, Category, City } from "./types";
import { slugify, monogram } from "./money";

// Sample promotions carried over from the original TopKaun prototype, so the
// board looks alive before any real business has signed up. In production these
// live in the database; this seed is used by the in-memory store for local dev
// and demos (no accounts or keys required).

type Seed = {
  name: string;
  tagline: string;
  url?: string;
  city: City;
  category: Category;
  totalInr: number;
  todayInr: number;
  hype: number;
  verified?: boolean;
  founding?: number;
};

const SEEDS: Seed[] = [
  { name: "Khaata AI", tagline: "GST-ready bookkeeping on WhatsApp", url: "khaata.ai", city: "Ahmedabad", category: "SaaS", totalInr: 18500, todayInr: 2000, hype: 214, verified: true, founding: 12 },
  { name: "NaukriFlow", tagline: "Hiring for tier-2 cities", url: "naukriflow.com", city: "Bengaluru", category: "SaaS", totalInr: 14000, todayInr: 4600, hype: 120, verified: true, founding: 7 },
  { name: "PaisaDost", tagline: "A money app for your first salary", url: "paisadost.in", city: "Mumbai", category: "Fintech", totalInr: 9750, todayInr: 0, hype: 88, founding: 21 },
  { name: "ChaiStack", tagline: "Single-estate chai, delivered monthly", url: "chaistack.in", city: "Surat", category: "D2C", totalInr: 6100, todayInr: 6100, hype: 41, founding: 34 },
  { name: "Rakshak Scan", tagline: "Website security checks for small businesses", url: "rakshakscan.com", city: "Pune", category: "SaaS", totalInr: 5800, todayInr: 2000, hype: 22, verified: true, founding: 15 },
  { name: "VidyaBot", tagline: "An AI tutor that speaks Hindi", url: "vidyabot.in", city: "Jaipur", category: "Edtech", totalInr: 4250, todayInr: 1250, hype: 57, verified: true, founding: 41 },
  { name: "GharKhoj", tagline: "Rentals without brokers", url: "gharkhoj.in", city: "Bengaluru", category: "Real estate", totalInr: 3999, todayInr: 0, hype: 18, founding: 52 },
  { name: "Biryani Cloud", tagline: "Cloud-kitchen biryani, 30-min delivery", url: "biryanicloud.in", city: "Hyderabad", category: "D2C", totalInr: 3300, todayInr: 400, hype: 29, founding: 44 },
  { name: "Baroda Bytes", tagline: "Custom software for Gujarat SMEs", url: "barodabytes.com", city: "Vadodara", category: "Agencies", totalInr: 3100, todayInr: 199, hype: 15, founding: 60 },
  { name: "Namma Stack", tagline: "No-code apps for local shops", url: "nammastack.in", city: "Bengaluru", category: "SaaS", totalInr: 2800, todayInr: 0, hype: 31, founding: 48 },
  { name: "Local Line", tagline: "Hyperlocal delivery for kirana stores", url: "localline.in", city: "Mumbai", category: "Logistics", totalInr: 2600, todayInr: 0, hype: 24, founding: 55 },
  { name: "@studio.kesar", tagline: "Wedding photographer on Instagram", url: "instagram.com/studio.kesar", city: "Ahmedabad", category: "Creators", totalInr: 2400, todayInr: 0, hype: 96, founding: 9 },
  { name: "Filter Kaapi Co", tagline: "South Indian filter coffee, shipped fresh", url: "filterkaapi.co", city: "Chennai", category: "D2C", totalInr: 2200, todayInr: 0, hype: 37, founding: 63 },
  { name: "ShipKaro", tagline: "Compare courier rates in one place", url: "shipkaro.com", city: "Delhi NCR", category: "Logistics", totalInr: 1980, todayInr: 500, hype: 9, founding: 70 },
  { name: "MandiLive", tagline: "Daily crop prices on WhatsApp", url: "mandilive.in", city: "Indore", category: "Agritech", totalInr: 1500, todayInr: 199, hype: 33, founding: 72 },
  { name: "Mishti Box", tagline: "Bengali sweets, delivered pan-India", url: "mishtibox.in", city: "Kolkata", category: "D2C", totalInr: 1200, todayInr: 0, hype: 26, founding: 66 },
  { name: "Surti Farsan Co", tagline: "Khaman and farsan, shipped across India", url: "surtifarsan.in", city: "Surat", category: "D2C", totalInr: 1200, todayInr: 0, hype: 64, founding: 38 },
  { name: "Patang Studio", tagline: "Brand design for D2C founders", url: "patang.studio", city: "Ahmedabad", category: "Agencies", totalInr: 999, todayInr: 0, hype: 12, founding: 11 },
];

export function buildSeedListings(): Listing[] {
  const now = Date.now();
  return SEEDS.map((s, i) => {
    const slug = slugify(s.name);
    return {
      id: slug,
      slug,
      name: s.name,
      mono: monogram(s.name),
      tagline: s.tagline,
      url: s.url,
      city: s.city,
      category: s.category,
      totalInr: s.totalInr,
      todayInr: s.todayInr,
      hype: s.hype,
      verified: !!s.verified,
      founding: s.founding ?? null,
      visitsSent: Math.round(s.totalInr * 0.5 + s.hype * 4),
      // Spread created times over the last ~30 days, biggest spenders earliest.
      createdAt: new Date(now - (i + 1) * 36 * 60 * 60 * 1000).toISOString(),
    };
  });
}
