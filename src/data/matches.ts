export interface Match {
  id: string;
  homeTeam: string;
  awayTeam: string;
  date: string;
  time: string;
  venue: string;
  city: string;
  country: string;
  stage: string;
  group?: string;
  prices: {
    category1: number;
    category2: number;
    category3: number;
    category4: number;
  };
}

export const matches: Match[] = [
  // Group Stage - Group A
  {
    id: "match001",
    homeTeam: "USA",
    awayTeam: "TBD",
    date: "June 11, 2026",
    time: "20:00",
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    stage: "Group Stage",
    group: "A",
    prices: { category1: 800, category2: 600, category3: 400, category4: 200 }
  },
  {
    id: "match002",
    homeTeam: "Mexico",
    awayTeam: "TBD",
    date: "June 12, 2026",
    time: "17:00",
    venue: "Azteca Stadium",
    city: "Mexico City",
    country: "Mexico",
    stage: "Group Stage",
    group: "A",
    prices: { category1: 750, category2: 550, category3: 350, category4: 180 }
  },
  {
    id: "match003",
    homeTeam: "Canada",
    awayTeam: "TBD",
    date: "June 12, 2026",
    time: "20:00",
    venue: "BMO Field",
    city: "Toronto",
    country: "Canada",
    stage: "Group Stage",
    group: "A",
    prices: { category1: 700, category2: 500, category3: 300, category4: 150 }
  },
  // Group Stage - Group B
  {
    id: "match004",
    homeTeam: "Brazil",
    awayTeam: "TBD",
    date: "June 13, 2026",
    time: "16:00",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    stage: "Group Stage",
    group: "B",
    prices: { category1: 900, category2: 700, category3: 500, category4: 250 }
  },
  {
    id: "match005",
    homeTeam: "Argentina",
    awayTeam: "TBD",
    date: "June 13, 2026",
    time: "19:00",
    venue: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    stage: "Group Stage",
    group: "B",
    prices: { category1: 950, category2: 750, category3: 550, category4: 280 }
  },
  // Round of 16
  {
    id: "match049",
    homeTeam: "Winner Group A",
    awayTeam: "Runner-up Group B",
    date: "June 29, 2026",
    time: "16:00",
    venue: "Rose Bowl",
    city: "Los Angeles",
    country: "USA",
    stage: "Round of 16",
    prices: { category1: 1200, category2: 900, category3: 600, category4: 300 }
  },
  {
    id: "match050",
    homeTeam: "Winner Group B",
    awayTeam: "Runner-up Group A",
    date: "June 29, 2026",
    time: "20:00",
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    stage: "Round of 16",
    prices: { category1: 1250, category2: 950, category3: 650, category4: 320 }
  },
  // Quarter Finals
  {
    id: "match057",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 4, 2026",
    time: "16:00",
    venue: "Arrowhead Stadium",
    city: "Kansas City",
    country: "USA",
    stage: "Quarter Final",
    prices: { category1: 1800, category2: 1400, category3: 1000, category4: 500 }
  },
  {
    id: "match058",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 4, 2026",
    time: "20:00",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    country: "USA",
    stage: "Quarter Final",
    prices: { category1: 1850, category2: 1450, category3: 1050, category4: 520 }
  },
  // Semi Finals
  {
    id: "match061",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 9, 2026",
    time: "20:00",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    country: "USA",
    stage: "Semi Final",
    prices: { category1: 2500, category2: 2000, category3: 1500, category4: 800 }
  },
  {
    id: "match062",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 10, 2026",
    time: "20:00",
    venue: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    stage: "Semi Final",
    prices: { category1: 2600, category2: 2100, category3: 1600, category4: 850 }
  },
  // Third Place Play-off
  {
    id: "match063",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 13, 2026",
    time: "16:00",
    venue: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    stage: "Third Place Play-off",
    prices: { category1: 1500, category2: 1200, category3: 900, category4: 450 }
  },
  // Final
  {
    id: "match064",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 19, 2026",
    time: "15:00",
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    stage: "Final",
    prices: { category1: 5000, category2: 4000, category3: 3000, category4: 1500 }
  }
];