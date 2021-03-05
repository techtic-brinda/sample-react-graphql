import { Component } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import Router from 'next/router';
import { getUserStatus } from "../../src/helpers"

const StyledTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: theme.palette.common.black,
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledSubTableCell = withStyles((theme) => ({
    head: {
        backgroundColor: "#8F8F8E",
        color: theme.palette.common.white,
    },
    body: {
        fontSize: 14,
    },
}))(TableCell);

const StyledTableRow = withStyles((theme) => ({
    root: {
        '&:nth-of-type(odd)': {
            backgroundColor: theme.palette.background.default,
        },
    },
}))(TableRow);

class Table extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
            rowsPerPage: 25,
        };
    }
    handleChangeRowsPerPage = (e) => {
        this.setState({ rowsPerPage: e.target.value, page: 0 })
    }
    handleChangePage = (event, newPage) => {
        this.setState({ page: newPage })
    }
    render() {
        const { page, rowsPerPage } = this.state;
        const { classes, data = [], fields =[], columns=[] } = this.props;

        return (
            <TableContainer component={Paper}>
                <Table className={classes.table} aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            {columns.length > 0 && 
                                columns.map((key,value) =>(
                                    <StyledTableCell>{value}</StyledTableCell>
                                ))
                            }
                        </TableRow>
                            {/* <StyledTableCell>Children Name</StyledTableCell>
                            <StyledTableCell align="right">Age</StyledTableCell>
                            <StyledTableCell align="right">Donation Amount</StyledTableCell>
                            <StyledTableCell align="right">Date</StyledTableCell> */}
                    </TableHead>
                    <TableBody>
                        {
                            data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                                .map((row,index) => (

                                    <StyledTableRow key={row[fields[index]]}>
                                        <StyledTableCell component="th" scope="row">
                                        fields
                                        </StyledTableCell>
                                        <StyledTableCell align="right">{row.orphan_age}</StyledTableCell>
                                        <StyledTableCell align="right">${row.amount}</StyledTableCell>
                                        <StyledTableCell align="right">{getDateFormat(row.created_at)}</StyledTableCell>
                                    </StyledTableRow>
                                ))}
                    </TableBody>
                    {data.length == 0 &&
                        <StyledTableRow>
                            <StyledTableCell component="th" scope="row" colSpan="">
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            </StyledTableCell>
                            <StyledTableCell align="right">
                            </StyledTableCell>
                            <StyledTableCell align="right">
                                No result found
                            </StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                            <StyledTableCell align="center">
                            </StyledTableCell>
                        </StyledTableRow>
                    }
                </Table>
            </TableContainer>

        )
    }
}

export default withStyles(styles, { withTheme: true })((withAuth(Table))
);