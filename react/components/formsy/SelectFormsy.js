import {withFormsy} from 'formsy-react';
import  {Component} from 'react';
import {FormControl, FormHelperText, Input, InputLabel, Select} from '@material-ui/core';
import _ from 'lodash';

class SelectFormsy extends Component {

    changeValue = (event) => {
        this.props.setValue(event.target.value);
    };

    render()
    {
        const importedProps = _.pick(this.props, [
            'autoWidth',
            'children',
            'classes',
            'displayEmpty',
            'id',
            'InputLabelProps',
            'inputProps',
            'label',
            'MenuProps',
            'multiple',
            'fullWidth',
            'name',
            'onBlur',
            'onFocus',
            'native',
            'onChange',
            'onClose',
            'onOpen',
            'open',
            'renderValue',
            'select',
            'SelectProps',
            'SelectDisplayProps',
            'value',
            'variant',
            'margin',
            'required',
            'rows',
            'rowsMax',
            'selectAs',
        ]);

        // An error message is returned only if the component is invalid
        const errorMessage = this.props.errorMessage;
        const value = this.props.value;
        
    
        return (
            <FormControl  variant="outlined" error={Boolean(errorMessage)} className={this.props.className} >
                {this.props.label && (
                    <InputLabel htmlFor={this.props.name}>{this.props.label}</InputLabel>
                )}
                <Select
                    {...importedProps}
                    value={value}
                    onChange={this.changeValue}
                    
                />
                {this.props.selectAs && value=='3' &&
                    <FormHelperText>Your Donation Will Change Generations of Lives</FormHelperText>
                }
                {this.props.selectAs && value=='2' &&
                    <FormHelperText>Your efforts to collect Donation Will Change Generations of Lives</FormHelperText>
                }
                {Boolean(errorMessage) && (
                    <FormHelperText>{errorMessage}</FormHelperText>
                )}
            </FormControl>
        );
    }
}

export default withFormsy(SelectFormsy);