import { Component } from "react";
import {
  Button,
  Box,
  Typography,
  withStyles,
  Grid,
  Card,
  CardContent,
  Avatar,
  Paper,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
  TextField,
  ListItemIcon,
} from "@material-ui/core";
import { connect } from "react-redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import MainLayout from "../../components/layout/main";
import { AdoptChildButton, Link, BreadCrumbsComponent } from "../../components/common";
import { getAllChildrens, searchChild, getCategories, getLocations } from "../../src/store/actions";
import { bindActionCreators } from "redux";
import Formsy from 'formsy-react';
import { getImageUrl } from '../../src/helpers';
import CircularProgress from '@material-ui/core/CircularProgress';
import { ChildIcon } from '../../components/icons';
const styles = (theme) => ({
  formControl: {
    margin: '8px 0',
    minWidth: 120,
  },
  formControlNoWidth: {
    margin: theme.spacing(1),
    "& .MuiSelect-iconOutlined": {
      right: "0px !important"
    }
  },
  paper: {
    height: "100% !important",
    paddingBottom: "10px !importnat",
    alignItems: "center",
    position: "relative"
    ,
    '& .MuiListItemIcon-root': {
      minWidth: '30px',
      color: '#e1402a'
    }
  },
  avatar: {
    height: 100,
    width: 100,
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  removeHover: {
    textDecorationStyle: 'none'
  },
  viewProfile: {
    textTransform: "none !important",
    fontSize: "12px",
    padding: "9px 0!important",
    color: "#e1402a",
    float: "left",
  },
  cardTitle: {
    display: "flex",
    justifyContent: "center",
    fontSize: "18px",
    fontWeight: "700",
    color: "#333333"
  },
  cardDescription: {
    fontSize: "12px",
    color: "#7d7d7d",
  },
  boldFilter: {
    fontSize: "12px",
    fontWeight: "700",
    color: "#7d7d7d",
  },
  cardBody: {
    padding: "20px",
  },
  pagination: {
    paddingTop: "20px",
  },
  selectTag: {
    width: '-webkit-fill-available'
  },
  marginReset: {
    marginTop: "auto",
    marginBottom: "auto",
  },
  titleFilter: {
    maxWidth: '100px',
    flexBasis: 'auto',
    ['@media (max-width:960px)']: {
      // eslint-disable-line no-useless-computed-key
      textAlign: 'left',
      maxWidth: 'unset',
      flexBasis: '100%',
    }
  },
  buttonFilter: {
    ['@media (max-width:960px)']: {
      // eslint-disable-line no-useless-computed-key
      flexBasis: 'auto',
    }
  },
  adoptChild: {
    textTransform: "none !important",
    fontSize: "12px",
    padding: "9px 0!important",
    float: "right",
  },
  absoBottom: {
    position: 'absolute',
    bottom: '10px',
    ['@media (max-width:575px)']: {
      position: 'static !important',
      paddingBottom: '20px !important',
      
    }
  },
  clearfix: {
    clear: 'both'
  },
  buttonItem: {
    padding: '5px 12px !important',
  },
  singleItem: {
    textAlign: "center",
    height: "330px",
    ['@media (max-width:1199px)']: {
      height: "340px",
    },
    ['@media (max-width:860px)']: {
      // eslint-disable-line no-useless-computed-key
      maxWidth: '100%',
      flexBasis: '100%',
    },
    ['@media (max-width:575px)']: {
      height: 'auto',
      // eslint-disable-line no-useless-computed-key
    }
  },
  mainLoader:{
    textAlign: 'center',
    margin: '50px 0px 50px 0px',
  },
});

class Children extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      search: {
        age: '',
        gender: '',
        category: '',
        fund: '',
        champion: this.props.currentUser.id,
        roleName: '',
        location: '',
      }
    };
  }

  componentDidMount() {
    const { currentUser } = this.props
    if (currentUser) {
      const { search } = this.state
      search['roleName'] = currentUser.roleName
      search['id'] = currentUser.id
      this.setState(
        { search },
        () => this.props.searchChild(this.state.search)
      )
    }
    if (this.props.categories.length === 0) {
      this.props.getCategories()
    }
    this.props.getLocations()
  }
  handleSearch = (name, value) => {
    const { search } = this.state
    search[name] = value;
    this.setState({ search })
    this.props.searchChild(this.state.search);
  }
  handleResetForm = () => {
    this.setState(
      { search: { age: '', gender: '', category: '', fund: '', roleName: this.props.currentUser.roleName } },
      () => this.props.searchChild(this.state.search)
    );
  }
  onTextChange = (name, value) => {
    const { search } = this.state
    search[name] = value
    this.setState(search)
    if (value.length > 3) {
      this.props.searchChild(this.state.search)
    }
  }
  render() {
    const { classes, items, locations, searchloader = true } = this.props;
    const { age, gender, category, fund, location } = this.state.search
    let ageOptions = [];
    const ageGroup = ['0-5', '6-10', '11-15', '16-21', 'Above 21'];
    ageGroup.map((item)=>{
      ageOptions.push(<MenuItem key={item} value={item}>{item}</MenuItem>)
    })
    return (
      <MainLayout>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BreadCrumbsComponent />
          </Grid>
          <Grid item xs={12}>
            <Box >
              <Card>
                <CardContent>
                  <h2>Our Orphans</h2>
                  <Grid item xs={12} align="Right">
                    <Formsy
                      className={classes.formControl}
                    >
                      <Grid container spacing={2} direction="row">
                        <Grid item xs={12} sm={12} md={1} lg={1} align="Right" className={`${classes.marginReset} ${classes.titleFilter}`}>
                          <Typography align="centre|right" variant="h5" className={classes.boldFilter}>
                            Filter by:
                        </Typography>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3} align="Left">
                          <FormControl size={'small'} variant="outlined" className={classes.formControl} fullWidth>
                            <InputLabel id="location">Location</InputLabel>
                            <Select
                              labelId="location"
                              id="location"
                              value={location}
                              onChange={(e) => this.handleSearch('location', e.target.value)}
                              label="Location"
                              InputLabelProps={{
                                shrink: true,
                              }}
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {locations.map(location => (
                                <MenuItem key={location.id} value={location.name}>{location.name}</MenuItem>
                              ))}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6} md={3} lg={3} align="Left">
                          <FormControl size={'small'} variant="outlined" className={classes.formControl} fullWidth>
                            <InputLabel id="age">Age</InputLabel>
                            <Select
                              labelId="age"
                              id="age"
                              value={age}
                              onChange={(e) => this.handleSearch('age', e.target.value)}
                              label="Age"
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              {ageOptions}
                            </Select>
                          </FormControl>
                        </Grid>

                        <Grid item xs={12} sm={6} md={3} lg={3} align="Left">
                          <FormControl size={'small'} variant="outlined" className={classes.formControl} fullWidth>
                            <InputLabel id="gender">Gender</InputLabel>
                            <Select
                              labelId="gender"
                              id="gender"
                              value={gender}
                              onChange={(e) => this.handleSearch('gender', e.target.value)}
                              label="Gender"
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem key="male" value="male">Male</MenuItem>
                              <MenuItem key="female" value="female">Female</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid>

                        {/* <Grid item xs={2} align="Left">
                          <FormControl size={'small'} variant="outlined" className={classes.formControl} fullWidth>
                            <InputLabel>Requirement</InputLabel>
                            <TextField
                              id="category"
                              name='category'
                              variant="outlined"
                              size="small"
                              value={category}
                              InputLabelProps={{
                                shrink: true,
                              }}
                              onChange={(e) => this.onTextChange('category', e.target.value)}
                            />
                          </FormControl>
                        </Grid> */}

                        {/* <Grid item xs={3} align="Left">
                          <FormControl size={'small'} variant="outlined" className={classes.formControl} fullWidth>
                            <InputLabel id="fund">Require Amount</InputLabel>
                            <Select
                              labelId="fund"
                              id="fund"
                              value={fund}
                              onChange={(e) => this.handleSearch('fund', e.target.value)}
                              label="Require Amount"
                            >
                              <MenuItem value="">
                                <em>None</em>
                              </MenuItem>
                              <MenuItem key="1" value="100">$100.00</MenuItem>
                              <MenuItem key="2" value="200">$200.00</MenuItem>
                              <MenuItem key="3" value="500">$500.00</MenuItem>
                              <MenuItem key="4" value="1000">$1000.00</MenuItem>
                              <MenuItem key="5" value="3000">$3000.00</MenuItem>
                              <MenuItem key="6" value="5000">$5000.00</MenuItem>
                              <MenuItem key="6" value="10000">$10000.00</MenuItem>
                            </Select>
                          </FormControl>
                        </Grid> */}

                        <Grid item xs={12} sm={6} md={2} lg={2} align="Left" className={`${classes.marginReset} ${classes.titleFilter} ${classes.buttonFilter}`}>
                          <Button onClick={this.handleResetForm} variant="contained" size="medium" color="primary" className={classes.margin, classes.adoptChild}>
                            Reset
                          </Button>
                        </Grid>
                      </Grid>
                    </Formsy>
                  </Grid>
                  {searchloader && 
                    <Grid item  className={classes.mainLoader}>
                      <CircularProgress />
                    </Grid>
                  }
                  <Grid item xs={12}>
                    <Grid container spacing={2}>
                      {!searchloader && items.length == 0 &&
                        <Grid key={'empty'} className={classes.mainLoader} item xs={12} >
                          {'Data not found!'}
                        </Grid>
                      }
                      {!searchloader && items.map((children) => (
                        <Grid key={children.id} item className={classes.singleItem} sm={6} md={4} lg={3} >
                          <Paper className={classes.paper} elevation={2}>
                            <Grid container>
                              <Grid container spacing={0} direction="column" alignItems="center" justify="center" >
                                <Grid item xs={12}>
                                  <Avatar variant="align-content: center" className={classes.avatar} src={getImageUrl(children.image)} />
                                </Grid>
                              </Grid>
                              <Grid item xs={12} className={classes.cardBody}>
                                <Typography variant="h5" className={classes.cardTitle}>
                                  {children.is_donated == "true" &&
                                    <ListItemIcon className={classes.menuIconPadding}><ChildIcon className={classes.menuIcon} /></ListItemIcon>
                                  }
                                  <span>
                                    {children.first_name + ' ' + children.last_name}
                                  </span>
                                </Typography>
                                <Typography variant="subtitle1" className={classes.cardDescription}>
                                  {(children.comments != null && children.comments.length > 30)
                                    ? `${children.comments.substring(0, 32)}...`
                                    : `${children.comments !=null ? children.comments : ''}`}
                                </Typography>
                              </Grid>
                            </Grid>
                            <span className={classes.clearfix}></span>
                            <Grid container spacing={1} className={classes.absoBottom}>
                                <Grid item xs={12} md={12} lg={6} className={classes.buttonItem}>
                                    <AdoptChildButton variant="contained" size="medium" color="primary" className={classes.margin, classes.adoptChild} row={children} />
                                </Grid>
                                <Grid item xs={12} md={12} lg={6} className={classes.buttonItem}>
                                    <Link href="/orphans/[detail]" as={`/orphans/${children.id}`} variant="body2" className={classes.removeHover}>
                                    <Button fullWidth variant="outlined" className={classes.view_profile, classes.viewProfile}
                                        spacing={3}>View Profile</Button>
                                    </Link>
                                </Grid>
                            </Grid>
                          </Paper>
                        </Grid>
                      ))}

                    {/* <Grid continer spacing={0} direction="column" alignItems="center" justify="center" className={classes.pagination}>
                            <div className={classes.root}>
                                <Pagination count={10} color="primary" />
                            </div>
                    </Grid> */}

                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Box>
          </Grid>
        </Grid>
      </MainLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      searchChild: searchChild,
      getAllChildrens: getAllChildrens,
      getCategories: getCategories,
      getLocations: getLocations,
    },
    dispatch
  );
};

function mapStateToProps({ childrens, auth, userProfile }) {
  return {
    items: childrens.searchOption,
    searchloader: childrens.searchloader,
    currentUser: auth.user,
    categories: auth.categories,
    locations: userProfile.locations,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withAuth(Children)))
);
