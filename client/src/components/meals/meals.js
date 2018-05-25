import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import '../../assets/css/meals.css'
import Details from './details';
import mealdb from '../info_storage/meal-db';
import mealschosen from '../info_storage/meals-chosen';
import MealCreator from './meal-creator';
import MealConfirm from './mealconfirm';
import LogoHeader from '../general/logo-header';
import Footer from '../general/footer';
import Loader from '../general/loader';
import auth from '../general/auth';
import axios from 'axios';
import ErrorModal from '../general/error-modal';

class Meals extends Component {
    constructor(props) {
        super(props);

        this.retrieveUserMeals = this.retrieveUserMeals.bind(this);
        this.modalClose = this.modalClose.bind(this);
        
        this.state = {
            meals: 0,
            showDetails: false,
            confirmingMeals: false,
            showLoader: false,
            modalStatus: false,
            message: '',
            mealDetail: {
                name: '',
                image: '',
                ingredients: '',
                recipe_id: '',
                index: ''
            }
        };
    };

    determineMealConfirmation() {
        if (!this.props.location.state){
            this.setState({
                confirmingMeals: false
            }, () => {
                this.retrieveUserMeals();
            });
            return;
        };
        if (this.props.location.state.confirmingMeals === true){
            this.setState({
                confirmingMeals: true,
                meals: mealschosen
            }, () => {
                this.retrieveUserMeals();
            });
        } else {
            this.setState({
                confirmingMeals: false,
                meals: mealschosen
            }, () => {
                this.retrieveUserMeals();
            });
        };
    };

    componentWillMount() {
        this.determineMealConfirmation();
    };

