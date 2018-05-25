import React, {Component} from 'react';
import axios from 'axios';
import registerstorage from '../info_storage/register-storage';
import '../../assets/css/reg-confirm.css'
import {Link} from 'react-router-dom';
import LogoHeader from '../general/logo-header';
import Footer from '../general/footer';
import Loader from '../general/loader';
import ErrorModal from '../general/error-modal';
import Header from '../general/header';

class RegisterConfirm extends Component {
    constructor(props) {
        super(props);

        this.loginOnSuccess =  this.loginOnSuccess.bind(this);
        this.modalClose = this.modalClose.bind(this);

        this.state = {
            showLoader: false,
            modalStatus: false,
            message: ''
        };
    };

    sendAcctToServer() {
        registerstorage.diet = registerstorage.diet.toLowerCase();
        for (let i=0; i<registerstorage.allergy.length; i++) {
            registerstorage.allergy[i] = registerstorage.allergy[i].toLowerCase();
        };

        this.setState({
            showLoader: true
        });

        axios({

            // url: 'http://localhost:8080/frontend/Ding-FINAL/endpoints/create_user.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/create_user.php',
            url: '../../endpoints/create_user.php',
            method: 'post',
            data: {
                    email: registerstorage.email,
                    password: registerstorage.password,
                    diet: registerstorage.diet,
                    allergies: registerstorage.allergy,
                },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            if(resp.data.success === true) {
                this.loginOnSuccess();
            } else {
                this.setState({
                    showLoader: false,
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };
        }).catch( err => {
            console.log('Create user error:', err);
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

    loginOnSuccess(){
        axios({
            url: '../../endpoints/user_login.php',
            // url: 'http://localhost:8888/dingLFZ/endpoints/user_login.php',
            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/user_login.php',
            method: 'post',
            data: {
                    email: registerstorage.email,
                    password: registerstorage.password
                }
        }).then((resp) => {
            this.setState({
                showLoader: false
            });

            if(resp.data.success) {
                localStorage.ding_sessionID = resp.data.session_id;
                this.props.history.push('/meal-number');
            } else {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            }
        }).catch( err => {
            console.log('User login error: ', err);

            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });     
    }

    render() {
        return (
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className='regConfirmContainer'>
                    <LogoHeader />
                    <div className='container'>
                        <Header title={'Confirm Choices'}/>
                        <div className='regConfirmSelectionArea center'>
                            <div className='regConfirmLabel'>Email Address</div>
                            <div className='regConfirmEmail'>{registerstorage.email}</div>
                            <div className='regConfirmLabel'>Diet Selection</div>
                            <div className='regConfirmDiet'>{registerstorage.diet}</div>
                            <div className='regConfirmLabel'>Allergies</div>
                            <div className='regConfirmAllergy'>{registerstorage.allergy.join(', ') || 'None'}</div>
                        </div>
                        <div className='regConfirmButtonContainer'>
                            <Link to='/' className='btn btn-large teal'>Back to start</Link>
                            <button className='btn btn-large orange darken-4' onClick={this.sendAcctToServer.bind(this)}>All set!</button>
                        </div>
                    </div>
                </div>
            </React.Fragment>
        );
    };
};

export default RegisterConfirm;