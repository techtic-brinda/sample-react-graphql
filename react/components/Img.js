import React, { Component, Fragment } from 'react';

class Img extends Component {

    render() {
        const { src } = this.props;
        let image_date;
        try {
            image_date = JSON.parse(src);
        } catch (error) {
            image_date = null
        }
        return (
            <Fragment>
                <img {...this.props} alt="" src={(image_date && image_date.filepath ? process.env.baseUrl+"/"+image_date.filepath : this.props.src)}/>
            </Fragment>
        );
    }
}

export default Img;