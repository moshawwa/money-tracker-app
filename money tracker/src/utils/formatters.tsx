/**
 * Format a number as currency
 * @param amount The amount to format
 * @param currency The currency code (default: 'USD')
 * @returns Formatted currency string
 */
export const formatCurrency = (
  amount: number,
  currency: string = "USD"
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

/**
 * Format a date to a human-readable string
 * @param date The date to format
 * @param format The format style ('full', 'long', 'medium', 'short')
 * @returns Formatted date string
 */
export const formatDate = (
  date: Date | string | number,
  format: "full" | "long" | "medium" | "short" = "medium"
): string => {
  const dateObject =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  return new Intl.DateTimeFormat("en-US", {
    dateStyle: format,
  }).format(dateObject);
};

/**
 * Convert a plain number to a percentage string
 * @param value The decimal value (e.g., 0.42)
 * @param decimals Number of decimal places
 * @returns Formatted percentage string
 */
export const formatPercentage = (
  value: number,
  decimals: number = 0
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

/**
 * Truncate text with ellipsis if it exceeds the specified length
 * @param text The text to truncate
 * @param length The maximum length
 * @returns Truncated text
 */
export const truncateText = (text: string, length: number = 30): string => {
  if (text.length <= length) return text;
  return `${text.substring(0, length)}...`;
};

/**
 * Get a readable relative time (e.g., "2 days ago")
 * @param date The date to format
 * @returns Relative time string
 */
export const getRelativeTime = (date: Date | string | number): string => {
  const dateObject =
    typeof date === "string" || typeof date === "number"
      ? new Date(date)
      : date;

  const formatter = new Intl.RelativeTimeFormat("en", {
    numeric: "auto",
  });

  const now = new Date();
  const diff = dateObject.getTime() - now.getTime();

  // Convert to the appropriate unit
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(months / 12);

  if (Math.abs(seconds) < 60) return formatter.format(seconds, "second");
  if (Math.abs(minutes) < 60) return formatter.format(minutes, "minute");
  if (Math.abs(hours) < 24) return formatter.format(hours, "hour");
  if (Math.abs(days) < 30) return formatter.format(days, "day");
  if (Math.abs(months) < 12) return formatter.format(months, "month");
  return formatter.format(years, "year");
};
