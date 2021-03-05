import { Alert as MUAlert } from '@material-ui/lab';
import { makeStyles } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        marginTop: theme.spacing(2),
        marginBottom: theme.spacing(3),
    },
}));

export default function Alert(props) {

    if (!props || !props.message){
        return <div></div>;
    }
    const classes = useStyles();
    let severity = props.severity || 'success';
    let message = "";
    if (props.message && props.message.graphQLErrors){
        const messages = props.message.graphQLErrors.map(x => x.message).join('\n') ;
        if (messages.length == 0){
            return <div></div>;
        }
        severity = 'error';
        message = messages;
    }else{
        message = props.message;
    }

    return (
        <div className={classes.root}>
            <MUAlert severity={severity} action={props.action}> {message} </MUAlert>
        </div>
    );
}