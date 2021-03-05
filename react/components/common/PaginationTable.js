import { Component } from 'react'
import TablePagination from '@material-ui/core/TablePagination';

class PaginationTable extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 0,
            rowsPerPage: 25,
        };
    }
    handleChangeRowsPerPage = (e) => {
        this.setState({ rowsPerPage: e.target.value, page: 0 })
    }
    handleChangePage = (event, newPage,prevPage) => {
        this.setState({ page: newPage })
        this.props.handlePage(newPage)
    }
    render() {
        const { page, rowsPerPage } = this.state;
        const { total = 0 } = this.props;
        if(rowsPerPage > total){
            return ''
        }
        return (
            <>
            <TablePagination    
                component="div"
                count={total}
                rowsPerPage={rowsPerPage}
                page={page}
                onChangePage={this.handleChangePage}
                onChangeRowsPerPage={this.handleChangeRowsPerPage}
            />
            </>
        )
    }
}

export default PaginationTable