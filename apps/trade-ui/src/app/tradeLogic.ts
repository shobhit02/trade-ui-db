import { Trade, TradeFormValues, SaveResult } from './types';
import { todayStr, isExpired } from './utils/date';

export function saveTrade(existing: Trade[], input: TradeFormValues): SaveResult {
  const { tradeId, version, counterPartyId, bookId, maturityDate } = input;

  if (!tradeId || !counterPartyId || !bookId || !maturityDate) {
    return { ok: false, trades: existing, error: 'Please fill all fields.' };
  }

  if (isExpired(maturityDate)) {
    return { ok: false, trades: existing, error: 'Maturity date must be today or later.' };
  }

  const versionNum = Number(version);
  const sameIdTrades = existing.filter((t) => t.tradeId === tradeId);
  const higherVersion = sameIdTrades.find((t) => t.version > versionNum);

  if (higherVersion) {
    return {
      ok: false,
      trades: existing,
      error: `Version must be >= existing version ${higherVersion.version} for Trade ${tradeId}.`,
    };
  }

  const newTrade: Trade = {
    tradeId,
    version: versionNum,
    counterPartyId,
    bookId,
    maturityDate,
    createdDate: todayStr(),
    expired: isExpired(maturityDate),
  };

  const existingIndex = existing.findIndex(
    (t) => t.tradeId === tradeId && t.version === versionNum
  );

  if (existingIndex >= 0) {
    const updated = [...existing];
    updated[existingIndex] = newTrade;
    return {
      ok: true,
      trades: updated,
      message: `Trade ${tradeId} v${version} replaced successfully.`,
    };
  }

  return {
    ok: true,
    trades: [...existing, newTrade],
    message: `Trade ${tradeId} v${version} created successfully.`,
  };
}
