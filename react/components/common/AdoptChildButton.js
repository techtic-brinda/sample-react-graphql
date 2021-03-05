import { Component } from 'react'
import { Button, withStyles } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import { bindActionCreators } from "redux";
import { adoptChild } from "../../src/store/actions";
import { connect } from "react-redux";
import { Link } from "../../components/common";
const styles = () => ({
  
})

class AdoptChildButton extends Component {
  constructor (props) {
    super(props)
    this.state = {
      adopt_child : null
    }
  }
  componentWillReceiveProps(nextProps) {
      if (nextProps.adopt_child !== this.props.adopt_child){
          this.setState({
            adopt_child: nextProps.adopt_child
          });
      }
  }
  onclickButton = (orphanId) =>{
    let data = {}
    data.orphanId = Number(orphanId)
    data.championId = Number(this.props.currentUser.id)
    this.props.adoptChild(data);
  }
  render () {
    let status = ''
    const { row, currentUser } = this.props
    if(row.championRequests && row.championRequests.nodes != undefined && row.championRequests.nodes.length > 0){
        const { nodes } = row.championRequests
        status = nodes[0]['status']; 
    }
    const importedProps = _.pick(this.props, [
      'variant',
      'size',
      'color',
      'className',
    ]);
    return (
      <>
        {currentUser.roleName =="Champion" && !status && row.id != this.state.adopt_child && 
          <Button fullWidth onClick={()=>this.onclickButton(row.id)} {...importedProps} >
            Adopt Child
          </Button>
        }
        {currentUser.roleName =="Angel" && 
          <Link href="/donation/[orphanId]" as={`/donation/${row.id}`}  >
            <Button fullWidth {...importedProps}>
              Donate
            </Button>
          </Link>
        }
      </>
    )
  }
}

const mapDispatchToProps = (dispatch) => {
  return bindActionCreators(
    {
      adoptChild: adoptChild,
    },
    dispatch
  );
};

function mapStateToProps({ auth, childrens }) {
  return {
    profileData: childrens,
    loaders: childrens.loaders,
    currentUser : auth.user,
    adopt_child : childrens.adopt_child,
  };
}

export default withStyles(styles, { withTheme: true })(
  connect(mapStateToProps, mapDispatchToProps)(withAuth(AdoptChildButton))
);

