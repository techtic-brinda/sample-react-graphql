import React, { Component } from "react";
import {
  Button,
  CssBaseline,
  Grid,
  Box,
  Typography,
  Container,
  MenuItem,
  withStyles,
  IconButton,
} from "@material-ui/core";
import { connect } from "react-redux";
import { Link, Alert, DialogComponent } from "../../components/common";
import { register } from "../../src/store/actions/auth";
import { bindActionCreators } from "redux";
import Formsy from "formsy-react";
import {
  TextFieldFormsy,
  SelectFormsy,
  CheckboxFormsy,
} from "../../components";
import { InputAdornment } from "@material-ui/core";
import { getAllHeader } from "../../src/store/actions";
import { find } from 'lodash';
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";


const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(2),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },

  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(2, 0, 2),
  },
  selectTag: {
    width: "100%",
  },
});

class SignUp extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      canSubmit: false,
      termContidion: false,
      showPassword: false,
      confirm_visibility: true,
      dialogOpen: false,
      dialogContent: {},
    };
  }
  componentDidMount() {
    if(this.props.headerPages.length == 0) {
      this.props.getAllHeader();
    }
  }
  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  handleSubmit = async (model) => {
    delete model.termContidion;
    this.setState({
      loading: true,
    });
    await this.props.register(model);
    this.setState({
      loading: false,
    });
  };
  toggleDialog =(type) =>{
    if(type){
      const { headerPages = [] } = this.props;
      if(headerPages.length > 0 ){
        this.setState({
          dialogContent : find(headerPages,{ 'slug' : type}),
        });
      }
      this.setState({dialogOpen : true});
    }
  }
  dialogClose = () => {
      this.setState({dialogOpen : false, dialogContent : {}});
  }
  render() {
    const { classes, signUpErrorMessage, successMessage } = this.props;
    const { loading, canSubmit, termContidion,dialogOpen, dialogContent } = this.state;

    const label = (
      <div>
        <span>I accept the </span>
        <Link href={""} onClick={()=> this.toggleDialog('terms-and-conditions')}>Terms of use</Link>
        <span> and </span>
        <Link href={""} onClick={()=> this.toggleDialog('privacy-policy')}>Privacy Policy</Link>
      </div>
    );

    const handleClickShowPassword = () =>
      this.setState({
        showPassword: !this.state.showPassword,
      });

    const handleMouseDownPassword = (event) => {
      event.preventDefault();
    };

    return (
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <div className={classes.paper}>
          <div className="logo">
            <Link href={`/`}>
              <img src="images/logo.png" />
            </Link>
          </div>
          <Box align="center" mt={4}>
            <Typography
              component="h1"
              variant="h5"
              style={{
                fontWeight: 900,
              }}
            >
             Registration
            </Typography>
          </Box>
          {signUpErrorMessage && (
            <Alert severity="error" message={signUpErrorMessage} />
          )}
          {successMessage && <Alert message={successMessage} />}

          <Formsy
            onValidSubmit={this.handleSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            ref={(form) => (this.form = form)}
            className={classes.form}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextFieldFormsy
                  autoComplete="fname"
                  name="firstName"
                  variant="outlined"
                  required
                  fullWidth
                  label="First Name"
                  autoFocus
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextFieldFormsy
                  variant="outlined"
                  required
                  fullWidth
                  label="Last Name"
                  name="lastName"
                  autoComplete="lname"
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldFormsy
                  variant="outlined"
                  required
                  fullWidth
                  label="Email Address"
                  name="email"
                  autoComplete="email"
                  validations={{
                    isEmail: true,
                  }}
                  validationErrors={{
                    isEmail: "This is not a valid email",
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldFormsy
                  variant="outlined"
                  required
                  fullWidth
                  name="password"
                  label="Password"
                  type={this.state.showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  validations={{ minLength: 8, maxLength: 16 }}
                  validationErrors={{
                    minLength: "Password min length must be 8 character",
                    maxLength: "Password max length must be 16 character",
                  }}
                  InputProps={{
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={handleClickShowPassword}
                          onMouseDown={handleMouseDownPassword}
                          edge="end"
                        >
                          {this.state.showPassword ? (
                            <VisibilityIcon />
                          ) : (
                            <VisibilityOffIcon />
                          )}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                />
              </Grid>
              <Grid item xs={12}>
                <TextFieldFormsy
                  id="confirm_password"
                  label="Confirm Password"
                  name="confirm_password"
                  required
                  fullWidth
                  type={this.state.showPassword ? "text" : "password"}
                  variant="outlined"
                  validations={{
                    equalsField: "password",
                    minLength: 8,
                    maxLength: 16,
                  }}
                  validationErrors={{
                    minLength: "Password min length must be 8 character",
                    maxLength: "Password max length must be 16 character",
                    equalsField: "Password mismatch",
                  }}
                />
              </Grid>

              {/* <Grid item xs={12}>
                <SelectFormsy
                  name="role"
                  label="Register as"
                  required
                  selectAs={'register'}
                  className={classes.selectTag}
                >
                  <MenuItem value={3}>Champion</MenuItem>
                  <MenuItem value={2}>Angel</MenuItem>
                </SelectFormsy>
              </Grid> */}

              <Grid item xs={12}>
                <CheckboxFormsy
                  value={termContidion}
                  color="primary"
                  label={label}
                  name="termContidion"
                  required="isFalse"
                />
              </Grid>
            </Grid>
            <Box align="center">
              <Button
                style={{
                  padding: "15px 30px",
                }}
                size="large"
                type="submit"
                variant="contained"
                color="primary"
                disabled={!canSubmit || loading}
                className={classes.submit}
              >
                Create Account
              </Button>
            </Box>

            <Box align="center" mt={1}>
              Already Member?{" "}
              <Link href="/login" variant="body2">
                Login
              </Link>
            </Box>
          </Formsy>
        </div>
        <DialogComponent dialogOpen={dialogOpen} dialogContent={dialogContent} dialogClose={()=>this.dialogClose()} />
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      register: register,
      getAllHeader: getAllHeader,
    },
    dispatch
  );
};

function mapStateToProps({ auth, header }) {
  return {
    signUpErrorMessage: auth.errorMessage,
    successMessage: auth.successMessage,
    headerPages: header.pages,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignUp)
);
