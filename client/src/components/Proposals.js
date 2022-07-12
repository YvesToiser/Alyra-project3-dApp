import React from 'react';

export default class Proposals extends React.Component {

    addProposal = async () => {
        let proposalDescription = document.getElementById("addProposalButton").value;
        // TODO check if proposalDescription is correct format
        await this.props.contract.methods.addProposal(proposalDescription).send({ from: this.props.accounts[0] });
        await this.props.onProposalChange();
        document.getElementById('addProposalButton').value = "";
    };

    renderProposals () {
        if (!this.props.isVoter) {
            return <div>
                <p>You are not registered. So you can not see the proposals.</p>
            </div>
        } else {
            return <table>
                <tbody>
                {this.props.proposalList.map((prop) => (
                    <tr>
                        <td>{prop.description}</td>
                    </tr>
                ))}
                </tbody>
            </table>
        }
    };

    renderProposalSubmission () {
        if (!this.props.isVoter) {
            return <div>
                <p>You are not registered. So you can not participate. Sorry for the inconvenience.</p>
            </div>
        } else {
            if(this.props.workflowStatus === '0') {
                return <div>
                    <p>The proposal registration has not started yet.</p>
                </div>
            } else if (this.props.workflowStatus === '1') {
                return <div>
                    <input type="text" id="addProposalButton"/>
                    <button onClick={this.addProposal}>Add proposal</button>
                </div>
            } else if (this.props.workflowStatus === '2') {
                return <div>
                    <p>The proposal registration has Ended. Vote will start soon.</p>
                </div>
            } else if (this.props.workflowStatus === '3') {
                // TODO deal with vote here
                return <div></div>
            } else if (this.props.workflowStatus === '4') {
                return <div>
                    <p>The vote has Ended. Results will be published soon.</p>
                </div>
            } else if (this.props.workflowStatus === '5') {
                return <div>
                    <p>The vote has Ended. Results are available.</p>
                </div>
            }
        }
    }

    render(){
        return(
            <div id='proposals'>
                <h3>Proposals : </h3>
                { this.renderProposalSubmission() }
                { this.renderProposals() }
            </div>
        )
    }
}