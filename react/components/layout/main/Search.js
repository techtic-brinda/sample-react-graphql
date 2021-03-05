import { Component } from 'react'
import { TextField,withStyles, InputAdornment  } from '@material-ui/core';
import SearchIcon from '@material-ui/icons/Search';
import { withApollo } from '../../../src/apollo';
import { connect } from 'react-redux'
import Autocomplete from '@material-ui/lab/Autocomplete';
import { withAuth } from "../../../src/auth";
import { withRouter } from 'next/router'
import { bindActionCreators } from "redux";
import { searchChild } from "../../../src/store/actions";
import { debounce } from "lodash";
import CircularProgress from '@material-ui/core/CircularProgress';
import Router from 'next/router';

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
        maxWidth: "1000px",

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
        margin: 0,
        "& .MuiInputBase-root": {
            borderRadius: theme.spacing(1.5),
            padding: theme.spacing(1, 2),
            fontSize: '1rem',
        }
    },
  })


class Search extends Component {
    constructor (props) {
        super(props)
        this.state = {
        }
    }
    onTagsChange = debounce((value) => {
        if(value!=null){
            const { currentUser } = this.props
            this.props.searchChild({name: value, roleName: currentUser.roleName})
        }
    }, 1000);

    onClickSearchValue =(option)=>{
        Router.push('/childrens/'+option.id)
    }
    getLableName = (option) =>{
      return `${option.first_name} ${option.last_name}`;
    }
    render () {
    const { classes, loaders, searchOption} = this.props
    const { pathname } = this.props.router;
    const pathnames = pathname.split("/").filter(x => x);

    return (
        <div className={classes.search}>
          {(pathnames != "profile") ? 
             <Autocomplete
                options={searchOption}
                freeSolo
                onChange={(event, option)=>this.onClickSearchValue(option)}
                getOptionLabel={this.getLableName}
                renderInput={params => (
                    <TextField
                        {...params}
                        classes={{
                            root: classes.inputRoot,
                        }}
                        variant="outlined"
                        placeholder="Search"
                        margin="normal"
                        size="small"
                        onChange={(e)=>this.onTagsChange(e.target.value)}
                        fullWidth
                        InputProps={{
                            ...params.InputProps,
                            startAdornment: (
                                <InputAdornment position="start">
                                  <SearchIcon />
                                </InputAdornment>
                            ),
                            endAdornment: (
                              <React.Fragment>
                                {loaders.search ? <CircularProgress color="primary" size={20} /> : null}
                                {params.InputProps.endAdornment}
                              </React.Fragment>
                            ),
                          }}
                    />
                )}
                />
                : (null)}
        </div>
    );
    }

}

const mapDispatchToProps = (dispatch) => {
    return bindActionCreators(
      {
        searchChild: searchChild
      },
      dispatch
    );
  };

  function mapStateToProps({ childrens, auth }) {
    return {
        loaders: childrens.loaders,
        currentUser: auth.user,
        searchOption: childrens.searchOption,
    };
  }

  export default withStyles(styles, { withTheme: true })(
    connect(
      mapStateToProps,
      mapDispatchToProps
    )(withApollo(withAuth(withRouter(Search))))
  );
