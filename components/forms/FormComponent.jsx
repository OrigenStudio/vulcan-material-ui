import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { intlShape } from 'meteor/vulcan:i18n';
import classNames from 'classnames';
import { Components } from 'meteor/vulcan:core';
import { replaceComponent } from 'meteor/vulcan:core';
import debounce from 'lodash.debounce';
import get from 'lodash/get';
import merge from 'lodash/merge';
import withStyles from 'material-ui/styles/withStyles';
import { isEmptyValue } from '../../modules/utils.js';

const styles = theme => ({
  formInput: {
    position: 'relative',
    marginBottom: theme.spacing.unit * 2
  },
  halfWidthLeft: {
    display: 'inline-block',
    width: '48%',
    verticalAlign: 'top',
    marginRight: '4%'
  },
  halfWidthRight: {
    display: 'inline-block',
    width: '48%',
    verticalAlign: 'top'
  }
});

class FormComponent extends PureComponent {
  constructor(props) {
    super(props);

    const value = this.getValue(props);

    if (this.showCharsRemaining(props)) {
      const characterCount = value ? value.length : 0;
      this.state = {
        charsRemaining: this.props.max - characterCount > 0 ? this.props.max - characterCount : 0
      };
    }
    // TODO : remove if unnecessary
    // this.handleBlur = this.handleBlur.bind(this);
    // this.updateCharacterCount = this.updateCharacterCount.bind(this);
    //
    // if (props.limit) {
    //   this.state = {
    //     limit: props.value ? props.limit - props.value.length : props.limit
    //   };
    // }
  }
  //TODO remove if unnecessary
  // componentWillReceiveProps(nextProps) {
  //   this.updateCharacterCount(nextProps.name, nextProps.value);
  // }
  //
  // handleBlur() {
  //   if (this.formControl) {
  //     const value = this.formControl.getValue();
  //     this.props.updateCurrentValues({ [this.props.name]: value });
  //   }
  // }

  handleChange = (name, value) => {
    // if this is a number field, convert value before sending it up to Form
    if (this.getType() === 'number') {
      value = Number(value);
    }
    this.context.updateCurrentValues({ [this.props.path]: value });

    // for text fields, update character count on change
    if (this.showCharsRemaining()) {
      this.updateCharacterCount(value);
    }
  };


  /*

  Note: not currently used because when function is debounced
  some changes might not register if the user submits form too soon

  */
  handleChangeDebounced = debounce(this.handleChange, 500, { leading: true });

  updateCharacterCount = value => {
    const characterCount = value ? value.length : 0;
    this.setState({
      charsRemaining: this.props.max - characterCount > 0 ? this.props.max - characterCount : 0
      
    });
  };

  /*

  Get value from Form state through document and currentValues props

  */
  getValue = props => {
    let value;
    const p = props || this.props;
    const { document, currentValues, defaultValue, path, datatype } = p;
    const documentValue = get(document, path);
    const currentValue = currentValues[path];
    const isDeleted = p.deletedValues.includes(path);
    
    if (isDeleted) {
      value = '';
    } else {
      if (datatype[0].type === Array) {
        // for object and arrays, use lodash's merge
        // if field type is array, use [] as merge seed to force result to be an array as well
        value = merge([], documentValue, currentValue);
      } else if (datatype[0].type === Object) {
        value = merge({}, documentValue, currentValue);
      } else {
        // note: value has to default to '' to make component controlled
        value = currentValue || documentValue || '';
      }
      // replace empty value, which has not been prefilled, by the default value from the schema
      if (isEmptyValue(value)) {
        if (defaultValue) value = defaultValue;
      }
    }
    return value;
  };

  /*

  Whether to keep track of and show remaining chars

  */
  showCharsRemaining = props => {
    const p = props || this.props;
    return (
      p.max && ['url', 'email', 'textarea', 'text'].includes(this.getType(p))
    );
  };

  /*

  Get errors from Form state through context

  */
  getErrors = () => {
    const fieldErrors = this.props.errors.filter(
      error => error.data.name === this.props.path
    );
    return fieldErrors;
  };

  /*

  /*

  Get form control type, either based on control props, or by guessing
  based on form field type

  */
  getType = props => {
    const p = props || this.props;
    const fieldType = p.datatype && p.datatype[0].type;
    const autoType =
      fieldType === Number
        ? 'number'
        : fieldType === Boolean
          ? 'checkbox'
          : fieldType === Date ? 'date' : 'text';
    return p.control || autoType;
  };

