import { useMemo, useState, useCallback } from "react";

export function usePagination({ initialPage = 1, initialLimit = 20 } = {}) {
  const [page, setPage] = useState(initialPage);
  const [limit, setLimitState] = useState(initialLimit);
  const offset = (page - 1) * limit;

  const setLimit = useCallback((n) => {
    setLimitState(Math.max(10, n));
    setPage(1);
  }, []);

  const next = useCallback(() => setPage(p => p + 1), []);
  const prev = useCallback(() => setPage(p => Math.max(1, p - 1)), []);

  const pageCountFrom = useCallback((total) => Math.max(1, Math.ceil(total / limit)), [limit]);

  return { page, limit, offset, setPage, setLimit, next, prev, pageCountFrom };
}
