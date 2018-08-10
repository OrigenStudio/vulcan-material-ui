import omit from 'lodash/omit';

export const getFormControlProperties = (props) => {
  return {
    label: props.label,
    hideLabel: props.hideLabel,
    layout: props.layout,
    required: props.optional !== true || props.required === true,
    hasErrors: hasErrors(props),
    className: props.className,
    htmlFor: getId(props),
  };
};

export const getFormHelperProperties = (props) => {
  return {
    help: props.help,
    errors: props.errors,
    hasErrors: hasErrors(props),
    showCharsRemaining: props.showCharsRemaining,
    charsRemaining: props.charsRemaining,
    charsCount: props.charsCount,
    max: props.max,
  };
};

export const hashString = (string) => {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = (((hash << 5) - hash) + string.charCodeAt(i)) & 0xFFFFFFFF;
  }
  return hash;
};

/**
 * The ID is used as an attribute on the form control, and is used to allow
 * associating the label element with the form control.
 *
 * If we don't explicitly pass an `id` prop, we generate one based on the
 * `name` and `label` properties.
 */
export const getId = (props) => {
  if (props.id) {
    return props.id;
  }
  const label = (typeof props.label === 'undefined' ? '' : props.label);
  return [
    'frc',
    props.name.split('[').join('_').replace(']', ''),
    hashString(JSON.stringify(label))
  ].join('-');
};

export const hasErrors = (props) => {
  return !!(props.errors && props.errors.length);
};

export const cleanProps = (props) => {
  const removedFields = [
    'beforeComponent',
    'afterComponent',
    'addonAfter',
    'addonBefore',
    'help',
    'label',
    'hideLabel',
    'options',
    'layout',
    'rowLabel',
    'validatePristine',
    'validateOnSubmit',
    'inputClassName',
    'inputProperties',
    'optional',
    'throwError',
    'currentValues',
    'addToDeletedValues',
    'deletedValues',
    'clearFieldErrors',
    'formType',
    'inputType',
    'showCharsRemaining',
    'charsCount',
    'charsRemaining',
    'handleChange',
    'document',
    'updateCurrentValues',
    'classes',
    'errors',
    'description',
    'clearField',
    'regEx',
    'mustComplete',
    'renderComponent',
    'formInput',
    'className',
  ];

  return omit(props, removedFields);
};

export const cleanSwitchProps = (props) => {
  const removedFields = [
    'value',
    'error',
  ];

  return omit(props, removedFields);
};
