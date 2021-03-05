import { Component, Fragment } from "react";
import { withStyles, Accordion, AccordionSummary, AccordionDetails, Typography } from "@material-ui/core";
import { connect } from "react-redux";
import { getSettings, getFaqs } from "../src/store/actions";
import { bindActionCreators } from "redux";
import LandingPageLayout  from '../components/layout/LandingPage';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

const styles = () => ({
  root:{
    '& .MuiAccordion-root' :{
      textAlign: 'left',
    },
    '& .MuiAccordionDetails-root' :{
      textAlign: 'left',
    },
    '& .MuiAccordionSummary-root' :{
      background: '#f3f3f3',
    },
    
  },
  containerHeight: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '30vh',
  },
  header:{
    margin : '0px 0px 15px 17px',
  }
});
class Faq extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
    };
  }
  
  componentDidMount() {
    this.props.getFaqs();
  }

  render() {
    const faqs = this.props.faqs;
    const {classes} = this.props;
    const contentData = {
      metaDescription: 'Faq questions and answer',
      metaKeywords: 'orphan angles support',
      metaTitle:'FAQ page',
    }

    return (
        <LandingPageLayout metaContent={contentData}>
          <section class="mission-sec mission-sec-faq">
            <div class="container" className={this.props.classes.containerHeight}>
              {this.props.faqs && this.props.faqs.length == 0 && 
                  (<Typography component='h2' variant='h2'>Coming soon</Typography>)
              }
              {this.props.faqs && this.props.faqs.length > 0 && 
                  <div className={classes.root}>
                    <div className="container">
                      {this.props.faqs.map((faq)=>(
                        <Accordion>
                          <AccordionSummary
                            expandIcon={<ExpandMoreIcon />}
                            aria-controls="panel1a-content"
                            id="panel1a-header"
                          >
                            <Typography className={classes.heading}>{faq.question}</Typography>
                          </AccordionSummary>
                          <AccordionDetails>
                            <Typography>
                              {faq.question &&
                                <span dangerouslySetInnerHTML={{__html: faq.answer}} />
                              }                              
                            </Typography>
                          </AccordionDetails>
                        </Accordion>
                      ))}
                      </div>
                  </div>
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
      getFaqs: getFaqs,
    },
    dispatch
  );
};

function mapStateToProps({ settings, dashboard }) {
  return {
    settings: settings.data,
    faqs: dashboard.faqs,
  };
}
export default withStyles(styles, { withTheme: true })(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Faq)
);