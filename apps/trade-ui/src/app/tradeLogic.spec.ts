import { saveTrade } from './tradeLogic';
import { Trade } from './types';

const baseTrades: Trade[] = [
  {
    tradeId: 'T2',
    version: 2,
    counterPartyId: 'CP-2',
    bookId: 'B1',
    maturityDate: '2099-01-01',
    createdDate: '2025-01-01',
    expired: false,
  },
];

describe('tradeLogic.saveTrade', () => {
  it('rejects past maturity date', () => {
    const result = saveTrade(baseTrades, {
      tradeId: 'T9',
      version: 1,
      counterPartyId: 'CP-9',
      bookId: 'B9',
      maturityDate: '2000-01-01',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/maturity date must be today or later/i);
      expect(result.trades).toHaveLength(1);
    }
  });

  it('rejects lower version for existing trade id', () => {
    const result = saveTrade(baseTrades, {
      tradeId: 'T2',
      version: 1,
      counterPartyId: 'CP-X',
      bookId: 'B1',
      maturityDate: '2099-01-01',
    });

    expect(result.ok).toBe(false);
    if (!result.ok) {
      expect(result.error).toMatch(/version must be >= existing version 2/i);
    }
  });

  it('creates a new trade when version is higher', () => {
    const result = saveTrade(baseTrades, {
      tradeId: 'T2',
      version: 3,
      counterPartyId: 'CP-3',
      bookId: 'B1',
      maturityDate: '2099-01-02',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      expect(result.trades).toHaveLength(2);
      expect(result.message).toMatch(/created successfully/i);
    }
  });

  it('replaces an existing trade when same id + version', () => {
    const result = saveTrade(baseTrades, {
      tradeId: 'T2',
      version: 2,
      counterPartyId: 'CP-NEW',
      bookId: 'B2',
      maturityDate: '2099-02-01',
    });

    expect(result.ok).toBe(true);
    if (result.ok) {
      const updated = result.trades.find((t) => t.tradeId === 'T2' && t.version === 2);
      expect(updated?.counterPartyId).toBe('CP-NEW');
      expect(result.message).toMatch(/replaced successfully/i);
    }
  });
});
