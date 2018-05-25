import React, {Component} from 'react';

class MealConfirm extends Component {

    render() {
        return (
            <div className={`mealConfirmContainer row ${this.props.style}`}>
                <div className='col s9 confirmTextArea'>
                    <div className='confirmHead'>Confirm Meal Choices</div>
                    <div>Press to finalize your selections!</div>
                </div>
                <div className='col s3 valign-wrapper'>
                    <div className='btn green confirmButton left-align valign-wrapper' onClick={this.props.closeconfirm}>
                        <i className='material-icons confirmCheck' style={{fontSize: '3rem'}}>check</i>
                    </div>
                </div>                
            </div>
        );
    };
};

export default MealConfirm;