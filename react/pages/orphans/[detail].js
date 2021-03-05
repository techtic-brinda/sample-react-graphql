import { Component } from "react";
import {
  Typography,
  withStyles,
  Grid,
  Tabs,
  Tab,
  AppBar,
  Box,
  Card,
} from "@material-ui/core";

import { connect } from "react-redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import MainLayout from "../../components/layout/main";
import PropTypes from "prop-types";
import { withRouter } from 'next/router'
import { getChildrenProfile, addEducation, addHealth, addRequirement,getCategories, onDeleteEducation, onDeleteHealth } from "../../src/store/actions";
import { bindActionCreators } from "redux";
import ChildrenInfo from "./childrenInfo"
import PersonalInformation from "./personalInformation"
import EducationInformation from "./educationInformation"
import HealthInformation from "./healthInformation"
import DonationInformation  from "./donationInformation"
import {BreadCrumbsComponent} from "../../components/common";

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
  expansionHeading: {
    fontSize: "13px",
    color: "#444444"
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


class ChildrenDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: 0,
      id: props.router.query.detail,
    };
  }
  componentDidMount() {
    this.props.getChildrenProfile(this.state.id);
    if(this.props.categories.length ===0){
      this.props.getCategories()
    }
  }

  onSaveEducation =(data) =>{
    data.orphanId = this.state.id
    this.props.addEducation(data)
  }

  onSaveHealth =(data) =>{
    data.orphanId = this.state.id
    this.props.addHealth(data)
  }

  onSaveRequirement =(data) =>{
    data.orphanId = this.state.id
    this.props.addRequirement(data)
  }

  handleDeleteEducation =(id, profileId) =>{
    this.props.onDeleteEducation(id, profileId)
  }
  handleDeleteHealth =(id, profileId) =>{
    this.props.onDeleteHealth(id, profileId)
  }
  

  render() {
    const { classes, childrenProfile, addSuccess } = this.props;
    const handleChange = (event, newValue) => {
      this.setState({
        value: newValue,
      });
    };
    return (
      <MainLayout>
        <Grid container direction="row" justify="flex-start" spacing={2}>
          <Grid item xs={12}>
            <BreadCrumbsComponent />
          </Grid>
          <Grid item xs={12} sm={12} md={3} lg={3}>
            <Grid spacing={3} style={{ textAlign: "center" }}>
              <Grid item>
                <ChildrenInfo childrenProfile={childrenProfile} />
              </Grid>
            </Grid>
          </Grid>
          <Grid item xs={12} sm={12} md={9} lg={9}>
            <Card>
                  <AppBar position="static">
                    <Tabs
                      value={this.state.value}
                      onChange={handleChange}
                      variant="scrollable"
                      scrollButtons="auto"
                    >
                      <Tab label="Personal" {...a11yProps(0)} className={classes.textTransform} />
                      <Tab label="Education" {...a11yProps(1)} className={classes.textTransform} />
                      <Tab label="Health" {...a11yProps(2)} className={classes.textTransform} />
                      {/* <Tab label="Requirement" {...a11yProps(3)} className={classes.textTransform} />
                      <Tab label="Donation" {...a11yProps(4)} className={classes.textTransform} /> */}
                      <Tab label="Additional Information" {...a11yProps(3)} className={classes.textTransform} />
                    </Tabs>
                  </AppBar>
                  <TabPanel value={this.state.value} index={0}>
                    <PersonalInformation childrenProfile={childrenProfile} />
                  </TabPanel>
                  <TabPanel value={this.state.value} index={1}>
                    <EducationInformation onDeleteEducation={(id, profId) => this.handleDeleteEducation(id, profId)} addSuccess={addSuccess} onSaveEducation={(data)=>this.onSaveEducation(data)} childrenProfile={childrenProfile} />
                  </TabPanel>
                  <TabPanel value={this.state.value} index={2}>
                    <HealthInformation onDeleteHealth={(id, profId) => this.handleDeleteHealth(id, profId)} addSuccess={addSuccess} onSaveHealth={(data)=>this.onSaveHealth(data)} childrenProfile={childrenProfile} />
                  </TabPanel>

                  {/* <TabPanel value={this.state.value} index={3}>
                      <RequirementInformation categories={categories} addSuccess={addSuccess} onSaveRequirement={(data)=>this.onSaveRequirement(data)} childrenProfile={childrenProfile}  />
                  </TabPanel>
                  <TabPanel value={this.state.value} index={4}>
                      <DonationInformation childrenProfile={childrenProfile} />
                  </TabPanel> */}
                  <TabPanel value={this.state.value} index={3}>
                    {/* <Grid>
                      <h2>Requirement</h2>
                      <RequirementInformation categories={categories} addSuccess={addSuccess} onSaveRequirement={(data) => this.onSaveRequirement(data)} childrenProfile={childrenProfile} />
                    </Grid>
                    <br></br> */}
                    <Grid>
                      <h2>Donations History</h2>
                      <DonationInformation childrenProfile={childrenProfile} />
                    </Grid>
                  </TabPanel>

              </Card>
          </Grid>
        </Grid>
      </MainLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getChildrenProfile: getChildrenProfile,
      addEducation : addEducation,
      onDeleteEducation : onDeleteEducation,
      onDeleteHealth : onDeleteHealth,
      addHealth : addHealth,
      addRequirement : addRequirement,
      getCategories : getCategories,
    },
    dispatch
  );
};

function mapStateToProps({ childrens,auth }) {
  return {
    childrenProfile: childrens.childrenProfile,
    addSuccess:childrens.addSuccess,
    categories : auth.categories
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withAuth(withRouter(ChildrenDetails))))
);
