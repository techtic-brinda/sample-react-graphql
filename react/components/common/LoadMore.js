import { Component } from "react";
import {
    withStyles,
    Grid,
    Button,
} from "@material-ui/core";


const styles = () => ({
    root: {
    },
    loadMore: {
        alignSelf: 'center',
    },
});

class LoadMoreComponent extends Component {
   
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
        };
    }


    render() {
        const { classes, pageInfo, edges, onLoadMore, direction='column', type='notification' } = this.props;
        const { loading } = this.state;
        const rows = edges.map((item) => item.node);
        return (
            <Grid
                container
                className={classes.root}
                spacing={2}
                direction ={direction}
            >
                {type === 'notification' ? (
                    <Grid item fullWidth>
                        {this.props.children({ rows, pageInfo, loading })}
                    </Grid>
                ):(
                    this.props.children({ rows, pageInfo, loading })
                )}
                {loading ? <CircularProgress /> : null}
                {pageInfo.hasNextPage && (
                    <Grid item className={classes.loadMore}>
                        <Button onClick={() => onLoadMore && onLoadMore(pageInfo.endCursor)} variant="contained" color="primary">Load more</Button>
                    </Grid>
                )}
            </Grid>
        );
    }
}
 
export const LoadMore = withStyles(styles, { withTheme: true })(LoadMoreComponent);
