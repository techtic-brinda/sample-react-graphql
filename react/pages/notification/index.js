import { Component } from "react";
import {
  Typography,
  withStyles,
  Grid,
  Avatar,
  Card,
  CardHeader,
  CardContent
} from "@material-ui/core";
import { connect } from "react-redux";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import MainLayout from "../../components/layout/main";
import Moment from 'react-moment';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import { bindActionCreators } from "redux";
import { getNotifications, loadMoreNotifications, readNotification } from "../../src/store/actions";
import { LoadMore } from "../../components/common/LoadMore";
import { BreadCrumbsComponent } from "../../components/common";
import { getImageUrl } from "./../../src/helpers";
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  paper: {
    padding: theme.spacing(2)
  },
});

class Notification extends Component {
  constructor(props) {
    super(props);
  }

  handleLoadMore(cursor) {
    this.props.loadMoreNotifications(cursor);
  }

  componentDidMount() {
    this.props.getNotifications();
    this.props.readNotification();
  }

  getDesscription = (row)=>{
    let obj = row.data;
    if(obj != null && obj.description){
      return (<Typography variant='body2'>{obj.description}</Typography>);
    }
    return null;
  }
  render() {
    const { notifications } = this.props;
    return (
        <MainLayout>
            <Grid container spacing={4}>
                <Grid item xs={12}>
                  <BreadCrumbsComponent />
                </Grid>
                <Grid item xs={12}>
                    <Grid container spacing={4} direction="column">
                        <Grid item>
                            <Card>
                                <CardHeader
                                    title="Notifications"
                                    titleTypographyProps={{
                                    variant: "h5",
                                    }}
                                />
                                <CardContent>
                                <LoadMore
                                    {...notifications}
                                    onLoadMore={this.handleLoadMore.bind(this)}
                                    >
                                    {({ rows }) => (
                                        <List>
                                            {rows.map((row, index) => (
                                            <ListItem key={index}>
                                                <Grid container spacing={2}>
                                                <Grid item>
                                                    <Avatar src={getImageUrl(row.user.image)} />
                                                </Grid>
                                                <Grid item md>
                                                    <Typography variant="subtitle2">
                                                    {row.user && (row.user.firstName + " " + row.user.lastName)}
                                                    </Typography>
                                                    <Typography variant='body2'>
                                                    {row.title}
                                                    </Typography>
                                                    {this.getDesscription(row)}
                                                </Grid>
                                                <Grid item>
                                                    <Typography variant='caption'>
                                                    <Moment fromNow ago>{row.createdAt}</Moment>
                                                    </Typography>
                                                </Grid>
                                                </Grid>
                                            </ListItem>
                                            // {((rows.length - 1) == (index)) ? (null) : (<Divider component="li" />)}
                                            ))}
                                        </List>
                                    )}
                                </LoadMore>
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

function mapStateToProps({ notification }) {
  return {
    notifications: notification,
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      loadMoreNotifications: loadMoreNotifications,
      getNotifications: getNotifications,
      readNotification: readNotification,
    },
    dispatch
  )
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(withApollo(withAuth(Notification)))
);
