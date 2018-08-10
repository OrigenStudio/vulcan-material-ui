import React from 'react';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import { FormComponentShape } from '../helpers/propTypesShapes';
import {
  cleanProps,
  cleanSwitchProps,
  getFormControlProperties,
  getFormHelperProperties,
  getId,
} from '../helpers';


class MuiSwitch extends React.PureComponent {
  static propTypes = {
    ...FormComponentShape,
  };

  static defaultProps = {
    label: '',
    rowLabel: '',
    value: false,
  };

  changeValue = (event) => {
    const target = event.target;
    const value = target.checked;

    this.props.onChange(this.props.name, value);

    setTimeout(() => {document.activeElement.blur();});
  };

  render() {
    const element = this.renderElement();

    if (this.props.layout === 'elementOnly') {
      return element;
    }

    return (
      <MuiFormControl {...getFormControlProperties(this.props)} label={this.props.rowLabel}>
        {element}
        <MuiFormHelper {...getFormHelperProperties(this.props)}/>
      </MuiFormControl>
    );
  }

  renderElement() {
    return (
      <FormControlLabel
        control={
          <Switch
            ref={(c) => this.element = c}
            {...cleanSwitchProps(cleanProps(this.props))}
            id={getId(this.props)}
            checked={this.props.value === true}
            onChange={this.changeValue}
            disabled={this.props.disabled}
          />
        }
        label={this.props.label}
      />
    );
  }

}

export default MuiSwitch;
