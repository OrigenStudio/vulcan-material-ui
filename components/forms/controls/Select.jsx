import React from 'react';
import MuiSelect from '../base-controls/MuiSelect';
import { replaceComponent } from 'meteor/vulcan:core';


const SelectComponent = ({ refFunction, ...properties }) =>
  <MuiSelect
    {...properties}
    options={(
      properties.optional
        ? [{ label: '', value: '' }, ...properties.options || []]
        : properties.options
    )}
    ref={refFunction}
  />;


replaceComponent('FormComponentSelect', SelectComponent);
