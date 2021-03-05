import { Component } from "react";
import {
  Button,
  Typography,
  withStyles,
  Grid,
  TextField,
  InputAdornment,
  Box,
  Card,
  CardContent,
  Breadcrumbs,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  DialogContentText,
  Checkbox,
  CircularProgress 
} from "@material-ui/core";
import MainLayout from "../../components/layout/main";
import Formsy from "formsy-react";
import Divider from "@material-ui/core/Divider";
import { withRouter } from "next/router";
import styles from "./style";
import ChildSection from "./childSection";
import {
  getDonationDetails,
  getCategories,
  getSettings,
  getSessioToken,
  successPayment,
} from "../../src/store/actions";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import { loadStripe } from "@stripe/stripe-js";
import { Link } from "../../components/common";

const stripePromise = loadStripe(process.env.stripeKey);


class Donation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      donationConfirmation: false,
      paymentConfimation: false,
      paymentLoading: false,
      buttonDisabled: true,
      loading: false,
      canSubmit: false,
      value: 0,
      isDisabled: true,
      orphanId: props.router.query.orphanId,
      type: props.router.query.type,
      orphan_need_id: props.router.query.orphan_need_id,
      session_id:
        props.router.query.session_id != undefined
          ? props.router.query.session_id
          : null,
      payment: {
        totalAmount: 0,
        amount:
          props.router.query.amount != undefined
            ? props.router.query.amount
            : 0,
        orphan_need_id:
          props.router.query.orphan_need_id != undefined
            ? props.router.query.orphan_need_id
            : "",
        adminFees: 0,
      },
      totalCalculation: 0,
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.settings !== this.props.settings) {
      if (this.state.type === "requirement") {
        this.getAdminFees(nextProps.settings)
      }
    }
    if (nextProps.sessionId !== this.props.sessionId) {

      this.redirectTocheckout1(nextProps.sessionId);
    }
  }
  redirectTocheckout1 = async (sessionId) => {
    const stripe = await stripePromise;
    stripe.redirectToCheckout({
      sessionId: sessionId
    })
  };
  handleClose = () =>{
    this.setState({donationConfirmation : false})
  }
  componentDidMount() {
    
    if (this.props.settings.length == 0) {
      this.props.getSettings();
    }
    this.props.getDonationDetails(this.state.orphanId);
    if (this.state.type !== "requirement") {
      this.props.getCategories();
    }
    if (this.state.session_id) {
      const { id } = this.props.currentUser;
      this.props.successPayment(this.state.session_id, this.state.orphanId, id);
    }
    if (this.state.type === "requirement" && this.props.settings.length > 0) {
      this.getAdminFees(this.props.settings)
    }
  }
  getTotalPercentageVal = (name, value) => {
    if (name !== "amount" && value > 0) {
      const { categories } = this.props;
      let sumPercentage = 0;
      if (categories.length > 0) {
        categories.map((cat) => {
          if (
            this.state.payment[cat.id] != undefined &&
            this.state.payment[cat.id] != ""
          ) {
            sumPercentage += parseFloat(
              this.percentage(this.state.payment[cat.id])
            );
          }
        });
      }
      if (sumPercentage > parseFloat(this.state.payment.totalAmount)) {
        this.setState((prevState) => {
          return {
            payment: { ...prevState.payment, name: prevState.payment[name] },
          };
        });
      }
    }
  };
  getAmount = (value) => {
    return parseFloat(value).toFixed(2)
  }
  handlePercentageAmount = () => {
    document.getElementById('totalAmountRef').innerHTML = `$0`;
    const { categories } = this.props;
      categories.map((cat) => {
        this.state.payment[cat.id] = '';
      });
  }

  handleChange = (name, e) => {
    let value = e.target.value;
    value = value.replace(/\D/g,'');
    const { payment } = this.state;
    const re = /^[0-9\b]+$/;
    if (value === '' || re.test(value)) {
      if (value < 0) {
        return false
      }

      if (name !== "amount" && parseInt(value) > parseInt(payment.amount)) {
        return false;
      }
      let sumPercentage = 0;
      
      payment[name] = value;
      if (name !== "amount") {
        const { categories } = this.props;
        
        if (categories.length > 0) {
          categories.map((cat) => {
            if (cat.id == name) {
              // sumPercentage += this.percentage(value);
              sumPercentage += this.amount(value);
            } else {
              if (
                this.state.payment[cat.id] != undefined &&
                this.state.payment[cat.id] != ""
              ) {
                // sumPercentage += this.percentage(this.state.payment[cat.id]);
                sumPercentage += this.amount(this.state.payment[cat.id]);
              }
            }
          });
        }
        if (sumPercentage > this.getAmount(payment.amount)) {
          console.log('test same heer');
          payment[name] = "";
        }
      }
      
      this.setState({ payment, isDisabled: false }, ()  => {
        this.getAdminFees(this.props.settings);
        if(sumPercentage > this.getAmount(payment.amount)) {
          this.getTotalAmount();
        }
      });
    }
  };
  getTotalPerAmount =(value) =>{
    let amount = 0;
    const { payment } = this.state;
    this.props.categories.map((cat)=>{
      if(this.state.payment[cat.id] != ''){
        // amount += parseFloat((payment.amount / 100) * this.state.payment[cat.id]);
        amount += parseFloat((this.state.payment[cat.id] * 100) / payment.amount);
      }
    });
    document.getElementById('totalPerAmountRef').innerHTML = `% ${amount.toFixed(2)}`;
  }
  percentage = (amount, ids = null) => {
    const { payment } = this.state;
    if (amount != undefined && payment.amount) {
      // let percentageVal = (payment.amount / 100) * per;
      // this.getTotalPerAmount(percentageVal.toFixed(2))
      // return parseFloat(percentageVal.toFixed(2));

      let percentageVal = (amount * 100) / payment.amount;
      this.getTotalPerAmount(percentageVal.toFixed(2))
      return parseFloat(percentageVal.toFixed(2));
    } else {
      return 0;
    }
  };
  getTotalAmount = (value) => {
    let amt = 0;
    this.props.categories.map((cat) => {
      if (this.state.payment[cat.id]) {
        amt += parseInt(this.state.payment[cat.id]);
      }
    });
    const { payment } = this.state;
    if(payment.amount == amt){
      this.setState({ buttonDisabled : false });
    }else{
      this.setState({ buttonDisabled : true });
    }
    document.getElementById('totalAmountRef').innerHTML = `$ ${amt}`;
  }
  amount = (amount, ids = null) => {
    if (amount != undefined) {
      this.getTotalAmount(amount);
      return parseInt(amount);
    } else {
      return 0;
    }
  };
  getAdminFees = (data) => {
    const { payment } = this.state;
    const setting = _.find(data, { key: "donationCommission" });
    if (setting && payment.amount > 0) {
      let adminAmount = ((payment.amount / 100) * setting.value);
      let totals = (parseFloat(payment.amount) + parseFloat(adminAmount)).toFixed(2);
      this.setState((prevState) => {
        return {
          payment: {
            ...prevState.payment,
            adminFees: this.getAmount(adminAmount),
            totalAmount: this.getAmount(totals)
          },
        };
      });
    } else {
      this.setState((prevState) => {
        return {
          payment: { ...prevState.payment, adminFees: 0, totalAmount: prevState.payment.amount },
        };
      });
    }
  };

  donateNow= () =>{
    this.setState({donationConfirmation : true})
  }

  submitPayment = () => {
    this.setState({paymentLoading : true});
    const { payment } = this.state;
    const { stripeId = null, id } = this.props.currentUser;
    if (payment.totalAmount != null && stripeId != null) {
      payment.totalAmount = parseFloat(payment.totalAmount);
      payment.amount = parseFloat(payment.amount);
      payment.adminFees = parseFloat(payment.adminFees);
      let userId = parseInt(id);
      this.props.getSessioToken(stripeId, this.state.orphanId, payment, userId);
    }
  };
  render() {
    const { classes, data, categories, currentUser = {} } = this.props;
    const { type, session_id, payment, totalCalculation, buttonDisabled, donationConfirmation, paymentConfimation, paymentLoading } = this.state;
    const { amount, adminFees, totalAmount } = payment;
    
    if (session_id != undefined && session_id != null) {
      return (
        <MainLayout>
          <Grid container direction="row" justify="flex-start" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" href="/dashboard">
                  Dashboard
                </Link>
                <Link color="inherit" href="/orphans">
                  Orphans
                  {/* {currentUser.roleName == "Angel" ? 'Orphans' : 'Childrens'} */}
                </Link>
                <Typography style={{ textTransform: 'capitalize' }} color="textPrimary" key={'donation'}>
                  Donation
                </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12}>
              <Box>
                <Card>
                  <CardContent>
                    <Grid item xs={12} spacing={1} className={classes.cardBody}>
                      <Typography variant="h5" className={[classes.cardTitle, classes.alignLeft]}>
                        Thank you for your donation!
                      </Typography><br />
                    </Grid>
                  </CardContent>
                </Card>
              </Box>
            </Grid>

          </Grid>
        </MainLayout>
      );
    } else {
      return (
        <MainLayout>

        <Dialog
          open={donationConfirmation}
          onClose={this.handleClose}
          aria-labelledby="alert-dialog-title"
          aria-describedby="alert-dialog-description"
        >
          <DialogTitle id="alert-dialog-title">{"Are you sure you wish to send this donation?"}</DialogTitle>
          <DialogContent>
            <DialogContentText id="alert-dialog-description">
            <Checkbox
                checked={paymentConfimation}
                onChange={()=>{
                  this.setState({paymentConfimation : !paymentConfimation})
                }}
                color="primary"
                inputProps={{ 'aria-label': 'primary checkbox' }}
              />Payment confirmation
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              No
            </Button>
            <Button 
              size="medium" 
              color="primary" 
              align="left"
              className={[
                classes.margin,
                classes.adoptChild,
                classes.alignLeft,
              ]} 
              variant="contained" 
              disabled={!paymentConfimation || paymentLoading} 
              onClick={this.submitPayment} autoFocus
            >
              {!paymentLoading ? ('Yes') : (<CircularProgress color="primary" className={classes.circularProgres} size={20}/>)}
              
            </Button>
          </DialogActions>
        </Dialog>

          <Grid container direction="row" justify="flex-start" spacing={2}>
            <Grid item xs={12}>
              <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" href="/dashboard">
                  Dashboard
                  </Link>
                <Link color="inherit" href="/orphans">
                  Orphans
                  </Link>
                <Typography style={{ textTransform: 'capitalize' }} color="textPrimary" key={'donation'}>
                  Donation
                  </Typography>
              </Breadcrumbs>
            </Grid>
            <Grid item xs={12} sm={12} md={3} lg={3}>
              <ChildSection data={data} classes={classes} />
            </Grid>
            <Grid item xs={12} sm={12} md={9} lg={9}>
              <Grid spacing={3} align="center">
                <Grid item>
                  <Card>
                    <CardContent className={ classes.cardMainPadding }>
                      <h2> Donation Amount </h2>
                      <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="left"
                        align="left"
                        className={classes.spacing}
                      >
                        <Grid
                          item
                          xs={12} sm={12} md={4} lg={4}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationDescription,
                              classes.alignLeft,
                            ]}
                          >
                            Donation Amount
                        </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={8} sm={8} md={6} lg={6}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <TextField
                            type="text"
                            id="standard-basic"
                            label="Amount"
                            name={"amount"}
                            value={amount}
                            disabled={type === "requirement"}
                            onChange={(e) => {
                                this.handleChange("amount", e),
                                this.handlePercentageAmount()
                              }
                            }
                            InputProps={{
                              startAdornment: (
                                <InputAdornment position="start">
                                  $
                                </InputAdornment>
                              ),
                            }}
                          />
                        </Grid>
                        <Grid
                          item
                          xs={4} sm={4} md={2} lg={2}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationTitle,
                              classes.alignLeft,
                            ]}
                          ></Typography>
                        </Grid>

                        {type !== "requirement" &&
                          categories.map((cate) => (
                            <>
                              <Grid
                                item
                                xs={12} sm={12} md={4} lg={4}
                                className={[
                                  classes.blogTitle,
                                  classes.donationPaddingTitle,
                                ]}
                              >
                                <Typography
                                  variant="subtitle1"
                                  className={[
                                    classes.cardDonationDescription,
                                    classes.alignLeft,
                                  ]}
                                >
                                  {cate.name}
                                </Typography>
                              </Grid>
                              <Grid
                                item
                                xs={8} sm={8} md={6} lg={6}
                                className={[
                                  classes.blogTitle,
                                  classes.donationPaddingTitle,
                                ]}
                              >
                                <Formsy>
                                  <TextField
                                    id="standad-secondarry"
                                    name={cate.id}
                                    value={this.state.payment[cate.id]}
                                    type="text"
                                    InputLabelProps={{
                                      shrink: true,
                                    }}
                                    onChange={(e) =>{
                                        // this.setState({ [e.target.id]: parseInt(e.target.value) ? parseInt(e.target.value) : '' })
                                        this.handleChange(cate.id, e)
                                    }
                                    }
                                    disabled={amount <= 0}
                                    InputProps={{
                                      startAdornment: (
                                        <InputAdornment position="start">
                                          $
                                        </InputAdornment>
                                      ),
                                    }}
                                    size="small"
                                  />
                                </Formsy>
                              </Grid>
                              <Grid
                                item
                                xs={4} sm={4} md={2} lg={2}
                                className={[
                                  classes.blogTitle,
                                  classes.donationPaddingTitle,
                                ]}
                              >
                                <Typography
                                  variant="subtitle1"
                                  className={[
                                    classes.percentAmount,
                                    classes.cardDonationTitle,
                                    classes.alignLeft,
                                  ]}
                                >
                                %{this.percentage(this.state.payment[cate.id], cate.id)}
                                </Typography>
                              </Grid>
                            </>
                          ))}


                        <Grid
                          item
                          xs={8} sm={8} md={4} lg={4}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                            classes.totalAmount,
                          ]}
                        >
                            <Typography
                                variant="subtitle1"
                                className={[
                                classes.cardDonationDescription,
                                classes.alignLeft,
                                ]}
                            >
                                Total Percentage Amount
                            </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={2} sm={2} md={6} lg={6}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                            classes.totalAmountValue,
                          ]}
                        >
                            <Typography
                                variant="subtitle1"
                                className={[
                                classes.cardDonationTitle,
                                classes.alignLeft,
                                ]}
                            >
                                <span id="totalAmountRef">
                                $0
                                </span>
                            </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={2} sm={2} md={2} lg={2}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                            classes.totalAmountPercentage,
                          ]}
                        >
                            <Typography
                                variant="subtitle1"
                                className={[
                                classes.cardDonationTitle,
                                classes.alignLeft,
                                ]}
                            >
                                <span id="totalPerAmountRef">
                                %0
                                </span>
                            </Typography>
                        </Grid>

                        <Grid
                          item
                          xs={8} sm={8} md={4} lg={4}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationDescription,
                              classes.alignLeft,
                            ]}
                          >
                            Admin fees
                        </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={4} sm={4} md={6} lg={6}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationTitle,
                              classes.alignLeft,
                            ]}
                          >
                            ${adminFees}
                          </Typography>
                        </Grid>
                        {/* <Grid
                          item
                          xs={4} sm={4} md={2} lg={2}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationTitle,
                              classes.alignLeft,
                            ]}
                          ></Typography>
                        </Grid> */}
                        {/* Donation Form */}
                      </Grid>
                      <br />
                      <Divider />
                      <Grid
                        container
                        spacing={0}
                        direction="row"
                        alignItems="left"
                        align="left"
                      >
                        <Grid
                          item
                          xs={8} sm={8} md={4} lg={4}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationTitle,
                              classes.alignLeft,
                            ]}
                          >
                            Total Amount
                        </Typography>
                        </Grid>
                        <Grid
                          item
                          xs={4} sm={4} md={6} lg={6}
                          className={[
                            classes.blogTitle,
                            classes.donationPaddingTitle,
                          ]}
                        >
                          <Typography
                            variant="subtitle1"
                            className={[
                              classes.cardDonationTitle,
                              classes.alignLeft,
                            ]}
                          >
                            ${totalAmount}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Divider />
                      <br />
                      <Grid container spacing={1}>
                        <Grid item xs={12} className={[classes.paddingLeft]}>
                          <Button
                            disabled={buttonDisabled}
                            onClick={this.donateNow}
                            variant="contained"
                            size="medium"
                            color="primary"
                            align="left"
                            className={[
                              classes.margin,
                              classes.adoptChild,
                              classes.alignLeft,
                            ]}
                          >
                            Donate Now
                        </Button>
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </MainLayout>
      );
    }
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getDonationDetails: getDonationDetails,
      getCategories: getCategories,
      getSettings: getSettings,
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
    sessionId: donation.sessionId,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withAuth(withRouter(withAuth(Donation)))))
);
