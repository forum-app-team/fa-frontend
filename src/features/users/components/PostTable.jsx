import { Table } from "react-bootstrap";
import { Link, useNavigate } from "react-router-dom";
import { useMemo } from "react";

export default function PostTable({ posts = [], isAdmin }) {
  const fmt = useMemo(
    () => new Intl.DateTimeFormat(undefined, { year: "numeric", month: "short", day: "2-digit" }),
    []
  );
  return (
    <Table hover responsive="sm" size="sm" className="align-middle">
      <thead className="text-muted">
        <tr>
          <th style={{width: "55%"}}>Title</th>
          <th style={{width: "25%"}}>User</th>
          <th style={{width: "20%"}}>Date</th>
        </tr>
      </thead>
      <tbody>
        {posts.map(post => (
          <tr key={post.id}>
            <td className="text-truncate">
              <Link to={`/posts/${post.id}`} className="text-decoration-none">{post.title}</Link>
            </td>
            <td className="text-truncate">{post.author}</td>
            <td className="text-end">{fmt.format(new Date(post.createdAt))}</td>
          </tr>
        ))}
      </tbody>
    </Table>
  )
}