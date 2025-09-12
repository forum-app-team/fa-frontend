import { useEffect, useState } from 'react';
import { useListUsersQuery } from '../users.api';
import UsersTable from '../components/UsersTable';
import { useSelector } from 'react-redux';


const UserManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const [ page, setPage ] = useState(1);
  const [ pageSize, setPageSize ] = useState(20);
  const { data, isFetching, isError } = useListUsersQuery({
    offset: (page - 1) * pageSize,
    limit: pageSize,
  });

  const total = data?.totalCount ?? 0;
  const pageCount = Math.max(1, Math.ceil(total / pageSize));

  const handleToggle = (u) => {
    // dispatch(toggleUserStatus(u.id))
    console.log('toggle user status', u.id);
  };
  return (
    <>
      <h1>User Management</h1>
      {isFetching && <small>Loading...</small>}
      {isError && <small>Failed to load.</small>}
      <UsersTable users={data?.users} onToggleStatus={handleToggle} isSuper={user.role === 'super'}/>
    </>
  );
};

export default UserManagement;
