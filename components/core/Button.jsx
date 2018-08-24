import React from 'react';
import { registerComponent } from 'meteor/vulcan:core';
import MuiButton from '@material-ui/core/Button';

function Button({ label, ...props }) {
  return <MuiButton {...props}>{label}</MuiButton>;
}

registerComponent('Button', Button);
