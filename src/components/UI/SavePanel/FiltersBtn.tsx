import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';
import FinanceHelpers from '../../Finance/FinanceHelpers';
import Bank from '../../Finance/Bank';

interface IFiltersBtnProps {
  updated: boolean,
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IFiltersBtnState {
  dropdownOpen: boolean
}

export default class FiltersBtn extends Component<IFiltersBtnProps, IFiltersBtnState> {
  constructor(props: IFiltersBtnProps) {
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
    const {updated, bank} = this.props;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color={updated ? 'warning' : 'light'}>
          <i className="fa fa-columns"></i>
        </DropdownToggle>
        <DropdownMenu>
          {bank.savingsInputs(false).filter(header => header.type!=='TTT').map((header, key) => (
            <ClickableItem key={key} header={header} {...this.props} />
          ))}
          {/* <DropdownItem divider />
          <ClickableItem header={{id: 'total', type:'T'}} bank={bank} /> */}
        </DropdownMenu>
      </Dropdown>
    );
  }
}

interface IClickableItemProps {
  header: {id: string, type: string},
  bank: Bank,
  callback: (index: string, indexes: string[], amount: any, updatedState: boolean) => void
}

interface IClickableItemState {
  header_label: string,
  hidden: boolean
}

class ClickableItem extends Component<IClickableItemProps, IClickableItemState> {
  constructor(props: IClickableItemProps) {
    super(props);
    
    let hl = '';
    if (props.header.id === 'total') {
      hl = 'Totals';
    } else {
      const h = _(props.bank.savingsHeaders).keyBy('id').get([props.header.id], 'N/A');

      let header_label = h.label || 'N/A';
      if (h.sublabel) header_label += ' > ' + h.sublabel;
      if (h.interest) header_label += ' > ' + FinanceHelpers.labelSavings(props.header.type);

      hl = header_label;
    }

    this.state = {
      header_label: hl,
      hidden: _.get(props.bank, ['savingsHeadersHidden', this.props.header.id, this.props.header.type], false)
    };

    this.clickColumn = this.clickColumn.bind(this);
  }

  clickColumn () {
    this.props.callback('savingsHeadersHidden', [this.props.header.id, this.props.header.type], !this.state.hidden, false);
    this.setState({hidden: !this.state.hidden});
  }

  render() {
    return (
      <DropdownItem toggle={false} onClick={this.clickColumn} className={this.state.hidden ? 'text-muted' : ''}>
        <i className={`fa mr-2 ${this.state.hidden ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        {this.state.header_label}
      </DropdownItem>
    );
  }
}
