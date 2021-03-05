import { Grid, Button, withStyles, Dialog, DialogTitle, DialogActions, DialogContent, DialogContentText } from '@material-ui/core'
import React, { createRef, Component } from 'react'
import Typography from "@material-ui/core/Typography";
import Paper from '@material-ui/core/Paper';
import { getDateFormat } from './../../src/helpers'

const styles = (theme) => ({
  title: {
    fontSize: "20px",
    fontWeight: "700",
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif',
  },
  padding: {
    padding: "20px",
  },
  textPadding: {
    wordBreak: "break-word",
    padding: "5px",
  },
  width: {
    width: "1000px"
  },
  header: {
    backgroundColor: "#E1402A",
    color: "white",
  },

});

class ReportDialogComponent extends Component {
  constructor(props) {
    super(props),
      this.DialogRef = createRef();
  }
  handleToggele = () => () => {
    this.setState(prevState => ({ open: !prevState.open }));
  };
  render() {
    const { dialogContent: { content = {}, title = '' }, dialogOpen, dialogClose, classes } = this.props;
    
    return (
      <div>
        {dialogOpen == true ? (
          <Dialog
            open={true}
            aria-labelledby="draggable-dialog-title"
            close={dialogClose}
          >
            <DialogTitle id="draggable-dialog-title" className={classes.header}>
              {title}
            </DialogTitle>
            <DialogContent dividers={true}>

              <Grid container spacing={3}>

                <Grid item xs={12} sm={12} md={6} lg={6} spacing={2}>
                  <Paper variant="outlined" spacing={2} className={classes.padding}>
                    <Typography className={[classes.title, classes.textPadding]}>
                        Angel Detail
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                      <b>Name: </b><br/>{content.angel_first_name} {content.angel_last_name}
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                    <b>Email: </b><br/>{content.angel_email}
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                    <b>Phone: </b><br/>{content.angel_phone}
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                    <b>Address: </b><br/>{content.angel_address}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={12} md={6} lg={6} spacing={2}>
                  <Paper variant="outlined" className={classes.padding}>
                    <Typography className={[classes.title, classes.textPadding]}>
                        Orphan Child Details
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                      <b>Name: </b><br/>{content.orphan_first_name} {content.orphan_last_name}
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                      <b>Date of Birth: </b><br/>{getDateFormat(content.orphan_date_of_birth)}
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                      <b>Country Of Birth: </b><br/>{content.orphan_country_of_birth}
                    </Typography>

                    <Typography className={[classes.textPadding]}>
                      <b>Institution: </b><br/>{content.orphan_institution_name}
                    </Typography>
                  </Paper>
                </Grid>

                <Grid item xs={12} sm={12} md={12} lg={12} spacing={3}>
                  {(content.totaldonations == null) ?

                    <Paper variant="outlined" className={classes.padding}>
                      <Typography className={[classes.title, classes.textPadding]}>
                        Donation Amount
                      </Typography>

                      <Typography className={[classes.textPadding]}>
                        <b>Amount: </b><br/>${content.amount}
                      </Typography>

                      <Typography className={[classes.textPadding]}>
                        <b>Transaction ID: </b><br/>{content.transaction_id}
                      </Typography>

                      <Typography className={[classes.textPadding]}>
                        <b>Description: </b><br/>{content.orphan_description}
                      </Typography>

                      <Typography className={[classes.textPadding]}>
                        <b>Donation date: </b><br/>{getDateFormat(content.created_at)}
                      </Typography>
                    </Paper>

                    :

                    <Paper variant="outlined" className={classes.padding}>
                      <Typography className={[classes.title, classes.textPadding]}>
                        Donation Amount
                        </Typography>

                      <Typography className={[classes.textPadding]}>
                      <b>Donation collected: </b><br/>${content.totaldonations}
                      </Typography>

                      <Typography className={[classes.textPadding]}>
                      <b>Requirements: </b><br/>${content.totalrequirement}
                      </Typography>
                    </Paper>
                  }
                </Grid>

              </Grid>


            </DialogContent>
            <DialogActions>
              <Button size="small" onClick={dialogClose} color="primary" style={{ padding: '10px 20px', color: "white", backgroundColor: "#E1402A", }}>
                Close
                    </Button>
            </DialogActions>
          </Dialog>) : null
        }
      </div>
    );
  }
}
export default withStyles(styles, { withTheme: true })(ReportDialogComponent);
