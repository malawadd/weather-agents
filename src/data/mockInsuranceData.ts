export interface PolicyOption {
  range: string;
  percentage: number;
  premiumRate: number;
  coverageRatio: number;
  trend?: number;
}

export interface Policy {
  id: string;
  question: string;
  image: string;
  options: PolicyOption[];
  totalCoverage: number;
  frequency: 'Daily' | 'Weekly' | 'Monthly' | 'Seasonal';
  timeRemaining: string;
  category: string;
  location: string;
  policyId?: number;
  endTime?: number;
  isSettled?: boolean;
  actualTemp?: number;
  thresholds?: number[];
}

export interface PolicyDetail extends Policy {
  termsSummary: string;
  fullTermsLink: string;
  description: string;
  dataSource: string;
  verificationMethod: string;
}

// Mock data for active insurance policies
export const mockActivePolicies: Policy[] = [
  {
    id: '1',
    question: 'Drought protection for California farms?',
    image: 'https://images.pexels.com/photos/1118873/pexels-photo-1118873.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: '0-10mm rainfall', percentage: 45, premiumRate: 8, coverageRatio: 150 },
      { range: '10-20mm rainfall', percentage: 35, premiumRate: 12, coverageRatio: 120, trend: -5 },
      { range: '20+ mm rainfall', percentage: 20, premiumRate: 15, coverageRatio: 100, trend: 2 }
    ],
    totalCoverage: 2500000,
    frequency: 'Monthly',
    timeRemaining: '25d 14h 30m',
    category: 'Drought',
    location: 'California, USA'
  },
  {
    id: '2',
    question: 'Flood insurance for Miami properties?',
    image: 'https://images.pexels.com/photos/1463530/pexels-photo-1463530.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: 'Heavy rainfall (>50mm)', percentage: 60, premiumRate: 10, coverageRatio: 200 },
      { range: 'Extreme rainfall (>100mm)', percentage: 40, premiumRate: 15, coverageRatio: 300 }
    ],
    totalCoverage: 1800000,
    frequency: 'Seasonal',
    timeRemaining: '45d 8h 15m',
    category: 'Rainfall',
    location: 'Miami, FL'
  },
  {
    id: '3',
    question: 'Crop freeze protection for Texas?',
    image: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: 'Below 0°C for 6+ hours', percentage: 25, premiumRate: 12, coverageRatio: 180 },
      { range: 'Below -5°C for 3+ hours', percentage: 15, premiumRate: 18, coverageRatio: 250 },
      { range: 'Below -10°C any duration', percentage: 10, premiumRate: 25, coverageRatio: 400 }
    ],
    totalCoverage: 3200000,
    frequency: 'Seasonal',
    timeRemaining: '60d 2h 45m',
    category: 'Temperature',
    location: 'Texas, USA'
  },
  {
    id: '4',
    question: 'Hurricane protection for Caribbean?',
    image: 'https://images.pexels.com/photos/1446076/pexels-photo-1446076.jpeg?auto=compress&cs=tinysrgb&w=400&h=300&dpr=2',
    options: [
      { range: 'Category 1-2 Hurricane', percentage: 40, premiumRate: 15, coverageRatio: 150 },
      { range: 'Category 3-4 Hurricane', percentage: 30, premiumRate: 25, coverageRatio: 250 },
      { range: 'Category 5 Hurricane', percentage: 10, premiumRate: 40, coverageRatio: 500 }
    ],
    totalCoverage: 5000000,
    frequency: 'Seasonal',
    timeRemaining: '120d 10h 20m',
    category: 'Natural Disasters',
    location: 'Caribbean Region'
  }
];

// Mock detailed policy data
export const mockPolicyDetails: Record<string, PolicyDetail> = {
  '1': {
    ...mockActivePolicies[0],
    termsSummary: 'If rainfall in the specified California region falls below the threshold for the policy period, automatic payout is triggered based on the coverage ratio. Payout calculated using verified weather station data.',
    fullTermsLink: '/terms/drought-insurance',
    description: 'Protect your agricultural operations against drought conditions. Coverage is triggered automatically when rainfall falls below specified thresholds.',
    dataSource: 'WeatherXM Network Stations',
    verificationMethod: 'Automated smart contract verification using oracle data'
  },
  '2': {
    ...mockActivePolicies[1],
    termsSummary: 'Flood insurance activates when rainfall exceeds specified thresholds in Miami area. Automatic payout based on verified precipitation measurements from local weather stations.',
    fullTermsLink: '/terms/flood-insurance',
    description: 'Comprehensive flood protection for Miami properties. Coverage activates automatically when extreme rainfall events occur.',
    dataSource: 'WeatherXM Network - Miami Stations',
    verificationMethod: 'Real-time precipitation monitoring and smart contract execution'
  },
  '3': {
    ...mockActivePolicies[2],
    termsSummary: 'Crop freeze protection triggers when temperatures drop below specified thresholds for the required duration. Protects against agricultural losses due to unexpected frost.',
    fullTermsLink: '/terms/freeze-insurance',
    description: 'Protect your crops against unexpected freeze events. Coverage is based on temperature thresholds and duration of freezing conditions.',
    dataSource: 'WeatherXM Network - Texas Agricultural Stations',
    verificationMethod: 'Continuous temperature monitoring with duration-based triggers'
  },
  '4': {
    ...mockActivePolicies[3],
    termsSummary: 'Hurricane protection provides coverage when tropical storms reach specified categories in the Caribbean region. Payout amounts scale with hurricane intensity.',
    fullTermsLink: '/terms/hurricane-insurance',
    description: 'Comprehensive hurricane protection for Caribbean properties and businesses. Coverage scales with storm intensity and verified impact data.',
    dataSource: 'National Hurricane Center + WeatherXM Network',
    verificationMethod: 'Multi-source verification including satellite data and ground stations'
  }
};