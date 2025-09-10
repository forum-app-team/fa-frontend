import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import { PATHS } from "../app/config/paths";

export const NavigationBar = () => {
  return (
    <Navbar expand="lg" className="w-full">
      <Container fluid className="px-4 py-2 flex justify-between items-center">
        <Navbar.Brand href={PATHS.ROOT} className="text-xl font-semibold">
          Forum App
        </Navbar.Brand>

        <Nav className="ml-auto">
          <Nav.Link href={PATHS.LOGIN}>Login</Nav.Link>
          <Nav.Link href={PATHS.REGISTER}>Register</Nav.Link>
          <Nav.Link href={PATHS.CONTACT_US}>Contact Admin</Nav.Link>
        </Nav>
      </Container>
    </Navbar>
  );
};
