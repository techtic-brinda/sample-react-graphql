import { Component } from 'react'
import { withStyles } from '@material-ui/core'
import { withAuth } from '../../src/auth';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

const styles = () => ({
  root : {}
})

class DatePickerComponent extends Component {

  constructor (props) {
    super(props)
    this.state = {
      adopt_child : null
    }
  }
  render () {
    const childrens = _.pick(this.props, [
      'variant',
      'label',
      'color',
      'className',
      'format',
      'views',
      'height',
    ]);
    const { handleDateChange, value = null } = this.props
    return (
          <>
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <DatePicker
                style={{ width: "100%" }}
                {...childrens}
                value={value}
                variant="inline"
                inputVariant="outlined"
                onChange={handleDateChange}
                autoOk={true}
            />
          </MuiPickersUtilsProvider>
          </>

    )
  }
}

export default withStyles(styles, { withTheme: true })((withAuth(DatePickerComponent)));

