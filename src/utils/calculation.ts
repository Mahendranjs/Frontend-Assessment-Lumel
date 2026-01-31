import type { NormalizedRowData } from "../types";

export const calculateSubtotal = (
  rowId: string,
  byId: Record<string, NormalizedRowData>,
): number => {
  const row = byId[rowId];

  if (!row) return 0;

  if (row.childIds.length === 0) {
    return row.value;
  }

  return row.childIds.reduce(
    (sum, childId) => sum + calculateSubtotal(childId, byId),
    0,
  );
};

export const calculateOriginalSubtotal = (
  rowId: string,
  byId: Record<string, NormalizedRowData>,
): number => {
  const row = byId[rowId];

  if (!row) return 0;

  if (row.childIds.length === 0) {
    return row.originalValue;
  }

  return row.childIds.reduce(
    (sum, childId) => sum + calculateOriginalSubtotal(childId, byId),
    0,
  );
};

export const calculateVariance = (
  current: number,
  original: number,
): number => {
  if (original === 0) {
    return current === 0 ? 0 : 100;
  }
  return ((current - original) / original) * 100;
};

export const calculateGrandTotal = (
  rootIds: string[],
  byId: Record<string, NormalizedRowData>,
): number => {
  return rootIds.reduce((sum, id) => sum + calculateSubtotal(id, byId), 0);
};

export const calculateOriginalGrandTotal = (
  rootIds: string[],
  byId: Record<string, NormalizedRowData>,
): number => {
  return rootIds.reduce(
    (sum, id) => sum + calculateOriginalSubtotal(id, byId),
    0,
  );
};

export const applyPercentageToValue = (
  value: number,
  percentage: number,
): number => {
  return value * (1 + percentage / 100);
};

export const calculateDistributionRatio = (
  newTotal: number,
  currentTotal: number,
): number => {
  if (currentTotal === 0) return 0;
  return newTotal / currentTotal;
};
