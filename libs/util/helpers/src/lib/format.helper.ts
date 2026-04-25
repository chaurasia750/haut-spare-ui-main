/**
 * Format utilities for dates, currencies, and phone numbers
 */

/**
 * Format a date to a readable string format (e.g., "Jan 15, 2025")
 * @param date - The date to format (Date object or string)
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted date string
 */
export function formatDate(date: Date | string, locale: string = 'en-US'): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return '';
  }
}

/**
 * Format a date and time to a readable string (e.g., "Jan 15, 2025 2:30 PM")
 * @param date - The date to format (Date object or string)
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted date and time string
 */
export function formatDateTime(date: Date | string, locale: string = 'en-US'): string {
  try {
    const d = typeof date === 'string' ? new Date(date) : date;
    return d.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      meridiem: 'short',
    });
  } catch {
    return '';
  }
}

/**
 * Format a number as currency
 * @param amount - The amount to format
 * @param currency - The currency code (default: 'USD')
 * @param locale - The locale to use (default: 'en-US')
 * @returns Formatted currency string (e.g., "$1,234.56")
 */
export function formatCurrency(amount: number, currency: string = 'USD', locale: string = 'en-US'): string {
  try {
    return new Intl.NumberFormat(locale, {
      style: 'currency',
      currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch {
    return `${currency} ${amount.toFixed(2)}`;
  }
}

/**
 * Format a phone number (US format by default)
 * @param phoneNumber - The phone number string (digits only or with formatting)
 * @param format - The format to use (default: 'US' for (123) 456-7890)
 * @returns Formatted phone number string
 */
export function formatPhoneNumber(phoneNumber: string, format: string = 'US'): string {
  // Remove all non-digit characters
  const digits = phoneNumber.replace(/\D/g, '');

  if (format === 'US' && digits.length === 10) {
    return `(${digits.slice(0, 3)}) ${digits.slice(3, 6)}-${digits.slice(6)}`;
  } else if (format === 'INTERNATIONAL' && digits.length === 11) {
    return `+${digits.slice(0, 1)} ${digits.slice(1, 4)} ${digits.slice(4, 7)} ${digits.slice(7)}`;
  }

  return phoneNumber;
}

/**
 * Format a percentage value
 * @param value - The decimal value (e.g., 0.25 for 25%)
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted percentage string (e.g., "25.00%")
 */
export function formatPercentage(value: number, decimals: number = 2): string {
  return `${(value * 100).toFixed(decimals)}%`;
}

/**
 * Format bytes to human readable format (B, KB, MB, GB)
 * @param bytes - The number of bytes
 * @param decimals - Number of decimal places (default: 2)
 * @returns Formatted file size string (e.g., "1.5 MB")
 */
export function formatFileSize(bytes: number, decimals: number = 2): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(decimals)) + ' ' + sizes[i];
}

/**
 * Format a number with thousands separator
 * @param value - The number to format
 * @param separator - The separator to use (default: ',')
 * @returns Formatted number string (e.g., "1,234,567")
 */
export function formatNumber(value: number, separator: string = ','): string {
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, separator);
}
