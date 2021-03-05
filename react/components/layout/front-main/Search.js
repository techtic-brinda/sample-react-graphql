import { Component } from 'react'
import { TextField, withStyles, Typography, Grid, List, Link, Button } from '@material-ui/core';
import { withApollo } from '../../../src/apollo';
import { connect } from 'react-redux'
import Autocomplete, { createFilterOptions } from '@material-ui/lab/Autocomplete';
import { withAuth } from "../../../src/auth";
import { withRouter } from 'next/router'
import { bindActionCreators } from "redux";
import { searchBlog, getAllHeader } from "../../../src/store/actions";
import { debounce } from "lodash";
import Router from "next/router";

const filter = createFilterOptions();

const styles = theme => ({
    root: {
        flexGrow: 1,
    },
    menuButton: {
        marginRight: theme.spacing(2),
    },
    title: {
        flexGrow: 1,
        display: 'none',
        [theme.breakpoints.up('sm')]: {
            display: 'block',
        },
    },
    search: {
        position: 'relative',
        borderRadius: theme.spacing(1.5),
        // maxWidth: "1000px",

        color: '#333333',
        marginLeft: 0,
        width: '100%',
    },
    searchIcon: {
        padding: theme.spacing(0, 2),
        height: '100%',
        position: 'absolute',
        pointerEvents: 'none',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        right: 0,
        top: 0,
        fontSize: 22,
    },
    inputRoot: {
        color: 'inherit',
        width: '100%',
    },
    inputInput: {
        padding: theme.spacing(2.5, 4, 2.5, 4),
        paddingRight: `calc(1em + ${theme.spacing(2)}px)`,
        transition: theme.transitions.create('width'),
        width: '100%',

    },
    projectTitle: {
        fontSize: "15px",
        fontWeight: "700",
        float: "left",
        padding: "0px 0px 0px 20px !important",
        color: "#E1402A"
    },
    fullwidth: {
        width: "inherit",
    },
    headerList: {
        display: "flex",
    },
    viewProfile: {
        textTransform: "none !important",
        fontSize: "12px",
        padding: "9px 17px 9px 17px !important",
        color: "#e1402a",
        float: "left",
        border: "0px solid",
        width: "max-content",
    },
    autoHeight: {
        marginTop: "auto",
        marginBottom: "auto",
    }
})


class Search extends Component {
    constructor(props) {
        super(props)
        this.state = {
        }
    }
    onTagsChange = debounce((value) => {
        if (value != null) {
            this.props.searchBlog(value)
        }
    }, 500);
    onClickSearchValue = (option) => {
        if(typeof option === 'object' && option.id != ''){
            Router.push('/blogs/' + option.id)
        }
    }
    componentDidMount() {
        this.props.getAllHeader();
    }
    manageFilterBlog = (options, params) =>{
        
            const filtered = filter(options, params);
  
            if (params.inputValue !== '') {
              filtered.push({
                inputValue: params.inputValue,
                title: `Blog not found`,
              });
            }
            return filtered;
        
    }
    render() {
        const { classes, searchData } = this.props
        const headerPages = this.props.headerPages.pages
        return (
            <div className={classes.search}>

                <Grid container direction="row" justify="center" alignItems="center">
                    <Grid container xs={2} direction="row" alignItems="center" justify="left" >

                        <Typography className={[classes.projectTitle]}>
                            ORPHAN ANGELS
                        </Typography>

                    </Grid>
                    <Grid container xs={6} direction="row" alignItems="center" justify="left" >

                        <Autocomplete
                            style={{ width: 600 }}
                            options={searchData}
                            filterOptions={(options, params) => {
                                console.log(params, 'params');
                                const filtered = filter(options, params);
                                if (options.length <= 0 && params.inputValue != '') {
                                  filtered.push({
                                    inputValue: params.inputValue,
                                    title: `No blog found`,
                                  });
                                }
                                return filtered;
                            }}
                            freeSolo
                            onChange={(event, option) => this.onClickSearchValue(option)}
                            getOptionLabel={option => option.title}
                            renderInput={params => (
                                <TextField
                                    {...params}
                                    classes={{
                                        root: classes.inputRoot,
                                        input: classes.inputInput,
                                    }}
                                    variant="outlined"
                                    placeholder="Search"
                                    margin="normal"
                                    size="small"
                                    onChange={(e) => this.onTagsChange(e.target.value)}
                                    InputProps={{
                                        ...params.InputProps,
                                        endAdornment: (
                                            <React.Fragment>
                                                {/* {loaders.search ? <CircularProgress color="primary" size={20} /> : null} */}
                                                {params.InputProps.endAdornment}
                                            </React.Fragment>
                                        ),
                                    }}
                                />
                            )}
                        />
                    </Grid>

                    <Grid container xs={4} direction="row" alignItems="right" justify="flex-end" >
                        {/* <List className={[classes.headerList]}>

                            {headerPages && headerPages.map((header) => (

                                <Link href={`/${header.slug}`} variant="body2" className={[classes.removeHover, classes.autoHeight]}>
                                    <Button variant="outlined" className={classes.view_profile, classes.viewProfile}
                                        spacing={3}>{header.title}</Button>
                                </Link>

                            ))}

                        </List> */}

                    </Grid>

                </Grid>
            </div>
        );
    }

}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
        {
            searchBlog: searchBlog,
            getAllHeader: getAllHeader,
        },
        dispatch
    );
};

function mapStateToProps({ childrens, header, blogs }) {
    return {
        loaders: childrens.loaders,
        searchData: blogs.searchData,
        headerPages: header,
    };
}

export default withStyles(styles, { withTheme: true })(
    connect(
        mapStateToProps,
        mapDispatchToProps
    )(withApollo(withAuth(withRouter(Search))))
);
