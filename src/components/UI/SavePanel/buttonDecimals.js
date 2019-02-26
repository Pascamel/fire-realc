import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';

class ButtonDecimals extends Component {
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

  clickDecimal(decimal) {
    this.props.callback('showDecimals', [], decimal, false);
  }

  render () {
    const {updated, bank} = this.props;

    return (
      <ButtonDropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color={updated ? 'warning' : 'light'}>
          <i className="fa fa-university"></i>
        </DropdownToggle>
        <DropdownMenu>
          <DropdownItem disabled={bank.showDecimals} onClick={e => this.clickDecimal(true)}>Decimals</DropdownItem>
          <DropdownItem disabled={!bank.showDecimals} onClick={e => this.clickDecimal(false)}>Rounded</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}

export default ButtonDecimals;
