import React, { Component } from 'react';
import axios from 'axios';
import Header from '../general/header';
import Button from '../general/button';
import Next from '../general/next_button';
import newFilter from '../info_storage/new-filter-storage';
import '../../assets/css/allergy-selection.css';
import {Link} from 'react-router-dom';
import LogoHeader from '../general/logo-header';
import Loader from '../general/loader';
import ErrorModal from '../general/error-modal';
import auth from '../general/auth';
import FilterModal from './filter-reset-modal';

class AllergySettings extends Component {
    constructor(props) {
        super(props); 

        this.handleSelected = this.handleSelected.bind(this);
        this.modalClose = this.modalClose.bind(this);
        
        this.state = {
            selected: [],
            showLoader: false,
            modalStatus: false,
            message: '',
            resetModal: false
        };
    };

    handleSelected(buttonObject) {
        const { selected } = this.state;
        const { title } = buttonObject.props;

        if(!selected.includes(title)) {
            this.setState({
                selected: [...selected, title]
            },() => {
                newFilter.allergy = this.state.selected;
            });
        } else {
            let currentSelected = selected;
            let itemLocation = currentSelected.indexOf(title);
            currentSelected.splice(itemLocation, 1);
            this.setState({
                selected: currentSelected
            },() => {
                newFilter.allergy = this.state.selected;
            });
        };
    };

    sendFiltersToServer() {
        newFilter.diet = newFilter.diet.toLowerCase();
        for (let i=0; i<newFilter.allergy.length; i++){
            newFilter.allergy[i] = newFilter.allergy[i].toLowerCase();
        };

        this.setState({
            showLoader: true
        });

        axios({

            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/update_diet.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/update_diet.php',
            url: '../../endpoints/update_diet.php',
            method: 'post',
            data: {
                    diet: newFilter.diet,
                    allergies: newFilter.allergy,
                    session_ID: localStorage.ding_sessionID
                },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            this.setState({
                showLoader: false
            });
            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };

            if (!this.state.modalStatus) {
                this.setState({
                    resetModal: true
                });
            };            
        }).catch( err => {
            console.log('Update diet error: ', err);
            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
    };

    modalClose() {
        this.setState({
            modalStatus: false
        });
    };

    goToMeals(){
        this.props.history.push('/meal-num-settings');
    }

    goToSettings(){
        this.props.history.push('/settings');
    }

    render() {   
        const { handleSelected } = this;
        const { selected } = this.state;

        return (  
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className='allergySettingsContainer'>  
                    {this.state.resetModal && <FilterModal yes={this.goToMeals.bind(this)} no={this.goToSettings.bind(this)} />} 
                    <LogoHeader back={true} location={'/diet-settings'}/>
                    <div className="container">
                        <Header title={'Any Allergies?'} />
                        <div className="row">
                            <Button title={'Gluten'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Gluten')} />  
                            <Button title={'Dairy'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Dairy')} />     
                            <Button title={'Tree Nut'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Tree Nut')} />   
                            <Button title={'Peanuts'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Peanuts')} />   
                            <Button title={'Shellfish'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Shellfish')} />
                            <Button title={'Soy'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Soy')} />
                            <Button title={'Egg'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Egg')} />
                            <Button title={'Wheat'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Wheat')} />
                            <Button title={'Sesame'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Sesame')} />
                            <Button title={'Seafood'} selectedCheck={ handleSelected } determineSelected={ selected.includes('Seafood')} />
                        </div>  
                        <div className="nextHolder" style={{marginTop: `3vh`}}>
                            <div />
                            <a>
                                <Next onclick={this.sendFiltersToServer.bind(this)}/>
                            </a>
                        </div>
                    </div>             
                </div>
            </React.Fragment>
        );
    };
};

export default auth(AllergySettings);