import { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { CardContent, Card, Button, Box, withStyles, Grid } from '@material-ui/core'
import Formsy from 'formsy-react'
import { TextFieldFormsy } from '../../components'
import { Alert, Link } from '../../components/common'
const styles = theme => ({
  FormRoot: {
    '& .MuiTextField-root': {
      margin: '8px 15px 8px 0',
      paddingBottom: theme.spacing(3),
      width: '100%'
    }
  },

  paymentForm: {
    '& .MuiTextField-root': {
      paddingBottom: theme.spacing(3)
    }
  },

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
    margin: theme.spacing(1, 0, 1)
  },
  formField: {
    display: 'inline-flex',
    width: '100%',
    '& .MuiTextField-root': {
      ['@media (max-width:960px)']: {
        // eslint-disable-line no-useless-computed-key
        margin: '8px 0 8px 0',
        width: '100%',
        paddingBottom: '18px',
      },
    }
  }
})

class ChangePassword extends Component {
  constructor (props) {
    super(props)
    this.state = {
      loading: false,
      canPasswordSubmit: false,
      confirm_pass_visibility: false
    }
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.profileMessage && nextProps.profileMessage == 'success'){
        this.refs.form.reset();
    }
  }
  disablePasswordButton = () => {
    this.setState({ canPasswordSubmit: false })
  }

  enablePasswordButton = () => {
    this.setState({ canPasswordSubmit: true })
  }

  render () {
    const { classes, errorPassMessage} = this.props
    const { loading, canPasswordSubmit } = this.state
    return (
      <Grid container>
          <Grid item xs={12}>
            <Card className={classes.root}>
              <CardContent>
                <h2>Change Password</h2>
                {errorPassMessage && (
                  <Alert severity='error' message={errorPassMessage} />
                )}
                <Formsy
                  onValidSubmit={this.props.onSaveChangePassword}
                  onValid={this.enablePasswordButton}
                  onInvalid={this.disablePasswordButton}
                  ref={"form"}
                  className={classes.FormRoot}
                >
                <Grid container spacing={2} direction="row">
                  <Grid item xs={12}>
                    <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                      <TextFieldFormsy
                        id='old_password '
                        label='Current Password'
                        name='old_password'
                        required
                        type='password'
                        variant='outlined'
                        validations={{ minLength: 8, maxLength: 16 }}
                        validationErrors={{
                          minLength: 'Password min length must be 8 character',
                          maxLength: 'Password max length must be 16 character'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                      <TextFieldFormsy
                        id='new_password'
                        label='New Password'
                        name='new_password'
                        required
                        type='password'
                        variant='outlined'
                        validations={{ minLength: 8, maxLength: 16 }}
                        validationErrors={{
                          minLength: 'Password min length must be 8 character',
                          maxLength: 'Password max length must be 16 character'
                        }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                      <TextFieldFormsy
                        id='confirm_password'
                        label='Confirm Password'
                        name='confirm_password'
                        required
                        type='password'
                        variant='outlined'
                        validations={{
                          equalsField: 'new_password',
                          minLength: 8,
                          maxLength: 16
                        }}
                        validationErrors={{
                          minLength: 'Password min length must be 8 character',
                          maxLength: 'Password max length must be 16 character',
                          equalsField: 'Password mismatch'
                        }}
                      />
                    </Grid>

                    <Grid item xs={12} sm={12} md={12} lg={12}>
                      <Box align='center'>
                        <Button
                          type='submit'
                          variant='contained'
                          color='primary'
                          size={'large'}
                          disabled={!canPasswordSubmit || loading}
                          className={classes.submit}
                        >
                          Save Changes
                        </Button>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Formsy>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    )
  }
}

export default withStyles(styles, { withTheme: true })(ChangePassword)
