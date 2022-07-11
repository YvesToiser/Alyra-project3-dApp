import React from 'react';

export default class Whitelist extends React.Component {
    state = {
        isOwner: null,
        isVoter: null,
    };

    componentDidMount = async () => {
        const { accounts, contract } = this.props;
        const isOwner = (accounts.toString() === "0xb3470eB2cFEEFc54A4323B3ecB1EA892A8653ABA");
        console.log("isOwner :" + isOwner);
        console.log("accounts :" + accounts);
        this.setState({ isOwner });

        let options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        let voterEventsList = await contract.getPastEvents('VoterRegistered', options);
        const whitelist = [];

        voterEventsList.map( (voter) => (
            whitelist.push(voter.returnValues.voterAddress.toString())
        ));
        const isVoter = whitelist.includes(accounts.toString());
        this.setState({ isVoter });
        console.log("isVoter :" + this.state.isVoter);

    };

    addVoter = async () => {
        const { accounts, contract } = this.props;
        let voterAddress = document.getElementById("addVoterButton").value;
        // TODO check if voterAddress is correct format
        const transaction = await contract.methods.addVoter(voterAddress).send({ from: accounts[0] });
        console.log(transaction);
        console.log("Add Voter : " + transaction.events.VoterRegistered.returnValues.voterAddress);
    };

    renderWhitelistManagement() {
        console.log("this.state.isOwner :" + this.state.isOwner);
        console.log("this.props.workflowStatus :" + this.props.workflowStatus);
        console.log(typeof (this.props.workflowStatus));
        if(this.state.isOwner && this.props.workflowStatus === '0') {
            return <div>
                <input type="text" id="addVoterButton"/>
                <button onClick={this.addVoter}>Add on Whitelist</button>
            </div>
        }
    }

    renderWhitelistStatus() {
        if(this.state.isVoter) {
            return <p>"Congratulations! You have been registered in the whitelist. Check the workflow status to see if you can add proposals or vote."</p>
        } else {
            return <p>"You are not registered in the whitelist."</p>
        }
    }

    render(){
        return(
            <div id='whitelist'>
                <p>Whitelist : </p>
                { this.renderWhitelistStatus() }
                { this.renderWhitelistManagement() }
            </div>
        )
    }

}