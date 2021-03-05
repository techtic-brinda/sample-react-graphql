import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import _ from 'lodash';
import { Icon, Button, withStyles } from '@material-ui/core';
import Img from './Img';
import CameraIcon from '@material-ui/icons/Camera';
const styles = () => ({
    root: {},
    input: {
        display: 'none !important'
    },
    fileName: {
        marginLeft: 10,
        textTransform: 'none',
    },
    filePreview: {
    },
    previewItem: {
        textAlign: 'center'
    },
    imageContainer: {
        marginBottom: 10,
    },
    previewImg: {
        height: 120,
        width: 120,
        objectFit: 'cover'
    }
});


class ImageInput extends Component {
    static propTypes = {
        classes: PropTypes.object.isRequired
    };

    state = {
        fileName: "",
        images: [],
        value: []
    };

    handleCapture = (event) => {
        const { target } = event;
        const fileReader = new FileReader();
        const name = 'value';

        fileReader.readAsDataURL(target.files[0]);
        fileReader.onload = (e) => {
            this.setState((prevState) => ({
                [name]: this.props.multiple ? [...prevState[name], e.target.result] : [e.target.result]
            }));
        };

        if (this.props.onChange) {
            this.props.onChange(this.props.multiple ? target.files : target.files[0])
        }
    };

    removeSelectedFile(image) {
        const index = this.state.value.indexOf(image);
        this.state.value.splice(index, 1);

        this.setState({
            value: this.state.value || []
        })

        this.props.onChange(this.props.multiple ? this.state.value : this.state.value[0] || "");

    }

    componentWillReceiveProps(nextProps) {

        if (nextProps.value && nextProps.value !== ""){
            this.setState({
                value: this.props.multiple ? nextProps.value : [nextProps.value]
            });
        }
    }

    render() {
        const { classes, multiple } = this.props;
        const { value = [], images = []} = this.state;
       

        const importedProps = _.pick(this.props, [
            'accept',
            'multiple',
            'name',
            //'onChange',
            //'value'
        ]);

        return (
            <Fragment>
                {
                    ((images.length === 0 && value.length === 0) || multiple) ?
                        <Fragment>
                            <input
                                accept="image/*"
                                className={classes.input}
                                id="icon-button-photo"
                                onChange={this.handleCapture}
                                type="file"
                                name="image"
                                {...importedProps}
                            />
                            <div>
                            
                                <label htmlFor="icon-button-photo">
                                    <Button color="default" variant="raised" component="span">
                                    <CameraIcon /> <span className={classes.fileName}>{this.state.fileName ? this.state.fileName : multiple ? 'Add File' : 'Select File'}</span>
                                    </Button>
                                </label>
                            </div>
                        </Fragment>
                        :
                        null
                }
                <div className={classes.filePreview}>
                    {[...value, ...images].map((image, index) => {
                        return (
                            <div key={index} className={classes.previewItem}>
                                <div className={classes.imageContainer}><Img className={classes.previewImg} src={image} /></div>
                                <Button variant="raised" color="primary" component="span" onClick={(e) => this.removeSelectedFile(image)}>Remove</Button>
                            </div>
                        )
                    })}
                </div>
            </Fragment>
        );
    }
}

export default withStyles(styles, { withTheme: true })(ImageInput);