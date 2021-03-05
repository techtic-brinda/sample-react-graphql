import { Component } from 'react'
import Pagination from '@material-ui/lab/Pagination';

class CustomPagination extends Component {
    constructor(props) {
        super(props)
        this.state = {
            page: 1,
        };
    }
    handleChangePage = (event, value) => {
        const rowpage = this.props.rowsPerPage ? this.props.rowsPerPage : 9
        this.setState({ page: value })
        this.props.handlePage(((rowpage * value) - rowpage))
    }
    render() {
        const { page,  } = this.state;
        const { total = 0, rowsPerPage = 9 } = this.props;
        const count = Math.ceil(total / rowsPerPage)
        if(rowsPerPage > total){
            return ''
        }
        return (
            <>
                <Pagination count={count} page={page} onChange={this.handleChangePage} color="primary" />
            </>
        )
    }
}

export default CustomPagination