    retrieveUserMeals() {
        if (!this.props.location.state) {

            this.setState({
                showLoader: true
            });

            axios({

                // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/meals/userCurrentMeals.php',
                // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/meals/userCurrentMeals.php',
                url: '../../endpoints/meals/userCurrentMeals.php',
                method: 'post',
                data: {
                    session_ID: localStorage.ding_sessionID
                }
                }).then( resp => {
                    console.log('All user meals resp: ', resp);

                for (let i=0; i<resp.data.length; i++){
                    mealschosen.push(resp.data[i]);
                };
                this.setState({
                    meals: mealschosen,
                    showLoader: false
                });
                if (typeof resp.data === undefined) {
                    this.setState({
                        modalStatus: true,
                        message: "Server Error. Please try again later."
                    });
                };
            }).catch( err => {
                console.log('User current meals error: ', err);

                this.setState({
                    showLoader: false,
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            });  
        };
    };

    closeMealConfirm() {
        const selectedMeals = [];
        for (var i=0; i<mealschosen.length; i++) {
            selectedMeals.push(mealschosen[i].recipe_id);
        };

        this.setState({
            showLoader: true
        });

        axios({

            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/create_meal_plan.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/create_meal_plan.php',
            url: '../../endpoints/create_meal_plan.php',

            method: 'post',
            data: {
                'recipe_ids': selectedMeals,
                'session_ID': localStorage.ding_sessionID
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            this.setState({
                confirmingMeals: false,
                showLoader: false
            });
            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            } else {
                this.generateNewGroceries();
            }
        }).catch( err => {
            console.log('Create meal plan error: ', err);

            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });        
    };

    generateNewGroceries(){

        this.setState({
            showLoader: true
        });

        axios({

            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/meals/allMealsIngredients.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/meals/allMealsIngredients.php',
            url: '../../endpoints/meals/allMealsIngredients.php',

            method: 'post',
            data: {
                'session_ID': localStorage.ding_sessionID
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {

            this.setState({
                showLoader: false
            });

            console.log('Gen new grocery: ', resp);

        }).catch( err => {
            
            console.log('Create meal plan error: ', err);

            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
    }

    mealClicked(number, mealInfo) {
        const mealDetail = {
            name: mealInfo.title,
            image: mealInfo.image,
            ingredients: '',
            recipe_id: mealInfo.recipe_id,
            readyInMinutes: mealInfo.readyInMinutes,
            index: number,
            complete: mealInfo.complete
        };

        this.setState({
            showLoader: true
        });

        axios({


            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/meals/recipeIngredients.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/meals/recipeIngredients.php',
            url: '../../endpoints/meals/recipeIngredients.php',

            method: 'post',
            data: {
                'recipe_id': mealInfo.recipe_id,
                'session_ID': localStorage.ding_sessionID
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            mealDetail.ingredients = resp.data;
            this.setState({
                showDetails: true,
                mealDetail: mealDetail,
                showLoader: false
            });
            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };
        }).catch( err => {
            console.log('Recipe ingredients error: ', err);
            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
    };

    hideDetails() {
        this.setState({
            showDetails: false
        });
    };

    removeMeal(event, index) {
        event.stopPropagation();
        if (mealdb.length <= 5) {
            this.addMealsToStorage(index);
            return;
        };
        mealschosen.splice(index, 1);
        this.addSubstituteMeal(index);
    };

    addMealsToStorage(index) {

        this.setState({
            showLoader: true
        });

        axios({
            url: '../../endpoints/meals/newRecipes.php',
            // url: 'http://localhost:8888/dingLFZ/endpoints/mealGen.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/meals/newRecipes.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/meals/newRecipes.php',
            method: 'post',
            data: {
                session_ID: localStorage.ding_sessionID
            }
        }).then( resp => {
            for (var i=0; i<resp.data.length; i++) {
                mealdb.push(resp.data[i]);
            };
            mealschosen.splice(index, 1);
            this.setState({
                showLoader: false
            }, () => {
                this.addSubstituteMeal(index);
            });
            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
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

    completeMeal(index, recipe_id) {

        this.setState({
            showLoader: true
        });

        axios({

            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/update_meal_completed.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/update_meal_completed.php',
            url: '../../endpoints/update_meal_completed.php',

            method: 'post',
            data: {
                'recipe_id': recipe_id,
                'session_ID': localStorage.ding_sessionID,
                completed: 1
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            console.log('Completed meal resp: ', resp);

            this.setState({
                showDetails: false,
                showLoader: false
            });

            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
                return;
            };

            this.reloadMeals();
        }).catch( err => {
            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
        
    };

    reloadMeals() {
        while(mealschosen.length) {
            mealschosen.pop();
        };
        this.updateCompletedDisplay();
    };

    updateCompletedDisplay(){
        this.setState({
            showLoader: true
        });

        axios({

            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/meals/userCurrentMeals.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/meals/userCurrentMeals.php',
            url: '../../endpoints/meals/userCurrentMeals.php',
            method: 'post',
            data: {
                session_ID: localStorage.ding_sessionID
            }
            }).then( resp => {

            for (let i=0; i<resp.data.length; i++){
                mealschosen.push(resp.data[i]);
            };
            this.setState({
                meals: mealschosen,
                showLoader: false
            });
            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };
        }).catch( err => {
            console.log('User current meals error: ', err);

            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
    }

    addSubstituteMeal(index) {
        let randomIndex = Math.floor(Math.random() * mealdb.length);
        mealschosen.splice(index, 0, (mealdb[randomIndex]));
        mealdb.splice(randomIndex, 1);
        this.setState({
            meals: mealschosen
        });
    };

    componentWillUnmount(){
        while (mealschosen.length) {
            mealschosen.pop();
        };
    }

    modalClose() {
        this.setState({
            modalStatus: false
        });
    };

    render() {
        const {mealDetail, meals} = this.state;

        let mealStyle = null;
        let confirmStyle = null;
        if(meals.length === 1) {
            mealStyle = 'singleMeal';
        } else if (meals.length === 3) {
            mealStyle = 'tripleMeal';
        }

        let mealMap = '';

        this.state.meals ? mealMap = this.state.meals.map((meal, index) => {return <MealCreator mealInfo={meal} style={mealStyle} key={index} number={index} onclick={this.mealClicked.bind(this)} deleteItem={this.removeMeal.bind(this)} deleteable={this.state.confirmingMeals}/>}) : '';
      
        return(
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className="mealsContainer">
                    <LogoHeader add={true} />
                    <main className="mealsMainArea">
                        {this.state.confirmingMeals && <MealConfirm style={mealStyle} confirming={this.state.confirmingMeals} closeconfirm={this.closeMealConfirm.bind(this)} />}
                        {!this.state.showDetails && mealMap}
                        {this.state.showDetails && <Details mealInfo={mealDetail} hide={this.hideDetails.bind(this)} complete={this.completeMeal.bind(this)} index={this.state.mealDetail.index} hidecomplete={this.state.confirmingMeals} />}
                    </main>
                    <Footer currentPage='meals'/>
                </div>
            </React.Fragment>
        );
    };
};

export default auth(Meals);