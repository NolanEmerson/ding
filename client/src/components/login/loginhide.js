import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import axios from 'axios';
import mealschosen from '../info_storage/meals-chosen';

class LoginHide extends Component {
    constructor(props) {
        super(props);

        this.fieldFocused = this.fieldFocused.bind(this);
        this.fieldBlurred = this.fieldBlurred.bind(this);
        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);

        this.state = {
            dataValue: '',
            emailValue: '',
            passwordValue: '',
            emailFocused: false,
            passwordFocused: false,
            modalStatus: false,
            message: '',
            emailCheck: {
                color: 'red'
            },
            passwordLength: {
                color: 'red'
            },
            passwordCharacters: {
                color: 'red'
            },
            showLoader: false
        };
    };

    //use thisprops.history.push to redirect user to the meals page inside then promise
    //use componentdidmount to call axios request to load the correct user meal 

    confirmUserInfo(e) {
        e.preventDefault();
        this.props.toggleLoader();
        axios({
            url: '../../endpoints/user_login.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/user_login.php',            
            // url: 'http://localhost:8888/dingLFZ/endpoints/user_login.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/user_login.php',
            method: 'post',
            data: {
                    email: this.state.emailValue,
                    password: this.state.passwordValue
                }
        }).then((resp) => {
            console.log(resp);

            this.props.toggleLoader();

            if(resp.data.success) {
                localStorage.ding_sessionID = resp.data.session_id;
                if (resp.data.meal_plan === 1) {
                    this.props.history.push('/mymeals');                    
                } else {
                    this.props.history.push('/meal-number');
                };
            };

            if (resp.data === 'Password is not correct' || resp.data === "Your email is invalid" || resp.data === 'Invalid username/password combination') {
                this.props.showModal('Your email or password is invalid')
            } else {
                this.props.showModal('Server Error. Please try again later');
            };
        }).catch( err => {
            console.log('User login error: ', err);
            this.props.toggleLoader();
            this.props.showModal('Server Error. Please try again later');
        });     
    };

    emailChange(e) {
        const emailValidification = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.setState({
            emailValue: e.target.value
        }, () => {
            if(emailValidification.test(this.state.emailValue)){
                const strikeThrough = {color: 'green'};
                this.setState({
                    emailCheck: strikeThrough
                });
            } else {
                const noStrike = {color: 'red'};
                this.setState({
                    emailCheck: noStrike
                });
            }
        });
    };

    passwordChange(e) {
        this.setState({
            passwordValue: e.target.value
        });
    };

    fieldFocused(targetField) {
        if (targetField === 'email'){
            this.setState({
                emailFocused: true
            });
        }
    };

    fieldBlurred(targetField) {
        if (targetField === 'email'){
            this.setState({
                emailFocused: false
            });
        }
    };

    render() {
        const strikeThrough = {color: 'green'}; 

        return (
            <form className='row'>
                <div className='col s8 offset-s2 inputField'>
                    <label className='white-text'>Email</label>
                    <input type='text' className='white-text' value={this.state.emailValue} onChange={this.emailChange} onFocus={()=>this.fieldFocused('email')} onBlur={()=>this.fieldBlurred('email')}/>
                    {this.state.emailFocused && <div style={this.state.emailCheck} className='validationText1'>
                        {this.state.emailCheck.color === 'green' && <div className='checkmark'>✓</div>}Must be valid email address
                    </div>}
                </div>
                <div className='col s2' />
                <div className='col s8 offset-s2 inputField'>
                    <label className='white-text'>Password</label>
                    <input type='password' className='white-text' value={this.state.passwordValue} onChange={this.passwordChange} onFocus={()=>this.fieldFocused('password')} onBlur={()=>this.fieldBlurred('password')}/>
                </div>
                <div className='col s2' />
                <div className='loginButtonHolder'>
                    <button className='btn btn-large center-align dingOrange waves-effect waves-light loginSubmit' onClick={this.confirmUserInfo.bind(this)} type='submit'>Login</button>
                    <button onClick={this.props.returnFX} className='btn btn-large dingTeal waves-effect waves-light loginSubmit grey darken-1' type='button'>Return</button>
                </div>
            </form>
        );
    };
};

export default LoginHide;