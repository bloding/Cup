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
  // Opening Match - Group A
  {
    id: "match001",
    homeTeam: "Mexico",
    awayTeam: "TBD",
    date: "June 11, 2026",
    time: "11:00 CT (Mexico City Time)",
    venue: "Azteca Stadium",
    city: "Mexico City",
    country: "Mexico",
    stage: "Group Stage",
    group: "A",
    prices: { category1: 800, category2: 600, category3: 400, category4: 200 }
  },
  {
    id: "match002",
    homeTeam: "USA",
    awayTeam: "TBD",
    date: "June 12, 2026",
    time: "14:00 PT (Los Angeles Time)",
    venue: "SoFi Stadium",
    city: "Los Angeles",
    country: "USA",
    stage: "Group Stage",
    group: "A",
    prices: { category1: 900, category2: 700, category3: 500, category4: 250 }
  },
  {
    id: "match003",
    homeTeam: "Canada",
    awayTeam: "TBD",
    date: "June 12, 2026",
    time: "17:00 ET (Toronto Time)",
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
    time: "13:00 ET (Miami Time)",
    venue: "Hard Rock Stadium",
    city: "Miami",
    country: "USA",
    stage: "Group Stage",
    group: "B",
    prices: { category1: 950, category2: 750, category3: 550, category4: 280 }
  },
  {
    id: "match005",
    homeTeam: "Argentina",
    awayTeam: "TBD",
    date: "June 13, 2026",
    time: "16:00 ET (New York Time)",
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    stage: "Group Stage",
    group: "B",
    prices: { category1: 1000, category2: 800, category3: 600, category4: 300 }
  },
  // Group Stage - Group C
  {
    id: "match006",
    homeTeam: "England",
    awayTeam: "TBD",
    date: "June 14, 2026",
    time: "12:00 CT (Dallas Time)",
    venue: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    stage: "Group Stage",
    group: "C",
    prices: { category1: 900, category2: 700, category3: 500, category4: 250 }
  },
  // Round of 16
  {
    id: "match049",
    homeTeam: "Winner Group A",
    awayTeam: "Runner-up Group B",
    date: "June 29, 2026",
    time: "13:00 PT (Los Angeles Time)",
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
    time: "17:00 ET (New York Time)",
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    stage: "Round of 16",
    prices: { category1: 1250, category2: 950, category3: 650, category4: 320 }
  },
  {
    id: "match051",
    homeTeam: "Winner Group C",
    awayTeam: "Runner-up Group D",
    date: "June 30, 2026",
    time: "14:00 CT (Dallas Time)",
    venue: "AT&T Stadium",
    city: "Dallas",
    country: "USA",
    stage: "Round of 16",
    prices: { category1: 1200, category2: 900, category3: 600, category4: 300 }
  },
  // Quarter Finals
  {
    id: "match057",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 4, 2026",
    time: "13:00 CT (Kansas City Time)",
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
    time: "17:00 ET (Philadelphia Time)",
    venue: "Lincoln Financial Field",
    city: "Philadelphia",
    country: "USA",
    stage: "Quarter Final",
    prices: { category1: 1850, category2: 1450, category3: 1050, category4: 520 }
  },
  {
    id: "match059",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 5, 2026",
    time: "14:00 ET (Atlanta Time)",
    venue: "Mercedes-Benz Stadium",
    city: "Atlanta",
    country: "USA",
    stage: "Quarter Final",
    prices: { category1: 1800, category2: 1400, category3: 1000, category4: 500 }
  },
  // Semi Finals
  {
    id: "match061",
    homeTeam: "TBD",
    awayTeam: "TBD",
    date: "July 14, 2026",
    time: "17:00 ET (Atlanta Time)",
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
    date: "July 15, 2026",
    time: "17:00 CT (Dallas Time)",
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
    date: "July 18, 2026",
    time: "13:00 ET (Miami Time)",
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
    time: "12:00 ET (New York Time)",
    venue: "MetLife Stadium",
    city: "New York/New Jersey",
    country: "USA",
    stage: "Final",
    prices: { category1: 5000, category2: 4000, category3: 3000, category4: 1500 }
  }
];