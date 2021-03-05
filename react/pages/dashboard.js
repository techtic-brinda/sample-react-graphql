import { Component } from "react";
import {
  Button,
  Typography,
  withStyles,
  Grid,
  Avatar,
  Box,
  Card,
  CardContent,
  CardMedia,
  Paper,
  List,
  ListItemAvatar,
  ListItemIcon,
  ListItemText,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withApollo } from "../src/apollo";
import { withAuth } from "../src/auth";
import MainLayout from "../components/layout/main";
import PropTypes from "prop-types";
import { Link, DashboardNotification } from "../components/common";
import ListItem from "@material-ui/core/ListItem";
import Slider from "@material-ui/core/Slider";
import { deepOrange } from "@material-ui/core/colors";
import { getDashboardDetail, getAllChildrens, getDashboardOrphansDetail, searchChild, getLocations } from "../src/store/actions";
import { bindActionCreators } from "redux";
import { getImageUrl, getDateFormat } from "./../src/helpers";
import { getNotifications } from "./../src/store/actions";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

const StyledTableCell = withStyles((theme) => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
  root: {
    '&:nth-of-type(odd)': {
      backgroundColor: theme.palette.background.default,
    },
  },
}))(TableRow);

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <Typography
      component="div"
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

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

  cardTitle: {
    fontSize: "18px",
    fontWeight: "600",
    color: "#333333",
  },

  blogTitle: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#333333",
    padding: "6px 20px",
  },

  cardDescriptionText: {
    fontSize: "12px",
    color: "#7d7d7d",
  },


  statusAvatar: {
    height: 60,
    width: 60,
    margin: theme.spacing(1),
    borderRadius: "10px",
    alignItems: "left",
  },

  statusSubAvatar: {
    height: 20,
    width: 20,
    borderRadius: "10px",
    alignItems: "left",
  },

  donationCount: {
    height: 20,
    width: 20,
    fontSize: "10px",
    borderRadius: "10px",
    alignItems: "left",
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
    textAlign: "right",
  },

  alignLeft: {
    float: "left",
    textAlign: "left",
  },


  paddingCardList: {
    paddingTop: "25px !important",
    paddingBottom: "25px !important",
  },

  sponsorHeader: {
    marginBottom: '10px',
  },

  fullWidth: {
    width: "100%",
  },

  cardContent: {
    marginTop: "auto",
    marginBottom: "auto",
  },

  statusCardPadding: {
    paddingLeft: "20px",
  },

  statusCardMarging: {
    marginLeft: "5px",
  },

  adoptChild: {
    textTransform: "none !important",
    fontSize: "12px",
    padding: "9px 10px 9px 10px !important",
    ['@media (max-width:977px)']: {
      position: 'absolute',
      right: '15px',
      bottom: '15px',
    },
    ['@media (max-width:853px)']: {
      position: 'static',
      marginTop: '20px',
    },
  },

  btnPadding: {
    padding: "10px",
  },

  flextRow: {
    display: "flex !important",
  },

  flexInline: {
    display: "inline-flex !important",
    ['@media (max-width:960px)']: {
      maxWidth: '100%',
      flexBasis: '100%',
    },
    ['@media (max-width:769px)']: {
      display: 'block !important',
    },
  },

  petroSlider: {
    height: "12px",
    width: '100%',
  },

  orange: {
    color: theme.palette.getContrastText(deepOrange[500]),
    backgroundColor: deepOrange[500],
  },

  poster: {
    padding: "10px 20px",
    backgroundColor: "#9373F6",
    color: "white",
    borderRadius: "15px",
    '& .MuiCardContent-root': {
      padding: '0px'
    }
  },
  posterTitle: {
    color: "white",
    letterSpacing: "2px",
    fontSize: "14px",
    fontFamily: "inherit",
    fontWeight: "600",
  },
  amountNumber :{
    color: "white",
    fontSize: "28px",
    fontFamily: "inherit",
    fontWeight: "700",
  },
  posterNumber: {
    color: "white",
    fontSize: "100px",
    fontFamily: "inherit",
    fontWeight: "700",
  },

  posterDescription: {
    color: "white",
    fontSize: "20px",
    fontFamily: "inherit",
    fontWeight: "100",
  },

  childName: {
      '& > span': {
        lineHeight: '4px'
      }
  },
  currentUserList:{
    ['@media (max-width:977px)']: {
      width: '100%',
    },
    '& > li': {
      ['@media (max-width:977px)']: {
        display: 'block !important',
      },
      ['@media (max-width:853px)']: {
        padding: '16px 16px 90px !important',
      },
    },
  },
  currentSatusText:{
    ['@media (max-width:977px)']: {
      width: '80%',
      position: 'relative',
      marginLeft: '-20px',
    },
    ['@media (max-width:853px)']: {
      width: '100%',
    },
  }
});

