import { Component } from "react";
import {
  Button,
  Typography,
  withStyles,
  Grid,
  Avatar,
  Paper,
  ListItem,
  Card,
  CardContent,
} from "@material-ui/core";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import DateRangeIcon from "@material-ui/icons/DateRangeOutlined";
import AccessTimeIcon from "@material-ui/icons/AccessTime";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { getDateFormat, getTimeFormat, getImageUrl } from "./../../src/helpers";

const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
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
    color: "#333333",
  },

  description: {
    fontSize: "12px",
    color: "#7d7d7d",
    marginBottom: "10px",
  },

  cardHeader: {
    fontSize: "18px",
    fontWeight: "700",
    float: "left",
    padding: "0px 0px 0px 20px !important",
    color: "#333333",
  },
  iconFont: {
    marginBottom: "-3px",
    fontSize: "16px",
    color: "#e1402ad1",
  },
  tabPersonalInfo: {
    padding: "5px",
  },
  donationAvatar: {
    height: 60,
    width: 60,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  blogTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333333",
    padding: "6px 0px",
    ['@media (max-width:960px)']: {
        // eslint-disable-line no-useless-computed-key
        fontSize: "16px",
    },
    ['@media (max-width:480px)']: {
        // eslint-disable-line no-useless-computed-key
        fontSize: "14px",
    },
  },
  blogTimeStamp: {
    fontSize: "12px",
    color: "#7d7d7d",
    padding: "0",
  },

  iconFont: {
    marginBottom: "-3px",
    fontSize: "16px",
    color: "#e1402ad1",
  },

  blogPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#7d7d7d",
    padding: "6px 20px",
    margin: "auto",
  },

  testing: {
    boxShadow: "0 2px 10px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.02) !important",
    marginLeft: "0 !important",
    ['@media (max-width:960px)']: {
        // eslint-disable-line no-useless-computed-key
        marginLeft: "0 !important",
    },
  },

  donamtionSubDiv: {
    padding: "8px 24px 24px 130px",
  },

  DonationBtmMargin: {
    marginBottom: "-90px",
  },

  boldDescription: {
    fontSize: "12px",
    fontWeight: "500",
    marginBottom: "0px",
    paddingRight: "10px",
  },
  tabDonationInfo: {
    ['@media (max-width:960px)']: {
        // eslint-disable-line no-useless-computed-key
        maxWidth: 'fit-content',
    },
    ['@media (max-width:560px)']: {
        // eslint-disable-line no-useless-computed-key
        maxWidth: '100%',
    },
  }
});

class DonationInformation extends Component {
  constructor(props) {
    super(props);
  }
  getDonationHtml = (title, amount) => {
    return (
      <>
        <Grid container>
          <Grid item xs={12} sm={6} md={6} lg={6} className={this.props.classes.tabDonationInfo}>
            <Typography
              variant="subtitle1"
              className={this.props.classes.boldDescription}
            >
              {title ? title : "Other"}:
            </Typography>
          </Grid>
          <Grid
            item
            xs={12} sm={6} md={6} lg={6}
            className={this.props.classes.tabDonationInfo}
            align="left"
          >
            <Typography
              variant="subtitle1"
              className={this.props.classes.description}
            >
              ${this.getAmount(amount)}
            </Typography>
          </Grid>
        </Grid>
      </>
    );
  };
  getAmount = (value) => {
    if(!isNaN(value) && value !=''){
      return parseFloat(value).toFixed(2)
    }else{
      return 0.00
    }    
  }
  render() {
    const { classes, childrenProfile } = this.props;
    const donationDetails = childrenProfile.donations.nodes;
    return (
      <>
        <Grid container>
          <Grid container justify="center"  alignItems="center">
            <Grid item xs={12}  className={classes.tabPersonalInfo}>
              <br></br>
              <div className={classes.root}>
              {donationDetails.length == 0 &&
              <>
              <Typography variant="h6" align="center">
                  Donation not found!
              </Typography>
              </>
              }

                {donationDetails.length > 0 && donationDetails.map((donation) => (
                  <ExpansionPanel key={donation.id}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                      style={{ boxShadow: "" }}
                    >
                      <ListItem>
                        <Grid
                          container
                          direction="row"
                          justify="flex-start"
                          spacing={2}
                        >
                          {/* <Grid item xs={12} sm={} md={1} lg={1}> */}
                            {/* <Avatar
                              variant="align-content: center"
                              className={classes.donationAvatar}
                              src={getImageUrl(donation.user.image)}
                            /> */}
                          {/* </Grid> */}
                          <Grid item xs={8} sm={8} md={8} lg={8}>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="right"
                            >
                              {/* <Grid
                                item
                                md={12}
                                sm={12}
                                className={classes.blogTitle}
                              >
                                {donation.user.firstName}{" "}
                                {donation.user.lastName}
                              </Grid> */}
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className={classes.blogTimeStamp}
                              >
                                <DateRangeIcon className={classes.iconFont} />{" "}
                                {getDateFormat(donation.createdAt)}
                                &nbsp;&nbsp;&nbsp;
                                <AccessTimeIcon
                                  className={classes.iconFont}
                                />{" "}
                                {getTimeFormat(donation.createdAt)}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={4} sm={4} md={4} lg={4}
                            direction="row"
                            alignItems="center"
                            className={classes.blogPrice}
                          >
                            <Grid
                              item
                              md={12}
                              sm={12}
                              className={classes.alignRight}
                              align="Right"
                            >
                              ${this.getAmount(donation.amount)}
                            </Grid>
                          </Grid>
                        </Grid>
                      </ListItem>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Card
                        className={[classes.root, classes.testing]}
                        variant="outlined"
                      >
                        <CardContent key={donation}>
                          <Grid item md={12}>
                            <Grid
                              container
                              spacing={0}
                              direction="column"
                              alignItems="left"
                            >
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className={classes.blogTitle}
                              >
                                {donation.orphanNeed !== null ? 'Donation by requirement' : 'Donation by categories'}
                              </Grid>
                            </Grid>
                            {donation.orphanNeed !== null &&
                              this.getDonationHtml(
                                donation.orphanNeed.title,
                                donation.amount
                              )}
                            <div>
                              {donation.donationsCategories.nodes.length > 0 &&
                                donation.donationsCategories.nodes.map(
                                  (donationList) =>
                                    this.getDonationHtml(
                                      donationList.category.name,
                                      donationList.amount
                                    )
                                )}
                            </div>
                          </Grid>
                        </CardContent>
                      </Card>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                ))}
              </div>
            </Grid>
          </Grid>
        </Grid>
      </>
    );
  }
}
export default withStyles(styles, { withTheme: true })(DonationInformation);
