import React from "react";
import type { GrandTotalRowProps } from "../types";
import {
  formatNumber,
  formatVariance,
  calculateVariance,
  getVarianceClass,
} from "../utils";

const GrandTotalRow: React.FC<GrandTotalRowProps> = ({
  total,
  originalTotal,
}) => {
  const variance = calculateVariance(total, originalTotal);
  const varianceClass = getVarianceClass(variance);

  return (
    <tr className="grand-total-row">
      <td className="cell label-cell">
        <span className="grand-total-label">Grand Total</span>
      </td>
      <td className="cell value-cell">
        <span className="grand-total-value">{formatNumber(total)}</span>
      </td>
      <td className="cell input-cell" aria-hidden="true"></td>
      <td className="cell action-cell" aria-hidden="true"></td>
      <td className="cell action-cell" aria-hidden="true"></td>
      <td className={`cell variance-cell ${varianceClass}`}>
        <span className="variance-display">{formatVariance(variance)}</span>
      </td>
    </tr>
  );
};

export default React.memo(GrandTotalRow);
