import type {
  TableRowData,
  NormalizedRowData,
  NormalizedState,
} from "../types";

export const normalizeData = (data: TableRowData[]): NormalizedState => {
  const byId: Record<string, NormalizedRowData> = {};
  const rootIds: string[] = [];

  // First pass: create lookup map
  data.forEach((item) => {
    byId[item.id] = {
      ...item,
      originalValue: item.value,
      depth: 0,
    };

    if (!item.parentId) {
      rootIds.push(item.id);
    }
  });

  // Second pass: calculate depths using DFS
  const calculateDepth = (id: string, depth: number = 0): void => {
    byId[id].depth = depth;
    byId[id].childIds.forEach((childId) => {
      calculateDepth(childId, depth + 1);
    });
  };

  rootIds.forEach((id) => calculateDepth(id, 0));

  return { byId, rootIds };
};

export const denormalizeData = (state: NormalizedState): TableRowData[] => {
  const { byId } = state;
  return Object.values(byId).map(
    ({ originalValue: _originalValue, depth: _depth, ...rest }) => rest,
  );
};

export const flattenForDisplay = (
  state: NormalizedState,
): NormalizedRowData[] => {
  const { byId, rootIds } = state;
  const result: NormalizedRowData[] = [];

  const traverse = (ids: string[]): void => {
    ids.forEach((id) => {
      result.push(byId[id]);
      if (byId[id].childIds.length > 0) {
        traverse(byId[id].childIds);
      }
    });
  };

  traverse(rootIds);
  return result;
};

export const getDescendantIds = (
  rowId: string,
  byId: Record<string, NormalizedRowData>,
): string[] => {
  const descendants: string[] = [];

  const collect = (id: string): void => {
    const row = byId[id];
    if (!row) return;

    row.childIds.forEach((childId) => {
      descendants.push(childId);
      collect(childId);
    });
  };

  collect(rowId);
  return descendants;
};

export const getAncestorIds = (
  rowId: string,
  byId: Record<string, NormalizedRowData>,
): string[] => {
  const ancestors: string[] = [];
  let currentId = byId[rowId]?.parentId;

  while (currentId) {
    ancestors.push(currentId);
    currentId = byId[currentId]?.parentId;
  }

  return ancestors;
};

export const getLeafIds = (
  byId: Record<string, NormalizedRowData>,
): string[] => {
  return Object.keys(byId).filter((id) => byId[id].childIds.length === 0);
};

export const isLeafNode = (
  rowId: string,
  byId: Record<string, NormalizedRowData>,
): boolean => {
  return byId[rowId]?.childIds.length === 0;
};

export const isRootNode = (
  rowId: string,
  byId: Record<string, NormalizedRowData>,
): boolean => {
  return byId[rowId]?.parentId === null;
};
