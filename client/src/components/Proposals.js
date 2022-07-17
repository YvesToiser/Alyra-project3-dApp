import React from 'react';

export default class Proposals extends React.Component {

    addProposal = async () => {
        let proposalDescription = document.getElementById("addProposalButton").value;
        if (proposalDescription.match(/.*\S.*/)) {
            await this.props.contract.methods.addProposal(proposalDescription).send({ from: this.props.accounts[0] });
            await this.props.onProposalChange();
        } else {
            // show error message
        }
        document.getElementById('addProposalButton').value = "";
    };

    voteForProposal = async (_i) => {
        if (!this.props.hasVoted) {
            await this.props.contract.methods.setVote(_i).send({ from: this.props.accounts[0] });
            await this.props.onVoteChange();
        }
    };

    renderProposals () {
        const proposalList =
        <table className='whitelistTable'>
            <tbody className='tableBody'>
            {this.props.proposalList.map((prop) => (
                <tr>
                    <td>{prop.description}</td>
                </tr>
            ))}
            </tbody>
        </table>;

        if (this.props.isVoter){
            if (this.props.workflowStatus === '0' || this.props.workflowStatus === '1' || this.props.workflowStatus === '2') {
                return <div>
                    <p>You are registered but the vote has not opened yet. </p>
                    {proposalList}
                </div>
            }
            if (this.props.workflowStatus === '3') {
                if (this.props.hasVoted) {
                    return <div>
                        <p>You are registered and have already voted. Please wait before the results are available. </p>
                        {proposalList}
                    </div>
                } else {
                    const list = [];
                    for (let i = 0; i < this.props.proposalList.length; i++) {
                        list.push(
                            <tr><td>{this.props.proposalList[i].description}</td>
                                <td><button className="button" onClick={() => this.voteForProposal(i)}>Vote for this proposal</button></td></tr>
                        );
                    }
                    return <table className='whitelistTable'>
                        <tbody className='tableBody'>
                        {list}
                        </tbody>
                    </table>
                }
            }
            if (this.props.workflowStatus === '5') {
                return <div>
                    <p>The vote has ended. The winning proposal is : </p>
                    <span id="winner">
                        {this.props.winningProposal}
                    </span>
                </div>
            }
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
                    <button className="button" onClick={this.addProposal}>Add proposal</button>
                </div>
            } else if (this.props.workflowStatus === '2') {
                return <div>
                    <p>The proposal registration has Ended. Vote will start soon.</p>
                </div>
            } else if (this.props.workflowStatus === '3' && !this.props.hasVoted) {
                return <div>
                    <p>The vote is open. You can vote for your favorite proposal.</p>
                </div>
            } else if (this.props.workflowStatus === '4') {
                return <div>
                    <p>The vote has ended. Results will be published soon.</p>
                </div>
            }
        }
    }

    render(){
        return(
            <div id='proposals'>
                <h3>Proposals</h3>
                { this.renderProposalSubmission() }
                { this.renderProposals() }
            </div>
        )
    }
}