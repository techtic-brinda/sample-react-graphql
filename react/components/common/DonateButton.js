import { Component } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import Router from 'next/router';
import { getUserStatus } from "../../src/helpers"
import StripeCheckout from 'react-stripe-checkout';
import { loadStripe } from "@stripe/stripe-js";

const stripePromise = loadStripe(process.env.stripeKey);


const styles = () => ({

    adoptChild: {
        textTransform: "none !important",
        fontSize: "12px",
        padding: "9px 17px 9px 17px !important",
    },
})

class DonateButton extends Component {
    constructor(props) {
        super(props)
    }

    onToken = async(token) => {
        this.props.createPayment(token.id,amount)
    }
    getAmount = (amount)=> {
        return  (Number(amount) * 100)
    }
    render() {
        const { classes, disabled} = this.props
        return (
            <Button disabled={disabled} onClick={this.handleClick} variant="contained" size="medium" color="primary" align="left" className={[classes.margin, classes.adoptChild, classes.alignLeft]}>
                Donate Now
            </Button>
        )
    }
}

export default withStyles(styles, { withTheme: true })((withAuth(DonateButton))
);