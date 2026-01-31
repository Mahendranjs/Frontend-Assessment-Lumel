export interface TableRowData {
  id: string;
  label: string;
  value: number;
  parentId: string | null;
  childIds: string[];
}

export interface NormalizedRowData extends TableRowData {
  originalValue: number;
  depth: number;
}

export interface NormalizedState {
  byId: Record<string, NormalizedRowData>;
  rootIds: string[];
}

export type InputValuesState = Record<string, string>;

export interface TableColumn {
  key: string;
  header: string;
  align: "left" | "center" | "right";
}

export type VarianceClass = "positive" | "negative" | "neutral";

export interface TableRowProps {
  row: NormalizedRowData;
  subtotal: number;
  originalSubtotal: number;
  inputValue: string | undefined;
  onInputChange: (rowId: string, value: string) => void;
  onApplyPercentage: (rowId: string) => void;
  onApplyValue: (rowId: string) => void;
}

export interface GrandTotalRowProps {
  total: number;
  originalTotal: number;
}

export interface HierarchicalTableProps {
  data?: TableRowData[];
  title?: string;
  subtitle?: string;
}

export interface UseHierarchicalTableReturn {
  rows: NormalizedRowData[];
  byId: Record<string, NormalizedRowData>;
  rootIds: string[];
  inputValues: InputValuesState;
  grandTotal: number;
  originalGrandTotal: number;
  getSubtotal: (rowId: string) => number;
  getOriginalSubtotal: (rowId: string) => number;
  isParent: (rowId: string) => boolean;
  getRowById: (rowId: string) => NormalizedRowData | undefined;
  updateInput: (rowId: string, value: string) => void;
  clearInput: (rowId: string) => void;
  applyPercentage: (rowId: string) => void;
  applyValue: (rowId: string) => void;
  updateRowValue: (rowId: string, newValue: number) => void;
  reset: () => void;
}
