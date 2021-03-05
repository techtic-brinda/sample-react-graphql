import { Component } from "react";
import { Typography, withStyles, Grid, Divider, Button, Box } from "@material-ui/core";
import moment from "moment";
import ExpansionPanel from "@material-ui/core/ExpansionPanel";
import ExpansionPanelSummary from "@material-ui/core/ExpansionPanelSummary";
import ExpansionPanelDetails from "@material-ui/core/ExpansionPanelDetails";
import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import Formsy from "formsy-react";
import { TextFieldFormsy, DatePickerFieldFormsy } from "../../components";
import { AddButton, DeleteButton } from "../../components/common";
import { getDateFormatDefualt } from '../../src/helpers';

// addBtn
const styles = (theme) => ({
  root: {
    flexGrow: 1,
    backgroundColor: theme.palette.background.paper,
  },
  expansionDescriptionMain: {
    paddingTop: '0px'
  },
  expansionDescription: {
    padding: "0px 0px 0px 23px",
    fontSize: "12px",
    color: "#7d7d7d",
  },
  expansionHeading: {
    fontSize: "13px",
    color: "#444444",
  },
  expansionNumber: {
    fontSize: "16px",
  },
  margin: {
    margin: "5px"
  },
  expansionSummary: {
    minHeight: '48px!important',
    maxHeight: '48px!important'
  },
  description: {
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
	textTransform: {
		textTransform: "none !important",
	},
	margin: {
		margin: "5px"
	},
  adoptChild: {
    textTransform: "none !important",
    padding: "10px 20px",
  },
});

class EducationInformation extends Component {
  state = {
    loading: false,
    canSubmit: false,
  };
  componentWillReceiveProps(nextProps) {
		if (nextProps.addSuccess !== this.props.addSuccess) {
		  this.setState({isAdd:false});
		}
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };
  onSubmit = (model) => {
    this.props.onSaveEducation(model)
  }

  handleForm = () => {
    this.setState({ isAdd: !this.state.isAdd });
  }
  deleteEducation = (id) =>{
    this.props.onDeleteEducation(id, this.props.childrenProfile.id)
  }
  constructor(props) {
    super(props);
  }
  render() {
    const { classes, childrenProfile} = this.props;
    const { orphanEducations } = childrenProfile
    const { loading, canSubmit, isAdd } = this.state;

    let educationDetails = "";
    let index = 0;
    if (orphanEducations.nodes.length) {
      educationDetails = orphanEducations.nodes.map((education) => {
        return (
            <ExpansionPanel>
              <ExpansionPanelSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls={education.id + "-content"}
                id={education.id + "-header"}
                className={classes.expansionSummary}
              >
                <Typography className={classes.expansionHeading}>
                  <b className={classes.expansionNumber}>{++index}{" Review Date : "}
                &nbsp;&nbsp;&nbsp;{getDateFormatDefualt(education.educationReviewDate)} </b>
                </Typography>
              </ExpansionPanelSummary>
              <ExpansionPanelDetails className={classes.expansionDescriptionMain}>

                <Grid container>
                  <Grid container>
                    <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Grade:
                              </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
                      <Typography
                        variant="subtitle1"
                        className={classes.boldDescription}
                      >
                        {education.grade ? education.grade : "-"}
                      </Typography>
                    </Grid>
                  </Grid>

                  <Grid container>
                    <Grid item xs={12} sm={3} md={3} lg={2} className={classes.tabPersonalInfo}>
                      <Typography variant="subtitle1" className={classes.description}>
                        Comment:
                              </Typography>
                    </Grid>
                    <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
                      <Typography
                        variant="subtitle1"
                        className={classes.boldDescription}
                      >
                        {education.comment ? education.comment : "-"}
                      </Typography>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} sm={9} md={9} lg={10} className={classes.tabPersonalInfo}>
                    <DeleteButton row={childrenProfile} onClick={() => this.deleteEducation(education.id)} />  
                    </Grid>
                  </Grid>         

                </Grid>

                {/* <Typography className={classes.expansionDescription}>
                  {education.comment}
                </Typography> */}
              </ExpansionPanelDetails>
            </ExpansionPanel>
        );
      });
    } else {
      educationDetails = (
        <div>
          <Typography
            variant="h6"
            align="center"
          >
            Education Information not found!
        </Typography>
        </div>
      );
    }
    return <div className={classes.root}>

      {isAdd ?
        <Grid container justify="center" alignItems="right">
          <Grid item xs={12}>
            <Formsy
              onValidSubmit={this.onSubmit}
              onValid={this.enableButton}
              onInvalid={this.disableButton}
              ref={"educationForm"}
              className={classes.FormRoot}
            >
              <Grid container spacing={2} justify="left" alignItems="right">
                  <Grid item md={3} xs={12}>
                      <DatePickerFieldFormsy
                          format="MM/dd/yyyy"
                          label="Education Review Date"
                          name="educationReviewDate"
                          required
                          value={new Date()}
                          emptyLabel={'Select date'}
                          disabled
                  />
                    {/* <TextFieldFormsy
                      id="outlined-number"
                      label="Education Review Date"
                      name="educationReviewDate"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      required
                    /> */}
                  </Grid>
                  <Grid item md={3} xs={12}>
                    <TextFieldFormsy
                      id="outlined-number"
                      label="Grade"
                      name="grade"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      required
                    />
                  </Grid>
                <Grid item md={6} xs={12}>
                    <TextFieldFormsy
                      id="outlined-number"
                      label="Comment"
                      name="comment"
                      type="text"
                      fullWidth
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant="outlined"
                      required
                    />
                  </Grid>
                </Grid>
                <br />
                <Box align="right">
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size={"medium"}
                    disabled={!canSubmit || loading}
                    className={classes.adoptChild}
                  >
                    Save
                    </Button>

                  <Button 
                    onClick={this.handleForm} 
                    variant="contained" 
                    size="medium" 
                    className={[classes.margin, classes.adoptChild]}>
                    Cancel
                    </Button>
                </Box>
            </Formsy>

          </Grid>
        </Grid>

        :
        <Grid container justify="center" alignItems="right">
          <Grid container spacing={0} direction="column" align="right" justify="right" >
            <Grid item xs={12}>
              <AddButton row={childrenProfile} onClick={this.handleForm} />
            </Grid>
          </Grid>
        </Grid>
      }
      <br />
      {educationDetails}
    </div>;
  }
}

export default withStyles(styles, { withTheme: true })(EducationInformation);
