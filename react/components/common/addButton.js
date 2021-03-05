import { Component } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import Router from 'next/router';
import { getUserStatus } from "../../src/helpers"
const styles = () => ({

    adoptChild: {
        textTransform: "none !important",
        fontSize: "12px",
        padding: "9px 17px 9px 17px !important",
        // float: "right",
    },
})

class AddButton extends Component {
    constructor(props) {
        super(props)
    }

    onclickButton = (orphanId) => {
        let data = {}
        data.orphanId = Number(orphanId)
        data.championId = this.props.currentUser.id
        this.props.adoptChild(data);
    }

    onClickDonatechild = (orphanId) => {
        Router.push(`/donation/${orphanId}`)
    }
    render() {
        const { classes, onClick, row } = this.props
        if(getUserStatus(row) != 'active'){
            return ''
        }
        return (
            <Button onClick={onClick} variant="contained" size="medium" color="primary" className={classes.margin, classes.adoptChild}>
                Add
            </Button>
        )
    }
}

export default withStyles(styles, { withTheme: true })((withAuth(AddButton))
);