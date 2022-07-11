import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Address from "./components/Address.js";
import Workflow from "./components/Workflow";
import Whitelist from "./components/Whitelist";


class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        workflowStatus: null,
        isOwner: null,
        isVoter: null,
        whitelist: []
    };

    OWNER_ADDRESS = '0xD98cee544c0B8d808511563B2977242f15650e39';

    componentDidMount = async () => {
        try {
            // Get network provider and web3 instance.
            const web3 = await getWeb3();

            // Use web3 to get the user's accounts.
            const accounts = await web3.eth.getAccounts();

            // Get the contract instance.
            const networkId = await web3.eth.net.getId();
            const deployedNetwork = VotingContract.networks[networkId];
            const contract = new web3.eth.Contract(
                VotingContract.abi,
                deployedNetwork && deployedNetwork.address,
            );

            this.setState({ web3, accounts, contract });

            // get workflow status
            const workflowStatus = await contract.methods.workflowStatus().call();
            this.setState({ workflowStatus });

            // check if is owner
            const isOwner = (accounts.toString() === this.OWNER_ADDRESS);
            console.log("accounts :" + accounts);
            this.setState({ isOwner });
            console.log("main - isOwner" + this.state.isOwner);


            // check if is voter
            let options = {
                fromBlock: 0,
                toBlock: 'latest'
            };
            let voterEventsList = await contract.getPastEvents('VoterRegistered', options);

            voterEventsList.map( (voter) => (
                this.state.whitelist.push(voter.returnValues.voterAddress.toString())
            ));
            const isVoter = this.state.whitelist.includes(accounts.toString());
            this.setState({ isVoter });
            console.log("Main isVoter :" + this.state.isVoter);

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    updateWorkflowStatus = async () => {
        const workflowStatus = await this.state.contract.methods.workflowStatus().call();
        this.setState({ workflowStatus });
    };

    updateWhitelist = async () => {
        // we could just add the new registered voter but retrieving the whole whitelist is more error-proof
        let options = {
            fromBlock: 0,
            toBlock: 'latest'
        };
        let voterEventsList = await this.state.contract.getPastEvents('VoterRegistered', options);
        const whitelist = [];
        voterEventsList.map( (voter) => (
            whitelist.push(voter.returnValues.voterAddress.toString())
        ));
        this.setState({ whitelist });
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <Address addr={this.state.accounts} />
                <Workflow
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    isOwner={this.state.isOwner}
                    onWorkflowChange={this.updateWorkflowStatus}
                />
                <Whitelist
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    isOwner={this.state.isOwner}
                    isVoter={this.state.isVoter}
                    whitelist={this.state.whitelist}
                    onWhitelistChange={this.updateWhitelist}
                />
            </div>
        );
    }
}

export default App;
