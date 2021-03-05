import { Component } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Head from "next/head";
import {
  Badge,
  AppBar,
  Drawer,
  Hidden,
  Grid,
  IconButton,
  Toolbar,
  withStyles,
  Avatar,
  Button,
  Box,
} from "@material-ui/core";
import { connect } from "react-redux";
import { logoutUser } from "../../../src/store/actions/auth";
import styles from "./style";
import Search from "./Search";
import SideBar from "./SideBar";
import {
  Typography,
} from "@material-ui/core";
import { NotificationIcon } from "../../icons";
import { Link } from "./../../../components/common";
import { getImageUrl } from "../../../src/helpers";
import { withRouter } from 'next/router';
class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
    };
  }

  handleDrawerToggle = () => {
    this.setState({
      mobileOpen: !this.state.mobileOpen,
      userMenu: null,
    });
  };
  userMenuClick = (event) => {
    this.setState({ userMenu: event.currentTarget });
  };
  userMenuClose = () => {
    this.setState({ userMenu: null });
  };

  render() {
    const {
      classes,
      container,
      title,
      children,
      user = {},
      unreadCount = 0
    } = this.props;
    
    const { pathname } = this.props.router;
    const pathnames = pathname.split("/").filter(x => x);
    let profileClassname = 'main-layout-profile';
    if(pathnames){
      profileClassname = pathnames[0] != undefined && pathnames[0] == 'profile'  ? 'main-layout-root' : 'main-layout'
    }
    return (
      <React.Fragment>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0" />
          <title>{title || "Orphan Angels"}</title>
          <link rel="icon" type="image/png" href="/images/logo.png" />
          <link rel='shortcut icon' type='image/x-icon' href='/images/logo.png' />
        </Head>

        <div className={classes.root+ ' '+profileClassname}>
          <AppBar
            color="transparent"
            position="fixed"
            className={classes.appBar}
          >
            <Toolbar>
              <Grid container spacing={3} justify="flex-end" alignItems="center">
                <Grid item xs={1} sm={1}>
                  <IconButton
                    color="inherit"
                    aria-label="open drawer"
                    edge="start"
                    onClick={(e) => this.handleDrawerToggle(e)}
                    className={classes.menuButton}
                  >
                    <MenuIcon />
                  </IconButton>
                  {/* <Search /> */}
                </Grid>
                <Grid item xs={11} sm={11} align="right">
                  <Grid container spacing={2} justify="flex-end" alignItems="center">
                    <Grid item>
                      <Link href="/notification">
                        <IconButton color="inherit">
                          <Badge badgeContent={unreadCount} color="primary">
                            <NotificationIcon />
                          </Badge>
                        </IconButton>
                      </Link>
                    </Grid>
                    <Grid item>
                      <Button
                        className="h-64"
                        onClick={this.userMenuClick}
                      >
                        <Box mr={2}>
                          <Avatar
                            alt="Guest"
                            src={user.image ? getImageUrl(user.image) : 'assets/images/avatars/profile.jpg'}
                          />
                        </Box>
                        <Typography>{user.firstName + '' + user.lastName}</Typography>
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Toolbar>

          </AppBar>
          <nav className={classes.drawer} aria-label="mailbox folders">
            <Hidden smUp implementation="css">
              <Drawer
                container={container}
                variant="temporary"
                anchor="left"
                open={this.state.mobileOpen}
                onClose={(e) => this.handleDrawerToggle(e)}
                classes={{
                  paper: classes.drawerPaper,
                }}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile.
                }}
              >
                <SideBar />
              </Drawer>
            </Hidden>
            <Hidden xsDown implementation="css">
              <Drawer
                classes={{
                  paper: classes.drawerPaper,
                }}
                variant="permanent"
                open
              >
                <SideBar />
              </Drawer>
            </Hidden>
          </nav>

          <main className={classes.content}>
            <div className={classes.toolbar} />
            {children}
          </main>
        </div>
      </React.Fragment>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    logoutUser: () => dispatch(logoutUser()),
  };
};
const mapStateToProps = ({ auth, notification }) => {
  return {
    container: null,
    user: auth.user,
    unreadCount: notification.unreadCount,
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(MainLayout))
);
