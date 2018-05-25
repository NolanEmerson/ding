import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import '../../assets/css/settings.css';
import LogoHeader from '../general/logo-header';
import Footer from '../general/footer';
import auth from '../general/auth';
import Header from '../general/header';

class Settings extends Component {
    constructor(props) {
        super(props);

        this.logoutClicked = this.logoutClicked.bind(this);

    };

    logoutClicked(){
        localStorage.removeItem('ding_sessionID');
        this.props.history.push('/');
    }

    render() {
        return (                      
            <div className='settingsContainer'>
                <LogoHeader />
                <div className="mainContainer container">
                    <Header title={'Settings'} />
                    <div className='settingsOptionArea'>
                        <Link to='/diet-settings'className='settingsButton oxygenFont btn-large btn  grey darken-1'>Reset Filters</Link>
                        <Link to='meal-num-settings' className='settingsButton oxygenFont btn-large btn  grey darken-1'>New Meals</Link>
                        <div className='settingsButton oxygenFont btn btn-large grey darken-1' onClick={this.logoutClicked}>Logout</div>
                    </div>
                </div>
                <Footer currentPage='settings' />  
            </div>      
        );
    };
};

export default auth(Settings);