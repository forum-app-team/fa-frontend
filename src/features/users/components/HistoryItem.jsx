import { useEffect, useState } from "react";
import { Link, generatePath } from "react-router-dom";
import { PATHS } from "@/app/config/paths";
import { getPostDetail } from "@/features/posts/api/posts.api";

const HistoryItem = ({ item, onDelete }) => {
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        const data = await getPostDetail(item.postId);
        if (!cancelled) {
          setPost(data);
          setError(null);
        }
      } catch (e) {
        if (!cancelled) setError(e);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [item.postId]);

  if (loading) return <li className="py-2 text-muted">Loading...</li>;
  if (error || !post || post.status !== "Published") return null;

  const to = generatePath(PATHS.POST_DETAIL, { id: post.id });
  const viewedAt = (() => {
    try { return new Date(item.viewDate).toLocaleString(); } catch { return item.viewDate; }
  })();

  return (
    <li className="py-2 border-bottom d-flex justify-content-between align-items-center">
      <div>
        <Link to={to} className="fw-semibold text-decoration-none">{post.title}</Link>
        <div className="small text-muted">Viewed: {viewedAt}</div>
        {(item.searchTerms?.length > 0) && (
          <div className="mt-1 d-flex gap-1 flex-wrap">
            {item.searchTerms.map((t, idx) => (
              <span key={idx} className="badge text-bg-light border">{t}</span>
            ))}
          </div>
        )}
      </div>
      <button className="btn btn-sm btn-link text-danger" onClick={() => onDelete(item.historyId)}>
        Remove
      </button>
    </li>
  );
};

export default HistoryItem;

