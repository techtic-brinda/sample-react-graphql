import { Component } from "react";
import {
  Typography,
  withStyles,
  Grid,
  Avatar,
  Paper,
  CardContent,
  Card,
} from "@material-ui/core";
import { Alert, Link, AdoptChildButton } from "../../components/common";
import { getImageUrl } from "./../../src/helpers";
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
});

class ChildrenInfo extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { classes, childrenProfile } = this.props;
    const {
      firstName = "",
      lastName = "",
      comments = "",
      image = "",
    } = childrenProfile;
    return (
      <Card>
        <CardContent>
        {/* <h2>
          Children Info
        </h2> */}
        <Grid container justify="center" alignItems="center">
          <Grid
            container
            spacing={0}
            direction="column"
            alignItems="center"
            justify="center"
          >
            <Grid item xs={12}>
              <br />
              <Avatar
                variant="align-content: center"
                className={classes.avatar}
                src={getImageUrl(image)}
              />
            </Grid>
          </Grid>
          <Grid item xs={12} className={classes.cardBody}>
            <Typography variant="h5" className={classes.cardTitle}>
              {firstName} {lastName}
            </Typography>
            <br />
            {/* <Typography variant="subtitle1" className={classes.description}>
              {comments}
            </Typography> */}
          </Grid>
        </Grid>
        <Grid container spacing={1}>
          <Grid item xs={12}>
            <AdoptChildButton  
              variant="contained"
              size="medium"
              color="primary" 
              className={(classes.margin, classes.adoptChild)}
              row={childrenProfile} 
            />
          </Grid>
        </Grid>
        </CardContent>
      </Card>
    );
  }
}

export default withStyles(styles, { withTheme: true })(ChildrenInfo);
