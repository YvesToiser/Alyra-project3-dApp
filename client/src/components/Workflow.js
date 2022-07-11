import React from 'react';

export default class Workflow extends React.Component {

    render(){
        return(
            <div id='workflow'>
                <p>Workflow Status : </p>
                {this.props.workflowStatus}
            </div>
        )
    }

}