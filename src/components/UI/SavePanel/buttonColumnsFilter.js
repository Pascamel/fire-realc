import React, { Component } from 'react';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem } from 'reactstrap';
import _ from 'lodash';
import FinanceHelpers from '../../Finance/FinanceHelpers';

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
    const {updated, bank} = this.props;

    return (
      <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
        <DropdownToggle color={updated ? 'warning' : 'light'}>
          <i className="fa fa-columns"></i>
        </DropdownToggle>
        <DropdownMenu>
          {bank.savingsInputs.filter(header => header.type!=='TTT').map((header, key) => (
            <ClickableItem key={key} header={header} {...this.props} />
          ))}
          <DropdownItem divider />
          <ClickableItem header={{id: 'total', type:'T'}} bank={bank} />
        </DropdownMenu>
      </Dropdown>
    );
  }
}

class ClickableItem extends Component {
  constructor(props) {
    super(props);

    this.state = {hidden: _.get(props.bank, ['savingsHeadersHidden', this.props.header.id, this.props.header.type], false)};

    if (props.header.id === 'total') {
      this.state.header_label = 'Totals';
    } else {
      const h = _(props.bank.savingsHeaders).keyBy('id').get([props.header.id], 'N/A');

      let header_label = h.label || 'N/A';
      if (h.sublabel) header_label += ' > ' + h.sublabel;
      if (h.interest) header_label += ' > ' + FinanceHelpers.labelSavings(props.header.type);

      this.state.header_label = header_label;
    }
  }

  clickColumn () {
    this.setState({hidden: !this.state.hidden});
    this.props.callback('savingsHeadersHidden', [this.props.header.id, this.props.header.type], true, false);
  }

  render() {
    const {header} = this.props;

    return (
      <DropdownItem onClick={this.clickColumn} className={this.state.hidden ? 'text-muted' : ''}>
        <i className={`fa mr-2 ${this.state.hidden ? 'fa-eye-slash' : 'fa-eye'}`}></i>
        {this.state.header_label}
      </DropdownItem>
    );
  }
}

export default ButtonColumnsFilter;
