import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getMessagesThunk } from "../store/message.thunk";
import {
  selectMessages,
  selectMessageError,
  selectMessageLoading,
} from "../store/message.slice";
import { MessageList } from "../components/MessageList";

const MessageManagement = () => {
  const dispatch = useDispatch();
  const messages = useSelector(selectMessages);
  const error = useSelector(selectMessageError);
  const loading = useSelector(selectMessageLoading);

  const messageCount = useMemo(() => {
    return Array.isArray(messages) ? messages.length : 0;
  }, [messages.length]);

  useEffect(() => {
    dispatch(getMessagesThunk());
  }, [dispatch]);

  return (
    <div className="container-fluid py-4">
      <h1 className="h3">Message Management</h1>

      {error && (
        <div className="alert alert-danger" role="alert">
          {error}
        </div>
      )}

      <div className="card">
        <div className="card-header">
          <h5 className="card-title mb-0">
            All Messages ({messageCount})
            {loading && (
              <span className="spinner-border spinner-border-sm ms-2"></span>
            )}
          </h5>
        </div>
        <div className="card-body p-0">
          <MessageList messages={messages} />
        </div>
      </div>
    </div>
  );
};

export default MessageManagement;
