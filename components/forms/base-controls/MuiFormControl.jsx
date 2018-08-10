import React from "react";
import PropTypes from "prop-types";
import InputLabel from "@material-ui/core/InputLabel";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

//noinspection JSUnusedGlobalSymbols
class MuiFormControl extends React.PureComponent {
  static propTypes = {
    label: PropTypes.node,
    children: PropTypes.node,
    required: PropTypes.bool,
    hasErrors: PropTypes.bool,
    fakeLabel: PropTypes.bool,
    hideLabel: PropTypes.bool,
    layout: PropTypes.oneOf(["horizontal", "vertical", "elementOnly"]),
    htmlFor: PropTypes.string
  };

  static defaultProps = {
    label: "",
    required: false,
    hasErrors: false,
    fakeLabel: false,
    hideLabel: false
  };

  renderRequiredSymbol() {
    if (this.props.optional === true || this.props.required === false) {
      return null;
    }
    return <span className="required-symbol"> *</span>;
  }

  renderLabel() {
    if (this.props.layout === "elementOnly" || this.props.hideLabel) {
      return null;
    }

    if (this.props.fakeLabel) {
      return (
        <FormLabel
          className="control-label legend"
          component="legend"
          data-required={this.props.required}
        >
          {this.props.label}
          {this.renderRequiredSymbol()}
        </FormLabel>
      );
    }

    return (
      <InputLabel
        className="control-label"
        data-required={this.props.required}
        htmlFor={this.props.htmlFor}
      >
        {this.props.label}
        {this.renderRequiredSymbol()}
      </InputLabel>
    );
  }

  render() {
    const { layout, className, children, hasErrors } = this.props;

    if (layout === "elementOnly") {
      return <span>{children}</span>;
    }

    return (
      <FormControl
        component="fieldset"
        error={hasErrors}
        fullWidth={true}
        className={className}
      >
        {this.renderLabel()}
        {children}
      </FormControl>
    );
  }
}

export default MuiFormControl;
