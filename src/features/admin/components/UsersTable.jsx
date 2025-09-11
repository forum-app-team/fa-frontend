// components/UsersTable.jsx
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import { Link, generatePath } from 'react-router-dom';
import { PATHS } from '@/app/config/paths';

export default function UsersTable({ users = [], onToggleStatus }) {
  const fmt = (iso) => (iso ? new Date(iso).toLocaleDateString() : '');

  if (!users.length) {
    return <p className="text-muted m-3">No users found.</p>;
  }

  return (
    <Table striped hover responsive="md" className="align-middle">
      <thead>
        <tr>
          <th>User ID</th>
          <th>Full Name</th>
          <th>Email</th>
          <th>Date Joined</th>
          <th>Type</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {users.map((u) => (
          <tr key={u.id}>
            <td>
              <Link to={generatePath(PATHS.PROFILE, { id: u.id })}>
                {u.id}
              </Link>
            </td>
            <td>{[u.firstName, u.lastName].filter(Boolean).join(' ')}</td>
            <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
            <td>{fmt(u.dateJoined)}</td>
            <td className="text-capitalize">{u.type}</td>
            <td>
              <Button
                size="sm"
                variant={u.active ? 'success' : 'outline-danger'}
                onClick={() => onToggleStatus?.(u)}
              >
                {u.active ? 'Active' : 'Banned'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
