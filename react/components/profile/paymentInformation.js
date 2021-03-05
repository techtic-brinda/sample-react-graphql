import { Component } from "react";
import clsx from 'clsx';
import Typography from "@material-ui/core/Typography";
import {
  CardContent,
  Card,
  Button,
  Grid,
  Box,
  withStyles,
  Radio,
  RadioGroup,
  FormControlLabel,
  Avatar,
  IconButton,
} from "@material-ui/core";
import { connect } from "react-redux";
import { getCards, deleteCard, setDefaultCard, updateCard } from "../../src/store/actions";
import { bindActionCreators } from "redux";
import Formsy from "formsy-react";
import { TextFieldFormsy } from "../../components";
import { Alert, Link } from '../../components/common'
import { makeStyles } from '@material-ui/core/styles';
import { green } from '@material-ui/core/colors';
import EditOutlinedIcon from '@material-ui/icons/EditOutlined';
import CloseOutlinedIcon from '@material-ui/icons/CloseOutlined';
import AddIcon from '@material-ui/icons/Add';
import _ from 'lodash';

const styles = (theme) => ({
  FormRoot: {
    "& .MuiTextField-root": {
      margin: '8px 8px 8px 0',
      paddingBottom: theme.spacing(3),
      width: "100%",
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
  card: {
    borderRadius: "0px",
    height: "auto",
  },
  centrelizeContent: {
    alignSelf: "center"
  },
  paddingLeft: {
    paddingLeft: "7px",
    alignSelf: "center"
  },
  cardList: {
    padding: "15px !important",
  },
  paddingTop: {
    paddingTop: "40px"
  },
  paddingBottom: {
    paddingBottom: "10px"
  },
  formField: {
    display: 'inline-flex',
    width: '100%',
    '& .MuiTextField-root': {
      margin: '8px 15px 8px 0',
      width: '100%',
      '& .MuiInputLabel-outlined': {
        transform: 'translate(5px, 20px) scale(1)',
      },
      '& .MuiInputLabel-outlined.Mui-focused': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
      '& .MuiInputLabel-outlined.MuiFormLabel-filled': {
        transform: 'translate(14px, -6px) scale(0.75)',
      },
      ['@media (max-width:1279px)']: {
        '& .MuiInputLabel-outlined': {
            // eslint-disable-line no-useless-computed-key
            transform: 'translate(14px, 20px) scale(1)',
        },
      },
      ['@media (max-width:960px)']: {
        // eslint-disable-line no-useless-computed-key
        margin: '8px 0 8px 0',
        width: '100%',
        paddingBottom: '18px',
      },
    },
  },
  formYear: {
    '& .MuiOutlinedInput-input': {
        padding: '18.5px 10px',
    }
  },
  paymentButton: {
    '& .MuiIconButton-root': {
      padding: '5px',
    }
  }
});


const useStyles = makeStyles({
  root: {
    color: green[400],
    '&$checked': {
      color: green[600],
    },
    '&:hover': {
      backgroundColor: 'transparent',
    },
    '& MuiIcon-fontSizeSmall': {
      fontSize: '1px'
    },
  },
  icon: {
    borderRadius: '50%',
    width: 16,
    height: 16,
    boxShadow: 'inset 0 0 0 1px rgba(16,22,26,.2), inset 0 -1px 0 rgba(16,22,26,.1)',
    backgroundColor: '#f5f8fa',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.8),hsla(0,0%,100%,0))',
    '$root.Mui-focusVisible &': {
      outline: '2px auto rgba(19,124,189,.6)',
      outlineOffset: 2,
    },
    'input:hover ~ &': {
      backgroundColor: '#ebf1f5',
    },
    'input:disabled ~ &': {
      boxShadow: 'none',
      background: 'rgba(206,217,224,.5)',
    },
  },
  checkedIcon: {
    backgroundColor: '#137cbd',
    backgroundImage: 'linear-gradient(180deg,hsla(0,0%,100%,.1),hsla(0,0%,100%,0))',
    '&:before': {
      display: 'block',
      width: 16,
      height: 16,
      backgroundImage: 'radial-gradient(#fff,#fff 28%,transparent 32%)',
      content: '""',
    },
    'input:hover ~ &': {
      backgroundColor: '#106ba3',
    },
  },
});

