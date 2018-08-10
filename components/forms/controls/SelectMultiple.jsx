import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { replaceComponent } from 'meteor/vulcan:core';


const SelectMultiple = ({ refFunction, ...properties }) =>
  <MuiSelect {...properties} multiple ref={refFunction}/>;


replaceComponent('FormComponentSelectMultiple', SelectMultiple);
