import { Component } from 'react'
import {
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  Grid,
  withStyles
} from '@material-ui/core'
import { Link, Alert } from '../../components/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { forgotPassword, removeMessage } from '../../src/store/actions'
import Formsy from 'formsy-react'
import { TextFieldFormsy } from '../../components'

const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(3, 1, 2)
  }
})

class ForgotPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      canSubmit: false
    }
  }
  componentWillReceiveProps(nextProps){
    if(nextProps.errorMessage != null || nextProps.successMessage != null){
        setTimeout( () => 
          this.props.removeMessage(),
        3000);
    }
  }
  componentDidMount() {
    this.props.removeMessage();
  }
  async handleSubmit (event) {
    event.preventDefault()
    const form = event.target
    const formData = new window.FormData(form)
    const email = formData.get('email')

    this.setState({
      loading: true
    })
    await forgotPassword(email)
    this.setState({
      loading: false
    })
  }

  disableButton = () => {
    this.setState({ canSubmit: false })
  }

  enableButton = () => {
    this.setState({ canSubmit: true })
  }

  handleSubmit = async model => {
    this.setState({
      loading: true
    })
    await this.props.forgotPassword({email :model.email})
    this.setState({
      loading: false
    })
    this.refs.form.reset();
  }

  render () {
    const { classes, errorMessage, successMessage } = this.props
    const { canSubmit, loading } = this.state

    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <div className='logo'>
            <img src='images/logo.png'></img>
          </div>
          <Box align='center' mt={4}>
            <Typography component='h6' variant='h6'>
              Forgot your password
            </Typography>
            <Typography variant='caption' display='block' gutterBottom>
              Please enter your Email Address to get Reset Password link
            </Typography>
          </Box>
          <Formsy
            onValidSubmit={this.handleSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            ref={"form"}
            className={classes.form}
          >
            {errorMessage && <Alert severity='error' message={errorMessage} />}
            {successMessage && <Alert message={successMessage} />}
            <Grid item xs={12}>
              <TextFieldFormsy
                variant='outlined'
                margin='normal'
                required
                fullWidth
                id='email'
                label='Email Address'
                name='email'
                autoComplete='email'
                autoFocus
                validations={{
                  isEmail: true
                }}
                validationErrors={{
                  isEmail: 'This is not a valid email'
                }}
              />
            </Grid>
            <Box align='center'>
              <Button
                variant='outlined'
                size={'large'}
                className={classes.submit}
              >
                <Link href='/login' color='inherit' underline='none'>
                  {' '}
                  Not Now{' '}
                </Link>
              </Button>

              <Button
                disabled={!canSubmit || loading}
                type='submit'
                color='primary'
                size={'large'}
                variant='contained'
                className={classes.submit}
              >
                Send
              </Button>
            </Box>
          </Formsy>
        </div>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      forgotPassword: forgotPassword,
      removeMessage: removeMessage,
    },
    dispatch
  )
}

function mapStateToProps ({ auth }) {
  return {
    errorMessage: auth.errorMessage,
    successMessage: auth.successMessage
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(ForgotPassword)
)
