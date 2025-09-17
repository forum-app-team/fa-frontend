// TODO: Wire up search and date filter inputs to filter history list client-side, with debouncing
const ViewHistoryFilters = () => {
  return (
    <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
      <input placeholder="Search viewed posts" />
      <input type="date" />
      <button>Apply</button>
      <button>Reset</button>
    </div>
  );
};

export default ViewHistoryFilters;
