import React from 'react';
import { Container, Nav, Navbar, Dropdown, Button } from 'react-bootstrap';

function HeaderNav({ isLoggedIn, handleLogout, handleChangePassword }) {
  return (
    <Navbar expand="lg" className="bg-body-tertiary" data-bs-theme="dark">
      <Container fluid>
        <Navbar.Brand href="#">Algoquant</Navbar.Brand>
        <Navbar.Toggle aria-controls="navbarScroll" />
        <Navbar.Collapse id="navbarScroll">
          <Nav
            className="me-auto my-2 my-lg-0"
            style={{ maxHeight: '100px' }}
            navbarScroll
          >
            <Nav.Link href="#action1">Link 1</Nav.Link>
            <Nav.Link href="#action2">Link 2</Nav.Link>
          </Nav>
          {isLoggedIn ? (
            <Dropdown style={{marginRight: "10%"}}>
              <Dropdown.Toggle variant="success" id="dropdown-basic">
                Devansh
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item onClick={handleChangePassword}>Change Password</Dropdown.Item>
                <Dropdown.Item onClick={handleLogout}>Logout</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>
          ) : (
            <Button variant="outline-success">Login</Button>
          )}
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
}

export default HeaderNav;
