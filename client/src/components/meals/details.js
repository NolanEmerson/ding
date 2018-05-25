import React, {Component} from 'react';
import {Link} from 'react-router-dom';
import axios from 'axios';
import Footer from '../general/footer';
import LogoHeader from '../general/logo-header';
import Loader from '../general/loader';
import ErrorModal from '../general/error-modal';

class Details extends Component {
    constructor(props) {
        super(props);
        
        this.headerClicked = this.headerClicked.bind(this);
        this.generateIngredients = this.generateIngredients.bind(this);
        this.generateInstructions = this.generateInstructions.bind(this);
        this.generateNutrition = this.generateNutrition.bind(this);
        this.modalClose = this.modalClose.bind(this);

        this.state = {
            recipeComplete: false,
            showLoader: false,
            ingrTarget: 'detailsSelectedList',
            instrTarget: '',
            nutrTarget: '',
            ingrList: {
                display: 'inline'
            },
            instrList: {
                display: 'none'
            },
            nutrList: {
                display: 'none'
            },
            ingrInfo: '',
            instrInfo: '',
            nutrInfo: ''
        };        
    };

    componentWillMount() {
        this.generateIngredients(this.props.mealInfo.ingredients);
    };

    headerClicked(target) {
        this.setState({
            showLoader: true
        });

        let selectedSection= {};
        let axiosTarget = '';
        switch (target) {
            case 'ingr':
                selectedSection = {
                    ingrTarget: 'detailsSelectedList',
                    instrTarget: '',
                    nutrTarget: '',
                    ingrList: {
                        display: 'inline'
                    },
                    instrList: {
                        display: 'none'
                    },
                    nutrList: {
                        display: 'none'
                    }
                };
                axiosTarget = 'recipeIngredients';
                break;
            case 'instr':
                selectedSection = {
                    ingrTarget: '',
                    instrTarget: 'detailsSelectedList',
                    nutrTarget: '',
                    ingrList: {
                        display: 'none'
                    },
                    instrList: {
                        display: 'inline'
                    },
                    nutrList: {
                        display: 'none'
                    }
                };
                axiosTarget = 'recipeInstructions';
                break;
            case 'nutr':
                selectedSection = {
                    ingrTarget: '',
                    instrTarget: '',
                    nutrTarget: 'detailsSelectedList',
                    ingrList: {
                        display: 'none'
                    },
                    instrList: {
                        display: 'none'
                    },
                    nutrList: {
                        display: 'inline'
                    }
                };
                axiosTarget = 'recipeNutrition';
                break;
        };
        axios({

            // url: `http://localhost:8080/C1.18_FoodTinder/endpoints/meals/${axiosTarget}.php`,
            // url: `http://localhost:8080/frontend/Ding-Final/endpoints/meals/${axiosTarget}.php`,
            url: `../../endpoints/meals/${axiosTarget}.php`,


            method: 'post',
            data: {
                'recipe_id': this.props.mealInfo.recipe_id,
                'session_ID': localStorage.ding_sessionID
            },
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            }
        }).then( resp => {
            this.setState({
                showLoader: false
            });

            if (axiosTarget === 'recipeIngredients') {
                this.generateIngredients(resp, selectedSection);

            } else if (axiosTarget === 'recipeInstructions') {
                this.generateInstructions(resp, selectedSection);
                
            } else if (axiosTarget === 'recipeNutrition') {
                this.generateNutrition(resp, selectedSection);
            };

            if (typeof resp.data === undefined) {
                this.setState({
                    modalStatus: true,
                    message: "Server Error. Please try again later."
                });
            };
        }).catch( err => {
            console.log('Ingr/Instr/Nutr error: ', err);
            this.setState({
                showLoader: false,
                modalStatus: true,
                message: "Server Error. Please try again later."
            });
        });
    };

    generateIngredients(info, selectedSection){
        this.setState({
            ingrInfo: info.data,
            ...selectedSection
        });
    }

    generateInstructions(info, selectedSection){
        this.setState({
            instrInfo: info.data,
            ...selectedSection
        });
    }

    generateNutrition(info, selectedSection){
        this.setState({
            nutrInfo: info.data[0],
            ...selectedSection
        });
    }

    modalClose() {
        this.setState({
            modalStatus: false
        });
    };

    render() {


        const {mealInfo, hide, index, complete} = this.props;

        let instrMap = '';
        
        this.state.instrInfo !== '' ? instrMap = this.state.instrInfo.map((item, index) => {return <li className='collection-item detailsListItem' key={index}> {index+1}. {item.step}</li>}) : instrMap = '';

        let ingrMap = '';

        this.state.ingrInfo !== '' ? ingrMap = mealInfo.ingredients.map((item, index) => {return <li className='collection-item detailsListItem' key={index}> {`${mealInfo.ingredients[index].amount != 0 ? mealInfo.ingredients[index].amount : '< 1'} ${mealInfo.ingredients[index].unit_type} ${mealInfo.ingredients[index].ingredient}`}</li>}) : ingrMap = '';
        
        let nutrMap = '';

        this.state.nutrInfo !== '' ? nutrMap = 
        <ul className='collection'>
            <li className='collection-item detailsListItem'>Calories: {this.state.nutrInfo.calories}</li>
            <li className='collection-item detailsListItem'>Protein: {this.state.nutrInfo.protein}</li>
            <li className='collection-item detailsListItem'>Sugar: {this.state.nutrInfo.sugar}</li>
            <li className='collection-item detailsListItem'>Carbohydrates: {this.state.nutrInfo.carbs}</li>
            <li className='collection-item detailsListItem'>Fat: {this.state.nutrInfo.fat}</li>
            <li className='collection-item detailsListItem'>Sodium: {this.state.nutrInfo.sodium}</li>
        </ul>
        :
        nutrMap = '';

        return(
            <React.Fragment>
                {this.state.modalStatus && <ErrorModal message={this.state.message} onClick={this.modalClose} />}
                {this.state.showLoader && <Loader />}
                <div className="detailsContainer">
                    <LogoHeader onClick={hide} back={true} style={{position: 'fixed'}}/>
                    <main className="detailsMainArea">
                        <img src={mealInfo.image} alt="" className="detailsImg" />
                        <h3 className='detailsName'>{mealInfo.name}</h3>
                        <h5 className='detailsTime'>Time to Complete: {mealInfo.readyInMinutes} minutes</h5>
                        <div>
                            <div className={"detailsIngredientsHead " + this.state.ingrTarget} onClick={()=>this.headerClicked('ingr')} >Ingredients</div>
                            <div className={"detailsInstructionsHead " + this.state.instrTarget} onClick={()=>this.headerClicked('instr')} >Instructions</div>
                            <div className={"detailsNutritionHead " + this.state.nutrTarget} onClick={()=>this.headerClicked('nutr')} >Nutrition</div>
                        </div>
                        <div className="detailsIngredientsList" style={this.state.ingrList}>
                            <ul className='collection'>
                                {ingrMap}
                            </ul>
                        </div>
                        <div className="detailsInstructionsList" style={this.state.instrList}>
                            <ul className='collection'>
                                {instrMap}
                            </ul>
                            {!this.props.hidecomplete && !mealInfo.complete && <button className="completeButton btn btn-large green darken-2" onClick={()=>complete(index, mealInfo.recipe_id)}>Complete</button>}
                        </div>
                        <div className="detailsNutritionList" style={this.state.nutrList}>
                            {nutrMap}
                        </div>
                    </main>
                    <Footer currentPage='meals' />
                </div>
            </React.Fragment>
        );
    };
};

export default Details;