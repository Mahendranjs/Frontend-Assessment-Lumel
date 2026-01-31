import { useState, useCallback, useMemo } from "react";
import type {
  TableRowData,
  NormalizedState,
  InputValuesState,
  UseHierarchicalTableReturn,
} from "../types";
import {
  normalizeData,
  flattenForDisplay,
  calculateSubtotal,
  calculateOriginalSubtotal,
  calculateGrandTotal,
  calculateOriginalGrandTotal,
  applyPercentageToValue,
  calculateDistributionRatio,
} from "../utils";
import { initialData as defaultInitialData } from "../constants";

export const useHierarchicalTable = (
  data: TableRowData[] = defaultInitialData,
): UseHierarchicalTableReturn => {
  const [state, setState] = useState<NormalizedState>(() =>
    normalizeData(data),
  );

  const [inputValues, setInputValues] = useState<InputValuesState>({});

  const rows = useMemo(() => {
    return flattenForDisplay(state);
  }, [state]);

  const grandTotal = useMemo(() => {
    return calculateGrandTotal(state.rootIds, state.byId);
  }, [state]);

  const originalGrandTotal = useMemo(() => {
    return calculateOriginalGrandTotal(state.rootIds, state.byId);
  }, [state]);

  const getSubtotal = useCallback(
    (rowId: string): number => calculateSubtotal(rowId, state.byId),
    [state.byId],
  );

  const getOriginalSubtotal = useCallback(
    (rowId: string): number => calculateOriginalSubtotal(rowId, state.byId),
    [state.byId],
  );

  const updateInput = useCallback((rowId: string, value: string): void => {
    setInputValues((prev) => ({
      ...prev,
      [rowId]: value,
    }));
  }, []);

  const clearInput = useCallback((rowId: string): void => {
    setInputValues((prev) => {
      const newValues = { ...prev };
      delete newValues[rowId];
      return newValues;
    });
  }, []);

  const applyPercentage = useCallback(
    (rowId: string): void => {
      const inputVal = parseFloat(inputValues[rowId]);
      if (isNaN(inputVal)) return;

      setState((prev) => {
        const newById = { ...prev.byId };
        const row = newById[rowId];

        if (row.childIds.length === 0) {
          // Leaf node: apply percentage directly
          const newValue = applyPercentageToValue(row.value, inputVal);
          newById[rowId] = { ...row, value: newValue };
        } else {
          // Parent node: recursively apply to all leaf descendants
          const applyToLeaves = (
            parentId: string,
            percentage: number,
          ): void => {
            const parent = newById[parentId];
            parent.childIds.forEach((childId) => {
              const child = newById[childId];
              if (child.childIds.length === 0) {
                // Leaf node
                const newValue = applyPercentageToValue(
                  child.value,
                  percentage,
                );
                newById[childId] = { ...child, value: newValue };
              } else {
                // Recurse into children
                applyToLeaves(childId, percentage);
              }
            });
          };
          applyToLeaves(rowId, inputVal);
        }

        return { ...prev, byId: newById };
      });
    },
    [inputValues],
  );

  const applyValue = useCallback(
    (rowId: string): void => {
      const inputVal = parseFloat(inputValues[rowId]);
      if (isNaN(inputVal)) return;

      setState((prev) => {
        const newById = { ...prev.byId };
        const row = newById[rowId];

        if (row.childIds.length === 0) {
          // Leaf node: set value directly
          newById[rowId] = { ...row, value: inputVal };
        } else {
          // Parent node: distribute proportionally
          const currentSubtotal = calculateSubtotal(rowId, newById);
          const ratio = calculateDistributionRatio(inputVal, currentSubtotal);

          const distributeToLeaves = (
            parentId: string,
            multiplier: number,
          ): void => {
            const parent = newById[parentId];
            parent.childIds.forEach((childId) => {
              const child = newById[childId];
              if (child.childIds.length === 0) {
                // Leaf node
                const newValue = child.value * multiplier;
                newById[childId] = { ...child, value: newValue };
              } else {
                // Recurse into children
                distributeToLeaves(childId, multiplier);
              }
            });
          };
          distributeToLeaves(rowId, ratio);
        }

        return { ...prev, byId: newById };
      });
    },
    [inputValues],
  );

  const reset = useCallback((): void => {
    setState((prev) => {
      const newById = { ...prev.byId };
      Object.keys(newById).forEach((id) => {
        newById[id] = {
          ...newById[id],
          value: newById[id].originalValue,
        };
      });
      return { ...prev, byId: newById };
    });
    setInputValues({});
  }, []);

  const updateRowValue = useCallback(
    (rowId: string, newValue: number): void => {
      setState((prev) => ({
        ...prev,
        byId: {
          ...prev.byId,
          [rowId]: {
            ...prev.byId[rowId],
            value: newValue,
          },
        },
      }));
    },
    [],
  );

  const isParent = useCallback(
    (rowId: string): boolean => (state.byId[rowId]?.childIds.length ?? 0) > 0,
    [state.byId],
  );

  const getRowById = useCallback(
    (rowId: string) => state.byId[rowId],
    [state.byId],
  );

  return {
    rows,
    byId: state.byId,
    rootIds: state.rootIds,
    inputValues,
    grandTotal,
    originalGrandTotal,

    // Calculations
    getSubtotal,
    getOriginalSubtotal,
    isParent,
    getRowById,

    // Actions
    updateInput,
    clearInput,
    applyPercentage,
    applyValue,
    updateRowValue,
    reset,
  };
};
