import Table from 'react-bootstrap/Table';
import Button from 'react-bootstrap/Button';
import ToggleButton from 'react-bootstrap/ToggleButton';
import { Link, generatePath } from 'react-router-dom';
import { PATHS } from '@/app/config/paths';
import { Alert } from 'react-bootstrap';
import UserBadge from '../../users/components/UserBadge';
import { useGetProfileQuery } from '../../users/store/users.slice';

const UserRow = ({user, isSuper, onToggleState}) => {
  const { dateJoined, isLoading } = useGetProfileQuery(user.id, {
    selectFromResult: ({ data, isLoading }) => ({
      isLoading,
      dateJoined: data?.profile?.dateJoined,
    }),
  });

  const fmt = (iso) => (iso ? new Date(iso).toLocaleString() : '');

  return (
    <tr key={user.id}>
      <td>
        <Link to={generatePath(PATHS.PROFILE, { id: user.id })} className={'font-monospace text-truncate text-nowrap'}>
          {user.id}
        </Link>
      </td>
      <td className="text-center"><UserBadge userId={user.id} className="d-inline-flex" /></td>
      <td><a href={`mailto:${user.email}`}>{user.email}</a></td>
      <td>{fmt(dateJoined)}</td>
      {isSuper ?
        <td>
          <ToggleButton
            id={`toggle-check-${user.id}`}
            size="sm"
            type="checkbox"
            variant="outline-primary"
            checked={user.role === 'admin'}
            onChange={() => onToggleState({...user, isActive: undefined})}
            disabled={!user.isActive}
            className="text-capitalize"
          >{user.role}</ToggleButton>
        </td> :
        <td className="text-capitalize">{user.role}</td>
      }
      <td>
        <Button
          size="sm"
          variant={user.isActive ? 'danger' : 'outline-success'}
          onClick={() => onToggleState({...user, role: undefined})}
          disabled={user.role === 'admin'}
        >
          {user.isActive ? 'Ban' : 'Unban'}
        </Button>
      </td>
    </tr>
  );
};

export default function UsersTable({ users = [], isSuper, onToggleState }) {

  if (!users.length) {
    return <Alert variant="light" className="border">No users found.</Alert>;
  }

  return (
    <Table striped hover responsive="sm" className="align-middle">
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
        {users.map((user) => <UserRow user={user} isSuper={isSuper} onToggleState={onToggleState}/>)}
      </tbody>
    </Table>
  );
}