  renderComponent() {
    // see https://facebook.github.io/react/warnings/unknown-prop.html
    /* eslint-disable */
    const {
      control,
      beforeComponent,
      afterComponent,
      options,
      name,
      label,
      description,
      placeholder,
      form,
      formType,
      classes,
      //errors,
      updateCurrentValues,
      document
    } = this.props;
    /* eslint-enable */

    // const base = typeof this.props.control === 'function' ? this.props : rest;

    const value = this.getValue();

    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const hasErrors = this.getErrors() && this.getErrors().length;
    
    const inputProperties = {
      name,
      options,
      label,
      description,
      placeholder,
      onChange: this.handleChange,
      value,
      error: hasErrors ? true : false,
      errors: this.getErrors(),
      ...form
    };

    // note: we also pass value on props directly
    const properties = {
      ...this.props,
      value,
      errors: this.getErrors(),
      inputProperties

      //onBlur: this.handleBlur, // TODO remove if unnecessary
      //refFunction: ref => (this.formControl = ref)
    };

    //TODO remove if unnecessary
    // for text fields, update character count on change
    // if (
    //   !this.props.control ||
    //   ['number', 'url', 'email', 'textarea', 'text'].includes(
    //     this.props.control
    //   )
    // ) {
    //   properties.onChange = this.updateCharacterCount;
    // }

    // if control is a React component, use it
    if (typeof control === 'function') {
      const ControlComponent = control;
      return <ControlComponent {...properties} />;
    } else {
      // else pick a predefined component

      switch (this.getType()) {
        case 'nested':
          return <Components.FormNested {...properties} />;

        case 'number':
          return <Components.FormComponentNumber {...properties} />;

        case 'url':
          return <Components.FormComponentUrl {...properties} />;

        case 'email':
          return <Components.FormComponentEmail {...properties} />;

        case 'textarea':
          return <Components.FormComponentTextarea {...properties} />;

        case 'checkbox':
        // formsy-react-components expects a boolean value for checkbox
        // https://github.com/twisty/formsy-react-components/blob/v0.11.1/src/checkbox.js#L20
        properties.inputProperties.value = !!properties.inputProperties.value;
          // not sure why, but onChange needs to be specified here
          properties.onChange =
            (name, value) => {this.props.updateCurrentValues({ [name]: value });};
          return <Components.FormComponentCheckbox {...properties} />;

        case 'checkboxgroup':
          return <Components.FormComponentCheckboxGroup {...properties} />;

        case 'radiogroup':
          // not sure why, but onChange needs to be specified here
          properties.onChange = (name, value) => {
            this.context.updateCurrentValues({ [name]: value });
          };
          return <Components.FormComponentRadioGroup {...properties} />;

        case 'select':
          properties.options = [
            { value: '', label: 'None' },
            ...properties.options
          ];
          return <Components.FormComponentSelect {...properties} />;

        case 'datetime':
          return <Components.FormComponentDateTime {...properties} />;

        case 'date':
          return <Components.FormComponentDate {...properties} />;

        case 'time':
          return <Components.FormComponentTime {...properties} />;

        case 'text':
          return <Components.FormComponentDefault {...properties} />;

        default:
          const CustomComponent = Components[control];
          return CustomComponent ? (
            <CustomComponent {...properties} />
          ) : (
            <Components.FormComponentDefault {...properties} />
          );
      }
    }
  }
  //TODO make showClear available for select and time, and make it render in a nice way : currently it's ugly on select, did not test on time
  showClear = () => {
    return ['datetime', 'radiogroup'].includes(this.props.control);
  };

  clearField = e => {
    e.preventDefault();
    this.context.updateCurrentValues({ [this.props.path]: null });
  };

  renderClear() {
    return (
      <a
        href="javascript:void(0)"
        className="form-component-clear"
        title={this.context.intl.formatMessage({ id: 'forms.clear_field' })}
        onClick={this.clearField}>
        <span>✕</span>
      </a>
    );
  }

  renderExtraComponent(extraComponent) {
    if (!extraComponent) return null;

    const {
      control,
      beforeComponent,
      afterComponent,
      options,
      name,
      label,
      form,
      formType,
      classes,
      //errors,
      updateCurrentValues,
      document
    } = this.props;
    /* eslint-enable */

    // const base = typeof this.props.control === 'function' ? this.props : rest;

    const value = this.getValue();

    // these properties are whitelisted so that they can be safely passed to the actual form input
    // and avoid https://facebook.github.io/react/warnings/unknown-prop.html warnings
    const inputProperties = {
      name,
      options,
      label,
      onChange: this.handleChange,
      value,
      ...form
    };

    // note: we also pass value on props directly
    const properties = {
      ...this.props,
      value,
      errors: this.getErrors(),
      inputProperties

      //onBlur: this.handleBlur, // TODO remove if unnecessary
      //refFunction: ref => (this.formControl = ref)
    };

    if (typeof extraComponent === 'string') {
      const ExtraComponent = Components[extraComponent];
      return <ExtraComponent {...properties} />;
    } else {
      return extraComponent;
    }
  }

  render() {
    const { classes, inputClassName, name, control } = this.props;
    const inputClass = classNames(
      classes.formInput,
      inputClassName && classes[inputClassName],
      `input-${name}`,
      `form-component-${control || 'default'}`
    );

    return (
      <div className={inputClass}>
        {this.renderExtraComponent(this.props.beforeComponent)}
        {this.renderComponent()}
        {this.showClear() ? this.renderClear() : null}
        {this.showCharsRemaining() && (
          <div
            className={classNames('form-control-limit', {
              danger: this.state.charsRemaining < 10
            })}>
            {this.state.charsRemaining}
          </div>
        )}
        {this.renderExtraComponent(this.props.afterComponent)}
      </div>
    );
  }
}

FormComponent.propTypes = {
  document: PropTypes.object,
  name: PropTypes.string,
  label: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.string,
  prefilledValue: PropTypes.any,
  options: PropTypes.any,
  control: PropTypes.any,
  datatype: PropTypes.any,
  disabled: PropTypes.bool,
  updateCurrentValues: PropTypes.func,
  classes: PropTypes.object.isRequired
};

FormComponent.contextTypes = {
  intl: intlShape,
  addToDeletedValues: PropTypes.func,
  errors: PropTypes.array,
  autofilledValues: PropTypes.object,
  deletedValues: PropTypes.array,
  getDocument: PropTypes.func,
  updateCurrentValues: PropTypes.func
};

replaceComponent('FormComponent', FormComponent, [withStyles, styles]);
