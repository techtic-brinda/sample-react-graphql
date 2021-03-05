import { Component } from 'react'
import {
  Button,
  Typography,
  withStyles,
  Grid,
  Avatar,
  Paper,
  Box,
  List,
  ListItem,
  Divider
} from '@material-ui/core'
import { withApollo } from '../../src/apollo'
import { withAuth } from '../../src/auth'
import MainLayout from '../../components/layout/main'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import styles from './style'
import { getSponsers } from '../../src/store/actions'
import { getDateFormat, getTimeFormat, getImageUrl } from './../../src/helpers'
import _ from 'lodash'
import { Link } from '../../components/common'
import {
  DateRangeOutlined as DateRangeIcon,
  AccessTime as AccessTimeIcon,
  ArrowForwardIos as ArrowForwardIosIcon,
} from "@material-ui/icons";


function TabPanel(props) {
  const { children, value, index, ...other } = props

  return (
    <Typography
      component='div'
      role='tabpanel'
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box p={3}>{children}</Box>}
    </Typography>
  )
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired
}

class Sponser extends Component {
  constructor(props) {
    super(props)
    this.state = {
      loading: false,
      value: 0,
      orphanDetails: null
    }
  }
  componentDidMount() {
    if (this.props.sponsers.length == 0) {
      this.props.getSponsers(this.props.currentUser.id)
    }
  }
  getChildDetails = id => {
    const childDetails = _.find(this.props.sponsers, { id: id })
    this.setState({ orphanDetails: childDetails })
  }
  render() {
    const { classes, sponsers } = this.props
    const { orphanDetails } = this.state
    console.log(sponsers, 'sponsers')
    return (
      <MainLayout>
        <Grid container direction='row' justify='flex-start' spacing={2}>
          <Grid item xs={12} sm={12} md={12} lg={9}>
            <List className={classes.root}>
              {sponsers.length > 0 && (
                <>
                  {sponsers.map((sponser, index) => (
                    <div>
                      <ListItem className={classes.pointer}
                        key={sponser.id}
                        onClick={() => this.getChildDetails(sponser.id)}
                      >
                        <Grid
                          container
                          direction='row'
                          justify='flex-start'
                          spacing={2}
                        >
                          <Grid item xs={12} sm={2} md={2} lg={2} className={classes.blogAvatarBar}>
                            <Avatar
                              variant='align-content: center'
                              className={classes.blogAvatar}
                              src={getImageUrl(sponser.sponser_image)}
                            />
                          </Grid>
                          <Grid item xs={9} sm={7} md={7} lg={7} className={classes.blogTitleBar}>
                            <Grid
                              container
                              spacing={0}
                              direction='column'
                              alignItems='left'
                            >
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className={classes.blogTitle}
                              >
                                {sponser.sponser_fname} {sponser.sponser_lname}
                              </Grid>
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className={classes.blogTimeStamp}
                              >
                                <DateRangeIcon className={classes.iconFont} />{' '}
                                {getDateFormat(sponser.created_at)}{' '}
                                &nbsp;&nbsp;&nbsp;
                                <AccessTimeIcon
                                  className={classes.iconFont}
                                />{' '}
                                {getTimeFormat(sponser.created_at)}
                              </Grid>
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={2} sm={2} md={2} lg={2}
                            direction='row'
                            alignItems='center'
                            className={classes.blogPrice}
                          >
                            <Grid
                              item
                              md={12}
                              sm={12}
                              className={classes.alignRight}
                            >
                              ${sponser.amount}
                            </Grid>
                          </Grid>
                          <Grid
                            item
                            xs={1} sm={1} md={1} lg={1}
                            direction='row'
                            alignItems='center'
                            className={classes.blogArrow}
                          >
                            <Grid
                              item
                              md={12}
                              sm={12}
                              className={classes.alignLeft}
                            >
                              <ArrowForwardIosIcon
                                className={classes.iconFont}
                              />
                            </Grid>
                          </Grid>
                        </Grid>
                      </ListItem>
                      {sponsers.length - 1 == index ? null : (
                        <Divider component='li' />
                      )}
                    </div>
                  ))}
                </>
              )}

              {sponsers.length == 0 ? (
                <Grid container justify='center' alignItems='center'>
                  <Typography variant='h5' className={classes.sponserNotFound}>
                    No Sponser Found
                        </Typography>
                </Grid>
              ) : null}
            </List>
          </Grid>


          {orphanDetails && (
            <Grid item xs={12} sm={12} md={12} lg={3}>
              <Grid spacing={3} style={{ textAlign: 'center' }}>
                <Grid item>
                  <Paper className={classes.paper} elevation={2}>
                    <Grid container justify='center' alignItems='center'>
                      <Grid
                        container
                        spacing={0}
                        direction='column'
                        alignItems='center'
                        justify='center'
                      >
                        <Grid item xs={12}>
                          <br />
                          <Avatar
                            variant='align-content: center'
                            className={classes.avatar}
                            src={getImageUrl(orphanDetails.orphan_image)}
                          />
                        </Grid>
                      </Grid>
                      <Grid item xs={9} className={classes.cardBody}>
                        <Typography variant='h5' className={classes.cardTitle}>
                          {orphanDetails.orphan_fname}{' '}
                          {orphanDetails.orphan_lname}
                        </Typography>
                        <br />
                        <Typography
                          variant='subtitle1'
                          className={classes.sponserNotFound}
                        >
                          {orphanDetails.comments}
                        </Typography>
                      </Grid>
                    </Grid>
                    <Grid container spacing={1}>
                      <Grid item xs={12}>
                        <Link
                          href='/orphans/[detail]'
                          as={`/orphans/${orphanDetails.orphan_id}`}
                          variant='body2'
                          className={classes.removeHover}
                        >
                          <Button
                            variant='contained'
                            size='medium'
                            color='primary'
                            className={(classes.margin, classes.adoptChild)}
                          >
                            View Child
                          </Button>
                        </Link>
                      </Grid>
                    </Grid>
                    <br></br>

                    <Divider variant='middle' />
                    {orphanDetails.orphanNeed &&
                      <>
                        <Grid container spacing={1}>
                          <Grid item md={12}>
                            <Grid
                              container
                              spacing={0}
                              direction='column'
                              alignItems='left'
                            >
                              <br></br>
                              <Grid
                                item
                                md={12}
                                sm={12}
                                className={[classes.blogTitle, classes.alignLeft]}
                              >
                                Donation
                          </Grid>
                              {/* <Grid
                            item
                            md={12}
                            sm={12}
                            className={[
                              classes.blogTimeStamp,
                              classes.alignLeft
                            ]}
                          >
                            <DateRangeIcon className={classes.iconFont} /> July
                            26, 2019 &nbsp;&nbsp;&nbsp;
                            <AccessTimeIcon className={classes.iconFont} />{' '}
                            01:51 Pm
                          </Grid>
                          <br></br> */}

                              <Grid container justify='center' alignItems='center'>
                                <Grid
                                  item
                                  xs={12} sm={12} md={9} lg={9}
                                  className={[
                                    classes.blogTitle,
                                    classes.cardPaddingTitle
                                  ]}
                                >
                                  <Typography
                                    variant='subtitle1'
                                    className={[
                                      classes.cardDonationTitle,
                                      classes.alignLeft
                                    ]}
                                  >
                                    {orphanDetails.orphanNeed.title}
                                  </Typography>
                                </Grid>
                                <Grid
                                  item
                                  xs={12} sm={12} md={3} lg={3}
                                  className={[
                                    classes.blogTitle,
                                    classes.cardPaddingTitle
                                  ]}
                                >
                                  <Typography
                                    variant='subtitle1'
                                    className={[
                                      classes.cardDonationsponserNotFound,
                                      classes.alignRight
                                    ]}
                                  >
                                    ${orphanDetails.orphanNeed.receivedDonationAmount}
                                  </Typography>
                                </Grid>
                                <br></br>
                                {/* <Grid
                              item
                              xs={9}
                              className={[
                                classes.blogTitle,
                                classes.cardPaddingTitle
                              ]}
                            >
                              <Typography
                                variant='subtitle1'
                                className={[
                                  classes.cardDonationTitle,
                                  classes.alignLeft
                                ]}
                              >
                                Medical
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              className={[
                                classes.blogTitle,
                                classes.cardPaddingTitle
                              ]}
                            >
                              <Typography
                                variant='subtitle1'
                                className={[
                                  classes.cardDonationsponserNotFound,
                                  classes.alignRight
                                ]}
                              >
                                $100
                              </Typography>
                            </Grid>

                            <Grid
                              item
                              xs={9}
                              className={[
                                classes.blogTitle,
                                classes.cardPaddingTitle
                              ]}
                            >
                              <Typography
                                variant='subtitle1'
                                className={[
                                  classes.cardDonationTitle,
                                  classes.alignLeft
                                ]}
                              >
                                Other
                              </Typography>
                            </Grid>
                            <Grid
                              item
                              xs={3}
                              className={[
                                classes.blogTitle,
                                classes.cardPaddingTitle
                              ]}
                            >
                              <Typography
                                variant='subtitle1'
                                className={[
                                  classes.cardDonationsponserNotFound,
                                  classes.alignRight
                                ]}
                              >
                                $50
                              </Typography>
                            </Grid> */}
                              </Grid>
                            </Grid>

                          </Grid>

                        </Grid>
                      </>
                    }
                  </Paper>
                </Grid>
              </Grid>
            </Grid>
          )}
        </Grid>
      </MainLayout>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      getSponsers: getSponsers
    },
    dispatch
  )
}
function mapStateToProps({ auth, sponsers }) {
  return {
    currentUser: auth.user,
    sponsers: sponsers.items
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withApollo(withAuth(Sponser)))
)
