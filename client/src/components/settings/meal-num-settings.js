import React, { Component } from 'react';
import axios from 'axios';
import Header from '../general/header';
import MealNumButton from '../meal_num/meal-num-btn';
import Next from '../general/next_button';
import '../../assets/css/settings.css';
import {Link, Redirect} from 'react-router-dom';
import mealdb from '../info_storage/meal-db';
import mealschosen from '../info_storage/meals-chosen';
import LogoHeader from '../general/logo-header';
import Loader from '../general/loader';
import ErrorModal from '../general/error-modal';
import auth from '../general/auth';

class MealNumberSettings extends Component {
    constructor(props) {
        super(props);

        this.modalClose = this.modalClose.bind(this);

        this.state = {
            confirmingMeals: false,
            numOfMeals: [],
            showLoader: false,
            modalStatus: false,
            message: ''
        };
    };

    setNumberOfMeals(num) {
        while (mealschosen.length){
            mealschosen.pop();
        }
        for (var i= 0; i< num; i++){
            let randomIndex = Math.floor(Math.random() * mealdb.length);
            mealschosen.push(mealdb[randomIndex]);
            mealdb.splice(randomIndex,1);
        }
        this.setState({
            confirmingMeals: true
        });
    };

    storeNumChoice(num){
        this.setState({
            numOfMeals: num
        });
    }
    
    getRecipes() {

        this.setState({
            showLoader: true
        });

        axios({
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/meals/newRecipes.php',
            url: '../../endpoints/meals/newRecipes.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/meals/newRecipes.php',
            method: 'post',
            data: {
                session_ID: localStorage.ding_sessionID
            }
        }).then( resp => {
            this.setState({
                showLoader: false
            });

            for (var i=0; i<resp.data.length; i++){
                mealdb.push(resp.data[i]);
            }

            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };

            if (!this.state.modalStatus) {
                this.setNumberOfMeals(this.state.numOfMeals);                
            };

        }).catch( err => {
            console.log('New Recipes error: ', err);
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

    render() {

        return (
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className='mealNumContainer'>
                    <LogoHeader />
                    <div className="container">
                        <Header title={'How many meals do you want to cook?'} style={{fontSize: '2.1rem'}}/>
                        <div className="button-column" style={{border: 'none', marginTop: '7vh'}}>
                            <MealNumButton title={'1'} style={'button'} determineSelected={ this.state.numOfMeals.includes('1')} mealnumclick={this.storeNumChoice.bind(this)}/>  
                            <MealNumButton title={'3'} style={'button'} determineSelected={ this.state.numOfMeals.includes('3')} mealnumclick={this.storeNumChoice.bind(this)}/>
                            <MealNumButton title={'5'} style={'button'} determineSelected={ this.state.numOfMeals.includes('5')} mealnumclick={this.storeNumChoice.bind(this)}/>   
                            <MealNumButton title={'7'} style={'button'} determineSelected={ this.state.numOfMeals.includes('7')} mealnumclick={this.storeNumChoice.bind(this)}/>   
                        </div>  
                        <div className="nextHolder" style={{marginTop: `5vh`}}>
                            <div />
                            <a>
                                <Next onclick={this.getRecipes.bind(this)} />
                            </a>
                        </div>
                        {this.state.confirmingMeals && <Redirect path to={{pathname: '/mymeals', state: {confirmingMeals: true}}} />}
                    </div>                
                </div>
            </React.Fragment>
        );
    };
};

export default auth(MealNumberSettings);