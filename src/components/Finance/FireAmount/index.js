import React, { Component } from 'react';
import _ from 'lodash';

import Display from '../../UI/Display';
import keydown, { Keys, keydownScoped } from 'react-keydown';

const { ENTER, ESC } = Keys;

@keydownScoped(ENTER, ESC)
class FireAmount extends Component {
  constructor(props) {
    super(props);

    this.indexes = props['callback-props'];
    this.index = this.indexes.shift();
    this.readonly = _.last(this.indexes) === 'T';

    this.state = {
      edit: false, 
      amount: props.amount,
      inputValue: props.amount
    };
  }

  setEditMode = () => {
    if (this.readonly) return;
    this.setState({edit: true, amount: this.props.amount });
  }

  onChange(e) {
    this.setState({inputValue: e.target.value})
  }

  confirmEdit = () => {
    this.setState({edit: false, amount: this.state.inputValue});
    this.props.callback(this.index, this.indexes, parseFloat(this.state.inputValue) || 0);
  }

  cancelEdit = () => {
    this.setState({edit: false});
  }

  handleKeyUp = (event) => {
    if (event.key === 'Enter' && this.state.edit) this.confirmEdit();
    if (event.key === 'Escape' && this.state.edit) this.cancelEdit();
  }

  @keydown(ENTER, ESC)
  handleKeyDown (event) {
    if (event.which === ENTER && this.state.edit) this.confirmEdit();
    if (event.which === ESC && this.state.edit) this.cancelEdit();
  }

  render() {
    const { edit } = this.state;

    return (
      <div className="amount-container" onKeyDown={this.handleKeyDown}>
        {!edit && <span className="amount" onClick={this.setEditMode}>{ Display.amount(this.props.amount) }</span>}
        {edit && <input ref={(input) => {if (input != null) input.focus();}}
                        defaultValue={this.state.amount} 
                        onChange={(value) => this.onChange(value)} 
                        onKeyUp={this.handleKeyUp}  />}
        {edit && <span onClick={this.saveEdit}><i className="fa fa-check"></i></span>}
        {edit && <span onClick={this.cancelEdit}><i className="fa fa-times"></i></span>}
      </div>
    );
  }
}

export default FireAmount;