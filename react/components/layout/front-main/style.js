const drawerWidth = 250;
export default theme => ({
    root: {
        display: 'flex',
    },
    grow: {
        flexGrow: 1,
    },
    drawer: {
        color: theme.palette.text.primary,
        [theme.breakpoints.up('sm')]: {
            width: drawerWidth,
            flexShrink: 0,
        },
    },
    appBar: {
        minHeight: '75px',
        backgroundColor: theme.palette.common.white,
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - 200px)`,
            marginLeft: "100px",
            marginRight: "100px",
        },
    },
    menuButton: {
        marginRight: theme.spacing(2),
        [theme.breakpoints.up('sm')]: {
            display: 'none',
        },
    },
    toolbar: {
        minHeight: '94px',
    },
    drawerPaper: {
        width: drawerWidth,
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
    menuIcon: {
        fontSize: 22,
        color: theme.palette.common.white,
    },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(1),
    },
    menuLinkText: {
        color :theme.palette.common.white
    }, 
    backgroundShadow: {
        borderRadius: "0px 0px 3px 3px",
        boxShadow: "0px 0px 0px 0px rgba(0,0,0,0.2), 0px 0px 0px 0px rgba(0,0,0,0.14), 0px 0px 10px 0px rgba(0,0,0,0.12) !important",
    }
});