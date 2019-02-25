import React, { Component } from 'react';
import _ from 'lodash';

import Display from '../../UI/Display';
import keydown, { Keys, keydownScoped } from 'react-keydown';

const { ENTER, ESC } = Keys;

@keydownScoped(ENTER, ESC)
class FireAmount extends Component {
  constructor(props) {
    super(props);
    
    this.state = {
      readonly: _.last(this.indexes) === 'T',
      extraClassName: props.extraClassName || '',
      edit: false, 
      amount: props.amount,
      inputValue: props.amount,
      displayIfZero: props['display-if-zero'] || false,
      showDecimals: props['display-decimals'] || false
    };
  }

  setEditMode = () => {
    if (this.state.readonly) return;
    this.setState({edit: true, amount: this.props.amount });
  }

  onChange(e) {
    this.setState({inputValue: e.target.value})
  }

  confirmEdit = () => {
    this.setState({
      edit: false, amount: 
      this.state.inputValue
    });

    let indexes = this.props['callback-props'];
    let index = indexes.shift();

    this.props.callback(index, indexes, parseFloat(this.state.inputValue) || 0);
  }

  cancelEdit = () => {
    this.setState({edit: false});
  }

  handleKeyUp = (event) => {
    if (!this.state.edit) return;

    if (event.key === 'Enter') this.confirmEdit();
    if (event.key === 'Escape') this.cancelEdit();
  }

  @keydown(ENTER, ESC)
  handleKeyDown (event) {
    if (!this.state.edit) return;

    if (event.which === ENTER) this.confirmEdit();
    if (event.which === ESC) this.cancelEdit();
  }

  render() {
    const { readonly, edit, extraClassName, displayIfZero, showDecimals } = this.state;

    return (
      <div className={`amount-container ${readonly ? 'read-only' : ''} ${extraClassName}`} onKeyDown={this.handleKeyDown}>
        {!edit && <span className="amount" onClick={this.setEditMode}>
          { Display.amount(this.props.amount, displayIfZero, showDecimals) }
        </span>}
        {edit && <input ref={(input) => {if (input != null) input.focus();}}
                        className="form-control"
                        defaultValue={this.state.amount} 
                        onChange={(value) => this.onChange(value)} 
                        onKeyUp={this.handleKeyUp}  />}
        {/* {edit && <span onClick={this.saveEdit}><i className="fa fa-check"></i></span>} */}
        {/* {edit && <span onClick={this.cancelEdit}><i className="fa fa-times"></i></span>} */}
      </div>
    );
  }
}

export default FireAmount;