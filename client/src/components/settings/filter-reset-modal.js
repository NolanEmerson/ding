import React, {Component} from 'react';

class FilterModal extends Component{
    constructor(props){
        super(props);

        
    }

    render(){

        return (
            <div className="filterModalBackdrop">
                <div className="filterModal">
                    <h4>Would you like to update your recipe choices?</h4>
                    <div className="filterModalButtons">
                        <button className='btn btn-large green' onClick={this.props.yes}>Yes</button>
                        <button className='btn btn-large red' onClick={this.props.no}>No</button>
                    </div>
                </div>
            </div>
        );
    }
}

export default FilterModal;