import { useRef, useState } from 'react';
import { useSelector } from 'react-redux';
import { Container } from 'react-bootstrap';
import { useListUsersQuery, useUpdateUserStatusMutation, useUpdateUserRolesMutation } from '../users.api';
import UsersTable from '../components/UsersTable';
import ConfirmationPopup from '../components/ConfirmationPopup';
import { usePagination } from "@/hooks/usePagination";
import PaginationComponent from "@/components/Pagination";


const UserManagement = () => {
  const user = useSelector((state) => state.auth.user);
  const { page, limit, offset, setPage, setLimit, next, prev, pageCountFrom } = usePagination();
  const { data, isFetching, isError } = useListUsersQuery({ offset, limit });
  const pageCount = pageCountFrom(data?.totalCount ?? 0);
  if (page > pageCount)
    setPage(pageCount);

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
    <Container fluid="md" className="py-3">
      <h2 className="mb-3">User Management</h2>
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
};

export default UserManagement;
