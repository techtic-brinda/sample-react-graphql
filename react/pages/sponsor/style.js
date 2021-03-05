export default theme => ({
	root: {
		"& MuiListItem-root &&" : {
			pointerEvents:'cursor'
		},
		flexGrow: 1,
		backgroundColor: theme.palette.background.paper,
	},

	dividerFullWidth: {
		margin: `5px 0 0 ${theme.spacing(2)}px`,
	},
	dividerInset: {
		margin: `5px 0 0 ${theme.spacing(9)}px`,
	},

	paper: {},

	avatar: {
		height: 100,
		width: 100,
		margin: theme.spacing(1),
		backgroundColor: theme.palette.secondary.main,
	},

	removeHover: {
		textDecorationStyle: 'none'
	},
	adoptChild: {
		textTransform: "none !important",
		fontSize: "12px",
		padding: "9px 17px 9px 17px !important",
	},

	cardTitle: {
		fontSize: "18px",
		fontWeight: "700",
		color: "#333333"
	},

	description: {
		fontSize: "12px",
		color: "#7d7d7d",
	},
	expansionDescription: {
		padding: "0px 0px 0px 27px",
		fontSize: "12px",
		color: "#7d7d7d",
	},
	boldDescription: {
		fontWeight: "600",
		fontSize: "12px",
		color: "#3D3D3D",
	},
	tabPersonalInfo: {
		padding: "5px",
	},
	cardHeader: {
		fontSize: "18px",
		fontWeight: "700",
		float: "left",
		padding: "0px 0px 0px 20px !important",
		color: "#333333"
	},
	expansionHeading: {
		fontSize: "13px",
		color: "#444444"
	},
	cardBody: {
		padding: "20px",
	},
	textTransform: {
		textTransform: "none !important",
	},
	expansionNumber: {
		fontSize: "16px",
	},
	boldPrice: {
		fontSize: "17px",
		fontWeight: "600",
		color: "#E1402A",
	},
	blogTitle: {
		fontSize: "18px",
		fontWeight: "700",
		color: "#333333",
		padding: '6px 20px',
	},

	cardPaddingTitle: {
		paddingTop: "0px",
		paddingBottom: "0px",
	},

	blogTimeStamp: {
		fontSize: "12px",
		color: "#7d7d7d",
		color: "#7d7d7d",
		padding: '3px 20px',
	},

	blogPrice: {
		fontSize: "18px",
		fontWeight: "700",
		color: "#7d7d7d",
		padding: '6px 20px',
        margin: "auto",
        ['@media (max-width:767px && min-width:601px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '50%',
            minWidth: '50%',
        },
        ['@media (max-width:460px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '25%',
            minWidth: '25%',
        },
        ['@media (max-width:390px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '32%',
            minWidth: '32%',
        },
        ['@media (max-width:321px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '40%',
            minWidth: '40%',
        },
	},

	blogArrow: {
		fontWeight: "700",
		color: '#e1402ad1',
		padding: '6px 20px',
        margin: "auto",
        ['@media (max-width:767px && min-width:601px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '50%',
            minWidth: '50%',
        },
        ['@media (max-width:460px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '70%',
            minWidth: '70%',
        },
        ['@media (max-width:390px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '65%',
            minWidth: '65%',
        },
        ['@media (max-width:321px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '55%',
            minWidth: '55%',
        },
	},

	blogAvatar: {
		height: 60,
		width: 60,
		margin: theme.spacing(1),
		alignItems: 'left',
		// backgroundColor: theme.palette.secondary.main,
	},

	iconFont: {
		marginBottom: '-3px',
		fontSize: '16px',
		color: '#e1402ad1'
	},

	cardDonationTitle: {
		fontWeight: "600",
		fontSize: "12px",
		color: "#3D3D3D",
	},

	cardDonationDescription: {
		fontSize: "12px",
		color: "#7d7d7d",
	},

	alignRight: {
		float: "right",
		textAlign: "right"
	},

	alignLeft: {
		float: "left",
		textAlign: "left"
	},

	pointer: {
		cursor: "pointer"
	},

	sponserNotFound: {
		fontSize: "14px",
		color: "#4c4c4c",
    },

    blogTitleBar: {
        ['@media (max-width:767px && min-width:601px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '80%',
            minWidth: '80%',
        },
        ['@media (max-width:460px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '100%',
            minWidth: '100%',
        },
    },

    blogAvatarBar: {
        ['@media (max-width:600px)']: {
            // eslint-disable-line no-useless-computed-key
            marginLeft: '15px',
        },
    }
});