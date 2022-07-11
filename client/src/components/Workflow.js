import React from 'react';

export default class Workflow extends React.Component {

    state = {
        workflowStatus: null,
    };

    switchWorkFlowStatus(wfs) {
        switch (wfs) {
            case '0' :
                return '1 - Registering Voters';
            case '1' :
                return '2 - Proposals Registration Started';
            case '2' :
                return '3 - Proposals Registration Ended';
            case '3' :
                return '4 - Voting Session Started';
            case '4' :
                return '5 - Voting Session Ended';
            case '5' :
                return '6 - Votes Tallied';
            default:
                return 'Error while fetching status';
        }
    }

    workflowManagement() {
        if (this.props.isOwner) {
            if (this.props.workflowStatus === '0') {
                return <div>
                    <button onClick={this.startProposalsRegistering}>Start proposals registering</button>
                </div>
            }
            if (this.props.workflowStatus === '1') {
                return <div>
                    <button onClick={this.endProposalsRegistering}>End proposals registering</button>
                </div>
            }
            if (this.props.workflowStatus === '2') {
                return <div>
                    <button onClick={this.startVotingSession}>Start voting session</button>
                </div>
            }
            if (this.props.workflowStatus === '3') {
                return <div>
                    <button onClick={this.endVotingSession}>End voting session</button>
                </div>
            }
            if (this.props.workflowStatus === '4') {
                return <div>
                    <button onClick={this.tallyVotes}>Tally votes</button>
                </div>
            }
            if (this.props.workflowStatus === '5') {
                return <div>
                    <p>The workflow has ended and can not be modified any more.</p>
                </div>
            }
        }
    }

    startProposalsRegistering = async () => {
        const { accounts, contract } = this.props;
        const transaction = await contract.methods.startProposalsRegistering().send({ from: accounts[0] });
        console.log("New Status : " + transaction.events.WorkflowStatusChange.returnValues.newStatus);
        this.props.onWorkflowChange()
    };

    endProposalsRegistering = async () => {
        const { accounts, contract } = this.props;
        const transaction = await contract.methods.endProposalsRegistering().send({ from: accounts[0] });
        console.log("New Status : " + transaction.events.WorkflowStatusChange.returnValues.newStatus);
        this.props.onWorkflowChange()
    };

    startVotingSession = async () => {
        const { accounts, contract } = this.props;
        const transaction = await contract.methods.startVotingSession().send({ from: accounts[0] });
        console.log("New Status : " + transaction.events.WorkflowStatusChange.returnValues.newStatus);
        this.props.onWorkflowChange()
    };

    endVotingSession = async () => {
        const { accounts, contract } = this.props;
        const transaction = await contract.methods.endVotingSession().send({ from: accounts[0] });
        console.log("New Status : " + transaction.events.WorkflowStatusChange.returnValues.newStatus);
        this.props.onWorkflowChange()
    };

    tallyVotes = async () => {
        const { accounts, contract } = this.props;
        const transaction = await contract.methods.tallyVotes().send({ from: accounts[0] });
        console.log("New Status : " + transaction.events.WorkflowStatusChange.returnValues.newStatus);
        this.props.onWorkflowChange()
    };

    render() {

        const workflowStatusDisplay = this.switchWorkFlowStatus(this.props.workflowStatus);

        return(
            <div id='workflow'>
                <h3>Workflow Status : </h3>
                {workflowStatusDisplay}
                { this.workflowManagement() }
            </div>
        )
    }

}