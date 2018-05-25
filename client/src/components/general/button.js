import React, { Component } from 'react';

class Button extends Component {
    constructor(props) {
        super(props);

        this.state = {
            color: 'grey darken-1'
        };
    };

    componentWillReceiveProps(nextProps, prevState) {
        if (nextProps.determineSelected) {
            this.setState({
                color: 'teal',
            });
        } else {
            this.setState({
                color: 'grey darken-1',
            });
        };   
    };

    render() {

        const buttonStyle = {
            backgroundColor: this.state.color,
            textShadow: '1px 2px 2px black'
        }

        return (
            <div className='buttonContainer'>
                <a onClick={this.props.selectedCheck.bind(null, this)} style={{height: 'auto', buttonStyle}} className={`btn-desk btn-large waves-effect waves-light btn ${this.state.color} ${this.props.style}`}>
                <div>
                    <div className="title-container oxygenFont">
                       {this.props.title} 
                    </div>
                     <div>
                       {this.props.descrip}   
                    </div>                                       
                </div>
                </a>
            </div>
        );
    };
};

export default Button;
