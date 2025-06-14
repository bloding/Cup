export interface Package {
  id: string;
  name: string;
  description: string;
  price: number;
  matches: number;
  includes: string[];
  featured?: boolean;
  color: string;
}

export const packages: Package[] = [
  {
    id: "supporter",
    name: "Supporter Package",
    description: "Experience the World Cup atmosphere with access to group stage matches",
    price: 899,
    matches: 3,
    includes: [
      "3 Group Stage match tickets (Category 3)",
      "Official FIFA Welcome Kit",
      "Match day transportation",
      "Digital match program"
    ],
    color: "from-blue-500 to-blue-700"
  },
  {
    id: "enthusiast",
    name: "Enthusiast Package",
    description: "Follow your team through the group stage with premium seating",
    price: 1799,
    matches: 4,
    includes: [
      "3 Group Stage + 1 Round of 16 tickets (Category 2)",
      "Official FIFA merchandise package",
      "VIP transportation service",
      "Priority customer support",
      "Stadium tour voucher"
    ],
    featured: true,
    color: "from-gold-500 to-yellow-600"
  },
  {
    id: "champion",
    name: "Champion Package",
    description: "Premium experience including knockout stage matches",
    price: 3499,
    matches: 6,
    includes: [
      "6 Match tickets including Quarter Final (Category 1)",
      "Luxury hospitality access",
      "Private transfer service",
      "Premium FIFA merchandise",
      "Meet & greet with FIFA legends",
      "VIP stadium experiences"
    ],
    color: "from-purple-600 to-indigo-700"
  },
  {
    id: "ultimate",
    name: "Ultimate FIFA Experience",
    description: "The complete World Cup journey from group stage to final",
    price: 7999,
    matches: 10,
    includes: [
      "10 Premium match tickets including Final",
      "5-star accommodation package",
      "Private jet transfers",
      "Exclusive FIFA events access",
      "Personal concierge service",
      "Official FIFA Golden Ball ceremony ticket",
      "Custom FIFA World Cup trophy replica"
    ],
    color: "from-red-600 to-pink-700"
  }
];