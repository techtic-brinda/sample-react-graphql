import { Component } from 'react'
import {
  Button,
  CssBaseline,
  Box,
  Typography,
  Container,
  withStyles,
  InputAdornment,
  IconButton,
} from '@material-ui/core'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { resetPassword,forgotPasswordUser } from '../../src/store/actions'
import Formsy from 'formsy-react'
import { TextFieldFormsy } from '../../components'
import { withRouter  } from 'next/router'
import logo from "../../public/images/logo.png"
import {
  Visibility as VisibilityIcon,
  VisibilityOff as VisibilityOffIcon,
} from "@material-ui/icons";

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



class ResetPassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      canSubmit: false,
      confirm_pass_visibility: false,
      confirm_password: false,
      token: props.router.query.token,
    }
    this.props.forgotPasswordUser(this.state.token);
  }

  onSubmit = async model => {
    if(this.props.forgotUser){
      let data = {userInId : Number(this.props.forgotUser) ,newPassword:model.newPassword}
      this.setState({
        loading: true
      })
      await this.props.resetPassword(data)
      this.setState({
        loading: false
      })
      this.refs.form.reset();
    }  
  }
  
  disableButton = () => {
    this.setState({ canSubmit: false })
  }

  enableButton = () => {
    this.setState({ canSubmit: true })
  }

  render () {
    const { classes } = this.props
    const { canSubmit, loading, confirm_password } = this.state

    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={classes.paper}>
          <div className='logo'>
            <img src={logo}></img>
          </div>
          <Box align='center' mt={4}>
            <Typography component='h6' variant='h6'>
              Reset Your Password?
            </Typography>
          </Box>
          <Formsy
            onValidSubmit={this.onSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            ref={"form"}
            className='flex flex-col justify-center p-24 w-512'
          >
            <TextFieldFormsy
              variant='outlined'
              margin='normal'
              required
              fullWidth
              type={confirm_password ? 'text' : 'password'}
              name='newPassword'
              label='New Password'
              required
              validations={{ minLength: 8, maxLength: 16 }}
              validationErrors={{
                minLength: 'Password min length must be 8 character',
                maxLength: 'Password max length must be 16 character'
              }}
              InputProps={{
                endAdornment: (
                  <InputAdornment position='end'>
                    <IconButton
                      edge='end'
                      onClick={() =>
                        this.setState({
                          confirm_password: !this.state.confirm_password
                        })
                      }
                    >
                      {confirm_password ? <VisibilityIcon /> : <VisibilityOffIcon />}
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <TextFieldFormsy
              variant='outlined'
              margin='normal'
              required
              fullWidth
              type={confirm_password ? 'text' : 'password'}
              name='confirmPassword'
              label='Confirm Password'
              required
              validations={{equalsField: 'newPassword' }}
              validationErrors={{
                  equalsField: 'Password mismatch'
              }}
            />
            <Box align='center'>
              <Button
                disabled={!canSubmit || loading}
                type='submit'
                color='primary'
                size={'large'}
                variant='contained'
                className={classes.submit}
              >
                Done
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
      resetPassword: resetPassword,
      forgotPasswordUser: forgotPasswordUser
    },
    dispatch
  )
}

function mapStateToProps ({ auth }) {
  return {
    errorMessage: auth.errorMessage,
    successMessage: auth.successMessage,
    forgotUser: auth.forgotUser
  }
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withRouter(ResetPassword))
)
