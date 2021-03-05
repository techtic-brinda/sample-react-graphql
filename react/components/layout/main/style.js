const drawerWidth = 215;
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
        minHeight: '94px',
        backgroundColor: theme.palette.common.white,
        display: 'flex',
        justifyContent: 'center',
        [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth,
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
        borderRadius: theme.spacing(0, 5, 5, 0),
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(6),
    },
    menuIcon: {
        fontSize: 17,
        color: theme.palette.common.white,
    },
    largeAvatar: {
        width: theme.spacing(7),
        height: theme.spacing(7),
        marginRight: theme.spacing(1),
    },
    menuLinkText: {
        color: theme.palette.common.white,
        fontSize: 14,
        padding: theme.spacing(1, 0),
        '& .MuiListItemText-primary': {
            color: 'inherit',
        },
    },
    toolbarButtons: {
        marginLeft: 'auto',
    },
    menuIconPadding: {
        minWidth: "32px",
    },
    menuList: {
        "& a.active": {
            backgroundColor: 'rgba(0, 0, 0, 0.1)'
        }
    },
    filterResetBtn: {
        padding: '12px 20px'
    }
});