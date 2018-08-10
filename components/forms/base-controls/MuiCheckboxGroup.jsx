import React from 'react';
import PropTypes from 'prop-types';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormGroup from '@material-ui/core/FormGroup';
import Checkbox from '@material-ui/core/Checkbox';
import Switch from '@material-ui/core/Switch';
import withStyles from '@material-ui/core/styles/withStyles';
import classNames from 'classnames';

import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import { getFormControlProperties, getFormHelperProperties } from '../helpers';
import { FormComponentShape } from '../helpers/propTypesShapes';


const styles = theme => ({
  group: {
    marginTop: '8px',
  },
  twoColumn: {
    display: 'block',
    [theme.breakpoints.down('md')]: {
      '& > label': {
        marginRight: theme.spacing.unit * 5,
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '49%',
      },
    },
  },
  threeColumn: {
    display: 'block',
    [theme.breakpoints.down('xs')]: {
      '& > label': {
        marginRight: theme.spacing.unit * 5,
      },
    },
    [theme.breakpoints.up('xs')]: {
      '& > label': {
        width: '49%',
      },
    },
    [theme.breakpoints.up('md')]: {
      '& > label': {
        width: '32%',
      },
    },
  },
});


class MuiCheckboxGroup extends React.PureComponent {
  static propTypes = {
    ...FormComponentShape,
    name: PropTypes.string.isRequired,
    options: PropTypes.array.isRequired,
    classes: PropTypes.object.isRequired,
    variant: PropTypes.oneOf(['checkbox', 'switch']),
  };

  static defaultProps = {
    label: '',
    help: null,
    variant: 'checkbox',
  };

  componentDidMount() {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }
  }

  changeCheckbox = () => {
    const value = [];
    this.props.options.forEach((option) => {
      if (this[this.props.name + '-' + option.value].checked) {
        value.push(option.value);
      }
    });
    this.props.onChange(this.props.name, value);
  };

  validate() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    return true;
  }

  renderElement() {
    const controls = this.props.options.map((checkbox, key) => {
      let value = checkbox.value;
      let checked = (this.props.value.indexOf(value) !== -1);
      let disabled = checkbox.disabled || this.props.disabled;
      const Component = this.props.variant === 'switch' ? Switch : Checkbox;

      return (
        <FormControlLabel
          key={key}
          control={
            <Component
              inputRef={(c) => this[this.props.name + '-' + value] = c}
              checked={checked}
              onChange={this.changeCheckbox}
              value={value}
              disabled={disabled}
            />
          }
          label={checkbox.label}
        />
      );
    });

    const maxLength = this.props.options.reduce((max, option) =>
      option.label.length > max ? option.label.length : max, 0);

    const columnClass = maxLength < 20 ? 'threeColumn' : maxLength < 30 ? 'twoColumn' : '';

    return (
      <FormGroup className={classNames(this.props.classes.group, this.props.classes[columnClass])}>
        {controls}
      </FormGroup>
    );
  }

  render() {
    if (this.props.layout === 'elementOnly') {
      return (
        <div>{this.renderElement()}</div>
      );
    }

    return (
      <MuiFormControl{...getFormControlProperties(this.props)} fakeLabel={true}>
        {this.renderElement()}
        <MuiFormHelper {...getFormHelperProperties(this.props)}/>
      </MuiFormControl>
    );
  }
}

export default withStyles(styles)(MuiCheckboxGroup);
