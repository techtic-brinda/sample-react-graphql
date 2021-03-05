import { Component } from "react";
import MenuIcon from "@material-ui/icons/Menu";
import Head from "next/head";
import {
  CssBaseline,
  AppBar,
  IconButton,
  Toolbar,
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import { logoutUser } from "../../../src/store/actions/auth";
import styles from "./style";
import Search from "./Search";

class MainLayout extends Component {
  constructor(props) {
    super(props);
    this.state = {
      mobileOpen: false,
      // anchorEl: false,
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
      title,
      children
    } = this.props;

    return (
      
      <React.Fragment>
        <Head>
          <meta charSet="UTF-8" />
          <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
          <title>{title || "Orphan Angels"}</title>
        </Head>

        <div className={[classes.root]}>
          <CssBaseline />
          <AppBar
            color="transparent"
            position="fixed"
            className={[classes.backgroundShadow, classes.appBar]}
          >
            <Toolbar>
              <IconButton
                color="inherit"
                aria-label="open drawer"
                edge="start"
                onClick={(e) => this.handleDrawerToggle(e)}
                className={classes.menuButton}
              >
                <MenuIcon />
              </IconButton>
              <Search />
            </Toolbar>
          </AppBar>
          
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
const mapStateToProps = ({auth}) => {
  return {
    container: null,
    user: auth.user
  };
};

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(MainLayout)
);