const PrettoSlider = withStyles({
  root: {
    color: "#E1402A",
    height: 8,
    padding: '5px 0',
    "& .MuiSlider-markLabel" :{
      ['@media (max-width:1024px)']: {
        top: '15px',
      },
    }
  },
  thumb: {
    height: 24,
    width: 24,
    backgroundColor: "#fff",
    border: "2px solid currentColor",
    marginTop: -8,
    marginLeft: -12,
    "&:focus, &:hover, &$active": {
      boxShadow: "inherit",
    },
  },
  active: {}, 
  valueLabel: {
    left: "calc(-50% + 4px)",
  },
  track: {
    height: 8,
    borderRadius: 4,
  },
  rail: {
    height: 8,
    borderRadius: 4,
  },
  MuiSliderMarkLabel: {
    top: '15px',
  },
})(Slider);

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: 0,
      page: 0,
      rowsPerPage: 25,
    };
  }
  componentDidMount() {
    const { currentUser } = this.props;
    this.props.getDashboardDetail(currentUser.id);
    this.props.getDashboardOrphansDetail(currentUser.id);
    this.props.getNotifications();
  }
  handleChangeRowsPerPage = (e) => {
    this.setState({ rowsPerPage: e.target.value, page: 0 })
  }
  handleChangePage = (event, newPage) => {
    this.setState({ page: newPage })
  }
  marksValue = (status) => {
    return [{ value: 0, label: "$0" }, { value: status.total_requirement, label: `$${status.total_requirement}` }];
  }
  render() {
    const { page, rowsPerPage } = this.state;
    const { classes, data = {}, currentUser, notification, items, mySponsoredOrphans = {} } = this.props;
    const { myOrphans = [] } = mySponsoredOrphans;
    const { newChild = [], currentStatus = [], totalChilds = 0, noOfDonation = 0 } = data;
    console.log(currentStatus, 'currentStatus')
    function donationValue(value) {
      return `${value * 10}`;
    }

    return (
      <MainLayout>
        <Grid container spacing={4}>
          <Grid item xs={12} lg={8}>
            <Grid container spacing={4} direction="column">
              <DashboardNotification notification={notification} />
              <Grid item>
                <Card>
                  <CardContent>
                    <h2>Current Status</h2>
                    {currentStatus.length == 0 && (
                      <Typography align="center">
                        Make donation for any child &nbsp;

                        <Link
                            href="/orphans"
                            variant="body2"
                            className={classes.removeHover}
                        >
                            <Button
                                variant="contained"
                                size="medium"
                                color="primary"
                                className={classes.adoptChild}
                            >
                            Donate Now
                        </Button>
                        </Link>
                      </Typography>
                    )}
                    <List className={classes.currentUserList}>
                      {currentStatus.length > 0 && currentStatus.map((currentSatus, indexValue) => (
                        <ListItem
                          key={indexValue}
                        >
                          <ListItemIcon>
                            <Avatar
                              className={classes.statusAvatar}
                              src={getImageUrl(currentSatus.image)}
                            />
                          </ListItemIcon>

                          {/* <ListItemText primary="Lorem Impulse">
                          </ListItemText> */}

                            <Grid item lg={12} md={12}
                                className={[
                                classes.cardContent,
                                classes.statusCardPadding,
                                ]}
                            >
                                <Grid
                                container
                                direction="row"
                                justify="center"
                                alignItems="center"
                                alignItems="left"
                                spacing={2}
                                className={classes.currentSatusText}
                                >
                                    <Grid item md={12}
                                        className={[
                                            classes.flexInline
                                        ]}
                                    >
                                        <Grid item lg={6}
                                            className={[
                                                classes.flexInline
                                            ]}
                                        >
                                          
                                           
                                        </Grid>
                                        <Grid item lg={6}
                                            className={[
                                                classes.cardDonationTitle,
                                                classes.statusCardMarging,
                                                classes.flexInline
                                            ]}
                                        >
                                            {currentSatus.orphan_name}
                                        </Grid>
                                    </Grid>
                                    <Grid item md={12}
                                        className={[
                                            classes.flexInline
                                        ]}
                                    >
                                        <Grid item sm={12} md={4}
                                            className={[
                                                classes.flexInline
                                            ]}
                                        >
                                            <Grid item md={12}
                                                className={[
                                                classes.cardDescriptionText,
                                                classes.flextRow,
                                                classes.statusCardMarging,
                                                ]}
                                            >
                                                <Grid item md={2}
                                                    className={classes.cardContent}
                                                >
                                                    <Avatar
                                                        className={[
                                                        classes.orange,
                                                        classes.donationCount,
                                                        ]}
                                                    >
                                                        {currentSatus.donation_count}
                                                    </Avatar>
                                                </Grid>
                                                <Grid item md={10}
                                                    className={[
                                                        classes.cardContent,
                                                        classes.statusCardMarging,
                                                    ]}
                                                >
                                                    <div className={classes.cardDescriptionText}>
                                                        Donations
                                                    </div>
                                                </Grid>
                                            </Grid>
                                        </Grid>
                                        <Grid item sm={12} md={8}
                                            className={[
                                                classes.flexInline
                                            ]}
                                        >
                                            <Grid item md={12}
                                                className={[
                                                classes.cardContent,
                                                classes.petroSlider,
                                                ]}
                                            >
                                                <PrettoSlider
                                                    defaultValue={(currentSatus.total_requirement - currentSatus.pending_requirement)}
                                                    getAriaValueText={donationValue}
                                                    aria-labelledby="discrete-slider-always"
                                                    valueLabelDisplay="auto"
                                                    min={0}
                                                    marks={this.marksValue(currentSatus)}
                                                    max={currentSatus.total_requirement}
                                                    valueLabelDisplay="on"
                                                    disabled={false}
                                                />
                                            </Grid>
                                        </Grid>
                                    </Grid>
                                </Grid>
                            </Grid>

                            <Grid
                                item
                                md={3}
                                className={[
                                    classes.cardContent,
                                    classes.statusCardPadding,
                                    classes.alignRight,
                                    classes.btnPadding,
                                ]}
                            >
                                <Link
                                    href="/orphans/[detail]"
                                    as={`/orphans/${currentSatus.orphan_id}`}
                                    variant="body2"
                                    className={classes.removeHover}
                                >
                                    <Button
                                        variant="contained"
                                        size="medium"
                                        color="primary"
                                        className={classes.adoptChild}
                                    >
                                    View More
                                </Button>
                                </Link>
                            </Grid>
                        </ListItem>
                      ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} lg={4}>
            <Grid container spacing={4} direction="column">
              <Grid item xs>
                <Card className={classes.poster}>
                  <CardMedia
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography
                      className={classes.posterTitle}
                      gutterBottom
                      variant="h5"
                      component="h2"
                    >
                      {currentUser.roleName === "Champion"
                        ? "TOTAL CHILD ADOPTED"
                        : "TOTAL AMOUNT OF DONATION"}
                      {/* {currentUser.roleName === "Champion"
                        ? "TOTAL CHILD ADOPTED"
                        : "TOTAL NUMBER OF ORPHANS"} */}
                    </Typography>
                    <Typography
                      className={classes.amountNumber}
                      variant="subtitle2"
                      color="textSecondary"
                      component="p"
                    >
                    {currentUser.roleName === "Champion" ? totalChilds : `$${Number(totalChilds).toFixed(2)}`}
                      {/* {currentUser.roleName === "Champion" ? totalChilds : myOrphans.length} */}
                    </Typography>
                    {/* <Typography
                      className={classes.posterDescription}
                      variant="body2"
                      color="textSecondary"
                      component="p"
                    >
                      {currentUser.roleName === "Champion"
                        ? "Your Children Received Love And Support"
                        : "Because of you many children will receive smile"}
                      <br />
                    </Typography> */}
                  </CardContent>
                </Card>
              </Grid>
             {currentUser.roleName === "Angel" &&
              <Grid item xs className={classes.countWidget}>
                <Card className={classes.poster}>
                  <CardMedia
                    image="/static/images/cards/contemplative-reptile.jpg"
                    title="Contemplative Reptile"
                  />
                  <CardContent>
                    <Typography
                      className={classes.posterTitle}
                      gutterBottom
                      variant="h5"
                      component="h2"
                    >
                    {"TOTAL NUMBER OF DONATIONS"}
                    </Typography>
                    <Typography
                      className={classes.amountNumber}
                      variant="subtitle2"
                      color="textSecondary"
                      component="p"
                    >
                      {noOfDonation}
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              }
              {/* <Grid item xs>
                <Card>
                  <CardContent>
                    <h2>New Child Added</h2>
                    <List>
                      {newChild.length == 0 && (
                        <Typography align="center" className={"mt-4"}>
                          No record Found
                        </Typography>
                      )}
                      {newChild.length > 0 &&
                        newChild.map((child, indexValue) => (
                            <ListItem component={Paper} key={indexValue}>
                                <ListItemAvatar>
                                    <Avatar
                                        className={classes.blogAvatar}
                                        src={getImageUrl(child.image)}
                                    />
                                </ListItemAvatar>
                                <ListItemText className={classes.childName} primary={(
                                    <span className={classes.cardDonationTitle}>
                                        {child.name}
                                    </span>
                                )} />
                                <ListItemIcon>
                                    <Link
                                        href="/childrens/[detail]"
                                        as={`/childrens/${child.id}`}
                                        variant="body2"
                                        className={classes.removeHover}
                                        >
                                        <Button
                                            variant="contained"
                                            size="small"
                                            color="primary"
                                            className={classes.adoptChild}
                                            >
                                            View
                                        </Button>
                                    </Link>
                                </ListItemIcon>
                          </ListItem>
                        ))}
                    </List>
                  </CardContent>
                </Card>
              </Grid> */}
            </Grid>
          </Grid>

          {currentUser.roleName === "Angel" &&
          <Grid item xs={12} >
          <Card>
            <CardContent>
              <h2 className={classes.sponsorHeader}>My Sponsored Orphans</h2>

              <Grid container spacing={4}>
                <Grid item xs={12} spacing={3} className={classes.fullWidth} >
                  <TableContainer component={Paper}>
                    <Table className={classes.table} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                          <StyledTableCell>Orphan Name</StyledTableCell>
                          <StyledTableCell align="center">Age</StyledTableCell>
                          <StyledTableCell align="center">Gender</StyledTableCell>
                          <StyledTableCell align="center">Location</StyledTableCell>
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {
                            myOrphans.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                              .map((row) => (

                            <StyledTableRow key={row.id}>
                              <StyledTableCell component="th" scope="row">
                                {row.first_name}{''}{row.last_name}
                              </StyledTableCell>
                              <StyledTableCell align="center">{row.age}</StyledTableCell>
                              <StyledTableCell align="center">{row.gender}</StyledTableCell>
                              <StyledTableCell align="center">{row.country_of_birth}</StyledTableCell>
                            </StyledTableRow>
                          ))}
                      </TableBody>
                        {myOrphans.length == 0 &&
                        <StyledTableRow>
                          <StyledTableCell align="center" colSpan="5">
                            No result found
                              </StyledTableCell>
                        </StyledTableRow>
                      }
                    </Table>
                  </TableContainer>
                  <TablePagination
                    component="div"
                    count={myOrphans.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangePage={this.handleChangePage}
                    onChangeRowsPerPage={this.handleChangeRowsPerPage}
                  />
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        }
        </Grid>
      </MainLayout >
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getDashboardDetail: getDashboardDetail,
      getDashboardOrphansDetail: getDashboardOrphansDetail,
      getNotifications: getNotifications,
      getAllChildrens: getAllChildrens,
      searchChild: searchChild,
      getLocations: getLocations,
    },
    dispatch
  );
};
function mapStateToProps({ auth, dashboard, notification, childrens, userProfile }) {
  return {
    currentUser: auth.user,
    data: dashboard.data,
    mySponsoredOrphans: dashboard.orphans,
    notification: notification,
    items: childrens.searchOption,
    locations: userProfile.locations,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withApollo(withAuth(Index)))
);
