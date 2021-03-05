import { Component } from "react";
import MainLayout from "../../components/layout/main";
import {
  Grid,
  Box,
  withStyles,
} from "@material-ui/core";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import ContactDetailForm from "./contactDetailForm";
import ContactDetail from "./contactDetail";
import { getSettings, sendMessage } from "../../src/store/actions";
import _ from 'lodash';
import styles from "./style";
import { withApollo } from "../../src/apollo";
import { withAuth } from "../../src/auth";
import { BreadCrumbsComponent } from '../../components/common';
class ContactUs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: 0,
    };

  }
  componentDidMount() {
    if (this.props.settings.length == 0) {
      this.props.getSettings()
    }
  }
  onClickSendMessage = (data) => {
    data.id = Number(this.props.currentUser.id);
    this.props.sendMessage(data)
  }
  render() {
    const { contactData, settings, successMessage } = this.props;
    return (
      <MainLayout>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <BreadCrumbsComponent />
          </Grid>
          <Grid item xs={12} sm={12} md={7} lg={7}>
            <Box>
              <ContactDetailForm
                contactData={contactData}
                successMessage={successMessage}
                onClickSendMessage={this.onClickSendMessage}
              />
            </Box>
          </Grid>
          <Grid item xs={12} sm={12} md={5} lg={5}>
            <Box>
              <ContactDetail settings={settings} />
            </Box>
          </Grid>
        </Grid>
      </MainLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getSettings: getSettings,
      sendMessage: sendMessage
    },
    dispatch
  );
};
function mapStateToProps({ auth, settings }) {
  return {
    currentUser: auth.user,
    settings: settings.data,
    successMessage: settings.successMessage
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withApollo(withAuth(ContactUs)))
);
