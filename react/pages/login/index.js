import { Component } from "react";
import {
  Container,
  CssBaseline,
  Box,
  Typography,
  Button,
  withStyles,
  IconButton,
} from "@material-ui/core";
import { connect } from "react-redux";
import { login, removeMessage } from "../../src/store/actions/auth";
import { Alert, Link } from "../../components/common";
import { bindActionCreators } from "redux";
import Formsy from "formsy-react";
import { TextFieldFormsy } from "../../components";
import { InputAdornment } from "@material-ui/core";
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";


const styles = (theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: "100%",
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
});

class SignIn extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      canSubmit: false,
      showPassword: false,
    };
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.signInMessage != null || nextProps.successMessage != null){
        setTimeout( () => 
          this.props.removeMessage(),
        3000);
    }
  }
  componentDidMount() {
    this.props.removeMessage();
  }
  
  getServerSideProps(ctx) {
    return {};
  }

  getInitialProps({ req }) {
    return { isServer: !!req };
  }
  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  handleSubmit = async (model) => {
    this.setState({
      loading: true,
    });
    await this.props.login(model);
    this.setState({
      loading: false,
    });
  };

  render() {
    const { classes, signInMessage, successMessage } = this.props;
    const { loading, canSubmit } = this.state;
    
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
              Login to Orphan Angels
            </Typography>
          </Box>
          <Formsy
            onValidSubmit={this.handleSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            ref={(form) => (this.form = form)}
            className={classes.form}
          >
            {signInMessage && (
              <Alert severity="error" message={signInMessage} />
            )}
            {successMessage && <Alert message={successMessage} />}
            <TextFieldFormsy
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="email"
              label="Email Address"
              name="email"
              autoComplete="email"
              autoFocus
              validations={{
                isEmail: true,
              }}
              validationErrors={{
                isEmail: "This is not a valid email",
              }}
            />
            <TextFieldFormsy
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="password"
              label="Password"
              type={this.state.showPassword ? "text" : "password"}
              id="password"
              autoComplete="current-password"
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

            <Box align="center">
              <Button
                style={{
                  padding: "15px 30px",
                }}
                size="large"
                disabled={!canSubmit || loading}
                type="submit"
                // fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
              >
                Login
              </Button>
            </Box>

            <Box align="center" mt={4}>
              <Link href="forgot-password" variant="body2">
                Forgot Password?
              </Link>
            </Box>
            <Box align="center" mt={4}>
              Don't have an account?<Link href="/sign-up" variant="body2">{" Registration"}</Link>
            </Box>
          </Formsy>
        </div>
      </Container>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      login: login,
      removeMessage: removeMessage,
    },
    dispatch
  );
};

function mapStateToProps({ auth }) {
  return {
    signInMessage: auth.errorMessage,
    successMessage: auth.successMessage,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SignIn)
);
