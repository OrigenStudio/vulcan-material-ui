import React from 'react';
import Select from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import MenuItem from '@material-ui/core/MenuItem';
import MenuList from '@material-ui/core/MenuList';
import ListSubheader from '@material-ui/core/ListSubheader';
import withStyles from '@material-ui/core/styles/withStyles';
import _isArray from 'lodash/isArray';

import MuiFormControl from './MuiFormControl';
import MuiFormHelper from './MuiFormHelper';
import StartAdornment, { hideStartAdornment } from './StartAdornment';
import EndAdornment from './EndAdornment';
import { cleanProps, getFormControlProperties, getFormHelperProperties, getId } from '../helpers';
import { FormComponentShape } from '../helpers/propTypesShapes';


export const styles = theme => ({
  inputRoot: {
    '& .clear-enabled': { opacity: 0 },
    '&:hover .clear-enabled': { opacity: 0.54 },
  },
  inputFocused: {
    '& .clear-enabled': { opacity: 0.54 }
  },
  menuItem: {},
  menuList: {
    '&:last-child': {
      paddingBottom: 0,
    },
  },
  menuListSubheader: {
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2,
  },
  input: {},
});


class MuiSelect extends React.PureComponent {
  static propTypes = {
    ...FormComponentShape,
  };

  constructor(...args) {
    super(...args);

    this.state = {
      isOpen: false,
    };
  }

  handleOpen = () => {
    // this doesn't work
    this.setState({
      isOpen: true,
    });
  };

  handleClose = () => {
    // this doesn't work
    this.setState({
      isOpen: false,
    });
  };

  handleChange = (event) => {
    const target = event.target;
    let value;
    if (this.props.multiple) {
      value = [];
      for (let i = 0; i < target.length; i++) {
        const option = target.options[i];
        if (option.selected) {
          value.push(option.value);
        }
      }
    } else {
      value = target.value;
    }
    this.changeValue(value);
  };

  changeValue = (value) => {
    this.props.onChange(this.props.name, value);
  };

  render() {
    if (this.props.layout === 'elementOnly') {
      return this.renderElement();
    }

    return (
      <MuiFormControl{...getFormControlProperties(this.props)}>
        {this.renderElement()}
        <MuiFormHelper {...getFormHelperProperties(this.props)}/>
      </MuiFormControl>
    );
  }

  renderOption(item, key) {
    //eslint-disable-next-line no-unused-vars
    const { group, label, ...rest } = item;
    return this.props.native
      ? (
        <option key={key} {...rest}>
          {label}
        </option>
      ) : (
        <MenuItem key={key} {...rest} className={this.props.classes.menuItem}>
          {label}
        </MenuItem>
      );
  }

  renderGroup(label, key, nodes) {
    return this.props.native
      ? (
        <optgroup label={label} key={key}>
          {nodes}
        </optgroup>
      ) : (
        <MenuList
          key={key}
          className={this.props.classes.menuList}
          disabled
          subheader={(
            <ListSubheader
              component="div"
              disabled
              className={this.props.classes.menuListSubheader}
            >
              {label}
            </ListSubheader>
          )}
        >
          {nodes}
        </MenuList>
      );
  }

  renderElement() {
    const { options, classes } = this.props;

    const groups = Array.from(
      options.reduce(
        (reduced, item) => {
          if (item.group) {
            reduced.add(item.group);
          }
          return reduced;
        },
        new Set(),
      ),
    );

    let optionNodes = [];

    if (groups.length === 0) {
      optionNodes = options.map((item, index) => this.renderOption(item, index));
    } else {
      // For items without groups.
      const itemsWithoutGroup = options.filter(function (item) {
        return !item.group;
      });

      itemsWithoutGroup.forEach((item, index) => {
        optionNodes.push(this.renderOption(item, 'no-group-' + index));
      });

      groups.forEach((group, groupIndex) => {

        const groupItems = options.filter((item) => item.group === group);

        const groupOptionNodes = groupItems.map((item, index) =>
          this.renderOption(item, groupIndex + '-' + index),
        );

        optionNodes.push(this.renderGroup(group, groupIndex, groupOptionNodes));
      });
    }

    let value = this.props.value;
    if (!this.props.multiple && _isArray(value)) {
      value = value.length ? value[0] : '';
    }

    const startAdornment = hideStartAdornment(this.props) ? null :
      <StartAdornment {...this.props}
                      value={value}
                      classes={null}
      />;
    const endAdornment =
      <EndAdornment {...this.props}
                    value={value}
                    classes={null}
      />;

    return (
      <Select className="select"
              ref={(c) => this.element = c}
              {...cleanProps(this.props)}
              value={value}
              onChange={this.handleChange}
              onOpen={this.handleOpen}
              onClose={this.handleClose}
              disabled={this.props.disabled}
              input={<Input id={getId(this.props)}
                            startAdornment={startAdornment}
                            endAdornment={endAdornment}
                            classes={{
                              root: classes.inputRoot,
                              focused: classes.inputFocused,
                              input: classes.input,
                            }}
              />}
      >
        {optionNodes}
      </Select>
    );
  }
}

export default withStyles(styles)(MuiSelect);
