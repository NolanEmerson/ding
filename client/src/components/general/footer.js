import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../../assets/css/general.css';
 
class Footer extends Component {
    render() {
        return (
            <footer className="footer">
                <Link to='/mymeals'><i className={`far fa-list-alt ${this.props.currentPage === 'meals' ? 'footerSelected' : 'footerDefault'}`}></i></Link>
                <Link to='/grocery'><i className={`fas fa-shopping-cart ${this.props.currentPage === 'grocery' ? 'footerSelected' : 'footerDefault'}`}></i></Link>
                <Link to='/settings'><i className={`fas fa-cogs ${this.props.currentPage === 'settings' ? 'footerSelected' : 'footerDefault'}`}></i></Link>
            </footer>
        );
    };
};

export default Footer;