import { Alert, Badge, Button, Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";

export default function PostTable({ posts = [], isAdmin, status = 'Published', onActionTriggered }) {
  if (!posts.length)
    return <Alert variant="light" className="border">No posts found.</Alert>;

  const buttons = { Published: 'Ban', Banned: 'Unban', Deleted: 'Recover' };
  return (
    <Table hover responsive="sm" size="sm" className="align-middle">
      <thead className="text-muted">
        <tr>
          <th style={{width: "55%"}}>Title</th>
          <th style={{width: "25%"}}>User</th>
          {isAdmin ?
            <>
              <th style={{width: "15%"}}>Date</th>
              <th style={{width: "5%"}}>Action</th>
            </> :
            <th style={{width: "20%"}}>Date</th>
          }
        </tr>
      </thead>
      <tbody>
        {posts.map(post => (
          <tr key={post.id}>
            <td className="text-truncate text-start">
              <Badge bg='info' className="me-2">{post.replyCount}</Badge>
              <Link to={`/posts/${post.id}`} className="text-decoration-none link-secondary">{post.title}</Link>
            </td>
            <td className="text-truncate">
              <Link to={`/users/${post.author?.id}/profile`} className="text-decoration-none link-secondary">{post.author?.name}</Link>
            </td>
            <td className="text-end">{new Date(post.createdAt).toLocaleString()}</td>
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