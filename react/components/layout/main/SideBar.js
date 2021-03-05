import { Component, Fragment } from 'react';
import { Box, List, ListItem, ListItemIcon, ListItemText, withStyles } from '@material-ui/core';
import { connect } from 'react-redux';
import PersonIcon from '@material-ui/icons/Person';
import ContactMailIcon from '@material-ui/icons/ContactMail';
import DescriptionSharpIcon from '@material-ui/icons/DescriptionSharp';
import FavoriteIcon from '@material-ui/icons/Favorite';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import styles from './style';
import { Link } from '../../../components/common';
import { logoutUser } from '../../../src/store/actions/auth';
import { DashboardIcon, ChildIcon, NotificationIcon, LogoutIcon } from '../../icons';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogContentText from '@material-ui/core/DialogContentText';
import DialogTitle from '@material-ui/core/DialogTitle';

class SideBar extends Component {

    state = {
        isOpen: false
    }

    render() {
        const { currentuser, classes } = this.props;
        return (
            <Fragment>
                <Box mt={3} className={classes.toolbar}>
                    {/* {user ? (<ListItem>
                        <ListItemAvatar className={classes.listItemAvatar} >
                            <Avatar className={classes.largeAvatar} src={getUrl(user.image)}> {`${user.firstName.charAt(0)}${user.lastName.charAt(0)}`} </Avatar>
                        </ListItemAvatar>
                        <div>
                            <Typography variant="subtitle1">{`${user.firstName} ${user.lastName}`}</Typography>
                            <Typography variant="body2">{user.email}</Typography>
                        </div>
                    </ListItem>) : ""} */}
                    <ListItem className={classes.menuIcon} >ORPHAN ANGELS</ListItem>
                </Box>
                <List className={classes.menuList}>
                    <ListItem button key="Dashboard" component={Link} href={'/dashboard'}>
                        <ListItemIcon className={classes.menuIconPadding}><DashboardIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText className={classes.menuLinkText} primary="Dashboard" />
                    </ListItem>

                    {(currentuser.roleName === "Champion") ?
                        <ListItem button key="champion-report" component={Link} href={'/champion-report'}>
                            <ListItemIcon className={classes.menuIconPadding}><DescriptionSharpIcon className={classes.menuIcon} /></ListItemIcon>
                            <ListItemText className={classes.menuLinkText} primary="Report" />
                        </ListItem>
                        :
                        <ListItem button key="angel-report" component={Link} href={'/angel-report'}>
                            <ListItemIcon className={classes.menuIconPadding}><DescriptionSharpIcon className={classes.menuIcon} /></ListItemIcon>
                            <ListItemText className={classes.menuLinkText} primary="Report" />
                        </ListItem>
                    }
                    <ListItem button key="Child" component={Link} href={'/orphans'}>
                        <ListItemIcon className={classes.menuIconPadding} ><ChildIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText className={classes.menuLinkText} primary="Orphans" />
                    </ListItem>
                    {(currentuser.roleName === "Champion") &&
                        <>
                            <ListItem button key="my-child" component={Link} href={'/my-children'}>
                                <ListItemIcon className={classes.menuIconPadding}><ChildIcon className={classes.menuIcon} /></ListItemIcon>
                                <ListItemText className={classes.menuLinkText} primary="My Childrens" />
                            </ListItem>

                            <ListItem button key="sponsor" component={Link} href={'/sponsor'}>
                                <ListItemIcon className={classes.menuIconPadding}><FavoriteIcon className={classes.menuIcon} /></ListItemIcon>
                                <ListItemText className={classes.menuLinkText} primary="Sponsors" />
                            </ListItem>
                        </>
                    }

                    <ListItem button key="Notification" component={Link} href={'/notification'}>
                        <ListItemIcon className={classes.menuIconPadding}><NotificationIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText className={classes.menuLinkText} primary="Notification" />
                    </ListItem>

                    <ListItem button key="Profile" component={Link} href={'/profile'}>
                        <ListItemIcon className={classes.menuIconPadding}><PersonIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText className={classes.menuLinkText} primary="Profile" />
                    </ListItem>
                    <ListItem button key="Contac-us" component={Link} href={'/contact-us'}>
                        <ListItemIcon className={classes.menuIconPadding}><ContactMailIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText className={classes.menuLinkText} primary="Contact Us" />
                    </ListItem>
                    <ListItem button key="Log Out" onClick={(e) => this.setState({ isOpen: true })}>
                        <ListItemIcon className={classes.menuIconPadding}><ExitToAppIcon className={classes.menuIcon} /></ListItemIcon>
                        <ListItemText className={classes.menuLinkText} primary="Log Out" />
                    </ListItem>
                    
                    {(this.state.isOpen) ?
                            <Dialog
                                // fullScreen={fullScreen}
                                open={open}
                                // onClose={handleClose}
                                aria-labelledby="responsive-dialog-title"
                            >
                                <DialogTitle id="responsive-dialog-title">{"Log Out!"}</DialogTitle>
                                <DialogContent>
                                    <DialogContentText>
                                        Are you sure you want to log out?
                                </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button autoFocus color="primary" onClick={(e) => this.setState({ isOpen: false })}>
                                        No
                                </Button>
                                    <Button color="primary" autoFocus onClick={logoutUser}>
                                        Yes
                                </Button>
                                </DialogActions>
                            </Dialog>
                            : null}

                </List>
            </Fragment >
        )
    }
}

const mapStateToProps = ({ auth }) => ({
    currentuser: auth.user,
})

const mapDispatchToProps = dispatch => {
    return {
        logoutUser: () => dispatch(logoutUser()),
    }
}

export default withStyles(styles, { withTheme: true })(connect(mapStateToProps, mapDispatchToProps)(SideBar));
