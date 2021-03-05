import { Component } from "react";
import MainLayout from "../../components/layout/main";
import { Grid, Box, withStyles } from "@material-ui/core";
import { connect } from "react-redux";
import { getCurrentUser, updatePassword,addCard, updateProfile, getSecurityQuestions, createSecurityQuestion, updateSecurityQuestion } from "../../src/store/actions";
import { bindActionCreators } from "redux";
import { withAuth } from './../../src/auth';
import ChangePassword from "../../components/profile/changePassword";
import PaymentInformation from "../../components/profile/paymentInformation";
import ProfileInformation from "../../components/profile/profileInformation";
import SecurityQuestion from "../../components/profile/SecurityQuestion";
import { BreadCrumbsComponent } from '../../components/common';

const styles = (theme) => ({
  FormRoot: {
    "& .MuiTextField-root": {
      margin: theme.spacing(1),
      paddingBottom: theme.spacing(3),
      width: "25ch",
    },
  },

  paymentForm: {
    "& .MuiTextField-root": {
      paddingBottom: theme.spacing(3),
    },
  },

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
    width: "100%", // Fix IE 11 issue.
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(1, 0, 1),
  },
});

class Profile extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      canSubmit: false,
      canPaymentSubmit: false,
      canPasswordSubmit: false,
      confirm_pass_visibility: false,
    };

  }
  componentDidMount() {
     if(this.props.currentUser){
       this.props.getCurrentUser(this.props.currentUser.id);
     }
     this.props.getSecurityQuestions()
	}

  onSaveChangePassword = (userPassword) => {
    userPassword.id = this.props.currentUser.id;
    this.props.updatePassword(userPassword);
  };

  onSaveProfile = (userModel) => {
	  this.props.updateProfile(userModel);
  };

  onSaveSecurityQuestion = (questionModel) => {
    questionModel.user_id = this.props.currentUser.id
    const type = questionModel.type;
    delete questionModel.type;
    if(type == 'add'){
      this.props.createSecurityQuestion(questionModel);
    }else{
      this.props.updateSecurityQuestion(questionModel);
    }
	};
  onSaveCard = (data) =>{
    data.stripe_id = this.props.currentUser.stripeId
    data.cardId = ''
    data.type = (data.cardId !='') ? 'update' :'add'
    this.props.addCard(data);
  }
  render() {
    const { profileData, profileQuestion, cardErrorMessage,cardSuccessMessage, errorPassMessage, errorMessage, profileMessage, errorProfileMessage, securityQuestions,currentUser } = this.props;
    return (
      <MainLayout>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BreadCrumbsComponent />
          </Grid>
          {/* (currentUser.roleName == "Angel") ? 8 : */}
          <Grid item xs={12} sm={12} md={12} lg={12}>
            <Box >
              <ProfileInformation
                profileData={profileData}
                errorProfileMessage={errorProfileMessage}
                onSaveProfile={this.onSaveProfile}
              />
            </Box>

            <Box mt={4}>
              <ChangePassword
                errorPassMessage={errorPassMessage}
                profileMessage={profileMessage}
                onSaveChangePassword={this.onSaveChangePassword}
              />
            </Box>

            <Box mt={4}>
              <SecurityQuestion
                errorMessage={errorMessage}
                profileQuestion ={profileQuestion}
                securityQuestions ={securityQuestions}
                onSaveSecurityQuestion={this.onSaveSecurityQuestion}
              />
            </Box>
          </Grid>
          {/* {currentUser.roleName == "Angel" &&
            <Grid item xs={12} sm={12} md={12} lg={4}>
              <Box >
                <PaymentInformation
                  cardErrorMessage={cardErrorMessage}
                  cardSuccessMessage={cardSuccessMessage}
                  onSaveCard={(e)=>this.onSaveCard(e)}
                 />
              </Box>
            </Grid>
          } */}
        </Grid>
      </MainLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCurrentUser: getCurrentUser,
      updatePassword: updatePassword,
      updateProfile: updateProfile,
      getSecurityQuestions: getSecurityQuestions,
      createSecurityQuestion: createSecurityQuestion,
      updateSecurityQuestion: updateSecurityQuestion,
      addCard: addCard,
    },
    dispatch
  );
};
function mapStateToProps({ auth, userProfile }) {
  console.log(userProfile, 'userProfile');
  return {
    profileData: userProfile.profile.user,
    profileQuestion: userProfile.profile.usersSecurityQuestions,
    currentUser: auth.user,
    errorMessage: userProfile.errorMessage,
    errorProfileMessage: userProfile.errorProfileMessage,
    errorPassMessage: userProfile.errorPassMessage,
    profileMessage: userProfile.profileMessage,
    successMessage: userProfile.successMessage,
    securityQuestions: userProfile.securityQuestions,
    cardErrorMessage: userProfile.cardErrorMessage,
    cardSuccessMessage: userProfile.cardSuccessMessage,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withAuth(Profile))
);
