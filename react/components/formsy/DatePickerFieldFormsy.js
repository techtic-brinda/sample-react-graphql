import {withFormsy} from 'formsy-react';
import {Component} from 'react';
import _ from 'lodash';
import { DatePicker, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from '@date-io/date-fns'; // choose your lib

class DatePickerFieldFormsy extends Component {

    changeValue = (event) => {
        this.props.setValue(event);
    };

    render()
    {
        const importedProps = _.pick(this.props, [
            'color',
            'format',
            'views',
            'height',
            'children',
            'className',
            'defaultValue',
            'disabled',
            'FormHelperTextProps',
            'fullWidth',
            'id',
            'InputLabelProps',
            'inputProps',
            'InputProps',
            'inputRef',
            'label',
            'multiline',
            'name',
            'onBlur',
            'onChange',
            'onFocus',
            'placeholder',
            'required',
            'rows',
            'rowsMax',
            'variant',
            'margin',
            'endAdornment',
            'minDate',
            'disablePast',
            'disableFuture',
            'emptyLabel',
        ]);

        const errorMessage = this.props.errorMessage;
        const value = this.props.value || null;

        return (
            <MuiPickersUtilsProvider utils={DateFnsUtils}>
                <DatePicker
                        {...importedProps}
                        onChange={this.changeValue}
                        value={value}
                        error={Boolean(errorMessage)}
                        helperText={errorMessage}
                        variant="inline"
                        inputVariant="outlined"
                        autoOk={true}
                />
          </MuiPickersUtilsProvider>
        );
    }
}

export default withFormsy(DatePickerFieldFormsy);