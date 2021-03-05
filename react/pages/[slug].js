import { Component } from "react";
import {
  Button,
  Box,
  Typography,
  withStyles,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import Skeleton from '@material-ui/lab/Skeleton';
import { connect } from "react-redux";
import { withApollo } from "../src/apollo";
import MainLayout from "../components/layout/front-main";
import { getPageDetail } from "../src/store/actions";
import { bindActionCreators } from "redux";
import { withRouter } from 'next/router'
import styles from "./blogs/style";
import { Link } from '../components/common';
import Router from 'next/router'

class PageDetails extends Component {
  constructor(props) {
    super(props);
    this.state = {
      id: props.router.query.id,
    };
  }
  static getInitialProps({ res }) {
    if(typeof window === 'undefined'){
      res.writeHead(302, {location: '/dashboard'})
      res.end()
    } else {
      Router.push('/dashboard')
    }
    return {}
  }
  componentDidMount() {
    this.props.getPageDetail(this.props.router.query.slug);
  }

  render() {
    const { classes, pageDetail, loader } = this.props;
    console.log(loader, 'loader');
    return (
      <MainLayout>
        <Grid container spacing={3}>

          <Grid item xs={2}>
          </Grid>
          <Grid item xs={8}>
            <Grid container mt={4} className={classes.backButton}>
              <Grid item xs={12}>
              {loader ?
                (<Skeleton width={150} />) : 
                (<Link href={`/`} variant="body2"><Button color="primary">Back to Home</Button></Link>)
              }
              </Grid>
            </Grid>
            <Grid container>
              <Grid item xs={12}>
                <Box mt={4}>
                  <Card>
                    <CardContent>
                    {loader ?  
                      (<>
                        <Skeleton />
                        <Skeleton />
                        <Skeleton />
                      </>
                      ) 
                      :(<Grid container spacing={2} className={classes.bodySpace}>
                        <Grid item xs={12}>
                          <Grid container spacing={2}>
                            <Grid item xs={12} spacing={1} className={classes.cardBody}>
                              <Typography variant="h5" className={[classes.cardTitle, classes.alignLeft]}>
                                {pageDetail && (pageDetail.title) ? pageDetail.title : "Page not found"} <br />
                              </Typography>
                              <br />
                            </Grid>

                            <Grid item xs={12} spacing={3} className={classes.cardBody}>
                              <Typography variant="h5" className={[classes.alignLeft, classes.cardDescription]}>
                                {pageDetail && (pageDetail.content) ?
                                  <div
                                    dangerouslySetInnerHTML={{
                                      __html: pageDetail.content
                                    }}>
                                  </div>
                                :
                                 ""}
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>)
                    }
                    </CardContent>
                  </Card>
                </Box>
             </Grid>

            </Grid>
          </Grid>
          <Grid item xs={2}></Grid>

        </Grid>
      </MainLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getPageDetail: getPageDetail,
    },
    dispatch
  );
};

function mapStateToProps({ header }) {
  // console.log(header, "mapStateToProps page detail")
  return {
    pageDetail: header.page[0],
    loader : header.loader,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withRouter(PageDetails)))
);
