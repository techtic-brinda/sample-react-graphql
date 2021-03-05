import { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import {
  CardContent,
  Card,
  Button,
  Grid,
  Box,
  withStyles,
  MenuItem
} from '@material-ui/core'
import Formsy from 'formsy-react'
import { TextFieldFormsy, SelectFormsy, DatePickerFieldFormsy, PhoneFieldFormsy } from '../../components'
import moment from 'moment'
import { Alert, Link } from '../common'
import ImageInput from '../ImageInput'
import { getImageUrl } from "./../../src/helpers";

const styles = theme => ({
  FormRoot: {
    '& .MuiTextField-root': {
      margin: '8px 15px 8px 0',
      paddingBottom: theme.spacing(3),
      width: '100%'
    },
    '& .select-formcy': {
      margin: theme.spacing(1),
      paddingBottom: theme.spacing(3),
      width: '100%'
    }
  },
  profileImage: {
    '& .MuiButtonBase-root': {
      margin: theme.spacing(1),
      paddingBottom: theme.spacing(3),
      width: '25ch',
      textAlign: 'center'
    }
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(3)
  },
  submit: {
    margin: theme.spacing(1, 0, 1)
  },
  alignCenter: {
    textAlign: 'center'
  },
  profileImageLabel: {
    marginBottom: '10px',
    display: 'inline-block',
  },
  formField: {
    display: 'inline-flex',
    width: '100%',
    '& .MuiTextField-root': {
      ['@media (max-width:960px)']: {
        // eslint-disable-line no-useless-computed-key
        margin: '8px 0 8px 0',
      },
    }
  }
})

class ProfileInformation extends Component {
  static getDerivedStateFromProps(props, state) {
    if (props.profileData) {
      state = {
        ...state,
        profile: {
          ...state.profile,
          ...props.profileData
        }
      }
      state.profile.old_email = props.profileData?.email
    }
    state.loading = props.loading
    return state
  }
  state = {
    loading: false,
    canSubmit: false,
    profile: {
      id: '',
      firstName: '',
      lastName: '',
      email: '',
      old_email: '',
      phone: '',
      dob: '',
      address: '',
      updatedEmail: ''
    },
    updateImage: '',
  }
  disableButton = () => {
    this.setState({ canSubmit: false })
  }

  enableButton = () => {
    this.setState({ canSubmit: true })
  }

  handleChange = (value, name) => {
    const { profile } = this.state
    profile[name] = value;
    this.setState({ profile })
    this.setState({ updateImage : value })
  }
  onSubmit = model => {
    const { updateImage } = this.state;
    model.updatedEmail = (model.email != this.state.profile.old_email) ? model.email : null;
    model.isMailUpdated = (model.email != this.state.profile.old_email) ? true : false;
    model.email = (model.email != this.state.profile.old_email) ? this.state.profile.old_email : model.email;
    model.image = (model.image != updateImage) ? updateImage : model.image;
    model.id = this.state.profile.id;
    this.props.onSaveProfile(model)
  }
  render() {
    const { classes, errorProfileMessage } = this.props
    const { loading, canSubmit } = this.state
    const {
      firstName,
      email,
      phone,
      dob,
      lastName,
      address,
      image,
      updatedEmail
    } = this.state.profile
    console.log(this.state.profile, 'profile user');
    return (
        <Grid container>
          <Grid item xs={12}>
            <Card className={classes.root}>
              <CardContent>
                <h2>Personal Information</h2>
                {errorProfileMessage && (
                  <Alert severity='error' message={errorProfileMessage} />
                )}
                <Formsy
                  onValidSubmit={this.onSubmit}
                  onValid={this.enableButton}
                  onInvalid={this.disableButton}
                  ref={(form) => (this.form = form)}
                  className={classes.FormRoot}
                >
                  <div>
                    <div className={classes.profileImage, classes.alignCenter}>
                      <label htmlFor='status' className={classes.profileImageLabel}>Profile Image</label>
                      <ImageInput
                        value={getImageUrl(image)}
                        name='image'
                        showPreviews={true}
                        className='mt-4'
                        maxFileSize={5000000}
                        onChange={e => this.handleChange(e, 'image')}
                      />
                    </div>
                    <Grid container spacing={2} direction="row">
                      <Grid item xs={12}>
                          <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                            <TextFieldFormsy
                              id='outlined-number'
                              label='First Name'
                              name='firstName'
                              value={firstName}
                              type='text'
                              required
                              variant='outlined'
                              validations={{ isAlpha: true }}
                              validationErrors={{
                                isAlpha: 'Only letters are allowed'
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                            <TextFieldFormsy
                              id='outlined-number'
                              label='Last Name'
                              name='lastName'
                              value={lastName}
                              type='text'
                              required
                              variant='outlined'
                              validations={{ isAlpha: true }}
                              validationErrors={{
                                isAlpha: 'Only letters are allowed'
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                            <TextFieldFormsy
                              id='outlined-search'
                              label='Email'
                              type='email'
                              name='email'
                              value={email}
                              required
                              defaultValue='Default Value'
                              variant='outlined'
                              validations={{
                                isEmail: true
                              }}
                              validationErrors={{
                                isEmail: 'This is not a valid email'
                              }}
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                            <PhoneFieldFormsy
                              id='outlined-helperText'
                              label='Phone'
                              type='text'
                              name='phone'
                              value={phone}
                              defaultValue='Default Value'
                              variant='outlined'
                              required
                              validations={{                      
                                  minLength: 12,
                              }}
                              validationErrors={{
                                  minLength: "Invalid Phone",
                              }}
                            />
                          </Grid>

                          {/* <DatePickerFieldFormsy
                              format="MM/dd/yyyy"
                              label="Date of Birth"
                              name="dob"
                              required
                              value={dob}
                              emptyLabel={'Select date'}
                              disableFuture={true}
                          /> */}

                          {/* <TextFieldFormsy
                            id='date-picker-inline'
                            label='Date of Birth'
                            type='date'
                            name='dob'
                            required
                            value={dob ? moment(dob).format('YYYY-MM-DD') : ''}
                            variant='outlined'
                          /> */}

                          <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                            <TextFieldFormsy
                              id='outlined-address'
                              label='Address'
                              name='address'
                              type='text'
                              value={address}
                              variant='outlined'
                            />
                          </Grid>

                          <Grid item xs={12} sm={12} md={12} lg={12}>
                              {updatedEmail &&
                                <Alert severity='info' message={`Your email ${updatedEmail}   is not verified, once verify it will update it.`} />
                              }
                              <Box align='center'>
                                <Button
                                  type='submit'
                                  variant='contained'
                                  color='primary'
                                  size={'large'}
                                  disabled={!canSubmit || loading}
                                  className={classes.submit}
                                >
                                  Save Changes
                                </Button>
                              </Box>
                          </Grid>
                      </Grid>
                    </Grid>
                  </div>
                </Formsy>
              </CardContent>
            </Card>
          </Grid>
        </Grid>
    )
  }
}
export default withStyles(styles, { withTheme: true })(ProfileInformation)
