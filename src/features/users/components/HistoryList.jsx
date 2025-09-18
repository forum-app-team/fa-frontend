import HistoryItem from "./HistoryItem";

const HistoryList = ({ items, onDelete }) => {
  return (
    <ul className="list-unstyled m-0">
      {items.map((it) => (
        <HistoryItem key={it.historyId} item={it} onDelete={onDelete} />
      ))}
    </ul>
  );
};

export default HistoryList;

