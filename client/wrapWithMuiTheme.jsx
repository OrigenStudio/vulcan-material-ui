import React from "react";
import { addCallback } from "meteor/vulcan:core";
import { MuiThemeProvider } from "@material-ui/core/styles";
import { getCurrentTheme } from "../modules/themes";
import JssCleanup from "../components/theme/JssCleanup";
import CssBaseline from "@material-ui/core/CssBaseline";
import { Helmet } from "react-helmet";

function wrapWithMuiTheme(app) {
  const theme = getCurrentTheme();
  return (
    <MuiThemeProvider theme={theme}>
      <Helmet>
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css?family=Roboto:300,400,500"
        />
      </Helmet>
      <CssBaseline />
      <JssCleanup>{app}</JssCleanup>
    </MuiThemeProvider>
  );
}

addCallback("router.client.wrapper", wrapWithMuiTheme);
