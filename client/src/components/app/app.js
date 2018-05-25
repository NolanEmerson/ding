import React, {Component} from 'react';
import 'materialize-css/dist/css/materialize.min.css'
import '../../assets/css/app.css';
import Login from '../login/login';
import Meals from '../meals/meals';
import Details from '../meals/details';
import Grocery from '../grocery/grocery';
import Settings from '../settings/settings';
import DietSelection from '../diet/diet-selection';
import AllergySelection from '../allergy/allergy-selection';
import DietSettings from '../settings/diet-settings';
import AllergySettings from '../settings/allergy-settings';
import MealNumber from '../meal_num/meal_number';
import MealNumberSettings from '../settings/meal-num-settings';
import RegisterConfirm from '../reg_confirm/reg-confirm';
import {
    BrowserRouter as Router,
    Route
} from 'react-router-dom';

class App extends Component {
    constructor(props) {
        super(props);

    };

    render() {

        return (
            <Router>
                <div className='mainContentContainer'>
                    <div className='desktop-gutter gutter-left'>
                        <div className='left-gutter-img' />
                    </div>
                    <Route exact path='/' component={Login} />
                    <Route path='/mymeals' component={Meals} />
                    <Route path='/details' component={Details} />
                    <Route path='/grocery' component={Grocery} />
                    <Route path='/settings' component={Settings} />
                    <Route path="/diet-selection" component={DietSelection} />
                    <Route path="/allergy-selection" component={AllergySelection} />
                    <Route path="/meal-number" component={MealNumber} />
                    <Route path="/diet-settings" component={DietSettings} />
                    <Route path="/allergy-settings" component={AllergySettings} />
                    <Route path="/meal-num-settings" component={MealNumberSettings} />
                    <Route path='/register-confirm' component={RegisterConfirm} />
                    <div className='desktop-gutter gutter-right'>
                        <div className='right-gutter-img' />    
                    </div>                    
                </div>
            </Router>
        );
    };
};


export default App;
