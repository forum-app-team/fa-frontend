import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";
import Button from "react-bootstrap/Button";
import { useDispatch } from "react-redux";
import { updateMessageStatusThunk } from "../store/message.thunk";

const MessageList = ({ messages }) => {
  const dispatch = useDispatch();
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  };

  const messageList = Array.isArray(messages) ? messages : [];

  if (messageList.length === 0) {
    return <p className="text-muted m-3">No messages found.</p>;
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "open":
        return "primary";
      case "closed":
        return "success";
      default:
        return "secondary";
    }
  };

  const handleToggle = (message) => {
    // Always send lowercase 'open' or 'closed' only
    const current = String(message.status).toLowerCase();
    const nextStatus = current === "closed" ? "open" : "closed";
    dispatch(updateMessageStatusThunk({ id: message.id, status: nextStatus }));
  };

  return (
    <Table striped hover responsive="md" className="align-middle">
      <thead>
        <tr>
          <th>Email</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Status</th>
          <th>Action</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody>
        {messageList.map((message) => (
          <tr key={message.id}>
            <td>
              <a href={`mailto:${message.email}`}>{message.email}</a>
            </td>
            <td>
              <strong>{message.subject}</strong>
            </td>
            <td
              style={{
                whiteSpace: "pre-line",
                maxWidth: "350px",
                wordBreak: "break-word",
              }}
            >
              {message.message && message.message.length > 60 ? (
                <span title={message.message} style={{ cursor: "pointer" }}>
                  {message.message.slice(0, 60)}...{" "}
                  <span style={{ color: "#0d6efd" }}>[more]</span>
                </span>
              ) : (
                message.message
              )}
            </td>
            <td>
              <Badge
                bg={getStatusVariant(message.status)}
                className="text-uppercase"
              >
                {message.status === "open" ? "Open" : "Closed"}
              </Badge>
            </td>
            <td>
              <Button
                size="sm"
                variant={
                  message.status === "closed"
                    ? "outline-primary"
                    : "outline-success"
                }
                onClick={() => handleToggle(message)}
              >
                {message.status === "closed" ? "Open" : "Close"}
              </Button>
            </td>
            <td>{formatDate(message.date_created)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export { MessageList };
