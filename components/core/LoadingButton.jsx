import React from 'react';
import { Components, replaceComponent } from 'meteor/vulcan:core';
import withStyles from '@material-ui/core/styles/withStyles';
import CircularProgress from '@material-ui/core/CircularProgress';
import classNames from 'classnames';
import get from 'lodash/get';

const getButtonProgressSize = size =>
  get({ small: 20, medium: 24, large: 28 }, size, 24);

function LoadingButton({
  loading,
  children,
  size,
  variant,
  label,
  classes: {
    fabProgressWrapper,
    fabProgress,
    buttonProgressWrapper,
    buttonProgress,
    ...buttonClasses
  },
  ...props
}) {
  return (
    <Components.Button
      disabled={loading}
      size={size}
      variant={variant}
      {...props}
      classes={buttonClasses}
      label={[
        label,
        !loading ? null : (
          <div
            key="loading-button-progress"
            className={classNames({
              [fabProgressWrapper]: variant === 'fab',
              [buttonProgressWrapper]: variant !== 'fab',
            })}
          >
            <CircularProgress
              size={variant === 'fab' ? '100%' : getButtonProgressSize(size)}
              className={classNames({
                [fabProgress]: variant === 'fab',
                [buttonProgress]: variant !== 'fab',
              })}
            />
          </div>
        )
      ]}
    />
  );
}

replaceComponent(
  'LoadingButton',
  LoadingButton,
  withStyles(theme => ({
    root: {
      position: 'relative',
    },
    fabProgressWrapper: {
      display: 'flex',
      position: 'absolute',
      top: 0,
      left: 0,
      width: `calc(100% + ${theme.spacing.unit}px)`,
      height: `calc(100% + ${theme.spacing.unit}px)`,
      marginLeft: -theme.spacing.unit/2,
      marginTop: -theme.spacing.unit/2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    fabProgress: {
      zIndex: 1,
      width: '100%',
      height: '100%',
    },
    buttonProgressWrapper: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
    },
    buttonProgress: {}
  })),
);

