import { Component } from 'react'
import { Button, withStyles, IconButton } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import Router from 'next/router';
import { getUserStatus } from "../../src/helpers"
import DeleteIcon from "@material-ui/icons/Delete";
const styles = () => ({

    deleteIcon: {
        
    },
})

class DeleteButton extends Component {
    constructor(props) {
        super(props)
    }
    render() {
        const { classes, onClick, row } = this.props
        if(getUserStatus(row) != 'active'){
            return ''
        }
        return (
            <IconButton
                color="inherit"
                edge="end"
                onClick={onClick}
                className={classes.deleteIcon}
              >
                <DeleteIcon />
              </IconButton>
        )
    }
}

export default withStyles(styles, { withTheme: true })((withAuth(DeleteButton))
);