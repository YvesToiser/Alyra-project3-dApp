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
            await this.initWeb3();

            await this.updateWorkflowStatus();

            await this.updateWhitelist();

            await this.updateRoles();

        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }
    };

    initWeb3 = async () => {
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
    };

    updateWorkflowStatus = async () => {
        const workflowStatus = await this.state.contract.methods.workflowStatus().call();
        this.setState({ workflowStatus });
    };

    updateWhitelist = async () => {
        // As there is no option for removal from the whitelist, we can use the event logs.
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

    updateRoles = async () => {
        // check if is owner
        const isOwner = (this.state.accounts.toString() === this.OWNER_ADDRESS);
        this.setState({ isOwner });

        // Check if is voter
        const isVoter = this.state.whitelist.includes(this.state.accounts.toString());
        this.setState({ isVoter });
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
