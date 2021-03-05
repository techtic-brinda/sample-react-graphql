import { Component } from 'react'
import { Button, withStyles, Breadcrumbs, Typography } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import { Router, withRouter } from 'next/router';
import { getUserStatus } from "../../src/helpers";
import { Link } from "../../components/common";
const styles = () => ({
    adoptChild: {
        textTransform: "none !important",
        fontSize: "12px",
        padding: "9px 17px 9px 17px !important",
    },
})

class BreadCrumbsComponent extends Component {
    constructor(props) {
        super(props)
    }
    getPathTitle = (value) =>{
        switch(value) {
        case '[detail]':
            return 'detail';
        default:
            return value;
        }
    }
    render() {
        
        const { pathname } = this.props.router;
        const pathnames = pathname.split("/").filter(x => x);
        return (
            <Breadcrumbs separator="›" aria-label="breadcrumb">
                <Link color="inherit" href="/dashboard">
                    Dashboard
                </Link>
                {pathnames.map((value, index) => {
                    const last = index === pathnames.length - 1;
                    const to = `/${pathnames.slice(0, index + 1).join("/")}`;
                    return last ? (
                        <Typography style={{textTransform: 'capitalize'}} color="textPrimary" key={to}>
                            {this.getPathTitle(value)}
                        </Typography>
                    ) : (
                        <Link style={{textTransform: 'capitalize'}} color="inherit" href={to} key={to}>
                            {this.getPathTitle(value)}
                        </Link>
                    );
                })}
            </Breadcrumbs>
        )
    }
}

export default withStyles(styles, { withTheme: true })((withAuth(withRouter(BreadCrumbsComponent)))
);