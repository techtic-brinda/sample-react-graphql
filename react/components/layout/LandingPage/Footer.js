import { Component, Fragment } from "react";
import { withStyles, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { getSettings, sendMessage } from "../../../src/store/actions";
import { bindActionCreators } from "redux";
import {
  Facebook as FacebookIcon,
  Twitter as TwitterIcon,
  LinkedIn as LinkedInIcon,
  Instagram as InstagramIcon,
} from "@material-ui/icons";
import { TextFieldFormsy } from "../../../components";
import Formsy from "formsy-react";
import { Box, Button } from "@material-ui/core";

const styles = () => ({
  form: {
    width: "100%",
    margin: '0px',
        '& .MuiFormControl-root' : {
            margin: '4px !important',
        },
        '& .MuiFormHelperText-root' : {
            left: 0,
            color: '#ff1744',
            position: 'absolute',
            top: '110%',
        },
        '& .MuiInputBase-root': {
            color: '#ffffff',
        },
        '& .MuiOutlinedInput-multiline, & .MuiInputBase-multiline': {
            padding: '0px !important'
        },
        '& .MuiInputBase-inputMultiline': {
            height: '19px !important'
        }
    },
    submit: {
         margin: '0px',
    },
    borderedFormImput:{
        border: "1px solid #3d4a7c",
    },
    footerTextBox: {
        margin: '4px 4px 4px 0!important',
    },
    footerSubmitBtn: {
        padding: "14px 30px 10px!important",
        marginTop: "0px",
        marginLeft: "7px",
        position: 'relative!important',
        ['@media (max-width:960px)']: {
            // eslint-disable-line no-useless-computed-key
            marginTop: '3px',
            marginLeft: '3px',
        },
    },
    formField: {
        display: 'inline-flex',
        width: '100%',
        /* '& .MuiTextField-root': {
          margin: '8px 15px 8px 0',
          width: '100%',
          ['@media (max-width:960px)']: {
            // eslint-disable-line no-useless-computed-key
            margin: '8px 0 8px 0',
            width: '100%',
            paddingBottom: '18px',
          },
        }, */
      },
  })

class Footer extends Component {
  constructor (props) {
        super(props)
        this.state = {
        }
    }
    componentDidMount() {
      this.props.getSettings();
    }
    getLinks = (val) => {
      if (this.props.settings.length > 0) {
        const setting = _.find(this.props.settings, { key: val })
        return (setting) ? setting.value : '#';
      } else {
        return '#';
      }
    }
    disableButton = () => {
      this.setState({ canSubmit: false });
    };

    enableButton = () => {
      this.setState({ canSubmit: true });
    };

    handleSubmit = async (model) => {
      this.setState({ loading: true });
      await this.props.sendMessage(model);
      this.setState({ loading: false });
      this.refs.form.reset();
    };

    render() {
      const { classes, signInMessage, successMessage, newOrphans = [] } = this.props;
      const { loading, canSubmit } = this.state;
      return (
        <React.Fragment>
          <footer>
                <div class="container">
                  <Grid
                    container
                    direction="row"
                  >
                    <Grid item xs={12} sm={12} md={8} lg={8}>
                      <div class="footer-left">
                        <h3>Contact us</h3>
                        <div class="news-latter-box">

                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12}>
                                    <Formsy
                                        onValidSubmit={this.handleSubmit}
                                        onValid={this.enableButton}
                                        onInvalid={this.disableButton}
                                        ref={"form"}
                                        className={classes.form}
                                    >
                                        <Grid item xs={12} sm={12} md={6} lg={3} className={classes.formField}>
                                            <TextFieldFormsy
                                                variant="outlined"
                                                margin="normal"
                                                id="name"
                                                placeholder="Enter your full name"
                                                name="name"
                                                autoComplete="name"
                                                className={[classes.borderedFormImput, classes.footerTextBox]}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={3} className={classes.formField}>
                                            <TextFieldFormsy
                                                variant="outlined"
                                                margin="normal"
                                                required
                                                id="email"
                                                placeholder="Enter your email address"
                                                name="email"
                                                autoComplete="email"
                                                validations={{
                                                    isEmail: true,
                                                }}
                                                className={[classes.borderedFormImput, classes.footerTextBox]}
                                                validationErrors={{
                                                    isEmail: "This is not a valid email",
                                                }}
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                                            <TextFieldFormsy
                                                variant="outlined"
                                                margin="normal"
                                                id="Address"
                                                placeholder="Enter your Message"
                                                name="messageBody"
                                                autoComplete="name"
                                                className={[classes.borderedFormImput, classes.footerTextBox]}
                                                multiline
                                                rows={2}
                                                required
                                                fullWidth
                                            />
                                        </Grid>
                                        <Grid item xs={12} sm={12} md={6} lg={2} className={classes.formField}>
                                            <Button
                                                size="small"
                                                disabled={!canSubmit || loading}
                                                type="submit"
                                                variant="contained"
                                                color="primary"
                                                className={[classes.submit, classes.footerSubmitBtn]}
                                            >
                                                Send
                                            </Button>
                                        </Grid>
                                    </Formsy>
                                </Grid>
                            </Grid>
                        </div>
                      </div>

                    </Grid>
                    <Grid item xs={12} sm={12} md={4} lg={4}>
                      <div class="footer-right">
                        <h3>Follow us</h3>
                        <ul>
                          <li>
                            <a target="_blank" href={this.getLinks('facebookLink')}>
                              <i>
                                <FacebookIcon />
                              </i>
                            </a>
                          </li>
                          <li>
                            <a target="_blank" href={this.getLinks('twitterLink')}>
                              <i>
                                <TwitterIcon />
                              </i>{" "}
                            </a>
                          </li>
                          <li>
                            <a target="_blank" href={this.getLinks('linkedinLink')}>
                              <i>
                                <LinkedInIcon />
                              </i>{" "}
                            </a>
                          </li>
                          <li>
                            <a target="_blank" href={this.getLinks('instagramLink')}>
                              <i>
                                <InstagramIcon />
                              </i>{" "}
                            </a>
                          </li>
                          {/* <li>
                            <a target="_blank" href={this.getLinks('youtubeLink')}>
                              <i>
                                <YouTubeIcon />
                              </i>{" "}
                            </a>
                          </li> */}
                        </ul>
                      </div>

                    </Grid>
                  </Grid>
                </div>
              </footer>
              <div class="footer-btm">
                <div class="container">
                  <p>
                    Orphan Angels is a 501(c)(3) nonprofit and all donations are
                    tax deductible. EIN:
                  </p>
                </div>
              </div>
        </React.Fragment>
      );
    }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getSettings: getSettings,
      sendMessage: sendMessage,
    },
    dispatch
  );
};

function mapStateToProps({ settings }) {
  return {
    settings: settings.data,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Footer)
);
