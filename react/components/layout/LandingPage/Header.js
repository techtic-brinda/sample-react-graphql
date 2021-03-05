import { Component } from 'react'
import { withStyles  } from '@material-ui/core';
import { withRouter } from 'next/router'
import { Link } from '../../../components/common';
// import Slider from "react-slick";

// const sliderSettings = {
//   arrows: false,
//   infinite: true,
//   lazyLoad: true,
//   duration: 10,
//   speed: 700,
//   slidesToScroll: 1,
//   slidesToShow: 1,
//   swipeToSlide: true,
// };


const styles = () => ({
    root: {
        flexGrow: 1,
    },
  })

class Header extends Component {
  constructor (props) {
        super(props)
    }
    render() {
      
      return (
        <React.Fragment>
          <head>
              <meta charset="UTF-8" />
              {this.props.metaContent && this.props.metaContent.metaDescription && 
                <meta name="description" content={this.props.metaContent.metaDescription} />
              }

              {this.props.metaContent && this.props.metaContent.metaKeywords && 
                <meta name="keywords" content={this.props.metaContent.metaKeywords} />
              }

              {this.props.metaContent && this.props.metaContent.metaTitle && 
                <meta name="title" content={this.props.metaContent.metaTitle} />
              }
              
              <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0"/>
            {this.props.metaContent && this.props.metaContent.metaTitle ? (<title>{`Orphan Angels - ${this.props.metaContent.metaTitle}`}</title>) : (<title>Orphan Angels</title> )}
              
            <link rel="shortcut icon" href="/images/favicon.ico" />
            </head>
            <header>
                <div class="container">
                  <div class="logo">
                    <Link href={`/`} variant="body2">
                      <img src="images/container_logo.png" alt="" />
                    </Link>
                  </div>
                  <div class="top-right">
                    <Link href={`/sign-up`} variant="body2">Sign up</Link>
                    <Link href={`/login`} variant="body2">Login</Link>
                  </div>
                  <div class="top-txt">
                    <div class="container">
                      <span>Orphan Angels</span>
                    </div>
                  </div>
                </div>
              </header>

              <div class="menu-nav">
                <div class="container">
                  <ul>
                    <li>
                      <Link href={`/about`} variant="body2">About</Link>
                    </li>
                    <li>
                      <Link href={`/faq`} variant="body2">FAQ</Link>
                    </li>
                    <li>
                      <Link href={`/fundraisers`} variant="body2">Fundraisers</Link>
                    </li>
                    <li>
                      <Link href={`/partnerships`} variant="body2">Partnerships</Link>
                    </li>
                  </ul>
                </div>
              </div>

              {/* <section class="main-banner">
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
              </section> */}
        </React.Fragment>
      );
    }
}
export default withStyles(styles, { withTheme: true })(
    withRouter(Header)
);
