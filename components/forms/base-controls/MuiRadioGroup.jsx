import React from 'react';
import PropTypes from 'prop-types';
import withStyles from '@material-ui/core/styles/withStyles';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import classNames from 'classnames';

import { getFormControlProperties, getFormHelperProperties } from '../helpers';
import { FormComponentShape } from '../helpers/propTypesShapes';
import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';

const styles = theme => ({
  group: {
    marginTop: '8px',
  },
  inline: {
    flexDirection: 'row',
    '& > label': {
      marginRight: theme.spacing.unit * 5,
    },
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
  radio: {
    width: '32px',
    height: '32px',
    marginLeft: '8px',
  },
  line: {
    marginBottom: '12px',
  },
});


class MuiRadioGroup extends React.PureComponent {
  static propTypes = {
    ...FormComponentShape,
    name: PropTypes.string.isRequired,
    type: PropTypes.oneOf(['inline', 'stacked']),
    options: PropTypes.array.isRequired
  };

  static defaultProps = {
    type: 'stacked',
    label: '',
    help: null,
    classes: PropTypes.object.isRequired,
  };

  componentDidMount() {
    if (this.props.refFunction) {
      this.props.refFunction(this);
    }
  }

  handleChange = (event) => {
    const value = event.target.value;
    this.props.onChange(this.props.name, value);
  };

  validate() {
    if (this.props.onBlur) {
      this.props.onBlur();
    }
    return true;
  }

  renderElement () {
    const controls = this.props.options.map((radio, key) => {
      let checked = (this.props.value === radio.value);
      let disabled = radio.disabled || this.props.disabled;

      return (
        <FormControlLabel
          key={key}
          value={radio.value}
          control={<Radio
            className={this.props.classes.radio}
            inputRef={(c) => this['element-' + key] = c}
            checked={checked}
            disabled={disabled}
          />}
          className={this.props.classes.line}
          label={radio.label}
        />
      );
    });

    const maxLength = this.props.options.reduce((max, option) =>
      option.label.length > max ? option.label.length : max, 0);

    let columnClass = maxLength < 18 ? 'threeColumn' : maxLength < 30 ? 'twoColumn' : '';
    if (this.props.type === 'inline') columnClass = 'inline';

    return (
      <RadioGroup
        aria-label={this.props.name}
        name={this.props.name}
        className={classNames(this.props.classes.group, this.props.classes[columnClass])}
        value={this.props.value}
        onChange={this.handleChange}
      >
        {controls}
      </RadioGroup>
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

export default withStyles(styles)(MuiRadioGroup);
