import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  Container, Row, Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Nav,
  Navbar,
  NavbarBrand,
  NavbarToggler,
  NavItem,
  NavLink,
  UncontrolledDropdown
} from 'reactstrap';

import * as ROUTES from '../../constants/routes';
import { AuthUserContext } from '../UserSession/Session';
import { SignOutLink } from '../UserSession/SignOut'; 


class NavigationAuth extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    const {authUser} = this.props,
      currentYear = new Date().getFullYear(),
      currentMonth = new Date().getMonth() + 1,
      route = ROUTES.MONTH.replace(':year', currentYear).replace(':month', currentMonth);

    return (
      <Container>
        <Row>
          <Col>
            <Navbar light expand="md">
              <NavbarBrand href={ROUTES.DASHBOARD}>FiReCalc</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav navbar>
                  <NavItem>
                    <NavLink href={route}>Month</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.REVENUES}>Revenues</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.SAVINGS}>Savings</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.HEADERS}>Settings</NavLink>
                  </NavItem>
                  <NavItem>
                    <NavLink href={ROUTES.ADMIN}>Admin</NavLink>
                  </NavItem>
                </Nav> 
                <Nav className="ml-auto" navbar>
                  <UncontrolledDropdown nav inNavbar>
                    <DropdownToggle nav caret>{authUser.email}</DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem tag="a" href={ROUTES.ACCOUNT} >Account</DropdownItem>
                      <DropdownItem divider />
                      <DropdownItem>
                        <SignOutLink />
                      </DropdownItem>
                    </DropdownMenu> 
                  </UncontrolledDropdown> 
                </Nav>
              </Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    );
  }
}

class NavigationNonAuth extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      isOpen: false
    };
  }

  toggle() {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render () {
    return (
      <Container>
        <Row>
          <Col>
            <Navbar light expand="md">
              <NavbarBrand href={ROUTES.HOME}>FiReCalc</NavbarBrand>
              <NavbarToggler onClick={this.toggle} />
              <Collapse isOpen={this.state.isOpen} navbar>
                <Nav className="ml-auto" navbar>
                  <NavItem>
                    <NavLink href={ROUTES.SIGN_IN}>Sign In</NavLink>
                  </NavItem>
                </Nav>
              </Collapse>
            </Navbar>
          </Col>
        </Row>
      </Container>
    );
  }
}

class Navigation extends Component {
  render () {
    return (
      <div>
       <AuthUserContext.Consumer>
         {(authUser) => authUser ? <NavigationAuth authUser={authUser} /> : <NavigationNonAuth />}
       </AuthUserContext.Consumer>
     </div>
    );
  }
}

export default withRouter(Navigation);