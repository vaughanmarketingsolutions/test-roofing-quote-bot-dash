import { Quote, QuoteStatus, ServiceType } from './types';

// Helper to generate random dates within the last 30 days
const getRandomDate = (daysBack: number) => {
  const date = new Date();
  date.setDate(date.getDate() - Math.floor(Math.random() * daysBack));
  return date.toISOString().split('T')[0];
};

const firstNames = ['James', 'Mary', 'John', 'Patricia', 'Robert', 'Jennifer', 'Michael', 'Linda', 'William', 'Elizabeth'];
const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez'];
const streets = ['Maple', 'Oak', 'Cedar', 'Pine', 'Elm', 'Washington', 'Lake', 'Hill'];

const generateMockQuotes = (count: number): Quote[] => {
  return Array.from({ length: count }).map((_, i) => {
    const serviceType = Object.values(ServiceType)[Math.floor(Math.random() * Object.values(ServiceType).length)];
    
    let basePrice = 0;
    switch (serviceType) {
      case ServiceType.ROOF_REPLACEMENT: basePrice = 12000; break;
      case ServiceType.REPAIR: basePrice = 850; break;
      case ServiceType.GUTTER_INSTALLATION: basePrice = 1500; break;
      case ServiceType.INSPECTION: basePrice = 250; break;
    }
    
    // Add some variance
    const quoteAmount = Math.floor(basePrice * (0.8 + Math.random() * 0.4));
    
    return {
      id: `Q-${1000 + i}`,
      customerName: `${firstNames[Math.floor(Math.random() * firstNames.length)]} ${lastNames[Math.floor(Math.random() * lastNames.length)]}`,
      address: `${Math.floor(Math.random() * 999) + 1} ${streets[Math.floor(Math.random() * streets.length)]} St`,
      serviceType,
      quoteAmount,
      date: getRandomDate(30),
      status: Object.values(QuoteStatus)[Math.floor(Math.random() * Object.values(QuoteStatus).length)],
      roofSizeSqFt: Math.floor(1500 + Math.random() * 2000),
    };
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
};

export const MOCK_QUOTES = generateMockQuotes(100);
