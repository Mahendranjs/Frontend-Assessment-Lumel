import React from "react";

const TableHeader: React.FC = () => {
  return (
    <thead className="table-header">
      <tr>
        <th className="header-cell header-label">Label</th>
        <th className="header-cell header-value">Value</th>
        <th className="header-cell header-input">Input</th>
        <th className="header-cell header-action">Allocation %</th>
        <th className="header-cell header-action">Allocation Val</th>
        <th className="header-cell header-variance">Variance %</th>
      </tr>
    </thead>
  );
};

export default React.memo(TableHeader);
