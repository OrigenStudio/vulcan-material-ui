import React from 'react';
import { replaceComponent } from 'meteor/vulcan:core';
import { CircularProgress } from '@material-ui/core/Progress';

function Loading(props) {
  return <CircularProgress {...props} />;
}

replaceComponent('Loading', Loading);
