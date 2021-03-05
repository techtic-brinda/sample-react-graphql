import { Component, Fragment } from "react";
import { withStyles, Grid, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { getSettings, getContent } from "../src/store/actions";
import { bindActionCreators } from "redux";
import LandingPageLayout  from '../components/layout/LandingPage';

const styles = () => ({
  root:{
    
  },
  containerHeight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '30vh',
  }
});
class Fundraisers extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }

  componentDidMount() {
    this.props.getContent('fundraisers');
  }

  render() {
    const contentData = this.props.content
    return (
        <LandingPageLayout metaContent={contentData}>
          <section class="mission-sec">
            <div class="container" className={this.props.classes.containerHeight}>
            {!contentData ? 
                (<Typography component='h2' variant='h2'>Coming soon</Typography>)
                :
                (<span dangerouslySetInnerHTML={ { __html : contentData?.content}} />)
            }
            </div>
          </section>
        </LandingPageLayout>
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getSettings: getSettings,
      getContent: getContent,
    },
    dispatch
  );
};

function mapStateToProps({ settings, dashboard }) {
  return {
    settings: settings.data,
    content: dashboard.content,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Fundraisers)
);