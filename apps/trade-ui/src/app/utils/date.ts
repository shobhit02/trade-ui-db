/**
* Returns today's date as an ISO string (YYYY-MM-DD)
*/
export const todayStr = (): string => new Date().toISOString().split('T')[0];

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
