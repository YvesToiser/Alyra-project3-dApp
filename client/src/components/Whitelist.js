import React from 'react';

export default class Whitelist extends React.Component {

    addVoter = async () => {
        let voterAddress = document.getElementById("addVoterButton").value;
        // TODO check if voterAddress is correct format
        await this.props.contract.methods.addVoter(voterAddress).send({ from: this.props.accounts[0] });
        this.props.onWhitelistChange();
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