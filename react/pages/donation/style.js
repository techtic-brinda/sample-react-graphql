export default theme => ({
        FormRoot: {
        "& .MuiTextField-root": {
            // marginTop: "5px",
            paddingBottom: theme.spacing(3),
            width: "100%",
        },
        "& .select-formcy": {
            margin: theme.spacing(1),
            paddingBottom: theme.spacing(3),
            width: "100%",
        },
      },
      cardMainPadding: {
        ['@media (max-width:960px)']: {
            // eslint-disable-line no-useless-computed-key
            padding: '20px',
        },
        ['@media (max-width:600px)']: {
            // eslint-disable-line no-useless-computed-key
            padding: '10px',
        },
      },
      totalAmount: {
        ['@media (max-width:360px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '100%',
            flexBasis: 'auto',
        },
      },
      totalAmountValue: {
        ['@media (max-width:360px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '400%',
        },
      },
      totalAmountPercentage: {
        ['@media (max-width:360px)']: {
            // eslint-disable-line no-useless-computed-key
            maxWidth: '50%',
        },
      },
      form: {
        width: "100%", // Fix IE 11 issue.
        marginTop: theme.spacing(3),
      },
      root: {
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper,
      },
      paper: {},
      avatar: {
        height: 100,
        width: 100,
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main,
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

      boldDescription: {
        fontWeight: "700",
        fontSize: "12px",
        color: "#3D3D3D",
      },

      cardHeader: {
        fontSize: "18px",
        fontWeight: "700",
        float: "left",
        padding: "0px 0px 0px 20px !important",
        color: "#333333"
      },
      thanksText: {
        fontSize: "18px",
        fontWeight: "500",
        float: "left",
        padding: "0px 0px 0px 20px !important",
        color: "#333333"
      },
      cardBody: {
        padding: "20px",
      },

      expansionNumber: {
        fontSize: "16px",
      },
      boldPrice: {
        fontSize: "17px",
        fontWeight: "600",
        color: "#E1402A",
      },

      blogPrice: {
        fontSize: "18px",
        fontWeight: "700",
        color: "#7d7d7d",
        padding: '6px 20px',
        margin: "auto"
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

      donationPaddingTitle: {
        padding: "10px 20px 10px 20px",
      },

      cardDonationTitle: {
        fontWeight: "600",
        fontSize: "12px",
        color: "#3D3D3D",
      },

      cardPaddingTitle: {
        paddingTop: "0px",
        paddingBottom: "0px",
      },

      alignRight: {
        float: "right",
        textAlign: "right"
      },

      alignLeft: {
        float: "left",
        textAlign: "left"
      },

      cardDonationDescription: {
        fontSize: "12px",
        color: "#7d7d7d",
      },

      spacing: {
        paddingTop: "10px",
      },

      paddingLeft: {
        paddingLeft: "20px !important",
      },

      cardImaga:{
        padding: '8px 10px 40px 10px !important',
      },
      
      circularProgres: {
        marginLeft: "15px",
        marginRight: theme.spacing.unit,
      },
});