export interface BidOption {
  range: string;
  percentage: number;
  yesPrice: number;
  noPrice: number;
  trend?: number; // positive or negative change
}

export interface Bid {
  id: string;
  question: string;
  image: string;
  options: BidOption[];
  totalVolume: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly';
  timeRemaining: string;
  category: string;
  location: string;
  // Contract-specific fields
  drawId?: number;
  endTime?: number;
  isSettled?: boolean;
  actualTemp?: number;
  thresholds?: number[];
}

export interface BidDetail extends Bid {
  rulesSummary: string;
  fullRulesLink: string;
  description: string;
  dataSource: string;
  verificationMethod: string;
}

// Mock data for active bids
export const mockActiveBids: Bid[] = [
  {
    id: '1',
    question: 'Highest temperature in LA today?',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: '74° to 75°', percentage: 26, yesPrice: 39, noPrice: 63 },
      { range: '72° to 73°', percentage: 37, yesPrice: 41, noPrice: 75, trend: -13 },
      { range: '76° to 77°', percentage: 7, yesPrice: 6, noPrice: 99, trend: 1 }
    ],
    totalVolume: 9084055,
    frequency: 'Daily',
    timeRemaining: '15h 43m 02s',
    category: 'Temperature',
    location: 'Los Angeles, CA'
  },
  {
    id: '2',
    question: 'Will it rain in NYC tomorrow?',
    image: 'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: 'Yes', percentage: 45, yesPrice: 48, noPrice: 52 },
      { range: 'No', percentage: 55, yesPrice: 52, noPrice: 48 }
    ],
    totalVolume: 5234567,
    frequency: 'Daily',
    timeRemaining: '1d 8h 22m',
    category: 'Precipitation',
    location: 'New York, NY'
  },
  {
    id: '3',
    question: 'Wind speed in Chicago this week?',
    image: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: '10-15 mph', percentage: 32, yesPrice: 35, noPrice: 65 },
      { range: '15-20 mph', percentage: 28, yesPrice: 31, noPrice: 69 },
      { range: '20+ mph', percentage: 40, yesPrice: 42, noPrice: 58, trend: 5 }
    ],
    totalVolume: 3456789,
    frequency: 'Weekly',
    timeRemaining: '4d 12h 15m',
    category: 'Wind',
    location: 'Chicago, IL'
  },
  {
    id: '4',
    question: 'Hurricane formation this month?',
    image: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: '0-1 hurricanes', percentage: 25, yesPrice: 28, noPrice: 72 },
      { range: '2-3 hurricanes', percentage: 45, yesPrice: 47, noPrice: 53 },
      { range: '4+ hurricanes', percentage: 30, yesPrice: 33, noPrice: 67 }
    ],
    totalVolume: 8765432,
    frequency: 'Monthly',
    timeRemaining: '18d 6h 45m',
    category: 'Severe Weather',
    location: 'Atlantic Basin'
  }
];

// Mock detailed bid data
export const mockBidDetails: Record<string, BidDetail> = {
  '1': {
    ...mockActiveBids[0],
    rulesSummary: 'If the highest temperature recorded in Los Angeles Airport, CA for the specified date as reported by the National Weather Service\'s Climatological Report (Daily), is between 74-75°, then the market resolves to Yes. Outcome verified from NWS Climatological Report.',
    fullRulesLink: '/rules/temperature-betting',
    description: 'Predict the highest temperature that will be recorded at Los Angeles International Airport today. Temperature readings are taken from official National Weather Service stations.',
    dataSource: 'National Weather Service Climatological Report',
    verificationMethod: 'Official NWS daily temperature records'
  },
  '2': {
    ...mockActiveBids[1],
    rulesSummary: 'Market resolves to Yes if any measurable precipitation (≥0.01 inches) is recorded at Central Park weather station in NYC tomorrow between 12:00 AM and 11:59 PM EST.',
    fullRulesLink: '/rules/precipitation-betting',
    description: 'Will there be any measurable rainfall in New York City tomorrow? Based on Central Park weather station readings.',
    dataSource: 'National Weather Service - Central Park Station',
    verificationMethod: 'Official precipitation measurements'
  },
  '3': {
    ...mockActiveBids[2],
    rulesSummary: 'Average wind speed for the week (Monday-Sunday) at Chicago O\'Hare International Airport. Measured in sustained wind speed, not including gusts.',
    fullRulesLink: '/rules/wind-betting',
    description: 'Predict the average wind speed for this week in Chicago. Measurements taken from O\'Hare International Airport weather station.',
    dataSource: 'National Weather Service - O\'Hare Station',
    verificationMethod: 'Weekly average of daily wind speed readings'
  },
  '4': {
    ...mockActiveBids[3],
    rulesSummary: 'Number of named tropical storms that reach hurricane status (Category 1 or higher) in the Atlantic Basin during the current month.',
    fullRulesLink: '/rules/hurricane-betting',
    description: 'How many hurricanes will form in the Atlantic this month? Based on National Hurricane Center classifications.',
    dataSource: 'National Hurricane Center',
    verificationMethod: 'Official hurricane tracking and classification'
  }
};