// Enhanced mock data with proper colors and metadata for interactive charts
export const enhancedMonthlyData = [
  { 
    label: 'Jan', 
    value: 65000, 
    color: '#3B82F6',
    metadata: {
      change: -5.2,
      details: 'Post-holiday slowdown affected sales in January',
      subMetrics: {
        'Nya kunder': 45,
        'Återkommande kunder': 75,
        'Genomsnittligt ordervärde': 867
      }
    }
  },
  { 
    label: 'Feb', 
    value: 78000, 
    color: '#3B82F6',
    metadata: {
      change: 20.0,
      details: 'Valentine\'s Day campaign drove significant growth',
      subMetrics: {
        'Nya kunder': 62,
        'Återkommande kunder': 73,
        'Genomsnittligt ordervärde': 1068
      }
    }
  },
  { 
    label: 'Mar', 
    value: 92000, 
    color: '#3B82F6',
    metadata: {
      change: 17.9,
      details: 'Spring product launch exceeded expectations',
      subMetrics: {
        'Nya kunder': 78,
        'Återkommande kunder': 80,
        'Genomsnittligt ordervärde': 1178
      }
    }
  },
  { 
    label: 'Apr', 
    value: 85000, 
    color: '#3B82F6',
    metadata: {
      change: -7.6,
      details: 'Seasonal adjustment after strong March performance',
      subMetrics: {
        'Nya kunder': 58,
        'Återkommande kunder': 84,
        'Genomsnittligt ordervärde': 1466
      }
    }
  },
  { 
    label: 'Maj', 
    value: 101000, 
    color: '#3B82F6',
    metadata: {
      change: 18.8,
      details: 'Mother\'s Day and spring promotions boosted sales',
      subMetrics: {
        'Nya kunder': 89,
        'Återkommande kunder': 83,
        'Genomsnittligt ordervärde': 1172
      }
    }
  },
  { 
    label: 'Jun', 
    value: 118000, 
    color: '#3B82F6',
    metadata: {
      change: 16.8,
      details: 'Summer collection launch and graduation season',
      subMetrics: {
        'Nya kunder': 95,
        'Återkommande kunder': 103,
        'Genomsnittligt ordervärde': 1192
      }
    }
  }
];

export const enhancedRegionData = [
  { 
    label: 'Stockholm', 
    value: 485000, 
    color: '#10B981',
    metadata: {
      change: 12.5,
      details: 'Strongest market with high customer retention',
      subMetrics: {
        'Marknadsandel': 32.5,
        'Kunder': 1247,
        'Genomsnittligt ordervärde': 1456
      }
    }
  },
  { 
    label: 'Göteborg', 
    value: 412000, 
    color: '#8B5CF6',
    metadata: {
      change: 8.3,
      details: 'Growing market with increasing brand awareness',
      subMetrics: {
        'Marknadsandel': 27.6,
        'Kunder': 892,
        'Genomsnittligt ordervärde': 1234
      }
    }
  },
  { 
    label: 'Malmö', 
    value: 358000, 
    color: '#F59E0B',
    metadata: {
      change: 15.7,
      details: 'Fastest growing region with new store opening',
      subMetrics: {
        'Marknadsandel': 24.0,
        'Kunder': 743,
        'Genomsnittligt ordervärde': 1189
      }
    }
  },
  { 
    label: 'Övriga', 
    value: 237000, 
    color: '#EF4444',
    metadata: {
      change: 5.2,
      details: 'Smaller cities showing steady growth',
      subMetrics: {
        'Marknadsandel': 15.9,
        'Kunder': 567,
        'Genomsnittligt ordervärde': 1098
      }
    }
  }
];

