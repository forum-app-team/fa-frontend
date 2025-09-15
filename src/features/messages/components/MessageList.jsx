import Table from "react-bootstrap/Table";
import Badge from "react-bootstrap/Badge";

const MessageList = ({ messages }) => {
  const formatDate = (dateString) => {
    return dateString ? new Date(dateString).toLocaleDateString() : "";
  };

  const messageList = Array.isArray(messages) ? messages : [];

  if (messageList.length === 0) {
    return <p className="text-muted m-3">No messages found.</p>;
  }

  const getStatusVariant = (status) => {
    switch (status) {
      case "pending":
        return "warning";
      case "closed":
        return "success";
      default:
        return "secondary";
    }
  };

  return (
    <Table striped hover responsive="md" className="align-middle">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Subject</th>
          <th>Message</th>
          <th>Status</th>
          <th>Date Created</th>
        </tr>
      </thead>
      <tbody>
        {messageList.map((message) => (
          <tr key={message.id}>
            <td>{message.id}</td>
            <td>
              <a href={`mailto:${message.email}`}>{message.email}</a>
            </td>
            <td>
              <strong>{message.subject}</strong>
            </td>
            <td>
              <div
                className="text-truncate"
                style={{ maxWidth: "200px" }}
                title={message.message}
              >
                {message.message}
              </div>
            </td>
            <td>
              <Badge bg={getStatusVariant(message.status)}>
                {message.status}
              </Badge>
            </td>
            <td>{formatDate(message.date_created)}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
};

export { MessageList };
