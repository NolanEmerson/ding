import React, {Component} from 'react';
import {Link, Route} from 'react-router-dom';
import axios from 'axios';
import grocerystorage from '../info_storage/grocery-storage';
import Settings from '../settings/settings';
import LogoHeader from '../general/logo-header';
import Footer from '../general/footer';
import Loader from '../general/loader';
import auth from '../general/auth';
import '../../assets/css/grocery.css';
import ErrorModal from '../general/error-modal';
import Header from '../general/header';
import ListMaker from './list_maker';

class Grocery extends Component {
    constructor(props) {
        super(props);

        this.renderGroceryList = this.renderGroceryList.bind(this);
        this.modalClose = this.modalClose.bind(this);

        this.state = {
                listOfIngredients: [],
                showLoader: false,
                modalStatus: false,
                message: ""
        };
    };

    componentDidMount() {
        this.setState({
            showLoader: true
        });

        this.pullGroceryList();
    };

    pullGroceryList(resetStyling) {
        axios({

            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/grocery_list_get.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/grocery_list_get.php',
            url: '../../endpoints/grocery_list_get.php',
            method: 'post',
            data: {
                'session_ID': localStorage.ding_sessionID
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            console.log('All groceries: ', resp);

            if(resp.data === 'No ingredients'){
                this.setState({
                    showLoader: false
                });
                return;
            }
            this.renderGroceryList(resp, resetStyling);

            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };
        }).catch( err => {
            console.log('All Meals Ingredients error: ', err);
            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
    }

    renderGroceryList(resp, resetStyling) {
        while(grocerystorage.length){
            grocerystorage.pop();
        };

        for (let i = 0; i < resp.data.length; i++){
            grocerystorage.push(resp.data);
        };

        if(resetStyling !== undefined){
            resetStyling();
        }
        this.setState({
            listOfIngredients: grocerystorage,
            showLoader: false
        })
    };

    completeItem(id, complete, resetStyling) {

        // this.setState({
        //     showLoader: true
        // });

        axios({

            // url: 'http://localhost:8080/C1.18_FoodTinder/endpoints/grocery_list_toggle.php',
            // url: 'http://localhost:8080/frontend/Ding-FINAL/grocery_list_toggle.php',
            url: '../../endpoints/grocery_list_toggle.php',
            method: 'post',
            data: {
                'session_ID': localStorage.ding_sessionID,
                'complete': complete,
                'id': id
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            console.log('Toggle response: ', resp);

            this.setState({
                showLoader: false
            });

            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };

            this.pullGroceryList(resetStyling);

        }).catch( err => {
            console.log('All Meals Ingredients error: ', err);
            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });

    }

    modalClose() {
        this.setState({
            modalStatus: false
        });
    };
    
    render() {



        const listMap = (this.state.listOfIngredients).map((item, index) => {
            return (
                <ListMaker key={index} id={index} item={item[index]} completeItem={this.completeItem.bind(this)} />
            );
		});

        return (
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className="groceryContainer Oxygen">
                    <LogoHeader style={{position: 'fixed'}}/>
                    <main className="mainArea" >
                        <Header title={'Grocery List'} />
                            <div className="list" >
                                {listMap}
                            </div>
                    </main>
                    <Footer currentPage='grocery' />
                </div>
            </React.Fragment>
        );
    };
};

export default auth(Grocery);