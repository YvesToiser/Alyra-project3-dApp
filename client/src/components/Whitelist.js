import React from 'react';

export default class Whitelist extends React.Component {

    addVoter = async () => {
        let voterAddress = document.getElementById("addVoterButton").value;
        if (voterAddress.match(/^0x[a-fA-F0-9]{40}$/)) {
            await this.props.contract.methods.addVoter(voterAddress).send({from: this.props.accounts[0]});
            await this.props.onWhitelistChange();
        } else {
            // show error message
        }
        document.getElementById('addVoterButton').value = "";
    };

    renderWhitelistManagement() {
        if(this.props.isOwner) {
            if (this.props.workflowStatus === '0') {
                return <div>
                    <h3>Whitelist Management : </h3>
                    <input type="text" id="addVoterButton"/>
                    <button onClick={this.addVoter}>Add on Whitelist</button>
                    <p>Here is the list of whitelisted addresses :</p>
                    <table>
                        <tbody>
                        {this.props.whitelist.map((a) => (
                            <tr key={a}><td>{a}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            } else {
                return <div>
                    <h3>Whitelist Management : </h3>
                    <p>Whitelist registration is closed. You can not add voters any more.</p>
                    <p>Here is the list of whitelisted addresses :</p>
                    <table>
                        <tbody>
                        {this.props.whitelist.map((a) => (
                            <tr key={a}><td>{a}</td></tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            }
        }
    }

    renderWhitelistStatus() {
        if(this.props.isVoter) {
            if (this.props.workflowStatus === '5') {
                const list = [];
                list.push(<tr><td>Voter address</td><td>vote</td></tr>);
                for (let i = 0; i < this.props.voteList.length; i++) {
                    console.log('this.props.voteList[i] => address: ' + this.props.voteList[i].voterAddress);
                    console.log('this.props.voteList[i] => proposalId: ' + this.props.voteList[i].proposalId);
                    list.push(<tr>
                        <td>{this.props.voteList[i].voterAddress.toString()}</td>
                        <td>{this.props.voteList[i].proposalId.toString()}</td>
                    </tr>);
                }
                return <div>
                    <p>You can see how the participants have voted below. Participants who are not in the list below have not voted.</p>
                    <table>
                        <tbody>
                            {list}
                        </tbody>
                    </table>
                </div>
            }
            return <p>"Congratulations! You have been registered in the whitelist. Check the workflow status to see if you can add proposals or vote."</p>
        } else {
            return <p>"You are not registered in the whitelist."</p>
        }
    }

    render(){
        return(
            <div id='whitelist'>
                <h3>Whitelist Status : </h3>
                { this.renderWhitelistStatus() }
                { this.renderWhitelistManagement() }
            </div>
        )
    }
}