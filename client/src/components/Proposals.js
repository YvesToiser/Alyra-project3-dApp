import React from 'react';

export default class Proposals extends React.Component {

    addProposal = async () => {
        let proposalDescription = document.getElementById("addProposalButton").value;
        // TODO check if proposalDescription is correct format
        await this.props.contract.methods.addProposal(proposalDescription).send({ from: this.props.accounts[0] });
        await this.props.onProposalChange();
        document.getElementById('addProposalButton').value = "";
    };

    voteForProposal = async (_i) => {
        // TODO check if voter has already voted
        await this.props.contract.methods.setVote(_i).send({ from: this.props.accounts[0] });
    };

    renderProposals () {
        if (!this.props.isVoter) {
            return <div>
                <p>You are not registered. So you can not see the proposals.</p>
            </div>
        } else if (this.props.workflowStatus === '3') {
            // TODO do not propose vote if voter has already voted
            const list = [];
            for (let i = 0; i < this.props.proposalList.length; i++) {
                list.push(
                    <tr><td>{this.props.proposalList[i].description}</td>
                    <td><button onClick={() => this.voteForProposal(i)}>Vote for this proposal</button></td></tr>
                );
            }
            return <table>
                <tbody>
                    {list}
                </tbody>
            </table>
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
                return <div>
                    <p>The vote is open. You can vote for your favorite proposal.</p>
                </div>
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