import React from 'react';

export default class Workflow extends React.Component {

    startProposalsRegistering = async () => {
        await this.props.contract.methods.startProposalsRegistering().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    endProposalsRegistering = async () => {
        await this.props.contract.methods.endProposalsRegistering().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    startVotingSession = async () => {
        await this.props.contract.methods.startVotingSession().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    endVotingSession = async () => {
        await this.props.contract.methods.endVotingSession().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    tallyVotes = async () => {
        await this.props.contract.methods.tallyVotes().send({ from: this.props.accounts[0] });
        this.props.onWorkflowChange()
    };

    renderWorkflow0() {
        let wfBox = "wfBox";
        if (this.props.workflowStatus === '0') {
            wfBox = "wfBoxSelected";
        }
        return <div className={wfBox}>
            Registering Voters
        </div>
    }

    renderWorkflow1() {
        let wfBox = "wfBox";
        if (this.props.workflowStatus === '1') {
            wfBox = "wfBoxSelected";
        }
        if (this.props.workflowStatus === '0' && this.props.isOwner) {
            return <div>
            <button className="wfButton" onClick={this.startProposalsRegistering}>Start proposals registering</button>
        </div>
        } else {
            return <div className={wfBox}>
                Proposals Registration Started
            </div>
        }
    }

    renderWorkflow2() {
        let wfBox = "wfBox";
        if (this.props.workflowStatus === '2') {
            wfBox = "wfBoxSelected";
        }
        if (this.props.workflowStatus === '1' && this.props.isOwner) {
            return <div>
                <button className="wfButton" onClick={this.endProposalsRegistering}>End proposals registering</button>
            </div>
        } else {
            return <div className={wfBox}>
                Proposals Registration Ended
            </div>
        }
    }

    renderWorkflow3() {
        let wfBox = "wfBox";
        if (this.props.workflowStatus === '3') {
            wfBox = "wfBoxSelected";
        }
        if (this.props.workflowStatus === '2' && this.props.isOwner) {
            return <div>
                <button className="wfButton" onClick={this.startVotingSession}>Start voting session</button>
            </div>
        } else {
            return <div className={wfBox}>
                Voting Session Started
            </div>
        }
    }

    renderWorkflow4() {
        let wfBox = "wfBox";
        if (this.props.workflowStatus === '4') {
            wfBox = "wfBoxSelected";
        }
        if (this.props.workflowStatus === '3' && this.props.isOwner) {
            return <div>
                <button className="wfButton" onClick={this.endVotingSession}>End voting session</button>
            </div>
        } else {
            return <div className={wfBox}>
                Voting Session Ended
            </div>
        }
    }

    renderWorkflow5() {
        let wfBox = "wfBox";
        if (this.props.workflowStatus === '5') {
            wfBox = "wfBoxSelected";
        }
        if (this.props.workflowStatus === '4' && this.props.isOwner) {
            return <div>
                <button className="wfButton" onClick={this.tallyVotes}>Tally votes</button>
            </div>
        } else {
            return <div className={wfBox}>
                Votes Tallied
            </div>
        }
    }

    workflowStatusDisplay() {
        return <div>
            { this.renderWorkflow0() }
            { this.renderWorkflow1() }
            { this.renderWorkflow2() }
            { this.renderWorkflow3() }
            { this.renderWorkflow4() }
            { this.renderWorkflow5() }
        </div>
    }

    render() {
        return(
            <div id='workflow'>
                { this.workflowStatusDisplay() }
            </div>
        )
    }
}