import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { Container, Row, Col, InputGroup, Form, Button, Spinner, Alert, Nav } from "react-bootstrap";
import { Dropdown, SplitButton } from "react-bootstrap";
import * as Icon from 'react-bootstrap-icons';

import PostTable from "../components/PostTable";
import { usePagination } from "@/hooks/usePagination";
import PaginationComponent from "@/components/Pagination";
import { useLazyListPostsQuery, useBanPostMutation, useUnbanPostMutation, useRecoverPostMutation } from "../../admin/posts.api";
import ConfirmationPopup from "../../admin/components/ConfirmationPopup";

export default function UserHomePage({isAdmin}) {/*
  const navigate = useNavigate();
  const myUserId = useSelector((s) => s.auth?.user?.id);

  const [posts, setPosts] = useState([]);
  const [names, setNames] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const pending = useRef(new Set());
  const guard = (action, id) => {
    const key = `${action}:${id}`;
    if (pending.current.has(key)) return true;
    pending.current.add(key);
    return false;
  };
  const release = (action, id) => pending.current.delete(`${action}:${id}`);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        setError(null);
        setLoading(true);
        const data = await listPublishedPosts();
        if (!mounted) return;
        setPosts(data || []);

        const ids = Array.from(new Set((data || []).map(p => p.userId).filter(Boolean)));
        const map = ids.length ? await getPublicUsers(ids) : {};
        if (!mounted) return;
        setNames(map || {});
      } catch (e) {
        setError(e?.response?.data?.message || e.message || "Failed to load posts");
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  const rows = useMemo(() => {
    return posts.map(p => ({
      ...p,
      email: names[p.userId] || "unknown@user",
      when: new Date(p.postDate || p.createdAt).toLocaleString(),
      isOwner: myUserId && p.userId === myUserId,
      archived: typeof p.isArchived === "boolean" ? p.isArchived : !!p._archived,
    }));
  }, [posts, names, myUserId]);

  const doHide = async (id) => {
    if (!window.confirm("Hide this post? It will no longer appear as published.")) return;
    if (guard("hide", id)) return;
    try {
      await hidePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to hide post");
    } finally {
      release("hide", id);
    }
  };

  const doToggleArchive = async (post) => {
    const { id, archived } = post;
    if (guard("archive", id)) return;

    // Optimistic flip: update immediately
    setPosts(prev => prev.map(p => (
        p.id === id ? { ...p, isArchived: !archived, _archived: !archived } : p
    )));

    try {
      if (archived) {
        await unarchivePost(id);
      } else {
        await archivePost(id);
      }
    } catch (e) {
      // Revert on failure
      setPosts(prev => prev.map(p => (
          p.id === id ? { ...p, isArchived: archived, _archived: archived } : p
      )));
      alert(e?.response?.data?.message || e.message || "Failed to toggle archive");
    } finally {
      release("archive", id);
    }
  };

  const doDelete = async (id) => {
    if (!window.confirm("Delete this post?")) return;
    if (guard("delete", id)) return;
    try {
      await deletePost(id);
      setPosts(prev => prev.filter(p => p.id !== id));
    } catch (e) {
      alert(e?.response?.data?.message || e.message || "Failed to delete post");
    } finally {
      release("delete", id);
    }
  };

  if (loading) return <div className="container py-4">Loading…</div>;
  if (error) return <div className="container py-4"><div className="alert alert-danger">{error}</div></div>;

  return (
      <div className="container py-4">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <h2 className="mb-0">Published Posts</h2>
          <button className="btn btn-primary" onClick={() => navigate(PATHS.POST_NEW)}>
            New Post
          </button>
        </div>

        {!rows.length && <div className="text-muted">No posts yet.</div>}

        <ul className="list-unstyled m-0 p-0">
          {rows.map(p => (
              <li key={p.id} className="d-flex justify-content-between align-items-center py-3 border-bottom">
                <div className="flex-grow-1 text-start">
                  <Link
                      to={resolvePath(PATHS.POST_DETAIL, { id: p.id })}
                      className="fw-semibold fs-5 text-decoration-none d-block m-0"
                  >
                    {p.title}
                  </Link>

                  <div className="text-muted small mb-1">
                    {p.email} • {p.when}{p.archived ? " • (archived)" : ""}
                  </div>
                </div>

                <div className="d-flex gap-2">
                  {p.isOwner ? (
                      <>
                        <button
                            className="btn btn-sm btn-warning"
                            onClick={() => doHide(p.id)}
                            title="Hide (Published → Hidden)"
                        >
                          Hide
                        </button>

                        <button
                            className="btn btn-sm btn-secondary"
                            onClick={() => navigate(resolvePath(PATHS.POST_EDIT, { id: p.id }))}
                            title="Edit"
                        >
                          Edit
                        </button>

                        <button
                            className="btn btn-sm btn-outline-dark"
                            onClick={() => doToggleArchive(p)}
                            title={p.archived ? "Unarchive (enable replies)" : "Archive (disable replies)"}
                        >
                          {p.archived ? "Unarchive" : "Archive"}
                        </button>

                        <button
                            className="btn btn-sm btn-danger"
                            onClick={() => doDelete(p.id)}
                            title="Delete (soft delete)"
                        >
                          Delete
                        </button>
                      </>
                  ) : null}
                </div>
              </li>
          ))}
        </ul>
      </div>
  );*/
  const [queryPosts, { data, error, isFetching, isError, reset }] = useLazyListPostsQuery();
  const { page, limit, offset, setPage, setLimit, next, prev, pageCountFrom } = usePagination();
  const pageCount = pageCountFrom(data?.total ?? 0);
  if (page > pageCount)
    setPage(pageCount);

  const qRef = useRef(null);
  const initState = {
    status: 'Published',
    field: 'title',
    sort: 'createdAt',
    ascending: false,
  };
  const [ postFilter, setPostFilter ] = useState(initState);
  const FIELD_OPTIONS = ['title', 'author'];

  const handleSearchFieldChange = (eventKey) => {
    if (eventKey === 'reset') {
      setPostFilter(() => ({...initState}));
      qRef.current.value = "";
      queryPosts({limit});
    } else
      setPostFilter((state) => ({...state, field: eventKey}));
  };

  const handleSearch = (event) => {
    event.preventDefault();
    queryPosts({
      ...postFilter,
      q: qRef.current.value,
      limit, offset,
    });
  };

  // perform actions
  const [ showPopup, setShowPopup ] = useState(false);
  const [ popupTitle, setPopupTitle ] = useState('');
  const [ popupContent, setPopupContent ] = useState('');
  const popupHandlerRef = useRef(() => {});
  const [ banPost, {} ] = useBanPostMutation();
  const [ unbanPost, {} ] = useUnbanPostMutation();
  const [ recoverPost, {} ] = useRecoverPostMutation();
  const handleAction = (post) => {
    const { id, action, title } = post;
    setShowPopup(true);
    setPopupTitle(`Are you sure to ${action} this post?`);
    setPopupContent(title);
    if (action === 'ban') {
      popupHandlerRef.current = async () => await banPost(id);
    } else if (action === 'unban') {
      popupHandlerRef.current = async () => await unbanPost(id);
    } else if (action === 'recover') {
      popupHandlerRef.current = async () => await recoverPost(id);
    }
  };

  // load posts
  useEffect(() => {
    reset();
    const req = queryPosts({
      ...postFilter,
      q: qRef.current.value,
      limit, offset,
    });
    return () => req.abort();
  }, [queryPosts, postFilter.status, postFilter.sort, postFilter.ascending, limit, offset]);

  return (
    <Container fluid="md" className="py-3">
      <h2 className="mb-3">{postFilter.status} Posts</h2>
      {isAdmin &&
        <Nav variant="tabs" className="mb-3" activeKey={postFilter.status} onSelect={
          (key) => setPostFilter((state) => (isAdmin ? {...initState, status: key} : state))
        }>
          <Nav.Item>
            <Nav.Link eventKey="Published">Published</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Banned">Banned</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="Deleted">Deleted</Nav.Link>
          </Nav.Item>
        </Nav>
      }

      <Row className="g-2 align-items-stretch mb-3">
        {/* Title/Author search */}
        <Col xs={12} md>
          <Form onSubmit={handleSearch}>
            <InputGroup>
              <SplitButton
                title={<Icon.Search/>}
                type="submit"
                variant="outline-primary"
                onSelect={handleSearchFieldChange}
              >
                {FIELD_OPTIONS.map((field) => 
                  <Dropdown.Item
                    className="text-capitalize"
                    key={field}
                    eventKey={field}
                    active={field === postFilter.field}
                  >
                    {field}
                  </Dropdown.Item>
                )}
                <Dropdown.Divider />
                <Dropdown.Item eventKey="reset" type="submit">Reset</Dropdown.Item>
              </SplitButton>
              <Form.Control
                ref={qRef}
                type="search"
                placeholder={`Search ${postFilter.field}…`}
                aria-label={`Search by ${postFilter.field}`}
              />
            </InputGroup>
          </Form>
        </Col>

        {/* Sort + order grouped tightly */}
        <Col xs="auto">
          <InputGroup>
            <Form.Select
              value={postFilter.sort}
              onChange={(e) => setPostFilter((state) => ({...state, sort: e.target.value}))}
              aria-label="Sort field"
              style={{ minWidth: 140 }}
            >
              <option value="createdAt">Created date</option>
              <option value="replyCount">Replies</option>
            </Form.Select>
            <Button
              variant="outline-secondary"
              onClick={() => setPostFilter((state) => ({...state, ascending: !state.ascending}))}
            >
              {postFilter.ascending ? <Icon.ArrowUp/> : <Icon.ArrowDown/>}
            </Button>
          </InputGroup>
        </Col>

        {/* Add Post button pinned right on md+; wraps on mobile */}
        <Col xs="auto" className="ms-md-auto">
          <Button as={Link} to="/posts/new">New Post</Button>
        </Col>
      </Row>

      {/* Content */}
      {isFetching ? (
        <div className="d-flex align-items-center gap-2">
          <Spinner size="sm" /> <span>Loading…</span>
        </div>
      ) : isError ? (
        <Alert variant="danger" className="border">{JSON.stringify(error)}</Alert>
      ) : <PostTable posts={data?.items} isAdmin={isAdmin} status={postFilter.status} onActionTriggered={handleAction}/>
      }

      <ConfirmationPopup
        show={showPopup}
        title={popupTitle}
        bodyContent={popupContent}
        onHide={() => setShowPopup(false)}
        handlerRef={popupHandlerRef}
      />

      {/* Pagination */}
      <PaginationComponent
        page={page}
        limit={limit}
        setPage={setPage}
        setLimit={setLimit}
        prev={prev}
        next={next}
        pageCount={pageCount}
      />

    </Container>
  );
}