import React, {Component} from 'react';

class MealNumButton extends Component {
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
    
    setNumberOfMeals() {
        this.props.mealnumclick(this.props.title);
    };

    render() {
        return (
            <a className={`waves-effect waves-light btn btn-large oxygenFont mealButton ${this.state.color} ${this.props.style}`} onClick={this.setNumberOfMeals.bind(this)}>
                {this.props.title}
            </a>
        );
    };
};

export default MealNumButton;