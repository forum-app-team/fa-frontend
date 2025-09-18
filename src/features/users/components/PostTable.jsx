import { Alert, Badge, Button, Stack, Table } from "react-bootstrap";
import { Link, generatePath } from "react-router-dom";
import { PATHS } from "@/app/config/paths";
import UserBadge from "./UserBadge";

export default function PostTable({ posts = [], isAdmin, status = 'Published', onActionTriggered }) {
  if (!posts.length)
    return <Alert variant="light" className="border">No posts found.</Alert>;

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : '');

  const buttons = { Published: 'Ban', Banned: 'Unban', Deleted: 'Recover' };
  return (
    <Table hover responsive="sm" size="sm" className="align-middle" style={{ tableLayout: 'fixed', width: '100%' }}>
      <thead className="text-muted">
        <tr>
          <th style={{width: "56%"}}>Title</th>
          <th style={{width: "20%"}}>User</th>
          {isAdmin ?
            <>
              <th style={{width: "16%"}}>Date</th>
              <th style={{width: "8%"}}>Action</th>
            </> :
            <th style={{width: "20%"}}>Date</th>
          }
        </tr>
      </thead>
      <tbody>
        {posts.map(post => (
          <tr key={post.id}>
            <td className="text-start">
              <Stack direction="horizontal" gap={2} className="align-items-center">
                <Badge bg='info' className="flex-shrink-0">{post.replyCount}</Badge>
                <Link
                  to={generatePath(PATHS.POST_DETAIL, { id: post.id })}
                  className="d-block flex-grow-1 text-truncate text-nowrap text-decoration-none link-secondary"
                  style={{ minWidth: 0, overflow: 'hidden' }}
                  title={post.title}
                >
                  {post.title}
                </Link>
              </Stack>
            </td>
            <td className="text-center">
              <Link to={generatePath(PATHS.PROFILE, { id: post.userId })}>
                <UserBadge userId={post.userId} className="d-inline-flex"/>
              </Link>
            </td>
            <td className="text-end text-truncate text-nowrap" title={fmt(post.createdAt)}>
              {fmt(post.createdAt)}
            </td>
            {isAdmin &&
              <td>
                <Button
                  size="sm"
                  variant={status === 'Published' ? 'danger': 'success'}
                  onClick={() => onActionTriggered({ ...post, action: buttons[status].toLowerCase() })}
                >{buttons[status]}</Button>
              </td>
            }
          </tr>
        ))}
      </tbody>
    </Table>
  )
}