import { Button, withStyles, Dialog, DialogTitle, DialogActions,DialogContent,DialogContentText   } from '@material-ui/core'
import React, { createRef, Component } from 'react'

class DialogComponent extends Component {
    constructor(props) {
        super(props),
        this.DialogRef = createRef();
    }
    handleToggele = () => () => {
        this.setState(prevState => ({ open: !prevState.open}));
    };
    render() {
      const { dialogContent : {content = '', title = ''} , dialogOpen, dialogClose} = this.props;
        return (
          <div>
            {dialogOpen == true ? (
              <Dialog
                open={true}
                aria-labelledby="draggable-dialog-title"
                close={dialogClose}
              >
                  <DialogTitle id="draggable-dialog-title">
                    {title}
                  </DialogTitle>
                  <DialogContent dividers={true}>
                    <DialogContentText 
                      ref={this.DialogRef}
                      tabIndex={-1}
                    >
                    <div dangerouslySetInnerHTML={{__html: content}} />
                  </DialogContentText>
                  </DialogContent>
                  <DialogActions>
                    <Button size="small" onClick={dialogClose} color="primary" style={{ padding: '10px 20px' }}>
                      Close
                    </Button>
                  </DialogActions>
              </Dialog>) : null
            }
          </div>
        );
    }
}
export default DialogComponent;