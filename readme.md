
# erikdakoda:vulcan-material-ui 1.10.1_2

Replacement for [Vulcan](http://vulcanjs.org/) components using [Material-UI](https://material-ui-next.com/). 
It's based on the latest [v1-beta branch](https://github.com/callemall/material-ui/tree/v1-beta) of Material-UI.

Soon this package will be rolled into the VulcanJS main repository. The next version of Vulcan will have no
dependencies on Bootstrap, and you will be able to choose your ui framework without the added bundle size of Bootstrap.

To give me feedback open an issue on GitHub or you can reach me on the [Vulcan Slack](https://vulcanjs.slack.com) 
channel as erikdakoda.

This version has been tested against Vulcan 1.10.0 and Material UI 1.0.0-beta.47. Support for the final v1.0.0 is just around the corner.

NOTE: Material UI is still in beta and the API is still in flux. 
If you are experiencing problems, try locking your project to 
1.0.0-beta.47 by removing the ^ before the version number in your package.json.

``` json
    "material-ui": "1.0.0-beta.47",
```

There are some nice bonus features like a CountrySelect with autocomplete and theming.

All components that use bootstrap in vulcan:core, vulcan:forms and vulcan:accounts 
have been implemented except for Icon and DateTime (but they will still work).

## Installation

To add vulcan-material-ui to an existing Vulcan project, enter the following:

``` sh
$ meteor add erikdakoda:vulcan-material-ui

$ meteor npm install --save material-ui@next
$ meteor npm install --save mdi-material-ui
$ meteor npm install --save react-autosuggest
$ meteor npm install --save autosuggest-highlight
```

> IMPORTANT: Please note that I have abandoned material-ui-icons in favor of mdi-material-ui because it has a much larger [selection of icons](https://materialdesignicons.com/).

To activate the example layout copy the three components to your project and import them:

``` javascript
import './example/Header',
import './example/Layout',
import './example/SideNavigation',
```

## Theming

For an example theme see `modules/sampleTheme.js`. For a complete list of values you can customize, 
see the [MUI Default Theme](https://material-ui-next.com/customization/default-theme/). 

Register your theme in the Vulcan environment by giving it a name: `registerTheme('MyTheme', theme);`. 
You can have multiple themes registered and you can specify which one to use in your settings file using the `muiTheme` public setting.

In addition to the Material UI spec, I use a `utils` section in my themes where I place global variables for reusable styles. 
For example the sample theme contains 

```
const theme = {
  
  . . .
  
  utils: {
    
    tooltipEnterDelay: 700,
    
    errorMessage: {
      textAlign: 'center',
      backgroundColor: red[500],
      color: 'white',
      borderRadius: '4px',
    },
    
    . . .
    
    // additional utils definitions go here
    
  },
  
};
```

You can use tooltipEnterDelay (or any other variable you define in utils) anywhere you include the withTheme HOC. See `/components/bonus/TooltipIconButton.jsx` for an example.

You can use errorMessage (or any other style fragment you define in utils) anywhere you include the withStyles HOC. See `/components/accounts/Form.jsx` for an example.

## Server Side Rendering (SSR)

Material UI and Vulcan support SSR, but this is a complex beast with pitfalls. Sometimes you will see a warning like this:

`Warning: Prop className did not match. Server: "MuiChip-label-131" Client: "MuiChip-label-130"`

Sometimes the React rendered on the server and the client don't match exactly and this causes a problem with [JSS](https://material-ui-next.com/customization/css-in-js/#jss). This is a complicated issue that has multiple causes and I will be working on solving each of the issues causing this over time.

Your pages should still render correctly, but there may be a blink and redraw when the first page after SSR loads in the browser.

IIn your own code, make sure that your components will render the same on the server and the client. This means not referring to client-side object such as `document` or `jQuery`. If you have a misbehaving component, try wrapping it with [react-no-ssr](https://github.com/kadirahq/react-no-ssr). 

## Form Controls

You can pass a couple of extra options to text inputs from the `form` property of your schema:

``` javascript
  userKey: {
    type: String,
    label: 'User key',
    description: 'The user’s key',
    optional: true,
    hidden: function ({ document }) {
      return !document.platformId || !document.usePlatformApp;
    },
    form: {
      autoFocus: true,                 // focus this input when the form loads
      addonBefore: <KeyIcon/>,         // adorn the start of the input
      addonAfter: <KeyIcon/>,          // adorn the end of the input
      inputClassName: 'halfWidthLeft', // use 'halfWidthLeft' or 'halfWidthRight'
                                       //   to display two controls side by side
      hideLabel: true,                 // hide the label
      help: 'Enter your key here',     // add help text below the input
      variant: 'switch',               // checkboxgroup can be set to either 
    },                                 //   'checkbox' (default) or 'switch'
    group: platformGroup,
    viewableBy: ['members'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
```

> Note: `form.getHidden` has been deprecated. Now you can just pass a function to `hidden`.

And to textarea inputs:

``` javascript
    form: {
      rows: 10,
    },
```

## Form Groups

You can pass a couple of extra options form groups as well:

``` javascript
  const platformGroup: {
    name: 'shops.platform',
    order: 4,
    startComponent: 'ShopsPlatformTitle', // component to put at the top of the form group
    endComponent: 'ShopsConnectButtons', // component to put at the bottom of the form group
  },

```

## DataTable

You can pass the DataTable component an `editComponent` property in addition to or instead of `showEdit`. Here is a simplified example:

``` javascript
const AgendaJobActions = ({ collection, document }) => {
  const scheduleAgent = () => {
    Meteor.call('scheduleAgent', document.agentId);
  };
  
  return <Components.TooltipIconButton titleId="executions.execute"
                                       icon={<Components.ExecutionsIcon/>}
                                       onClick={scheduleAgent}/>;
};

AgendaJobActionsInner.propTypes = {
  collecion: PropTypes.object.isRequired,
  document: PropTypes.object.isRequired,
};

<Components.Datatable
  editComponent={AgendaJobActions}
  collection={AgendaJobs}
   ...
/>
```

You can also control the spacing of the table cells using the `dense` property. Valid values are:

| Value   | Description  |
| ------- | ------------ |
| dense   | right cell padding of 16px instead of 56px |
| flat    | right cell padding of 16px and nowrap |
| denser  | right cell padding of 16px, nowrap, and row height of 40px instead of 56px |

You can also use other string values, as long as you define a `utils` entry named the same + `Table`, for example `myCustomTable`. Check out the sample theme for examples.


## CountrySelect

There is an additional component, an autosuggest-based country select.

``` javascript
  country: {
    type: String,
    label: 'Country',
    control: 'CountrySelect',
    viewableBy: ['guests'],
    insertableBy: ['members'],
    editableBy: ['members'],
  },
```

Countries are stored as their 2-letter country codes. I have included a helper function for displaying the country name:

``` javascript
import Typography from '@material-ui/core/Typography';
import { getCountryLabel } from 'meteor/erikdakoda:vulcan-material-ui';

<Typography variant="subheading">
  {getCountryLabel(supplier.country)}
</Typography>
```

