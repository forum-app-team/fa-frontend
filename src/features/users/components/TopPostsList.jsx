import { useGetTopPostsQuery } from "@/features/users/store/users.slice";

const TopPostsList = () => {
  const { data: posts, isLoading, isError, refetch } = useGetTopPostsQuery(3);

  return (
    <section className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">Top Posts</h2>
        {isLoading ? (
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-8"></span>
          </div>
        ) : isError ? (
          <div className="alert alert-danger">
            Error loading top posts.{" "}
            <button className="btn btn-sm btn-danger ms-2" onClick={refetch}>
              Retry
            </button>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {posts && posts.length > 0 ? (
              posts.map((post) => (
                <li
                  key={post.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className="fw-medium">{post.title}</span>
                  <span className="badge bg-primary">
                    {typeof post.repliesCount === "number"
                      ? post.repliesCount
                      : 0}{" "}
                    replies
                  </span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No posts found.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

export default TopPostsList;
