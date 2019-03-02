import React, { Component } from 'react';
import { ButtonDropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import Bank from '../../Finance/Bank';

interface IDecimalsBtnProps {
  updated: boolean, 
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IDecimalsBtnState {
  dropdownOpen: boolean
}

export default class ButtonDecimals extends Component<IDecimalsBtnProps, IDecimalsBtnState> {
  constructor(props: IDecimalsBtnProps) {
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

  clickDecimal(decimal: boolean) {
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
          <DropdownItem disabled={bank.showDecimals} onClick={() => this.clickDecimal(true)}>Decimals</DropdownItem>
          <DropdownItem disabled={!bank.showDecimals} onClick={() => this.clickDecimal(false)}>Rounded</DropdownItem>
        </DropdownMenu>
      </ButtonDropdown>
    );
  }
}
