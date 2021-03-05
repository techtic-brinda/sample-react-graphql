import { Component } from 'react'
import {
  CssBaseline,
  Box,
  Typography,
  Container,
  withStyles,
} from '@material-ui/core'
import { Link } from '../../components/common'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { verifyNewEmail } from '../../src/store/actions'
import { withRouter  } from 'next/router'
import logo from "../../public/images/logo.png"
 
const styles = theme => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  }
})
class Verify extends Component {
  constructor (props) {
    super(props)
    this.state = {
      token: props.router.query.token,
    }
    this.props.verifyNewEmail(this.state.token);
  }
 render () {
    return (
      <Container component='main' maxWidth='xs'>
        <CssBaseline />
        <div className={this.props.classes.paper}>
          <div className='logo'>
            <img src={logo}></img>
          </div>
          <Box align='center' mt={10}>
            <Typography component='h2' variant='h2'>
              Your new email is updated successfully. please <Link href="/login" variant="body2"> click here </Link> to login your account.
            </Typography>
          </Box>
        </div>
      </Container>
    )
  }
}

const mapDispatchToProps = dispatch => {
  return bindActionCreators(
    {
      verifyNewEmail: verifyNewEmail
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
  connect(mapStateToProps, mapDispatchToProps)(withRouter(Verify))
)
