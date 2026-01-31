import type { VarianceClass } from "../types";

export const formatNumber = (
  num: number,
  minDecimals: number = 0,
  maxDecimals: number = 2,
): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: minDecimals,
    maximumFractionDigits: maxDecimals,
  }).format(num);
};

export const formatCurrency = (
  num: number,
  currency: string = "USD",
): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(num);
};

export const formatVariance = (
  variance: number,
  decimals: number = 2,
): string => {
  const sign = variance > 0 ? "+" : "";
  return `${sign}${variance.toFixed(decimals)}%`;
};

export const getVarianceClass = (variance: number): VarianceClass => {
  if (variance > 0) return "positive";
  if (variance < 0) return "negative";
  return "neutral";
};

export const formatPercentage = (
  value: number,
  decimals: number = 2,
): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const truncateText = (text: string, maxLength: number = 20): string => {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength - 3)}...`;
};
