import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import Input from '@material-ui/core/Input';

import StartAdornment, { hideStartAdornment, fixUrl } from './StartAdornment';
import { FormComponentShape } from '../helpers/propTypesShapes';
import { cleanProps, getFormControlProperties, getFormHelperProperties, getId } from '../helpers';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import EndAdornment from './EndAdornment';


export const styles = theme => ({
  inputRoot: {
    '& .clear-enabled': { opacity: 0 },
    '&:hover .clear-enabled': { opacity: 0.54 },
  },
  inputFocused: {
    '& .clear-enabled': { opacity: 0.54 }
  },
});


//noinspection JSUnusedGlobalSymbols
class MuiInput extends React.PureComponent {
  static propTypes = {
    ...FormComponentShape,
    type: PropTypes.oneOf([
      'color',
      'date',
      'datetime',
      'datetime-local',
      'email',
      'hidden',
      'month',
      'number',
      'password',
      'range',
      'search',
      'tel',
      'text',
      'time',
      'url',
      'week'
    ]),
    placeholder: PropTypes.string,
  };

  static defaultProps = {
    type: 'text',
  };

  handleChange = (event) => {
    const value = event.target.value;
    this.changeValue(value);
  };

  changeValue = (value) => {
    this.props.onChange(this.props.name, value);
  };

  handleBlur = (event) => {
    const { type, value } = this.props;

    if (type === 'url' && !!value && value !== fixUrl(value)) {
      this.changeValue(fixUrl(value));
    }
  };

  render () {
    const startAdornment = hideStartAdornment(this.props) ? null :
      <StartAdornment {...this.props}
                      classes={null}
                      changeValue={this.changeValue}
      />;
    const endAdornment =
      <EndAdornment {...this.props}
                    classes={null}
                    changeValue={this.changeValue}
      />;

    let element = this.renderElement(startAdornment, endAdornment);

    if (this.props.layout === 'elementOnly' || this.props.type === 'hidden') {
      return element;
    }

    return (
      <MuiFormControl {...getFormControlProperties(this.props)}>
        {element}
        <MuiFormHelper {...getFormHelperProperties(this.props)}/>
      </MuiFormControl>
    );
  }

  renderElement(startAdornment, endAdornment) {
    const { classes, disabled, autoFocus, value } = this.props;
    const options = this.props.options || {};

    return (
      <Input
        ref={c => (this.element = c)}
        {...cleanProps(this.props)}
        id={getId(this.props)}
        value={value}
        onChange={this.handleChange}
        onBlur={this.handleBlur}
        disabled={disabled}
        rows={options.rows || this.props.rows}
        autoFocus={options.autoFocus || autoFocus}
        startAdornment={startAdornment}
        endAdornment={endAdornment}
        placeholder={this.props.placeholder}
        classes={{ root: classes.inputRoot, focused: classes.inputFocused }}
      />
    );
  }
}

export default withStyles(styles)(MuiInput);
