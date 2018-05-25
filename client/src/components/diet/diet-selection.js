import React, { Component } from 'react';
import Header from '../general/header';
import Button from '../general/button';
import Next from '../general/next_button';
import registerstorage from '../info_storage/register-storage';
import '../../assets/css/diet-selection.css';
import {Link} from 'react-router-dom';
import LogoHeader from '../general/logo-header';
import ErrorModal from '../general/error-modal';

class DietSelection extends Component {   
    constructor(props) {
        super(props);

        this.handleSelected = this.handleSelected.bind(this);

        this.state = {
            selected: [],
            value: false
        };
    };

    handleSelected(buttonObject) {
        const { selected } = this.state;
        const { title } = buttonObject.props;

        if(!selected.includes(title)) {
            this.setState({
                selected: [title],
                value: true
            });
        };
        registerstorage.diet = title;
    };

    render() {
        const { handleSelected } = this;

        return (
            <div className='dietContainer'>
                <LogoHeader />
                <div className="container">
                    <Header title={'Dietary Preference'} style={{fontSize: `2rem`}}/>                    
                    <div className="center-align" style={{marginTop: `2vh`}}>
                        <Button title={'None'} descrip={'No restrictions'} style={'button'} selectedCheck={ handleSelected } determineSelected={ this.state.selected.includes('None')} />  
                        <Button title={'Vegetarian'} descrip={'Avoid meat'} style={'button'} selectedCheck={ handleSelected } determineSelected={ this.state.selected.includes('Vegetarian')} />   
                        <Button title={'Vegan'} descrip={'Avoid animal products'} style={'button'} selectedCheck={ handleSelected } determineSelected={ this.state.selected.includes('Vegan')} />   
                        <Button title={'Ketogenic'} descrip={'Low carb, high fat'} style={'button'} selectedCheck={ handleSelected } determineSelected={ this.state.selected.includes('Ketogenic')} />                   
                    </div>  
                    <div className="nextHolder" style={{marginTop: `7vh`}}>
                        <div />
                        {this.state.value && <Link to='/allergy-selection'><Next /></Link>}
                    </div>     
                </div>                
            </div>
        );  
    };
};

export default DietSelection;