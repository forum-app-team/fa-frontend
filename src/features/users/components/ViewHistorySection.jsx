import ViewHistoryFilters from './ViewHistoryFilters';

// TODO: Replace placeholder list with actual data from backend (published posts from history, sorted most recent first)
const ViewHistorySection = () => {
  return (
    <section>
      <h2>View History</h2>
      <ViewHistoryFilters />
      {/* TODO: Render real history data here */}
      <ul>
        <li>/* viewed post 1 */</li>
        <li>/* viewed post 2 */</li>
      </ul>
    </section>
  );
};

export default ViewHistorySection;
