import { useRef, useState } from 'react';
import { useListUsersQuery, useUpdateUserStatusMutation, useUpdateUserRolesMutation } from '../users.api';
import UsersTable from '../components/UsersTable';
import ConfirmationPopup from '../components/ConfirmationPopup';
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

  const [ showPopup, setShowPopup ] = useState(false);
  const [ popupContent, setPopupContent ] = useState('');
  const popupHandlerRef = useRef(() => {});
  const [ updateUserStatus, {} ] = useUpdateUserStatusMutation();
  const [ updateUserRoles, {} ] = useUpdateUserRolesMutation();
  const handleToggleState = (u) => {
    const { id, email, role, isActive } = u;
    setShowPopup(true);
    if (role) {
      const newRole = role === 'admin' ? 'normal' : 'admin';
      setPopupContent(`Are you sure you want to change the role of User ${email} to ${newRole}?`);
      popupHandlerRef.current = async () => await updateUserRoles([{id, role: newRole}]);
    } else {
      setPopupContent(`Are you sure you want to ${isActive ? '' : 'un'}ban User ${email}?`);
      popupHandlerRef.current = async () => await updateUserStatus([{id, active: !isActive}]);
    }
  };

  return (
    <>
      <h1>User Management</h1>
      {isFetching && <small>Loading...</small>}
      {isError && <small>Failed to load.</small>}
      <UsersTable 
        users={data?.users}
        onToggleState={handleToggleState}
        isSuper={user.role === 'super'}
      />
      <ConfirmationPopup
        show={showPopup}
        bodyContent={popupContent}
        onHide={() => setShowPopup(false)}
        handlerRef={popupHandlerRef}
      />
    </>
  );
};

export default UserManagement;
