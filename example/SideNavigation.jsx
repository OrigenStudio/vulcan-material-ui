import React from 'react';
import PropTypes from 'prop-types';
import { browserHistory } from 'react-router';
import List, { ListItem, ListItemIcon, ListItemText } from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import Collapse from '@material-ui/core/Collapse';
import ExpandLessIcon from '@material-ui/icons/ArrowDropUp';
import ExpandMoreIcon from '@material-ui/icons/ArrowDropDown';
import { Components, registerComponent, withCurrentUser } from 'meteor/vulcan:core';
import LockIcon from '@material-ui/icons/Lock';
import UsersIcon from '@material-ui/icons/AccountMultiple';
import ThemeIcon from '@material-ui/icons/Palette';
import HomeIcon from '@material-ui/icons/Home';
import withStyles from '@material-ui/core/styles/withStyles';
import Users from 'meteor/vulcan:users';


const styles = theme => ({
  root: {},
  nested: {
    paddingLeft: theme.spacing.unit * 4,
  },
});


class SideNavigation extends React.Component {
  state = {
    isOpen: { admin: false }
  };
  
  toggle = (item) => {
    const newState = { isOpen: {} };
    newState.isOpen[item] = !this.state.isOpen[item];
    this.setState(newState);
  };
  
  render () {
    const currentUser = this.props.currentUser;
    const classes = this.props.classes;
    const isOpen = this.state.isOpen;
    
    return (
      <div className={classes.root}>
        
        <List>
          <ListItem button onClick={() => {browserHistory.push('/');}}>
            <ListItemIcon>
              <HomeIcon/>
            </ListItemIcon>
            <ListItemText inset primary="Home"/>
          </ListItem>
        </List>
        
        {
          Users.isAdmin(currentUser) &&
          
          <div>
            <Divider/>
            <List>
              <ListItem button onClick={e => this.toggle('admin')}>
                <ListItemIcon>
                  <LockIcon/>
                </ListItemIcon>
                <ListItemText primary="Admin"/>
                {isOpen.admin ? <ExpandLessIcon/> : <ExpandMoreIcon/>}
              </ListItem>
              <Collapse in={isOpen.admin} transitionduration="auto" unmountOnExit>
                <ListItem button className={classes.nested}
                          onClick={() => {browserHistory.push('/admin');}}>
                  <ListItemIcon>
                    <UsersIcon/>
                  </ListItemIcon>
                  <ListItemText inset primary="Users"/>
                </ListItem>
                <ListItem button className={classes.nested}
                          onClick={() => {browserHistory.push('/theme');}}>
                  <ListItemIcon>
                    <ThemeIcon/>
                  </ListItemIcon>
                  <ListItemText inset primary="Theme"/>
                </ListItem>
              </Collapse>
            </List>
          </div>
        }
      
      </div>
    );
  }
}


SideNavigation.propTypes = {
  classes: PropTypes.object.isRequired,
  currentUser: PropTypes.object,
};


SideNavigation.displayName = 'SideNavigation';


registerComponent('SideNavigation', SideNavigation, [withStyles, styles], withCurrentUser);
