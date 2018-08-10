import PropTypes from 'prop-types';

export const FormComponentShape = {
  label: PropTypes.oneOfType([PropTypes.string, PropTypes.node]),
  hideLabel: PropTypes.bool,
  layout: PropTypes.string,
  required: PropTypes.bool,
  errors: PropTypes.arrayOf(PropTypes.object),
};
