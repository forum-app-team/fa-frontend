import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagesThunk } from "../store/message.thunk";
import { selectMessages } from "../store/message.slice";
import { MessageList } from "../components/MessageList";

const MessageManagement = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);

  useEffect(() => {
    dispatch(getMessagesThunk());
  }, [dispatch]);

  return (
    <div className="container-fluid py-4">
      <h1 className="h3">Message Management</h1>

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">All Messages ({messages.length})</h5>
        </div>
        <div className="card-body p-0">
          <MessageList messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;
