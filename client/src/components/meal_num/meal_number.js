import React, { Component } from 'react';
import axios from 'axios';
import Header from '../general/header';
import MealNumButton from './meal-num-btn';
import Next from '../general/next_button';
import '../../assets/css/mealNumber.css';
import {Link, Redirect} from 'react-router-dom';
import mealdb from '../info_storage/meal-db';
import mealschosen from '../info_storage/meals-chosen';
import LogoHeader from '../general/logo-header';

class MealNumber extends Component {
    constructor(props) {
        super(props);

        this.state = {
            confirmingMeals: false
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
    };
    
    getRecipes() {
        console.log('wew', localStorage.ding_sessionID);
        axios({
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/mealGen.php',
            // url: 'http://localhost:8888/dingLFZ/endpoints/mealGen.php',
            url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/mealGen.php',
            method: 'post',
            data: {
                session_ID: localStorage.ding_sessionID
            }
        }).then((resp) => {
            console.log('Meal gen response: ', resp);
        }).catch((err) => {
            console.log('Meal gen error: ', err);
        });
        this.setState({
            confirmingMeals: true
        });
    };

    render() {

        return (
            <div>
                <LogoHeader />
                <div className="container">
                    <Header title={'How Many Recipes?'} />
                    <div className="button-column collection">
                        <MealNumButton title={'1'} style={'button'} mealnumclick={this.setNumberOfMeals.bind(this)}/>  
                        <MealNumButton title={'3'} style={'button'} mealnumclick={this.setNumberOfMeals.bind(this)}/>
                        <MealNumButton title={'5'} style={'button'} mealnumclick={this.setNumberOfMeals.bind(this)}/>   
                        <MealNumButton title={'7'} style={'button'} mealnumclick={this.setNumberOfMeals.bind(this)}/>   
                    </div>  
                    <div className="right" style={{marginTop: `2.2vh`}}>
                        <Next onclick={this.getRecipes.bind(this)} />          
                    </div>
                    {this.state.confirmingMeals && <Redirect path to={{pathname: '/mymeals', state: {confirmingMeals: true}}} />}
                </div>                
            </div>
        );
    };
};

export default MealNumber;