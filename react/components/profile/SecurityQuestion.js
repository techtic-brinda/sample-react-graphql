import { Component } from 'react'
import Typography from '@material-ui/core/Typography'
import { CardContent, Card, Button, Box, withStyles, Grid, MenuItem } from '@material-ui/core'
import InputLabel from '@material-ui/core/InputLabel';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import Formsy from 'formsy-react'
import { TextFieldFormsy } from '../../components'
import { SelectFullwidthFormsy } from '../../components'
import { Alert, Link } from '../../components/common'
const styles = theme => ({
    FormRoot: {
        '& .MuiTextField-root': {
          margin: '8px 15px 8px 0',
          paddingBottom: theme.spacing(3),
          width: '100%'
        }
    },
    paymentForm: {
        '& .MuiTextField-root': {
            paddingBottom: theme.spacing(3)
        }
    },

    paper: {
        marginTop: theme.spacing(8),
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
    },
    avatar: {
        margin: theme.spacing(1),
        backgroundColor: theme.palette.secondary.main
    },
    form: {
        width: '100%', // Fix IE 11 issue.
        marginTop: theme.spacing(3)
    },
    submit: {
        margin: theme.spacing(1, 0, 1)
    },

    selectTag: {
        width: '100%'
    },
    paddingBottom: {
        paddingBottom: "10px"
    },
    formField: {
        display: 'inline-flex',
        width: '100%',
        '& .MuiTextField-root': {
            ['@media (max-width:960px)']: {
                // eslint-disable-line no-useless-computed-key
                margin: '8px 0 8px 0',
                width: '100%',
                paddingBottom: '18px',
            },
        }
    }
})

class SecurityQuestion extends Component {
    static getDerivedStateFromProps(props, state) {
        if (props.profileQuestion?.nodes.length) {
          state = {
            ...state,
            securityQuestion: {
              ...state.securityQuestion,
              ...props.profileQuestion.nodes[0],
            },
          };
            state.type = 'update';
        }else{
            state.type = 'add';
        }
        state.loading = props.loading;
        return state;
    }

    constructor(props) {
        super(props)
        this.state = {
            type:'add',
            loading: false,
            canSecurityQuestionSubmit: false,
            securityQuestion  : {
                securityQuestionId : null,
                answer:null,
                id:null
            }
        }
    }

    disableSecurityQuestionButton = () => {
        this.setState({ canSecurityQuestionSubmit: false })
    }

    enableSecurityQuestionButton = () => {
        this.setState({ canSecurityQuestionSubmit: true })
    }

    onSubmit = (model) =>{
        model.type = this.state.type
        model.id = this.state.securityQuestion.id
        this.props.onSaveSecurityQuestion(model)
    }
    render() {
        const { classes, errorMessage,securityQuestions } = this.props
        const { loading, canSecurityQuestionSubmit } = this.state
        const { securityQuestionId , answer} = this.state.securityQuestion
        return (
            <Grid container>
              <Grid item xs={12}>
                <Card className={classes.root}>
                  <CardContent>
                    <h2 className={classes.paddingBottom}>Security Question</h2>
                    {errorMessage && (
                        <Alert severity='error' message={errorMessage} />
                    )}
                    <Formsy
                        onValidSubmit={this.onSubmit}
                        onValid={this.enableSecurityQuestionButton}
                        onInvalid={this.disableSecurityQuestionButton}
                        ref={form => (this.form = form)}
                        className={classes.formControl}
                    >
                    {securityQuestions.length > 0 &&
                    <>
                        <Grid container spacing={2} direction="row">
                            <Grid item xs={12} className={classes.formField}>
                                <SelectFullwidthFormsy
                                    id='securityQuestionId'
                                    name="securityQuestionId"
                                    label="Security Question"
                                    required
                                    variant='outlined'
                                    value={securityQuestionId}
                                    className={classes.selectTag}
                                    InputLabelProps={{ shrink: true }}
                                >
                                {securityQuestions.map(question => (
                                <MenuItem key={question.id} value={question.id}>{question.question}</MenuItem>
                                ))}
                                </SelectFullwidthFormsy>
                            </Grid>
                            <Grid item xs={12} className={classes.formField}>
                                <TextFieldFormsy
                                    id='answer'
                                    label='Answer'
                                    required
                                    fullWidth
                                    type='text'
                                    value={answer}
                                    name='security_answer'
                                    variant='outlined'
                                />
                            </Grid>
                        </Grid>

                        <Grid item xs={12}>
                            <Box align='center'>
                                <Button
                                    type='submit'
                                    variant='contained'
                                    color='primary'
                                    size={'large'}
                                    disabled={!canSecurityQuestionSubmit || loading}
                                    className={classes.submit}
                                >
                                    Save Changes
                                </Button>
                            </Box>
                        </Grid>
                        </>
                        }
                    </Formsy>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        )
    }
}

export default withStyles(styles, { withTheme: true })(SecurityQuestion)
