import React from 'react';

export default class Address extends React.Component {

    render(){
        return(
            <div className='header'><p>Your address : </p>{this.props.addr}</div>
        )
    }

}