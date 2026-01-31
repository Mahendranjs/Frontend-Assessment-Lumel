import type { TableRowData, TableColumn } from "../types";
export const initialData: TableRowData[] = [
  {
    id: "electronics",
    label: "Electronics",
    value: 1500,
    parentId: null,
    childIds: ["phones", "laptops"],
  },
  {
    id: "phones",
    label: "Phones",
    value: 800,
    parentId: "electronics",
    childIds: [],
  },
  {
    id: "laptops",
    label: "Laptops",
    value: 700,
    parentId: "electronics",
    childIds: [],
  },
  {
    id: "furniture",
    label: "Furniture",
    value: 1000,
    parentId: null,
    childIds: ["tables", "chairs"],
  },
  {
    id: "tables",
    label: "Tables",
    value: 300,
    parentId: "furniture",
    childIds: [],
  },
  {
    id: "chairs",
    label: "Chairs",
    value: 700,
    parentId: "furniture",
    childIds: [],
  },
];

export const tableColumns: TableColumn[] = [
  { key: "label", header: "Label", align: "left" },
  { key: "value", header: "Value", align: "right" },
  { key: "input", header: "Input", align: "left" },
  { key: "allocationPercent", header: "Allocation %", align: "center" },
  { key: "allocationVal", header: "Allocation Val", align: "center" },
  { key: "variance", header: "Variance %", align: "right" },
];
