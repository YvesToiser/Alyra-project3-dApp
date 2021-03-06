import React, { Component } from "react";
import VotingContract from "./contracts/Voting.json";
import getWeb3 from "./getWeb3";
import Address from "./components/Address.js";
import Workflow from "./components/Workflow";
import Whitelist from "./components/Whitelist";
import Proposals from "./components/Proposals";
import "./App.css";


class App extends Component {
    state = {
        web3: null,
        accounts: null,
        contract: null,
        workflowStatus: null,
        isOwner: null,
        isVoter: null,
        hasVoted: null,
        whitelist: [],
        proposalList: [],
        voteList: [],
        proposalCount: 0,
        winningProposal: null
    };

    OWNER_ADDRESS = '0x00adF40C31239299e5ce1196a89499E6e4e4850c';
    CONTRACT_GENESIS_BLOCK = 0; // In the case of localhost blockchain => 0.

    componentDidMount = async () => {
        try {
            await this.initWeb3();
        } catch (error) {
            // Catch any errors for any of the above operations.
            alert(
                `Failed to load web3, accounts, or contract. Check console for details.`,
            );
            console.error(error);
        }

        await this.updateWorkflowStatus();

        await this.updateWhitelist();

        await this.updateRoles();

        await this.updateProposalList();
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
        const workflowStatus = await this.state.contract.methods.workflowStatus().call({ from: this.state.accounts[0] });
        this.setState({ workflowStatus });
        if (workflowStatus === '5') {
            await this.setWinner();
        }
    };

    updateWhitelist = async () => {
        // As there is no option for removal from the whitelist, we can use the event logs.
        // It is safest to check all the events history.
        // To avoid browsing all the blockchain we will start from the block when the contract is launched.
        let options = {
            fromBlock: this.CONTRACT_GENESIS_BLOCK,
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

        // Check if voter has already voted
        await this.updateVoteStatus();
    };

    updateVoteStatus = async () => {
        // As there is no cancellation of vote, we can use the event logs.
        // It is safest to check all the events history.
        // To avoid browsing all the blockchain we will start from the block when the contract is launched.
        let options = {
            fromBlock: this.CONTRACT_GENESIS_BLOCK,
            toBlock: 'latest'
        };
        let votesEventsList = await this.state.contract.getPastEvents('Voted', options);
        let hasVoted = false;
        let voteList = [];
        for (let i = 0; i < votesEventsList.length; i++) {
            if (votesEventsList[i].returnValues.voter.toString() === this.state.accounts[0]) {
                hasVoted = true;
            }
            const proposalId = votesEventsList[i].returnValues.proposalId.toString()
            const proposal = await this.state.contract.methods.getOneProposal(proposalId).call({from: this.state.accounts[0]});
            voteList.push({
                voterAddress : votesEventsList[i].returnValues.voter.toString(),
                proposal : proposal.description
            })
        }
        this.setState({hasVoted, voteList});
    };

    updateProposalList = async () => {
        // As there is no option to remove a proposal, we can use the event logs.
        // It is safest to check all the events history.
        // To avoid browsing all the blockchain we will start from the block when the contract is launched.
        if (this.state.isVoter) {
            let options = {
                fromBlock: this.CONTRACT_GENESIS_BLOCK,
                toBlock: 'latest'
            };
            let proposalEventsList = await this.state.contract.getPastEvents('ProposalRegistered', options);
            let proposalCount = proposalEventsList.length;
            this.setState({ proposalCount });
            const proposalList = [];
            for (let i = 0; i < this.state.proposalCount; i++) {
                const result = await this.state.contract.methods.getOneProposal(i).call({from: this.state.accounts[0]});
                proposalList.push(result);
            }
            this.setState({ proposalList });
        }
    };

    setWinner = async () => {
        const winnerId = await this.state.contract.methods.winningProposalID().call({ from: this.state.accounts[0] });
        const winningProposal = await this.state.contract.methods.getOneProposal(winnerId).call({ from: this.state.accounts[0] });
        this.setState({ winningProposal: winningProposal.description });
    };

    render() {
        if (!this.state.web3) {
            return <div>Loading Web3, accounts, and contract...</div>;
        }
        return (
            <div className="App">
                <div id='header'>
                    <Address
                        address={this.state.accounts}
                        web3={this.state.web3}
                    />
                </div>
                <Workflow
                    workflowStatus={this.state.workflowStatus}
                    accounts={this.state.accounts}
                    contract={this.state.contract}
                    isOwner={this.state.isOwner}
                    onWorkflowChange={this.updateWorkflowStatus}
                />
                <div id='container'>
                    <Whitelist
                        workflowStatus={this.state.workflowStatus}
                        accounts={this.state.accounts}
                        contract={this.state.contract}
                        isOwner={this.state.isOwner}
                        isVoter={this.state.isVoter}
                        whitelist={this.state.whitelist}
                        voteList={this.state.voteList}
                        onWhitelistChange={this.updateWhitelist}
                    />
                    <Proposals
                        workflowStatus={this.state.workflowStatus}
                        accounts={this.state.accounts}
                        contract={this.state.contract}
                        isVoter={this.state.isVoter}
                        hasVoted={this.state.hasVoted}
                        proposalList={this.state.proposalList}
                        winningProposal={this.state.winningProposal}
                        onProposalChange={this.updateProposalList}
                        onVoteChange={this.updateVoteStatus}
                    />
                </div>
            </div>
        );
    }
}

export default App;
