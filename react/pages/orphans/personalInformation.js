import { Component } from "react";
import { Typography, withStyles, Grid } from "@material-ui/core";
import moment from "moment";
import { getUserStatus } from "../../src/helpers"

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  removeHover: {
    textDecorationStyle: "none",
  },

  cardTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333333",
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
    ['@media (max-width:600px)']: {
        // eslint-disable-line no-useless-computed-key
        //maxWidth: 'fit-content',
        maxWidth: '138px',
    },
    ['@media (max-width:575px)']: {
      maxWidth: "100%",
    },
  },
  expansionHeading: {
    fontSize: "13px",
    color: "#444444",
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
});

class PersonalInformation extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes, childrenProfile } = this.props;
    const { firstName = "", lastName = "", middleName = "" } = childrenProfile;
    return (
      <Grid container>
        <Grid container>
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              First Name:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {firstName}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Middle Name:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {middleName}
            </Typography>
          </Grid>
        </Grid>

        <Grid container>
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Last Name:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {lastName}
            </Typography>
          </Grid>
        </Grid>

        {/* <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Date of Birth:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.dateOfBirth
                ? moment(childrenProfile.dateOfBirth).format("MMMM D, YYYY")
                : "-"}
            </Typography>
          </Grid>
        </Grid> */}

        <Grid container alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Age (Computed):
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.dateOfBirth
                ? moment().diff(childrenProfile.dateOfBirth, "years") + " Years"
                : "-"}
            </Typography>
          </Grid>
        </Grid>

         {/* <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Place of Birth:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.country_of_birth
                ? childrenProfile.country_of_birth
                : "-"}
            </Typography>
          </Grid>
        </Grid> */}

        <Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Location : 
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.countryOfBirth
                ? childrenProfile.countryOfBirth
                : "-"}
            </Typography>
          </Grid>
        </Grid>

        {/*<Grid container justify="center" alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Nationality:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.nationality ? childrenProfile.nationality : "-"}
            </Typography>
          </Grid>
        </Grid> */}

        <Grid container alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              # Years in institution:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.noYearsInInstitution
                ? childrenProfile.noYearsInInstitution
                : "-"}
            </Typography>
          </Grid>
        </Grid>

        <Grid container alignItems="center">
          <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.description}>
              Comments:
            </Typography>
          </Grid>
          <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
            <Typography variant="subtitle1" className={classes.boldDescription}>
              {childrenProfile.comments ? childrenProfile.comments : "-"}
            </Typography>
          </Grid>
        </Grid>
        {getUserStatus(childrenProfile) &&
          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
              <Typography variant="subtitle1" className={classes.description}>
                Status:
              </Typography>
            </Grid>
            <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
              <Typography variant="subtitle1" className={classes.boldDescription}>
                {getUserStatus(childrenProfile)}
              </Typography>
            </Grid>
          </Grid>
        }


      </Grid>
    );
  }
}

export default withStyles(styles, { withTheme: true })(PersonalInformation);
