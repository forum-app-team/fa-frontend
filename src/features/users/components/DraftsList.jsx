import { useGetDraftsQuery } from "@/features/users/store/users.slice";

const DraftsList = () => {
  const { data: drafts, isLoading, isError, refetch } = useGetDraftsQuery();

  return (
    <section className="card mb-3">
      <div className="card-body">
        <h2 className="h5 mb-3">Drafts</h2>
        {isLoading ? (
          <div className="placeholder-glow">
            <span className="placeholder col-6"></span>
            <span className="placeholder col-4"></span>
            <span className="placeholder col-8"></span>
          </div>
        ) : isError ? (
          <div className="alert alert-danger">
            Error loading drafts.{" "}
            <button className="btn btn-sm btn-danger ms-2" onClick={refetch}>
              Retry
            </button>
          </div>
        ) : (
          <ul className="list-group list-group-flush">
            {drafts && drafts.length > 0 ? (
              drafts.map((draft) => (
                <li
                  key={draft.id}
                  className="list-group-item d-flex justify-content-between align-items-center"
                >
                  <span className="fw-medium">{draft.title}</span>
                  <span className="badge bg-secondary">
                    Last updated: {" "}
                    {draft.updatedAt ? new Date(draft.updatedAt).toLocaleDateString() : "-"}
                  </span>
                </li>
              ))
            ) : (
              <li className="list-group-item text-muted">No drafts found.</li>
            )}
          </ul>
        )}
      </div>
    </section>
  );
};

export default DraftsList;
