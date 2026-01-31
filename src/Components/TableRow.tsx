import React, { type ChangeEvent, type KeyboardEvent } from "react";
import type { TableRowProps } from "../types";
import {
  formatNumber,
  formatVariance,
  calculateVariance,
  getVarianceClass,
} from "../utils";

const TableRow: React.FC<TableRowProps> = ({
  row,
  subtotal,
  originalSubtotal,
  inputValue,
  onInputChange,
  onApplyPercentage,
  onApplyValue,
}) => {
  const variance = calculateVariance(subtotal, originalSubtotal);
  const varianceClass = getVarianceClass(variance);
  const isParent = row.childIds.length > 0;
  const indentPx = row.depth * 24;

  const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
    onInputChange(row.id, e.target.value);
  };

  const handlePercentageClick = (): void => {
    onApplyPercentage(row.id);
  };

  const handleValueClick = (): void => {
    onApplyValue(row.id);
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>): void => {
    if (e.key === "Enter") {
      // Default to percentage on Enter
      onApplyPercentage(row.id);
    }
  };

  return (
    <tr
      className={`table-row ${isParent ? "parent-row" : "child-row"} depth-${row.depth}`}
      data-row-id={row.id}
    >
      <td className="cell label-cell">
        <div className="label-content" style={{ paddingLeft: `${indentPx}px` }}>
          {row.depth > 0 && (
            <span className="tree-indicator" aria-hidden="true">
              └─
            </span>
          )}
          <span className={isParent ? "parent-label" : "child-label"}>
            {row.label}
          </span>
        </div>
      </td>

      <td className="cell value-cell">
        <span className="value-display">{formatNumber(subtotal)}</span>
      </td>

      <td className="cell input-cell">
        <input
          type="number"
          className="value-input"
          value={inputValue ?? ""}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          placeholder="Enter value"
          aria-label={`Input for ${row.label}`}
        />
      </td>

      <td className="cell action-cell">
        <button
          type="button"
          className="btn btn-percentage"
          onClick={handlePercentageClick}
          title={`Apply ${inputValue ?? 0}% increase to ${row.label}`}
          aria-label={`Apply percentage allocation to ${row.label}`}
        >
          Allocation %
        </button>
      </td>
      <td className="cell action-cell">
        <button
          type="button"
          className="btn btn-value"
          onClick={handleValueClick}
          title={`Set ${row.label} value to ${inputValue ?? 0}`}
          aria-label={`Apply value allocation to ${row.label}`}
        >
          Allocation Val
        </button>
      </td>
      <td className={`cell variance-cell ${varianceClass}`}>
        <span className="variance-display">{formatVariance(variance)}</span>
      </td>
    </tr>
  );
};

export default React.memo(TableRow);
