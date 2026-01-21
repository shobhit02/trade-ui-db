/**
 * Returns today's date as an ISO string (YYYY-MM-DD) in local timezone
 */
export const todayStr = (): string => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

/**
 * Compares two date strings (ISO format YYYY-MM-DD)
 * Returns true if date1 is before date2
 */
export const isDateBefore = (date1: string, date2: string): boolean => {
  return date1 < date2;
};

/**
 * Checks if a maturity date has expired (is before today)
 */
export const isExpired = (maturityDate: string): boolean => {
  return maturityDate < todayStr();
};
