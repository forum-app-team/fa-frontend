// components/UsersTable.jsx
import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { Link, generatePath } from 'react-router-dom';
import { PATHS } from '@/app/config/paths';

export default function UsersTable({ users = [], isSuper, onToggleStatus }) {
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
              <Link to={generatePath(PATHS.PROFILE, { id: u.id })} className={'font-monospace'}>
                {u.id}
              </Link>
            </td>
            <td>{[u.firstName, u.lastName].filter(Boolean).join(' ')}</td>
            <td><a href={`mailto:${u.email}`}>{u.email}</a></td>
            <td>{fmt(u.createdAt)}</td>
            {isSuper ?
              <td>
                <ToggleButton
                  id={`toggle-check-${u.id}`}
                  size="sm"
                  type="checkbox"
                  variant="outline-primary"
                  checked={u.role === 'admin'}
                  // TODO: onChange={(e) => setChecked(e.currentTarget.checked)}
                  className="text-capitalize"
                >{u.role}</ToggleButton>
              </td> :
              <td className="text-capitalize">{u.role}</td>
            }
            <td>
              <Button
                size="sm"
                variant={u.isActive ? 'danger' : 'outline-success'}
                onClick={() => onToggleStatus?.(u)}
                disabled={u.role === 'admin'}
              >
                {u.isActive ? 'Ban' : 'Unban'}
              </Button>
            </td>
          </tr>
        ))}
      </tbody>
    </Table>
  );
}
