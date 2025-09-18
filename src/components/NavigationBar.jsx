import Container from 'react-bootstrap/Container';
import { Link, NavLink, useNavigate, generatePath } from 'react-router-dom';
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import { useSelector, useDispatch } from 'react-redux';
import { PATHS } from '../app/config/paths';
import { logout } from '../features/auth/store/auth.slice';
import { logoutUser } from '../features/auth/api/auth.api';
import { isAxiosError } from 'axios';
import UserBadge from '../features/users/components/UserBadge';

export const NavigationBar = () => {
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      const response = await logoutUser();
      dispatch(logout(response));
    } catch (error) {
      if (isAxiosError(error) && error.status === 401)
        return;
    } finally {
      navigate(PATHS.ROOT);
    }
  };

  return (
    <Navbar bg="light" expand="lg" className="w-100" data-bs-theme="light">
      <Container fluid>
        <Navbar.Brand as={Link} to={PATHS.ROOT} className="fw-semibold">
          Forum App
        </Navbar.Brand>

        <Navbar.Toggle aria-controls="main-nav" />
        <Navbar.Collapse id="main-nav">
          <Nav className="ms-auto align-items-center">
            {/* Admin/privileged links */}
            {user?.role !== 'normal' && user ? (
              <>
                <Nav.Link as={NavLink} to={PATHS.MESSAGES}>Messages</Nav.Link>
                <Nav.Link as={NavLink} to={PATHS.USERS} end>Users</Nav.Link>
              </>
            ) : null}

            <Nav.Link as={NavLink} to={PATHS.CONTACT_US}>Contact Admin</Nav.Link>

            {/* Auth-dependent links */}
            {!user ? (
              <>
                <Nav.Link as={NavLink} to={PATHS.LOGIN} end>Login</Nav.Link>
                <Nav.Link as={NavLink} to={PATHS.REGISTER} end>Register</Nav.Link>
              </>
            ) : (
              <>
                <Nav.Link as={NavLink} to={generatePath(PATHS.PROFILE, {id: user.id ?? 0})}>
                  <UserBadge userId={user.id}/>
                </Nav.Link>
                <Nav.Link onClick={handleLogout}>Logout</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};
