import { Trade, TradeFormValues, SaveResult } from './types';

const todayStr = () => new Date().toISOString().split('T')[0];

const computeExpired = (maturityDate: string): boolean => {
  return maturityDate < todayStr();
};

export function saveTrade(existing: Trade[], input: TradeFormValues): SaveResult {
  const { tradeId, version, counterPartyId, bookId, maturityDate } = input;

  if (!tradeId || !counterPartyId || !bookId || !maturityDate) {
    return { ok: false, trades: existing, error: 'Please fill all fields.' };
  }

  if (maturityDate < todayStr()) {
    return { ok: false, trades: existing, error: 'Maturity date must be today or later.' };
  }

  const sameIdTrades = existing.filter((t) => t.tradeId === tradeId);
  const higherVersion = sameIdTrades.find((t) => t.version > Number(version));

  if (higherVersion) {
    return {
      ok: false,
      trades: existing,
      error: `Version must be >= existing version ${higherVersion.version} for Trade ${tradeId}.`,
    };
  }

  const newTrade: Trade = {
    tradeId,
    version: Number(version),
    counterPartyId,
    bookId,
    maturityDate,
    createdDate: todayStr(),
    expired: computeExpired(maturityDate),
  };

  const existingIndex = existing.findIndex(
    (t) => t.tradeId === tradeId && t.version === Number(version),
  );

  let updated: Trade[];
  let message: string;

  if (existingIndex >= 0) {
    updated = [...existing];
    updated[existingIndex] = newTrade;
    message = `Trade ${tradeId} v${version} replaced successfully.`;
  } else {
    updated = [...existing, newTrade];
    message = `Trade ${tradeId} v${version} created successfully.`;
  }

  return { ok: true, trades: updated, message };
}