export const enhancedProductData = [
  { 
    label: 'Premium Widget', 
    value: 89997, 
    color: '#3B82F6',
    metadata: {
      change: 23.4,
      details: 'Top performer with excellent margins',
      subMetrics: {
        'Enheter sålda': 300,
        'Marginal': 35.5,
        'Lagerbalans': 45
      }
    }
  },
  { 
    label: 'Standard Widget', 
    value: 119994, 
    color: '#10B981',
    metadata: {
      change: 18.7,
      details: 'Volume leader with consistent demand',
      subMetrics: {
        'Enheter sålda': 600,
        'Marginal': 28.2,
        'Lagerbalans': 120
      }
    }
  },
  { 
    label: 'Basic Widget', 
    value: 49999, 
    color: '#8B5CF6',
    metadata: {
      change: 12.1,
      details: 'Entry-level product driving new customer acquisition',
      subMetrics: {
        'Enheter sålda': 500,
        'Marginal': 22.1,
        'Lagerbalans': 200
      }
    }
  },
  { 
    label: 'Pro Service', 
    value: 174999, 
    color: '#F59E0B',
    metadata: {
      change: 45.2,
      details: 'High-value service with excellent customer satisfaction',
      subMetrics: {
        'Tjänster levererade': 70,
        'Marginal': 68.7,
        'Kundnöjdhet': 4.8
      }
    }
  }
];

export const enhancedCustomerSegmentData = [
  { 
    label: 'High Value', 
    value: 45, 
    color: '#10B981',
    metadata: {
      change: 8.5,
      details: 'Premium customers with high lifetime value',
      subMetrics: {
        'Genomsnittligt ordervärde': 2456,
        'Köpfrekvens': 4.2,
        'Retention rate': 94
      }
    }
  },
  { 
    label: 'Regular', 
    value: 120, 
    color: '#3B82F6',
    metadata: {
      change: 12.3,
      details: 'Core customer base with steady purchasing patterns',
      subMetrics: {
        'Genomsnittligt ordervärde': 1234,
        'Köpfrekvens': 2.8,
        'Retention rate': 78
      }
    }
  },
  { 
    label: 'New', 
    value: 89, 
    color: '#8B5CF6',
    metadata: {
      change: 34.7,
      details: 'Growing segment of first-time customers',
      subMetrics: {
        'Genomsnittligt ordervärde': 567,
        'Konverteringsgrad': 23,
        'Återköpsgrad': 45
      }
    }
  },
  { 
    label: 'At Risk', 
    value: 23, 
    color: '#EF4444',
    metadata: {
      change: -15.2,
      details: 'Customers requiring retention efforts',
      subMetrics: {
        'Dagar sedan senaste köp': 120,
        'Tidigare ordervärde': 1890,
        'Churn risk': 67
      }
    }
  }
];

export const enhancedChannelData = [
  { 
    label: 'Online', 
    value: 756000, 
    color: '#3B82F6',
    metadata: {
      change: 28.4,
      details: 'E-commerce continues to dominate sales',
      subMetrics: {
        'Konverteringsgrad': 3.4,
        'Genomsnittlig sessionsvaraktighet': 245,
        'Mobilandel': 67
      }
    }
  },
  { 
    label: 'Butik', 
    value: 423000, 
    color: '#10B981',
    metadata: {
      change: 5.7,
      details: 'Physical stores maintaining steady performance',
      subMetrics: {
        'Fotgängartrafik': 12450,
        'Konverteringsgrad': 18.5,
        'Genomsnittligt ordervärde': 1567
      }
    }
  },
  { 
    label: 'Telefon', 
    value: 189000, 
    color: '#8B5CF6',
    metadata: {
      change: -8.2,
      details: 'Traditional channel showing decline',
      subMetrics: {
        'Samtal per dag': 45,
        'Konverteringsgrad': 12.3,
        'Genomsnittlig samtalstid': 8.5
      }
    }
  },
  { 
    label: 'Partner', 
    value: 234000, 
    color: '#F59E0B',
    metadata: {
      change: 15.9,
      details: 'Partner network expanding successfully',
      subMetrics: {
        'Aktiva partners': 23,
        'Genomsnittlig provision': 12.5,
        'Partner satisfaction': 4.2
      }
    }
  }
];