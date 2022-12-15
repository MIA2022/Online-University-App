import React ,{useContext} from "react";
import "bootstrap/dist/css/bootstrap.css";
import {Nav, NavDropdown, Navbar} from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';

export default function NavigationBar() {
  let user=localStorage.getItem('user-info')
  const {state, dispatch}= useContext(UserContext)
  const RenderMenu=()=>{
    if(state||user){
      return(
        <>
          <NavDropdown title={user}>
              <NavDropdown.Item onClick={logout}>Logout</NavDropdown.Item>
          </NavDropdown>
        </>
      )
    }else{
      return(
        <>
          <Nav.Link href="/login">Login</Nav.Link>
        </>
      )
    }
  }
  const navigate=useNavigate();
  function logout(){
    dispatch({type:"USER", payload:false})
    localStorage.clear()
    navigate('/')
  }
  return (
    <Navbar sticky="top" collapseOnSelect expand="lg" variant="light" bg="light">
        {/* <Navbar.Brand href="/">Home</Navbar.Brand> */}
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/">Home</Nav.Link>
            <Nav.Link href="/search">News and Events</Nav.Link>
            <Nav.Link href="/course">Courses</Nav.Link>
          </Nav>
          <Nav>
            <RenderMenu/>
            <Nav.Link href="/profile">Profile</Nav.Link>
          </Nav>
        </Navbar.Collapse>
    </Navbar>
  );
}

