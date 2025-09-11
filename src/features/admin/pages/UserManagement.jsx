import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import UsersTable from '../components/UsersTable'

const demo = [
  { id: '1', firstName: 'Ada', lastName: 'Lovelace', email: 'ada@example.com', dateJoined: '2025-09-10', type: 'admin', active: true },
  { id: '2', firstName: 'Alan', lastName: 'Turing',  email: 'alan@example.com', dateJoined: '2025-09-09', type: 'normal', active: false },
];

const UserManagement = () => {
  const dispatch = useDispatch();
  useEffect(() => {
    //dispatch();
  }, [dispatch]);

  const handleToggle = (u) => {
    // dispatch(toggleUserStatus(u.id))
    console.log('toggle user status', u.id);
  };
  return (
    <>
      <h1>User Management</h1>
      <UsersTable users={demo} onToggleStatus={handleToggle}/>
    </>
  );
};

export default UserManagement;
