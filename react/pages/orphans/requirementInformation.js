import { Component } from "react";
import {
  Button,
  Typography,
  withStyles,
  Grid,
  Box,
  MenuItem,
} from "@material-ui/core";

import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/core/Slider';
import { AddButton, DonateButton } from "../../components/common";
import Formsy from "formsy-react";
import { TextFieldFormsy, DatePickerFieldFormsy } from "../../components";
import moment from "moment";
import { getSessioToken, successPayment } from "../../src/store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import { withRouter } from 'next/router'
import { Link } from "../../components/common";
import Router from "next/router";

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
  margin: {
    margin: "5px"
  },
  boldDescription: {
    fontWeight: "600",
    fontSize: "12px",
    color: "#3D3D3D",
  },
  boldPrice: {
    fontSize: "17px",
    fontWeight: "600",
    color: "#E1402A",
  },
  textDecoration: {
    textDecoration: 'none !important'
  },

});

const PrettoSlider = withStyles({
  root: {
    color: '#E1402A',
    height: 8,
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: -8,
    marginLeft: -12,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  active: {},
  valueLabel: {
    left: 'calc(-50% + 4px)',
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  selectTag: {
    "& MuiFormControl-root": {
      display: 'inherit !important',
    }
  }
})(Slider);
function donationValue(value) {
  return `${value * 10}`;
}
class RequirementInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      session_id: props.router.query.session_id != undefined ? props.router.query.session_id : null,
      loading: false,
      canSubmit: false,
      isAdd: false,
      donationAmount: 0,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.addSuccess !== this.props.addSuccess) {
      this.setState({ isAdd: false });
    }
  }
  componentDidMount() {
    if (this.state.session_id) {
      const { id } = this.props.currentUser
      this.props.successPayment(this.state.session_id, this.state.orphanId, id)
    }
  }
  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };
  onSubmit = (model) => {
    this.props.onSaveRequirement(model)
  }
  showHideForm = () => {
    this.setState({ isAdd: !this.state.isAdd });
  }
  handleDonationChange = (e, value) => {
    this.setState({ donationAmount: value })
  }
  submitPayment = (e, child_id, orphan_need_id) => {
    e.preventDefault()
    Router.push({ pathname: `/donation/${child_id}`, query: { type: 'requirement', orphan_need_id: orphan_need_id, amount: this.state.donationAmount } })
  }
  getMaxvalue = (req) => {
    return (req.amount - req.receivedDonationAmount)
  }
  showDonationButton = (req) => {
    if ((req.amount - req.receivedDonationAmount) < 0) {
      return false
    } else {
      return true;
    }
  }  
  render() {
    const { currentUser, classes, childrenProfile } = this.props;
    const { orphanNeeds } = childrenProfile
    const userType = currentUser.roleUsers.nodes[0].role.name
    const { loading, canSubmit, isAdd, donationAmount } = this.state;

    return (
      <>
        {isAdd ?
          <Grid container justify="center" alignItems="right">
            <Grid item xs={12}>
              <Formsy
                onValidSubmit={this.onSubmit}
                onValid={this.enableButton}
                onInvalid={this.disableButton}
                ref={(form) => (this.form = form)}
                className={classes.FormRoot}
              >
                {" "}
                <div><br />
                  <Grid container spacing={2} justify="left" alignItems="right">
                    <Grid item xs={6} className={'select-grid'}>
                      <TextFieldFormsy
                        id="title"
                        label="Title"
                        name="title"
                        type="text"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        required
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <TextFieldFormsy
                        id="outlined-number"
                        label="Amount"
                        name="amount"
                        type="float"
                        fullWidth
                        variant="outlined"
                        required
                        validations="isFloat"
                        defaultValue={0}
                        validationError="Enter valid amount"
                      />
                    </Grid>
                    <Grid item xs={3}>
                        <DatePickerFieldFormsy
                          format="MM/dd/yyyy"
                          label="Date"
                          name="closeDate"
                          required
                          defaultValue={null}
                          disablePast={true}
                          emptyLabel={'Select date'}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextFieldFormsy
                        id="outlined-number"
                        label="Description"
                        name="description"
                        type="text"
                        fullWidth
                        InputLabelProps={{
                          shrink: true,
                        }}
                        variant="outlined"
                        required
                      />
                    </Grid>
                  </Grid>
                  <br />
                  <Box align="right">
                    <Button
                      type="submit"
                      variant="contained"
                      color="primary"
                      size={"medium"}
                      disabled={!canSubmit || loading}
                      className={[classes.margin, classes.adoptChild, classes.textTransform]}
                    >
                      Save
                            </Button>

                    <Button onClick={this.showHideForm} variant="contained" size="medium" className={[classes.margin, classes.adoptChild, classes.textTransform]}>
                      Cancel
                            </Button>
                  </Box>
                </div>
              </Formsy>

            </Grid>
          </Grid>

          :
          <Grid container justify="center" alignItems="right">
            <Grid container spacing={0} direction="column" align="right" justify="right" >
              <Grid item xs={12}>
                <AddButton row={childrenProfile} onClick={this.showHideForm} />
              </Grid>
            </Grid>
          </Grid>
        }
        <br />
        <Grid container>

          <Grid container justify="center" alignItems="center">
            <Grid item xs={12} className={classes.tabPersonalInfo}>
              <br></br>
              <div className={classes.root}>

                {orphanNeeds?.nodes.length > 0 && orphanNeeds?.nodes.map((requiredment, index) => (
                  <ExpansionPanel key={requiredment}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>{++index}</b> &nbsp;&nbsp;&nbsp; {requiredment.title}</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>

                      <Grid container>

                        <Grid container>
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Title:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              {requiredment.title}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              End Date:
                          </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              {requiredment.closeDate ? moment(requiredment.closeDate).format('MMMM DD, YYYY') : '-'}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Amount Needed:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldPrice}>
                              ${requiredment.amount}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Received Donation:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldPrice}>
                              ${requiredment.receivedDonationAmount}
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Description:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              {requiredment.description}
                            </Typography>
                          </Grid>
                        </Grid>
                        {this.showDonationButton(requiredment) && (userType !== "Champion") &&
                          <>
                            <Grid container justify="center" alignItems="center">
                              <Grid item xs={3} className={classes.tabPersonalInfo}>
                                <Typography variant="subtitle1" className={classes.description}>
                                  Donation:
                                 </Typography>
                              </Grid>
                              <Grid item xs={9} className={classes.tabPersonalInfo}>
                                <div className={classes.root}>
                                  <br></br>
                                  <div className={classes.margin} />
                                  <PrettoSlider
                                    defaultValue={requiredment.amount}
                                    getAriaValueText={donationValue}
                                    aria-labelledby="discrete-slider"
                                    valueLabelDisplay="auto"
                                    min={0}
                                    max={this.getMaxvalue(requiredment)}
                                    onChange={(event, v) => this.handleDonationChange(event, v)}
                                  />
                                </div>
                              </Grid>
                            </Grid>

                            <Grid container justify="center" alignItems="center">
                              <Grid item xs={12} aling="center" className={classes.tabPersonalInfo}>
                                <Link href="/donation/[orphanId]" as={`/donation/${childrenProfile.id}`} variant="body2" className={classes.textDecoration}>
                                  <Button disabled={donationAmount <= 0} onClick={(e) => this.submitPayment(e, childrenProfile.id, requiredment.id)} variant="contained" size="medium" color="primary" align="left" className={[classes.margin, classes.adoptChild, classes.alignLeft]}>
                                    Donate Now
                                    </Button>
                                </Link>
                              </Grid>
                            </Grid>

                          </>
                        }
                      </Grid>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>


                ))}
                {orphanNeeds?.nodes.length === 0 &&
                  <Typography
                    variant="h6"
                    align="center"
                  >
                    Requirements not found!
                  </Typography>
                }

              </div>

            </Grid>
          </Grid>

        </Grid>
      </>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getSessioToken: getSessioToken,
      successPayment: successPayment,
    },
    dispatch
  );
};
function mapStateToProps({ auth, settings, donation }) {
  return {
    categories: auth.categories,
    currentUser: auth.user,
    data: donation.data,
    settings: settings.data,
    successMessage: donation.successMessage,
    sessionId: donation.sessionId
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withAuth(withRouter(withAuth(RequirementInformation)))))
);