// Inspired by blueprintjs
function StyledRadio(props) {
  const classes = useStyles();

  return (
    <Radio
      className={classes.root}
      disableRipple
      color="primary"
      checkedIcon={<span className={clsx(classes.icon, classes.checkedIcon)} />}
      icon={<span className={classes.icon} />}
      {...props}
    />
  );
}
const initialCard = {
  name:'',
  card_number:'',
  exp_month:'',
  exp_year:'',
  cvc:'',
  type:'add',
  id:'',
  stripe_id:'',
  isdisabled : false
}
class PaymentInformation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      canPasswordSubmit: false,
      confirm_pass_visibility: false,
      card : initialCard,
    };
  }
  componentWillReceiveProps(nextProps) {
    if (nextProps.cardSuccessMessage && this.state.card.type == 'add') {
      this.refs.form.reset();
    }
    if (nextProps.updateCardSuccess && this.state.card.type == 'update') {
      this.setState({card : initialCard})
    }
  }
  componentDidMount() {
    if(this.props.currentUser && this.props.cards.length == 0){
      this.props.getCards(this.props.currentUser.stripeId)
    }

  }
  disablePaymentButton = () => {
    this.setState({ canPaymentSubmit: false });
  };

  enablePaymentButton = () => {
    this.setState({ canPaymentSubmit: true });
  };

  handlePaymentSubmit = model => {
    this.props.onSaveCard(model)
  };

  handlePaymentCardUpdate = model => {
    model.stripe_id = this.props.currentUser.stripeId
    model.cardId = this.state.card.id
    model.exp_month = String(model.exp_month)
    model.exp_year = String(model.exp_year)
    model.name = String(model.name)
    model.type='update'
    this.props.updateCard(model)
  };
  onClickAddNewCard = () =>{
    this.setState({card : initialCard})
  }
  onClickEditCard = (id,customer)=>{
      let { card } = this.state;
      card =  _.find(this.props.cards, {id:id});
      card['card_number'] = `********${card.last4}`;
      card['cvc'] = `***`;
      card['isdisabled'] = true;
      card['type'] = 'update';
      this.setState({card});
  }
  onClickDeleteCard =(id,customer) =>{
      let data ={}
      data.type ='delete'
      data.stripe_id = customer
      data.cardId = id
      this.props.deleteCard(data)
  }
  selectDefultCard =(cardId) =>{
    let data ={}
    data.type = 'default'
    data.stripe_id = this.props.currentUser.stripeId
    data.cardId = cardId
    this.props.setDefaultCard(data)
  }
  render() {
    const { classes, cardErrorMessage, cardSuccessMessage, cards } = this.props;
    const { name, card_number, exp_month ,exp_year, cvc, isdisabled,type } = this.state.card
    let cards_data  = ''

    if(cards.length > 0 ){
      cards_data = cards.map(card =>{
          return(<Box mt={2}>
            <Card style={{ height: "70px" }}>
              <CardContent className={classes.cardList}>
                <Grid container direction="row" alignItems="left" justify="left">
                  <Grid item xs={1} className={classes.centrelizeContent} >
                    <FormControlLabel value={card.id} control={<StyledRadio />} label="" >
                    </FormControlLabel>
                  </Grid>
                  <Grid item xs={2} className={classes.centrelizeContent} >
                    <Avatar className={classes.card} alt="Cindy Baker" src="images/card/0.png" />
                  </Grid>
                  <Grid item xs={5} className={classes.centrelizeContent, classes.paddingLeft} >
                    <Typography variant="subtitle1" >
                      **** {card.last4}
                  </Typography>
                  </Grid>
                  <Grid item xs={4} className={classes.centrelizeContent, classes.paymentButton} align="right">
                    <IconButton onClick={()=>this.onClickEditCard(card.id,card.customer)}>
                      <EditOutlinedIcon fontSize='small' />
                    </IconButton>
                    <IconButton aria-label="Close" onClick={()=>this.onClickDeleteCard(card.id,card.customer)}>
                      <CloseOutlinedIcon fontSize='small' />
                    </IconButton>
                  </Grid>

                </Grid>

              </CardContent>
            </Card>
          </Box>)
      })
    }
    const { loading, canPaymentSubmit } = this.state;
    return (
      <Card>
        <CardContent>
            <h2 className={classes.paddingBottom}>Payment</h2>
            {cardErrorMessage && (
              <Alert severity='error' message={cardErrorMessage} />
            )}
            {type == 'update' &&
            <>
              <Formsy
                onValidSubmit={this.handlePaymentCardUpdate}
                onValid={this.enablePaymentButton}
                onInvalid={this.disablePaymentButton}
                refupdate={"formUpdate"}
                className={classes.paymentForm}
              >
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextFieldFormsy
                      id="name"
                      label="Cardholder Name"
                      type="text"
                      name="name"
                      variant="outlined"
                      required
                      fullWidth
                      value={name}
                      size="small"
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextFieldFormsy
                      fullWidth
                      name="card_number"
                      required
                      type="text"
                      label="Card Number"
                      variant="outlined"
                      value={card_number}
                      size="small"
                      disabled={isdisabled}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                    <TextFieldFormsy
                      id="exp_month"
                      label="Month"
                      name="exp_month"
                      value={exp_month}
                      required
                      InputLabelProps={{
                        shrink: true,
                      }}
                      variant='outlined'
                      // validations={{
                      //   isNumeric: true,
                      //   minLength: 1,
                      //   maxLength: 2,
                      // }}
                      // validationErrors={{
                      //   minLength: "Min Length 1",
                      //   maxLength: "Max Length 2",
                      //   isNumeric: "Only number is allowed",
                      // }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4} className={[classes.formField, classes.formYear]}>
                    <TextFieldFormsy
                      name="exp_year"
                      required
                      id="exp_year"
                      value={exp_year}
                      label="Year"
                      variant="outlined"
                      // validations={{
                      //   isNumeric: true,
                      //   isLength: 4
                      // }}
                      // validationErrors={{
                      //   isLength: "Year must be 4 digit",
                      //   isNumeric: "Only number is allowed",
                      // }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                    <TextFieldFormsy
                      name="cvc"
                      id="cvc"
                      label="CVV"
                      value={cvc}
                      variant="outlined"
                      size="small"
                      disabled={isdisabled}
                    />
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size={"large"}
                  disabled={!canPaymentSubmit || loading}
                  className={classes.submit}
                >
                  Save
                </Button>
                <Button
                  fullWidth
                  type="button"
                  variant="contained"
                  size={"large"}
                  onClick={()=>this.onClickAddNewCard()}
                  className={classes.submit}
                >
                  Cancel
                </Button>

              </Formsy>
              </>
            }
            {type == 'add' &&
            <>
              <Formsy
                onValidSubmit={this.handlePaymentSubmit}
                onValid={this.enablePaymentButton}
                onInvalid={this.disablePaymentButton}
                ref={"form"}
                className={classes.paymentForm}
              >
                <Grid container spacing={24}>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextFieldFormsy
                      id="name"
                      label="Cardholder Name"
                      type="text"
                      name="name"
                      variant="outlined"
                      required
                      fullWidth
                      size="small"
                      validations={{ isAlpha: true }}
                      validationErrors={{
                        isAlpha: "Only letters are allowed",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={12} lg={12}>
                    <TextFieldFormsy
                      fullWidth
                      name="card_number"
                      required
                      type="text"
                      id="card_number"
                      label="Card Number"
                      variant="outlined"
                      size="small"
                      validations={{
                        minLength: 8,
                        maxLength: 20,
                      }}
                      validationErrors={{
                        minLength: "Min Length 8",
                        maxLength: "Max Length 20",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                    <TextFieldFormsy
                      name="exp_month"
                      required
                      id="exp_month"
                      label="Month"
                      variant='outlined'
                      validations={{
                        isNumeric: true,
                        minLength: 1,
                        maxLength: 2,
                      }}
                      validationErrors={{
                        minLength: "Min Length 1",
                        maxLength: "Max Length 2",
                        isNumeric: "Only number is allowed",
                      }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={12} md={6} lg={4} className={[classes.formField, classes.formYear]}>
                    <TextFieldFormsy
                      name="exp_year"
                      required
                      id="exp_year"
                      label="Year"
                      variant="outlined"
                      validations={{
                        isNumeric: true,
                        isLength: 4
                      }}
                      validationErrors={{
                        isLength: "Year must be 4 digit",
                        isNumeric: "Only number is allowed",
                      }}
                    />
                  </Grid>

                  <Grid item xs={12} sm={12} md={6} lg={4} className={classes.formField}>
                    <TextFieldFormsy
                      name="cvc"
                      required
                      id="cvc"
                      label="CVV"
                      value={cvc}
                      variant="outlined"
                      size="small"
                      validations={{ isLength: 3 }}
                      validationErrors={{
                        isLength: "CVV must be 3 digit",
                      }}
                    />
                  </Grid>
                </Grid>
                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  color="primary"
                  size={"large"}
                  disabled={!canPaymentSubmit || loading}
                  className={classes.submit}
                >
                  Save
                </Button>
              </Formsy>
              </>
            }
            {cards.length > 0 &&
              <RadioGroup onChange={(e)=>this.selectDefultCard(e.target.value)} defaultValue={cards[0].default_source} aria-label="cards" name="customized-radios">
                {cards_data}
              </RadioGroup>
            }
          </CardContent>
      </Card >
    );
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      getCards: getCards,
      deleteCard: deleteCard,
      setDefaultCard: setDefaultCard,
      updateCard: updateCard
    },
    dispatch
  );
};
function mapStateToProps({ auth, userProfile }) {
  return {
    errorMessage: auth.errorMessage,
    successMessage: auth.successMessage,
    updateCardSuccess: userProfile.updateCardSuccess,
    cards: userProfile.cards,
    currentUser: auth.user,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(PaymentInformation)
);
