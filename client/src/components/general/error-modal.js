import React, { Component } from 'react';

class ErrorModal extends Component {
    constructor(props) {
        super(props);
    }
    render() {

        return (
            <div className="errorModal" onClick={this.props.onClick} >
                <div className='errorFixed'>
                    <div className="center-align valign-wrapper errorModalContent" >
                        <div><i className="material-icons" style={{fontSize: `3.5rem`}}>error_outline</i></div>
                        <div className="errorText">{this.props.message}</div>                    
                    </div>
                    <div className="center-align errorCloseContent">Click anywhere to close</div>
                </div>
            </div>
        );
    };
};

export default ErrorModal;