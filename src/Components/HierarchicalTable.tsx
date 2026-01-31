import React from "react";
import type { HierarchicalTableProps } from "../types";
import { useHierarchicalTable } from "../Hooks";
import TableHeader from "./TableHeader";
import TableRow from "./TableRow";
import GrandTotalRow from "./GrandTotalRow";
import "../styles/hierarchicalTable.css";

const HierarchicalTable: React.FC<HierarchicalTableProps> = ({
  data,
  title = "Hierarchical Allocation Table",
  subtitle = "Manage values with percentage or direct allocation",
}) => {
  const {
    rows,
    inputValues,
    grandTotal,
    originalGrandTotal,
    getSubtotal,
    getOriginalSubtotal,
    updateInput,
    applyPercentage,
    applyValue,
    reset,
  } = useHierarchicalTable(data);

  return (
    <div className="hierarchical-table-container">
      <header className="table-header-section">
        <h1 className="table-title">{title}</h1>
        <p className="table-subtitle">{subtitle}</p>
        <button
          type="button"
          className="btn btn-reset"
          onClick={reset}
          aria-label="Reset all values to original"
        >
          Reset All Values
        </button>
      </header>
      <div className="table-wrapper">
        <table className="hierarchical-table" role="grid">
          <TableHeader />
          <tbody>
            {rows.map((row) => (
              <TableRow
                key={row.id}
                row={row}
                subtotal={getSubtotal(row.id)}
                originalSubtotal={getOriginalSubtotal(row.id)}
                inputValue={inputValues[row.id]}
                onInputChange={updateInput}
                onApplyPercentage={applyPercentage}
                onApplyValue={applyValue}
              />
            ))}
            <GrandTotalRow
              total={grandTotal}
              originalTotal={originalGrandTotal}
            />
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HierarchicalTable;
