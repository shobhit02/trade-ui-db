import { Trade } from './types';
import { todayStr } from './utils/date';

const SEED_TRADES: Trade[] = [
  {
    tradeId: 'T1',
    version: 1,
    counterPartyId: 'CP-1',
    bookId: 'B1',
    maturityDate: '2020-05-20',
    createdDate: todayStr(),
    expired: true,
  },
  {
    tradeId: 'T2',
    version: 2,
    counterPartyId: 'CP-2',
    bookId: 'B1',
    maturityDate: '2021-05-20',
    createdDate: todayStr(),
    expired: false,
  },
  {
    tradeId: 'T2',
    version: 1,
    counterPartyId: 'CP-1',
    bookId: 'B1',
    maturityDate: '2021-05-20',
    createdDate: '2015-03-14',
    expired: false,
  },
  {
    tradeId: 'T3',
    version: 3,
    counterPartyId: 'CP-3',
    bookId: 'B2',
    maturityDate: '2014-05-20',
    createdDate: todayStr(),
    expired: true,
  },
];

export async function fetchTrades(): Promise<Trade[]> {
  try {
    const res = await fetch('/api/trades');
    if (!res.ok) {
      throw new Error(`Failed to fetch trades: ${res.status} ${res.statusText}`);
    }
    const data = await res.json();
    // Validate response structure
    if (!Array.isArray(data)) {
      throw new Error('Invalid response format: expected array');
    }
    return data as Trade[];
  } catch (error) {
    // In production, consider logging to an error tracking service
    if (process.env.NODE_ENV === 'development') {
      console.warn('Failed to fetch trades from API, using seed data:', error);
    }
    return SEED_TRADES;
  }
}
