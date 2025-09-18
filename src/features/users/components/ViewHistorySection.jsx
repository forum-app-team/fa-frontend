import { useMemo, useState } from "react";
import { useListHistoryQuery, useDeleteHistoryEntryMutation, useClearHistoryMutation } from "../store/users.slice";
import ViewHistoryFilters from "./ViewHistoryFilters";
import HistoryList from "./HistoryList";

const DEFAULT_LIMIT = 20;

const ViewHistorySection = () => {
  const [filters, setFilters] = useState({ q: "", from: "", to: "" });
  const [cursor, setCursor] = useState(undefined);
  const [limit] = useState(DEFAULT_LIMIT);

  const params = useMemo(() => ({
    limit,
    cursor,
    q: filters.q || undefined,
    from: filters.from || undefined,
    to: filters.to || undefined,
  }), [limit, cursor, filters]);

  const { data, error, isLoading, isFetching } = useListHistoryQuery(params);
  const [deleteHistoryEntry] = useDeleteHistoryEntryMutation();
  const [clearHistory, { isLoading: clearing }] = useClearHistoryMutation();

  const onDelete = async (id) => {
    try { await deleteHistoryEntry(id).unwrap(); } catch {}
  };
  const onClearAll = async () => {
    if (!window.confirm("Clear all view history?")) return;
    try { await clearHistory().unwrap(); setCursor(undefined); } catch {}
  };

  const items = data?.items ?? [];
  const hasMore = Boolean(data?.nextCursor);

  return (
    <section className="card shadow-sm">
      <div className="card-body">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h2 className="h5 m-0">View History</h2>
          <button className="btn btn-sm btn-outline-danger" disabled={clearing || items.length === 0} onClick={onClearAll}>
            {clearing ? "Clearing..." : "Clear all"}
          </button>
        </div>

        <ViewHistoryFilters value={filters} onChange={(v) => { setFilters(v); setCursor(undefined); }} />

        {isLoading ? (
          <div>Loading history...</div>
        ) : error ? (
          <div className="alert alert-danger" role="alert">Failed to load history</div>
        ) : items.length === 0 ? (
          <div className="text-muted">No history yet</div>
        ) : (
          <HistoryList items={items} onDelete={onDelete} />
        )}

        <div className="mt-3 d-flex justify-content-center">
          {hasMore && (
            <button className="btn btn-outline-primary" disabled={isFetching} onClick={() => setCursor(data.nextCursor)}>
              {isFetching ? "Loading..." : "Load more"}
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default ViewHistorySection;
