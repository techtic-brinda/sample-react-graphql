import { Component } from "react";
import Typography from "@material-ui/core/Typography";
import {
  CardContent,
  Card,
  Grid,
  withStyles,
  Avatar,
  ListItem,
} from "@material-ui/core";
import { 
  Email as EmailIcon,
  Call as CallIcon,
} from '@material-ui/icons';
import LocationOnIcon from '@material-ui/icons/LocationOn';
import styles from "./style";


class ContactDetail extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  getValue = (val) => {
    const setting = _.find(this.props.settings, { key: val })
    if (setting) {
      return setting.value
    } else {
      return '-'
    }
  }
  render() {
    const { classes } = this.props;
    return (
      <Card className={[classes.root, classes.innerPadding]}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="h1">
            {" "}
            Contact Detail {" "}
          </Typography>

          <Grid container xs={12} spacing={3} direction="column" alignItems="left" justify="center" >
            <Grid item>
              <Avatar variant="align-content: center" className={classes.avatar} src="images/logo.png" />
            </Grid>
          </Grid>
          <br /><br />
          <Grid container xs={12} spacing={3} direction="column" alignItems="left" justify="center" >
            <Grid container justify="center" alignItems="center">

              <Grid item xs={12}>
                <Grid variant="subtitle1" className={[classes.blogTimeStamp, classes.cardDonationTitle, classes.alignLeft]}>
                  <EmailIcon className={classes.iconFont} />{' '}
                  <ListItem style={{ display: 'contents'}} key="Email" component="a" href={`mailto:${this.getValue('email')}`}>{this.getValue('email')}</ListItem>
                </Grid>
              </Grid>
              {/* <Grid item xs={12}>
                <Grid variant="subtitle1" className={[classes.blogTimeStamp, classes.cardDonationTitle, classes.alignLeft]}>
                  <CallIcon className={classes.iconFont} />{' '}
                  <ListItem style={{ display: 'contents'}} key="phone" component="a" href={`tel:${this.getValue('phone')}`}>{this.getValue('phone')}</ListItem>
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Grid variant="subtitle1" className={[classes.blogTimeStamp, classes.cardDonationTitle, classes.alignLeft]}>
                  <LocationOnIcon className={classes.iconFont} />{this.getValue('address')}
                </Grid>
              </Grid> */}
              </Grid>
          </Grid>
        </CardContent>
      </Card>
    );
  }
}
export default withStyles(styles, { withTheme: true })(ContactDetail);
