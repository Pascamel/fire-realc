import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';


class ButtonColumnsFilter extends Component {
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false
    };
  }

  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }))
  }

  render () {
    const {updated} = this.props;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color={updated ? 'warning' : 'light'}>
          <i className="fa fa-columns"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem disabled={false}>Some Action</DropdownItem>
          <DropdownItem disabled={true}>Action (disabled)</DropdownItem>
        </DropdownMenu>
      </Dropdown>
    );
  }
}

export default ButtonColumnsFilter;
