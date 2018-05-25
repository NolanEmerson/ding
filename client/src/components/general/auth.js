import React, {Component} from 'react';

export default function (WrappedComponent){

    class Auth extends Component{

        componentDidMount(){
            if(!localStorage.ding_sessionID){
                this.props.history.push('/');
            }
        }

        componentWillReceiveProps(nextProps){
            if(!localStorage.ding_sessionID){
                this.props.history.push('/');
            }
        }

        render(){
            return <WrappedComponent {...this.props} />
        }
    }
    
    return Auth;
}