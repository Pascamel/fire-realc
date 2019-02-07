import React, { Component } from 'react';
import keydown, { Keys, keydownScoped } from 'react-keydown';

const { ENTER, ESC } = Keys;

@keydownScoped(ENTER, ESC)
class FireAmount extends Component {
  constructor(props) {
    super(props);

    this.state = {
      edit: false, 
      amount: props.amount, 
      editAmount: props.amount,
      inputValue: props.amount
    };
  }

  setEditMode = () => {
    this.setState({edit: true, editAmount: this.state.amount });
  }

  onChange(e) {
    this.setState({inputValue: e.target.value})
  }

  saveEdit = () => {
    this.setState({edit: false, amount: this.state.inputValue});
  }

  cancelEdit = () => {
    this.setState({edit: false});
  }

  @keydown(ENTER, ESC)
  handleKeyDown (event) {
    if (event.which === ENTER && this.state.edit) this.saveEdit();
    if (event.which === ESC && this.state.edit) this.cancelEdit();
  }

  render() {
    const { edit } = this.state;

    return (
      <div>
      {!edit && <span onClick={this.setEditMode}>{this.state.amount}</span>}
      {edit && <input defaultValue={this.state.editAmount} onChange={(value) => this.onChange(value)} onKeyDown={ this.handleKeyDown } />}
      {edit && <span onClick={this.saveEdit}>save</span>}
      {edit && <span onClick={this.cancelEdit}>cancel</span>}
      </div>
    );
  }
}

export default FireAmount;