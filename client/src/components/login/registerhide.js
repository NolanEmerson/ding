import React, {Component} from 'react';
import {Link, Redirect} from 'react-router-dom';
import registerstorage from '../info_storage/register-storage';
import axios from 'axios';
import ErrorModal from '../general/error-modal';
import Loader from '../general/loader';

class RegisterHide extends Component {
    constructor(props) {
        super(props);

        this.emailChange = this.emailChange.bind(this);
        this.passwordChange = this.passwordChange.bind(this);
        this.confirmChange = this.confirmChange.bind(this);

        this.state = {
            emailValue: '',
            passwordValue: '',
            confirmValue: '',
            emailFocused: false,
            passwordFocused: false,
            confirmFocused: false,
            emailCheck: {
                color: 'red'
            },
            passwordLength: {
                color: 'red'
            },
            passwordCharacters: {
                color: 'red'
            },
            confirmMatches: {
                color: 'red'
            },
        };
    };

    emailChange(e) {
        const emailValidification = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

        this.setState({
            emailValue: e.target.value
        }, () => {
            if(emailValidification.test(this.state.emailValue)) {
                const strikeThrough = {color: 'green'};
                this.setState({
                    emailCheck: strikeThrough
                });
            } else {
                const noStrike = {color: 'red'};
                this.setState({
                    emailCheck: noStrike
                });
            };
        });
        registerstorage.email = e.target.value;
    };

    passwordChange(e) {
        this.setState({
            passwordValue: e.target.value
        }, () => {
            this.checkPWLength();
            this.checkPWChars();
        });
        registerstorage.password = e.target.value;
    }; 

    checkPWLength() {
        if(this.state.passwordValue.length >= 8 && this.state.passwordValue.length <= 32) {
            const strikeThrough = {color: 'green'};
            this.setState({
                passwordLength: strikeThrough
            });
        } else {
            const noStrike = {color: 'red'};
            this.setState({
                passwordLength: noStrike
            });
        };
    };

    checkPWChars() {
        const passwordChars = /^[a-z0-9]+$/i;
        if (passwordChars.test(this.state.passwordValue)) {
            const strikeThrough = {color: 'green'};
            this.setState({
                passwordCharacters: strikeThrough
            });
        } else {
            const noStrike = {color: 'red'};
            this.setState({
                passwordCharacters: noStrike
            });
        };
    };

    confirmChange(e) {
        if (e.target.value === this.state.passwordValue) {
            this.setState({
                confirmValue: e.target.value,
                confirmMatches: {color: 'green'}
            });
        } else {
            this.setState({
                confirmValue: e.target.value,
                confirmMatches: {color: 'red'}
            });
        };
    };

    fieldFocused(targetField) {
        if (targetField === 'email') {
            this.setState({
                emailFocused: true
            });
        } else if (targetField === 'password') {
            this.setState({
                passwordFocused: true
            });
        } else if (targetField === 'confirm') {
            this.setState({
                confirmFocused: true
            });
        };
    };

    fieldBlurred(targetField) {
        if (targetField === 'email') {
            this.setState({
                emailFocused: false
            });
        } else if (targetField === 'password') {
            this.setState({
                passwordFocused: false
            });
        } else if (targetField === 'confirm') {
            this.setState({
                confirmFocused: false
            });
        };
    };

    serverEmailVerify(e) {
        e.preventDefault();

        this.props.toggleLoader();

        axios({
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/email_check.php',
            url: '../../endpoints/email_check.php',
            method: 'post',
            data: {
                    email: registerstorage.email,
                    password: registerstorage.password,
                },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            this.props.toggleLoader();

            const passwordChars = /^[a-z0-9]+$/i;            
            if (resp.data === 'email available' && passwordChars.test(this.state.passwordValue) && this.state.passwordValue.length >= 8 && this.state.passwordValue.length <= 32 && this.state.passwordValue === this.state.confirmValue) {
                this.props.history.push('/diet-selection');

            } else if (this.state.passwordValue.length < 8 || this.state.passwordValue.length > 32 || !passwordChars.test(this.state.passwordValue)) {
                this.props.showModal('Please complete the password checklist.');

            } else if (resp.data === 'email taken') {
                this.props.showModal('That email is already in use.');

            } else if (resp.data === 'Your email is invalid') {
                this.props.showModal('Invalid email address.');

            } else if (this.state.passwordValue === '') {
                this.props.showModal('Please enter a password.');

            } else if (this.state.passwordValue !== this.state.confirmValue) {
                this.props.showModal('Your passwords do not match.');

            } else {
                this.props.showModal('Server error. Please try again later.');

            };  
        }).catch( err => {
            console.log('Email verification error: ', err);

            this.props.toggleLoader();
            this.props.showModal('Server error. Please try again later.');
        });
    };

    render() {
        return (
            <form onSubmit={this.goBack} className='row'>
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
                    {this.state.passwordFocused && <div className='validationText2'>
                        <div style={this.state.passwordLength} >
                            {this.state.passwordLength.color === 'green' && <div className='checkmark'>✓</div>}Must be 8-32 characters long
                        </div>
                        <div style={this.state.passwordCharacters} >
                            {this.state.passwordCharacters.color === 'green' && <div className='checkmark'>✓</div>}Only contains numbers or letters
                        </div>
                    </div>}
                </div>
                <div className='col s2' />
                <div className='col s8 offset-s2 inputField'>
                    <label className='white-text'>Confirm Password</label>
                    <input type='password' className='white-text' value={this.state.confirmValue} onChange={this.confirmChange} onFocus={()=>this.fieldFocused('confirm')} onBlur={()=>this.fieldBlurred('confirm')}/>
                    {this.state.confirmFocused && <div className='validationText1'>
                        <div style={this.state.confirmMatches} >
                            {this.state.confirmMatches.color === 'green' && <div className='checkmark'>✓</div>}Must match current password
                        </div>
                    </div>}
                </div>
                <div className='col s2' />
                <div className='registerButtonHolder'>
                    <button onClick={(e) => this.serverEmailVerify(e)} className='btn btn-large dingOrange waves-effect waves-light registerSubmit' type='submit'>Register</button>
                    <button onClick={this.props.returnFX} className='btn btn-large dingTeal waves-effect waves-light grey darken-1 registerSubmit' type='button'>Return</button>
                </div>
            </form>
        );
    };
};

export default RegisterHide;