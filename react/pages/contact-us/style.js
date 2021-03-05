export default theme => ({
    FormRoot: {
        "& .MuiTextField-root": {
            margin: theme.spacing(1),
            paddingBottom: theme.spacing(3),
            width: "100%",
        },
    },
    paper: {
        marginTop: theme.spacing(8),
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(3),
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
    },

    FormRoot: {
        "& .MuiTextField-root": {
            paddingBottom: theme.spacing(3),
            width: "100%",
        },
        "& .select-formcy": {
            margin: theme.spacing(1),
            paddingBottom: theme.spacing(3),
            width: "100%",
        },
    },
    profileImage: {
        "& .MuiButtonBase-root": {
            margin: theme.spacing(1),
            paddingBottom: theme.spacing(3),
            width: "25ch",
        }
    },
    form: {
        width: "100%",
        marginTop: theme.spacing(3),
    },
    innerPadding: {
        padding: "10px",
    },
    submit: {
        margin: theme.spacing(1, 0, 1),
    },
    alignRight: {
        float: "right",
        textAlign: "right",
    },
    innerPadding: {
        padding: "10px",
    },
    avatar: {
        marginTop: "20px",
        height: "73px",
        width: "85px",
        borderRadius: "0px",
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
        textAlign: "left",
    },
    cardPaddingTitle: {
        paddingLeft: "10px",
    },
    blogTimeStamp: {
        fontSize: "12px",
        padding: '3px 15px 15px 15px',
    },
    iconFont: {
        marginBottom: '-3px',
        fontSize: '16px',
        color: '#e1402ad1'
    },
});