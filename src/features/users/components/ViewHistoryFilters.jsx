import { useEffect, useMemo, useState } from "react";

const ViewHistoryFilters = ({ value, onChange }) => {
  const [q, setQ] = useState(value?.q || "");
  const [from, setFrom] = useState(value?.from || "");
  const [to, setTo] = useState(value?.to || "");

  // Debounce q to reduce requests as user types
  useEffect(() => {
    const t = setTimeout(() => onChange({ q, from, to }), 350);
    return () => clearTimeout(t);
  }, [q, from, to, onChange]);

  const reset = () => {
    setQ(""); setFrom(""); setTo(""); onChange({ q: "", from: "", to: "" });
  };

  return (
    <div className="d-flex align-items-end gap-2 mb-3">
      <div className="flex-grow-1">
        <label className="form-label">Search term</label>
        <input className="form-control" placeholder="Search viewed posts" value={q} onChange={(e) => setQ(e.target.value)} />
      </div>
      <div>
        <label className="form-label">From</label>
        <input className="form-control" type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
      </div>
      <div>
        <label className="form-label">To</label>
        <input className="form-control" type="date" value={to} onChange={(e) => setTo(e.target.value)} />
      </div>
      <div className="ms-auto">
        <button type="button" className="btn btn-outline-secondary" onClick={reset}>Reset</button>
      </div>
    </div>
  );
};

export default ViewHistoryFilters;
