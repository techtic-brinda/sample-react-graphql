import { Component } from "react";
import Typography from "@material-ui/core/Typography";
import {
  CardContent,
  Card,
  Button,
  Box,
  withStyles,
} from "@material-ui/core";
import Formsy from "formsy-react";
import { TextFieldFormsy } from "../../components";
import { PhoneFieldFormsy } from "../../components";
import styles from "./style";

class ContactDetailForm extends Component {
  state = {
    loading: false,
    canSubmit: false,
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.successMessage && nextProps.successMessage !== "") {
      this.refs.form.reset();
    }
  }

  disableButton = () => {
    this.setState({ canSubmit: false });
  };

  enableButton = () => {
    this.setState({ canSubmit: true });
  };

  onSubmit = (model) => {
    this.props.onClickSendMessage(model)
  }
  render() {
    const { classes } = this.props;
    const { loading, canSubmit } = this.state;
    return (
      <Card className={[classes.root, classes.innerPadding]}>
        <CardContent>
          <Typography gutterBottom variant="h6" component="h1">
            {" "}
            Quick Contact Us{" "}
          </Typography>
          <Formsy
            onValidSubmit={this.onSubmit}
            onValid={this.enableButton}
            onInvalid={this.disableButton}
            ref={"form"}
            className={classes.FormRoot}
          >
            {" "}
            <div>
              <TextFieldFormsy
                id="outlined-number"
                label="Full Name"
                name="name"
                type="text"
                InputLabelProps={{
                  shrink: true,
                }}
                variant="outlined"
                required
              />
              <TextFieldFormsy
                id="outlined-search"
                label="Email"
                type="email"
                name="email"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue="Default Value"
                variant="outlined"
                validations={{
                  isEmail: true,
                }}
                required
                validationErrors={{
                  isEmail: "This is not a valid email",
                }}
              />
              <PhoneFieldFormsy
                id="outlined-helperText"
                label="Mobile"
                type="text"
                name="phone"
                InputLabelProps={{
                  shrink: true,
                }}
                defaultValue="Default Value"
                variant="outlined"
                validations={{                      
                    minLength: 12,
                }}
                validationErrors={{
                    minLength: "Invalid Mobile",
                }}
              />

              <TextFieldFormsy
                id="outlined-Address"
                label="Message"
                name="messageBody"
                type="text"
                multiline
                rows={10}
                InputLabelProps={{
                  shrink: true,
                }}
                required
                variant="outlined"
              />

              <Box align="center">
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  size={"large"}
                  disabled={!canSubmit || loading}
                  className={[classes.submit, classes.alignRight]}
                >
                  Send Message
                </Button>
              </Box>
            </div>
          </Formsy>
        </CardContent>
      </Card>
    );
  }
}
export default withStyles(styles, { withTheme: true })(ContactDetailForm);
