import React, { Component } from 'react';
import Display from '../Display';
import * as _ from 'lodash';

interface IFireTDProps {
  show: boolean,
  hide: boolean,
  goal: number,
  threshold: number,
  span: number
}

export default class FireTD extends Component<IFireTDProps, {}> {
  render () {

    const classNames = [];
    if (_.has(this.props, 'show')) classNames.push(Display.showIf(this.props.show));
    if (_.has(this.props, 'hide')) classNames.push(Display.hideIf(this.props.hide));
    if (_.has(this.props, 'goal') && _.has(this.props, 'threshold')) {
      classNames.push(Display.goal(this.props.goal, this.props.threshold));
    }

    let colSpan = 1;
    if (_.has(this.props, 'span')) {
      colSpan = this.props.span || 1;
    }

    return (
      <td className={classNames.join(' ')} colSpan={colSpan}>
        {this.props.children}
      </td>
    );
  }
}
