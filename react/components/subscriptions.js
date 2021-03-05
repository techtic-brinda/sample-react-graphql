import { Component } from 'react'
import { connect } from 'react-redux'
import { bindActionCreators } from 'redux'
import { withRouter } from 'next/router'
import { loadNewNotifications } from '../src/store/actions'

class Subscriptions extends Component {
    interval
    componentDidMount() {
        if(this.props.currentUser){
            this.interval = setInterval(() => {
                this.props.loadNewNotifications();
            }, 60000);
        }
    }

    componentWillUnmount(){
        clearInterval(this.interval);
    }

    render() {
        return null;
    }
}

function mapStateToProps({ notification,auth }) {
    return {
        currentUser: auth.user,
    }
}

const mapDispatchToProps = dispatch => {
    return bindActionCreators(
        {
            loadNewNotifications: loadNewNotifications,
        },
        dispatch
    )
}

export default connect(mapStateToProps, mapDispatchToProps)(withRouter(Subscriptions))
