import { Component, Fragment } from "react";
import { withStyles, Grid } from "@material-ui/core";
import { connect } from "react-redux";
import { getSettings, getNewChild, sendMessage } from "../src/store/actions";
import { bindActionCreators } from "redux";
import { Link } from '../components/common'
import { getImageUrl } from "../src/helpers";
import LandingPageLayout  from '../components/layout/LandingPage';
import Slider from "react-slick";

const sliderSettings = {
  arrows: false,
  infinite: true,
  lazyLoad: true,
  duration: 10,
  speed: 700,
  slidesToScroll: 1,
  slidesToShow: 1,
  swipeToSlide: true,
};

const styles = () => ({
  root:{
  }
});
class HomePage extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      value: 0,
      email: '',
      canSubmit: false,
    };
  }
  componentDidMount() {
    this.props.getSettings();
    this.props.getNewChild();
  }

  getLinks = (val) => {
    if (this.props.settings.length > 0) {
      const setting = _.find(this.props.settings, { key: val })
      return (setting) ? setting.value : '#';
    } else {
      return '#';
    }
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  handleSubmit = async (model) => {
    this.setState({ loading: true });
    await this.props.sendMessage(model);
    this.setState({ loading: false });
    this.refs.form.reset();
  };

  render() {
    const { classes, signInMessage, successMessage, newOrphans = [] } = this.props;
    const { loading, canSubmit } = this.state;

    return (
        <LandingPageLayout>
            <section class="main-banner">
                <Slider {...sliderSettings}>
                  <div class="item">
                    <figure>
                      <img src="images/banner-1.jpg" />
                    </figure>
                    <div class="banner-content">
                      <div class="container">
                        <div class="banner-outer">
                          <h1>
                            Tincidunt ante <br /> consectetur{" "}
                          </h1>
                          <p>
                            Lorem ipsum dolor amet, consectetur adipiscing elit.
                            Pellentesque pulvinar a mauris at tincidunt.{" "}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Slider>
            </section>

            <section class="mission-sec">
                <div class="container">
                  <h2> Mission Statement</h2>
                  <p>
                    Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                    Pellentesque pulvinar a mauris at tincidunt. Pellentesque
                    auctor, ex nec consequat ullamcorper, nibh ipsum feugiat
                    tellus, eget laoreet felis risus sit amet nibh. Mauris
                    semper blandit nunc, ut commodo erat accumsan quis. Maecenas
                    sed sapien vel metus aliquam aliquet nec at eros. Nulla
                    scelerisque aliquam ligula non commodo. In hac habitasse
                    platea dictumst. Duis nec maximus dolor. Cras rutrum augue
                    vel augue tempor, a placerat nisi aliquet. Quisque sit amet
                    tempor lorem, vel ullamcorper velit.{" "}
                  </p>
                  <div class="read-more">
                    <Link href={`/sign-up`} variant="body2">Get involved</Link>
                  </div>
                </div>
              </section>

              <section class="meet-our-sec">
                <div class="container">
                  <h2>Meet some of our orphans!</h2>
                  <p>Create an account to find your orphan child and donate!</p>

                  <div class="meet-our-outer">
                    <Grid
                      container
                      spacing={3}
                      direction="row"
                      justify="center"
                    >
                      {newOrphans.length > 0 && newOrphans.map((orphan) => (
                        <Grid item xs={12} sm={6} lg={3} md={6} key={orphan.id}>
                          <div class="meet-child-box">
                            <figure>
                              <img src={getImageUrl(orphan.image, 'landing')} alt={orphan.firstName} />
                            </figure>
                            <div class="meet-child-cont">
                            <h3>{orphan.firstName}  {orphan.lastName}</h3>
                              <p>
                                {orphan.comments}
                              </p>
                            </div>
                          </div>
                        </Grid>
                      ))}
                    </Grid>
                  </div>
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
      getNewChild: getNewChild,
      sendMessage: sendMessage,
    },
    dispatch
  );
};
function mapStateToProps({ settings, dashboard }) {
  return {
    newOrphans: dashboard.newOrphans,
    settings: settings.data,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HomePage)
);