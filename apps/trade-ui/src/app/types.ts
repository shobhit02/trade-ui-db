export interface Trade {
  tradeId: string;
  version: number;
  counterPartyId: string;
  bookId: string;
  maturityDate: string;
  createdDate: string;
  expired: boolean;
}

export interface TradeFormValues {
  tradeId: string;
  version: number;
  counterPartyId: string;
  bookId: string;
  maturityDate: string;
}

export type SaveResult =
  | { ok: true; trades: Trade[]; message: string }
  | { ok: false; trades: Trade[]; error: string };

export interface TestCoverageSummary {
  statements: number;
  branches: number;
  functions: number;
  lines: number;
}

export function formatCoverageSummary(summary: TestCoverageSummary): string {
  const { statements, branches, functions, lines } = summary;
  return `Coverage - Statements: ${statements}%, Branches: ${branches}%, Functions: ${functions}%, Lines: ${lines}%`;
}
