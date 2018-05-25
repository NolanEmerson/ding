import React, {Component} from 'react';
import LoginHide from './loginhide';
import RegisterHide from './registerhide';
import Loader from '../general/loader';
import ErrorModal from '../general/error-modal';
import dingLogo from '../../assets/images/dingLogoOrangeShadow.png'
import '../../assets/css/login.css';

class Login extends Component {
    constructor(props) {
        super(props);

        this.loginClicked = this.loginClicked.bind(this);
        this.goBackLogin = this.goBackLogin.bind(this);
        this.registerClicked = this.registerClicked.bind(this);
        this.goBackRegister = this.goBackRegister.bind(this);
        this.modalClose = this.modalClose.bind(this);
        this.toggleLoader = this.toggleLoader.bind(this);
        this.showModal = this.showModal.bind(this);

        this.state = {
            loginHide: false,
            registerHide: false,
            modalStatus: false,
            showLoader: false,
            message: ''
        };
    };

    loginClicked(e) {
        e.preventDefault();
        this.setState({
            loginHide: !this.state.loginHide
        });
    };

    registerClicked(e) {
        e.preventDefault();
        this.setState({
            registerHide: !this.state.registerHide
        });
    };

    goBackLogin() {
        this.setState({
            loginHide: !this.state.loginHide
        });
    };

    goBackRegister() {
        this.setState({
            registerHide: !this.state.registerHide
        });
    };

    modalClose() {
        this.setState({
            modalStatus: false
        });
    };

    showModal(message) {
        this.setState({
            modalStatus: true,
            message
        })
    }

    toggleLoader() {
        const {showLoader} = this.state;

        this.setState({
            showLoader: !showLoader
        });
    }

    render() {
        return (
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className="loginContainer">
                    <img className='loginLogo' src={dingLogo} />
                    <h4 className='loginSlogan center-align'>dinner planning made easy</h4>
                    <div className='loginButtons'>
                        {this.state.loginHide && <LoginHide history={this.props.history} returnFX={this.goBackLogin} toggleLoader={this.toggleLoader} showModal={this.showModal} />}
                        {this.state.registerHide && <RegisterHide history={this.props.history} returnFX={this.goBackRegister} toggleLoader={this.toggleLoader} showModal={this.showModal} />}
                        {!this.state.loginHide && !this.state.registerHide && <button className="loginButton btn-large dingOrange z-depth-2" onClick={this.loginClicked}>Login</button>}
                        <br />
                        {!this.state.loginHide && !this.state.registerHide && <button className="registerButton btn-large dingOrange z-depth-2" onClick={this.registerClicked}>Register</button>}
                    </div>
                    <div className="loginDarken"></div>
                </div>
            </React.Fragment>
        );
    };
};

export default Login;