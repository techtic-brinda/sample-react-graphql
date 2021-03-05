
import { Component } from 'react'
import { withStyles  } from '@material-ui/core';
import { withRouter } from 'next/router'
import Header from './Header';
import Footer from './Footer';

const styles = () => ({
  root: {
      flexGrow: 1,
  },
})

class LandingPageLayout extends Component {
  constructor (props) {
      super(props);
      // this.state = {
      // }
    }
    
    render() {
      return (
        <React.Fragment>
          <div className="landing-container">
            <Header metaContent={this.props.metaContent} />
            {this.props.children}
            <Footer />
          </div>
        </React.Fragment>
      );
    }
}

export default withStyles(styles, { withTheme: true })(
  withRouter(LandingPageLayout)
);
