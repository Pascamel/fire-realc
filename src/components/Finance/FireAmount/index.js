import React, { Component } from 'react';
import Display from '../../UI/Display';
import keydown, { Keys, keydownScoped } from 'react-keydown';

const { ENTER, ESC } = Keys;

@keydownScoped(ENTER, ESC)
class FireAmount extends Component {
  constructor(props) {
    super(props);

    this.indexes = props['callback-props'];
    this.index = this.indexes.shift();

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
    this.props.callback(this.index, this.indexes, parseFloat(this.state.inputValue) || 0);
  }

  cancelEdit = () => {
    this.setState({edit: false});
  }

  handleKeyUp = (event) => {
    if (event.key === 'Enter' && this.state.edit) this.saveEdit();
    if (event.key === 'Escape' && this.state.edit) this.cancelEdit();
  }

  @keydown(ENTER, ESC)
  handleKeyDown (event) {
    if (event.which === ENTER && this.state.edit) this.saveEdit();
    if (event.which === ESC && this.state.edit) this.cancelEdit();
  }

  render() {
    const { edit } = this.state;

    return (
      <div className={'amount-container'} onKeyDown={this.handleKeyDown}>
        {!edit && <span className={'amount'} onClick={this.setEditMode}>{ Display.amount(this.state.amount) }</span>}
        {edit && <input ref={(input) => {if (input != null) input.focus();}}
                        defaultValue={this.state.editAmount} 
                        onChange={(value) => this.onChange(value)} 
                        onKeyUp={this.handleKeyUp}  />}
        {edit && <span onClick={this.saveEdit}><i className={'fa fa-check'}></i></span>}
        {edit && <span onClick={this.cancelEdit}><i className={'fa fa-times'}></i></span>}
      </div>
    );
  }
}

export default FireAmount;