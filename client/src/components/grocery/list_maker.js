import React, {Component} from 'react';

class ListMaker extends Component{
    constructor(props){
        super(props);

        this.toggleComplete = this.toggleComplete.bind(this);
        this.resetStyling = this.resetStyling.bind(this);

        this.state = {
            completing: '',
            style: 'auto'
        }
    }

    toggleComplete(){
        let {complete,  id} = this.props.item;

        complete = 1 - complete;

        this.setState({
            completing: 'checkbox-grey',
            style: 'none'
        });

        this.props.completeItem(id, complete, this.resetStyling);

    }

    resetStyling() {
        this.setState({
            completing: '',
            style: 'auto'
        });
    }

    render(){

        const {complete} = this.props.item;

        return (
            <div className='item' key={this.props.id} >
                <input type='checkbox' checked={complete ? 'checked' : ''} onChange={this.toggleComplete.bind(this)} className={`check filled-in ${this.state.completing}`} style={{pointerEvents: this.state.style}} id={this.props.id} />
                <label className='filled-in name oxygenFont' style={{fontSize: `1.2rem`}} htmlFor={this.props.id}>{this.props.item.ingredient}</label>
            </div>
        )
    }
}

export default ListMaker;