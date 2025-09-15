import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { listPublishedPosts } from "@/features/posts/api/posts.api";
import { PATHS } from "@/app/config/paths";

const UserHomePage = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState(null);

  const load = async () => {
    try {
      setError(null);
      const data = await listPublishedPosts();
      setPosts(data);
    } catch (e) {
      setError(e?.response?.data?.message || "Failed to load posts");
    }
  };

  useEffect(() => { load(); }, []);

  return (
      <div className="container">
        <div className="">
          <h2>Published Posts</h2>
          <button
              className="btn btn-primary"
              onClick={() => navigate(PATHS.POST_NEW)}
          >
            New Post
          </button>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <ul className="list-group">
          {posts.map((post) => (
              <li key={post.id} className="list-group-item">
                <div>
                  <div className="fw-semibold">{post.title}</div>
                  <div className="text-muted small">
                    {new Date(post.postDate || post.createdAt).toLocaleString()}
                    {post.lastEditedAt && (
                        <> Last edited: {new Date(post.lastEditedAt).toLocaleString()}</>
                    )}
                  </div>
                </div>
                <Link className="btn btn-outline-secondary" to={`/posts/${post.id}`}>Open</Link>
              </li>
          ))}
        </ul>
      </div>
  );
};

export default UserHomePage;
