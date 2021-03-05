import { Component } from "react";
import {
  Button,
  Typography,
  withStyles,
  Grid,
  Avatar,
  Paper,
  Tabs,
  Tab,
  AppBar,
  Box,
  ListItem,
  Card,
  CardContent,
  CardActions,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import MainLayout from "../../components/layout/main";
import AddButton from "../../components/common/addButton";
import PropTypes from "prop-types";
import ExpansionPanel from '@material-ui/core/ExpansionPanel';
import ExpansionPanelSummary from '@material-ui/core/ExpansionPanelSummary';
import ExpansionPanelDetails from '@material-ui/core/ExpansionPanelDetails';
import DateRangeIcon from '@material-ui/icons/DateRangeOutlined';
import AccessTimeIcon from '@material-ui/icons/AccessTime';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import Slider from '@material-ui/core/Slider';

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

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

const styles = (theme) => ({
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
    padding: '6px 20px',
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
    fontWeight: "700",
    fontSize: "12px",
    color: "#3D3D3D",
  },
  tabPersonalInfo: {
    padding: "5px",
  },
  tabDonationInfo: {
    padding: "5px 0px 5px 20px",
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

  blogTimeStamp: {
    fontSize: "12px",
    color: "#7d7d7d",
    color: "#7d7d7d",
    padding: '3px 20px',
  },

  iconFont: {
    marginBottom: '-3px',
    fontSize: '16px',
    color: '#e1402ad1'
  },

  blogPrice: {
    fontSize: "18px",
    fontWeight: "700",
    color: "#7d7d7d",
    padding: '6px 20px',
    margin: "auto"
  },

  testing: {
    boxShadow: "0 2px 10px rgba(0,0,0,0.1), 0 2px 2px rgba(0,0,0,0.02) !important",
    marginLeft: "100px !important",
  },

  donamtionSubDiv: {
    padding: "8px 24px 24px 130px",
  },

  DonationBtmMargin: {
    marginBottom: "-90px",
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
})(Slider);

class ChildrenDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: 0,
    };
  }

  render() {

    const { classes, value, errorMessage, successMessage } = this.props;

    const marks = [
      {
        value: 0,
        label: '$0',
      },
      {
        value: 1000,
        label: '$1000',
      },
    ];

    function donationValue(value) {
      return `${value * 10}`;
    }

    const handleChange = (event, newValue) => {
      this.setState({
        value: newValue,
      });
    };

    const DonationPostCount = [0, 1, 2];

    return (
      <MainLayout>
        <Grid container direction="row" justify="flex-start" spacing={2}>
          <Grid item md={3} sm={3}>
            <Grid spacing={3} align="center">
              <Grid item>
                <Paper className={classes.paper} elevation={2}>
                  <br></br>
                  <Typography variant="h5" className={classes.cardHeader}>
                    Children Info
                  </Typography>
                  <Grid container justify="center" alignItems="center">
                    <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
                      <Grid item xs={6}>
                        <br />
                        <Avatar variant="align-content: center" className={classes.avatar} src="images/avatar/3.jpg" />
                      </Grid>
                    </Grid>
                    <Grid item xs={9} className={classes.cardBody}>
                      <Typography variant="h5" className={classes.cardTitle}>
                        Victoria John
                            </Typography>
                      <br />
                      <Typography variant="subtitle1" className={classes.description}>
                        Industry's standard dummy text ever since the 1500s,
                            </Typography>
                    </Grid>
                  </Grid>
                  <Grid container spacing={1}>
                    <Grid item xs={12}>
                      <Button variant="contained" size="medium" color="primary" className={classes.margin, classes.adoptChild}>
                        Donate Child
                      </Button>
                    </Grid>

                  </Grid>
                  <br></br>
                </Paper>
              </Grid>
            </Grid>
          </Grid>
          <Grid item md={9} sm={9}>
            <Paper variant="outlined" className={classes.paper}>
              <AppBar position="static">
                <Tabs
                  value={this.state.value}
                  onChange={handleChange}
                  aria-label="simple tabs example"
                >
                  <Tab label="Personal Information" {...a11yProps(0)} className={classes.textTransform} />
                  <Tab label="Education Information" {...a11yProps(1)} className={classes.textTransform} />
                  <Tab label="Health Information" {...a11yProps(2)} className={classes.textTransform} />
                  <Tab label="Requirement" {...a11yProps(3)} className={classes.textTransform} />
                  <Tab label="Donation" {...a11yProps(4)} className={classes.textTransform} />
                </Tabs>
              </AppBar>
              <TabPanel value={this.state.value} index={0}>

                <Grid container>
                  <Grid container>
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        First Name:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        Victoria John Bruce
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Date of Birth:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        12/05/2017
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Age (Computed):
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        5 Years
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Place of Birth:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        Albany
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Country of Birth:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        United States
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Nationality:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        American
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        # Years in institution:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        2-3 Years
                    </Typography>
                    </Grid>
                  </Grid>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={3} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Comments:
                    </Typography>
                    </Grid>
                    <Grid item xs={9} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.boldDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Typography>
                    </Grid>
                  </Grid>
                </Grid>
              </TabPanel>
              <TabPanel value={this.state.value} index={1}>

                <Grid container justify="center" alignItems="right">
                  <Grid container spacing={0} direction="column" align="right" justify="right" >
                    <Grid item xs={12}>
                      <AddButton />
                    </Grid>
                  </Grid>
                </Grid>
                <br />

                <div className={classes.root}>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>01</b> &nbsp;&nbsp;&nbsp;Grade Level</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography className={classes.expansionDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                    </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>02</b> &nbsp;&nbsp;&nbsp;Comments</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography className={classes.expansionDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>03</b> &nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography className={classes.expansionDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  <ExpansionPanel>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel2a-content"
                      id="panel2a-header"
                    >
                      <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>04</b> &nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Typography className={classes.expansionDescription}>
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse malesuada lacus ex,
                        sit amet blandit leo lobortis eget.
                      </Typography>
                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                </div>
              </TabPanel>
              <TabPanel value={this.state.value} index={2}>

                <Grid container justify="center" alignItems="right">
                  <Grid container spacing={0} direction="column" align="right" justify="right" >
                    <Grid item xs={12}>
                      <AddButton />
                    </Grid>
                  </Grid>
                </Grid>
                <br />

                <div className={classes.root}>

                {DonationPostCount.map((indexValue) => (
                  <ExpansionPanel key={indexValue}>
                    <ExpansionPanelSummary
                      expandIcon={<ExpandMoreIcon />}
                      aria-controls="panel1a-content"
                      id="panel1a-header"
                    >
                      <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>{(indexValue+1)}</b> &nbsp;&nbsp;&nbsp;Lorem Impulse</Typography>
                    </ExpansionPanelSummary>
                    <ExpansionPanelDetails>
                      <Grid container>
                        <Grid container>
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Vaccinations:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              Tetanus
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Last Doctor's:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              Lorem ipsum dolor
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Medical Exam:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              Lorem ipsum dolor
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Disabilities:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              No
                            </Typography>
                          </Grid>
                        </Grid>

                        <Grid container justify="center" alignItems="center">
                          <Grid item xs={3} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.description}>
                              Comments:
                            </Typography>
                          </Grid>
                          <Grid item xs={9} className={classes.tabPersonalInfo}>
                            <Typography variant="subtitle1" className={classes.boldDescription}>
                              Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                            </Typography>
                          </Grid>
                        </Grid>
                      </Grid>

                    </ExpansionPanelDetails>
                  </ExpansionPanel>
                  ))}
                </div>
              </TabPanel>
              <TabPanel value={this.state.value} index={3}>

                <Grid container justify="center" alignItems="right">
                  <Grid container spacing={0} direction="column" align="right" justify="right" >
                    <Grid item xs={12}>
                      <Button variant="contained" size="medium" color="primary" className={classes.margin, classes.adoptChild}>
                        Add
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>


                <Grid container>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={12} className={classes.tabPersonalInfo}>
                      <br></br>
                      <div className={classes.root}>
                        <ExpansionPanel>
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>01</b> &nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet</Typography>
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
                                    Victoria John
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
                                    12-3-20
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
                                    $375,000
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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                </Typography>
                                </Grid>
                              </Grid>

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
                                      defaultValue={700}
                                      getAriaValueText={donationValue}
                                      aria-labelledby="discrete-slider"
                                      valueLabelDisplay="auto"
                                      step={100}
                                      marks={marks}
                                      min={0}
                                      max={1000}
                                    />
                                  </div>
                                </Grid>
                              </Grid>

                            </Grid>

                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                          >
                            <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>02</b> &nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet</Typography>
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
                                    Victoria John
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
                                    12-3-20
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
                                    $375,000
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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                  </Typography>
                                </Grid>
                              </Grid>

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
                                      defaultValue={700}
                                      getAriaValueText={donationValue}
                                      aria-labelledby="discrete-slider"
                                      valueLabelDisplay="auto"
                                      step={100}
                                      marks={marks}
                                      min={0}
                                      max={1000}
                                    />
                                  </div>
                                </Grid>
                              </Grid>

                            </Grid>

                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                        <ExpansionPanel>
                          <ExpansionPanelSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel2a-content"
                            id="panel2a-header"
                          >
                            <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>03</b> &nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet</Typography>
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
                                    Victoria John
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
                                    12-3-20
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
                                    $375,000
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
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                                    </Typography>
                                </Grid>
                              </Grid>

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
                                      defaultValue={700}
                                      getAriaValueText={donationValue}
                                      aria-labelledby="discrete-slider"
                                      valueLabelDisplay="auto"
                                      step={100}
                                      marks={marks}
                                      min={0}
                                      max={1000}
                                    />
                                  </div>
                                </Grid>
                              </Grid>

                            </Grid>

                          </ExpansionPanelDetails>
                        </ExpansionPanel>
                      </div>

                    </Grid>
                  </Grid>

                </Grid>

              </TabPanel>
              <TabPanel value={this.state.value} index={4}>

                <Grid container>

                  <Grid container justify="center" alignItems="center">
                    <Grid item xs={12} className={classes.tabPersonalInfo}>
                      <br></br>
                      <div className={classes.root}>

                        {DonationPostCount.map((indexValue) => (
                          <ExpansionPanel key={indexValue}>
                            <ExpansionPanelSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls="panel1a-content"
                              id="panel1a-header"
                              style={{ boxShadow: "" }}
                            >
                              {/* <Typography className={classes.expansionHeading}><b className={classes.expansionNumber}>01</b> &nbsp;&nbsp;&nbsp;Lorem ipsum dolor sit amet</Typography> */}

                              <ListItem >
                                <Grid container direction="row" justify="flex-start" spacing={2}>

                                  <Grid item md={1}>
                                    <Avatar variant="align-content: center" className={classes.donationAvatar} src="images/avatar/4.png" />
                                  </Grid>
                                  <Grid item md={4}>
                                    <Grid container spacing={0} direction="column" alignItems="right">
                                      <Grid item md={12} sm={12} className={classes.blogTitle}>
                                        Andrew Hardy
													          </Grid>
                                      <Grid item md={12} sm={12} className={classes.blogTimeStamp}>
                                        <DateRangeIcon className={classes.iconFont} /> July 26, 2019 &nbsp;&nbsp;&nbsp;
														          <AccessTimeIcon className={classes.iconFont} /> 01:51 Pm
													          </Grid>ccc
                                  </Grid>
                                  </Grid>
                                  <Grid item md={6} direction="row" alignItems="center" className={classes.blogPrice}>
                                    <Grid item md={12} sm={12} className={classes.alignRight} align="Right">
                                      $350
													        </Grid>
                                  </Grid>
                                </Grid>
                              </ListItem>
                            </ExpansionPanelSummary>
                            <ExpansionPanelDetails>

                              <Card className={[classes.root, classes.testing]} variant="outlined">

                                <CardContent key={indexValue}>

                                  <Grid item md={10}>
                                    <Grid container spacing={0} direction="column" alignItems="left">
                                      <Grid item md={12} sm={12} className={classes.blogTitle}>
                                        Andrew Hardy
                                        </Grid>
                                      <Grid item md={12} sm={12} className={classes.blogTimeStamp}>
                                        <DateRangeIcon className={classes.iconFont} /> July 26, 2019 &nbsp;&nbsp;&nbsp;
                                          <AccessTimeIcon className={classes.iconFont} /> 01:51 Pm
                                        </Grid>
                                    </Grid>

                                    <Grid container justify="center" alignItems="left">
                                      <Grid item xs={3} className={classes.tabDonationInfo}>
                                        <Typography variant="subtitle1" className={classes.boldDescription}>
                                          School fees
                                          </Typography>
                                      </Grid>
                                      <Grid item xs={9} className={classes.tabDonationInfo} align="left">
                                        <Typography variant="subtitle1" className={classes.description}>
                                          $100
                                          </Typography>
                                      </Grid>
                                      <Grid item xs={3} className={classes.tabDonationInfo}>
                                        <Typography variant="subtitle1" className={classes.boldDescription}>
                                          Medical
                                          </Typography>
                                      </Grid>
                                      <Grid item xs={9} className={classes.tabDonationInfo} align="left">
                                        <Typography variant="subtitle1" className={classes.description}>
                                          $100
                                          </Typography>
                                      </Grid>
                                      <Grid item xs={3} className={classes.tabDonationInfo}>
                                        <Typography variant="subtitle1" className={classes.boldDescription}>
                                          Other
                                          </Typography>
                                      </Grid>
                                      <Grid item xs={9} className={classes.tabDonationInfo} align="left">
                                        <Typography variant="subtitle1" className={classes.description}>
                                          $50
                                          </Typography>
                                      </Grid>
                                    </Grid>

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

              </TabPanel>
            </Paper>
          </Grid>
        </Grid>
      </MainLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => { };

export default withStyles(styles, { withTheme: true })(
  connect(
    null,
    mapDispatchToProps
  )(withApollo(withAuth(ChildrenDetails)))
);
