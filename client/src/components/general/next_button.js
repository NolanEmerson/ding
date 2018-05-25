import React from 'react';

const buttonStyle = {
    textShadow: '1px 2px 2px black'
}

export default (props) => (
    <div className="container nextButton" style={{height: 'auto'}}>
        <button onClick={props.onclick} style={buttonStyle} className={`waves-effect waves-light btn-large oxygenFont z-depth-2 orange darken-4 ${props.style}`}>{props.name || 'Next'}</button>
    </div>
);