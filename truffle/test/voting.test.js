const { BN, expectRevert, expectEvent } = require('@openzeppelin/test-helpers');
const { expect } = require('chai');
const Voting = artifacts.require('Voting');

contract('Voting', function (accounts) {

    const owner = accounts[0];
    const registeredVoter = accounts[1];
    const unregistered = accounts[2];
    const toBeRegistered = accounts[3];
    const willBeRegistered = accounts[4];
    const canNotBeRegistered = accounts[5];
    const proposalDescription1 = "proposal description # 1";
    const proposalDescription2 = "proposal description # 2";
    const proposalDescription3 = "proposal description # 3";
    const proposalDescription4 = "proposal description # 4";
    const proposalDescription5 = "proposal description # 5";
    const proposalDescription6 = "proposal description # 6";
    const proposalDescription7 = "proposal description # 7";
    const proposalDescription8 = "proposal description # 8";
    const proposalDescription9 = "proposal description # 9";
    const proposalDescription10 = "proposal description # 10";
    const emptyProposalDescription = "";
    const zero = new BN(0);
    const one = new BN(1);
    const two = new BN(2);
    const three = new BN(3);
    const someVoteId = new BN(2);
    const otherVoteId = new BN(3);
    const inexistantProposalId = new BN(8);
    const WF0 = new BN(Voting.WorkflowStatus.RegisteringVoters);
    const WF1 = new BN(Voting.WorkflowStatus.ProposalsRegistrationStarted);
    const WF2 = new BN(Voting.WorkflowStatus.ProposalsRegistrationEnded);
    const WF3 = new BN(Voting.WorkflowStatus.VotingSessionStarted);
    const WF4 = new BN(Voting.WorkflowStatus.VotingSessionEnded);
    const WF5 = new BN(Voting.WorkflowStatus.VotesTallied);

    beforeEach(async function () {
        this.VotingInstance = await Voting.new({from: owner});
        await this.VotingInstance.addVoter(registeredVoter, {from: owner});
    });

    describe('GETTERS', () => {

        describe('getVoter', () => {

            it('should returns voters correctly', async function () {
                const result  = await this.VotingInstance.getVoter.call(registeredVoter, {from: registeredVoter});
                expect(result.isRegistered).to.equal(true);
                const result2  = await this.VotingInstance.getVoter.call(unregistered, {from: registeredVoter});
                expect(result2.isRegistered).to.equal(false);
            });

            it('should not return voters to unregistered voter.', async function () {
                await expectRevert(this.VotingInstance.getVoter.call(registeredVoter, {from: unregistered}),
                    "You're not a voter");
            });
        });

        describe('getOneProposal', () => {

            it('should return one proposal correctly', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.addProposal(proposalDescription1, {from: registeredVoter});
                const result  = await this.VotingInstance.getOneProposal.call(0, {from: registeredVoter});
                expect(result.description).to.equal(proposalDescription1);
                expect(result.voteCount).to.be.bignumber.equal(zero);
            });

            it('should not return one proposal to unregistered voter', async function () {
                await expectRevert(this.VotingInstance.getOneProposal.call(0, {from: unregistered}),
                    "You're not a voter");
            });
        });
    });

    describe('REGISTRATION', () => {

        it('should add voter correctly', async function () {
            await this.VotingInstance.addVoter(toBeRegistered, {from: owner});
            const result  = await this.VotingInstance.getVoter.call(toBeRegistered, {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);
        });

        it('should add a lot of voters correctly', async function () {
            await this.VotingInstance.addVoter(accounts[2], {from: owner});
            await this.VotingInstance.addVoter(accounts[3], {from: owner});
            await this.VotingInstance.addVoter(accounts[4], {from: owner});
            await this.VotingInstance.addVoter(accounts[5], {from: owner});
            await this.VotingInstance.addVoter(accounts[6], {from: owner});
            await this.VotingInstance.addVoter(accounts[7], {from: owner});
            await this.VotingInstance.addVoter(accounts[8], {from: owner});
            await this.VotingInstance.addVoter(accounts[9], {from: owner});

            let result  = await this.VotingInstance.getVoter.call(accounts[1], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[2], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[3], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[4], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[5], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[6], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[7], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[8], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);

            result  = await this.VotingInstance.getVoter.call(accounts[9], {from: registeredVoter});
            expect(result.isRegistered).to.equal(true);
        });

        it('should not add voter if not by owner', async function () {
            await expectRevert(this.VotingInstance.addVoter(canNotBeRegistered, {from: registeredVoter}),
                "Ownable: caller is not the owner");

            await expectRevert(this.VotingInstance.addVoter(canNotBeRegistered, {from: unregistered}),
                "Ownable: caller is not the owner");
        });

        it('should not add voter if not in specific workflow status (RegisteringVoters)', async function () {
            await this.VotingInstance.startProposalsRegistering({from: owner});
            await expectRevert(this.VotingInstance.addVoter(toBeRegistered, {from: owner}),
                "Voters registration is not open yet");
        });

        it('should not add voter if already registered', async function () {
            await expectRevert(this.VotingInstance.addVoter(registeredVoter, {from: owner}),
                "Already registered");
        });

        it('should emit appropriate event when registering voter', async function () {
            const result = await this.VotingInstance.addVoter(willBeRegistered, {from: owner});
            expectEvent(result, 'VoterRegistered', {voterAddress : willBeRegistered});
        });
    });

    describe('PROPOSAL', () => {

        it('should add proposal correctly', async function () {
            await this.VotingInstance.startProposalsRegistering({from: owner});
            await this.VotingInstance.addProposal(proposalDescription1, {from: registeredVoter});
            const result  = await this.VotingInstance.getOneProposal.call(0, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription1);
        });

        it('should add multiple proposal correctly from multiple voters', async function () {
            await this.VotingInstance.addVoter(accounts[2], {from: owner});
            await this.VotingInstance.addVoter(accounts[3], {from: owner});
            await this.VotingInstance.addVoter(accounts[4], {from: owner});
            await this.VotingInstance.addVoter(accounts[5], {from: owner});
            await this.VotingInstance.addVoter(accounts[6], {from: owner});
            await this.VotingInstance.startProposalsRegistering({from: owner});

            await this.VotingInstance.addProposal(proposalDescription1, {from: accounts[5]});
            await this.VotingInstance.addProposal(proposalDescription2, {from: accounts[2]});
            await this.VotingInstance.addProposal(proposalDescription3, {from: accounts[6]});
            await this.VotingInstance.addProposal(proposalDescription4, {from: accounts[4]});
            await this.VotingInstance.addProposal(proposalDescription5, {from: accounts[6]});
            await this.VotingInstance.addProposal(proposalDescription6, {from: accounts[3]});
            await this.VotingInstance.addProposal(proposalDescription7, {from: accounts[6]});
            await this.VotingInstance.addProposal(proposalDescription8, {from: accounts[4]});
            await this.VotingInstance.addProposal(proposalDescription9, {from: accounts[2]});
            await this.VotingInstance.addProposal(proposalDescription10, {from: accounts[6]});

            let result  = await this.VotingInstance.getOneProposal.call(0, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription1);

            result  = await this.VotingInstance.getOneProposal.call(1, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription2);

            result  = await this.VotingInstance.getOneProposal.call(2, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription3);

            result  = await this.VotingInstance.getOneProposal.call(3, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription4);

            result  = await this.VotingInstance.getOneProposal.call(4, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription5);

            result  = await this.VotingInstance.getOneProposal.call(5, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription6);

            result  = await this.VotingInstance.getOneProposal.call(6, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription7);

            result  = await this.VotingInstance.getOneProposal.call(7, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription8);

            result  = await this.VotingInstance.getOneProposal.call(8, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription9);

            result  = await this.VotingInstance.getOneProposal.call(9, {from: registeredVoter});
            expect(result.description).to.equal(proposalDescription10);
        });

        it('should not add proposal if not in specific workflow status (ProposalsRegistrationStarted)', async function () {
            await expectRevert(this.VotingInstance.addProposal(proposalDescription1, {from: registeredVoter}),
                "Proposals are not allowed yet");
        });

        it('should not add empty proposal', async function () {
            await this.VotingInstance.startProposalsRegistering({from: owner});
            await expectRevert(this.VotingInstance.addProposal(emptyProposalDescription, {from: registeredVoter}),
                "Vous ne pouvez pas ne rien proposer");
        });

        it('should not add if not by registered voter', async function () {
            await this.VotingInstance.startProposalsRegistering({from: owner});
            await expectRevert(this.VotingInstance.addProposal(proposalDescription1, {from: unregistered}),
                "You're not a voter");
        });

        it('should emit appropriate event when adding proposal', async function () {
            await this.VotingInstance.startProposalsRegistering({from: owner});
            result = await this.VotingInstance.addProposal(proposalDescription1, {from: registeredVoter});
            expectEvent(result, 'ProposalRegistered', {proposalId : zero});
        });
    });

    describe('VOTE', () => {

        beforeEach(async function () {
            await this.VotingInstance.startProposalsRegistering({from: owner});
            await this.VotingInstance.addProposal(proposalDescription1, {from: registeredVoter});
            await this.VotingInstance.addProposal(proposalDescription2, {from: registeredVoter});
            await this.VotingInstance.addProposal(proposalDescription3, {from: registeredVoter});
            await this.VotingInstance.addProposal(proposalDescription4, {from: registeredVoter});
            await this.VotingInstance.endProposalsRegistering({from: owner});
        });

        it('should not vote if not registered', async function () {
            await this.VotingInstance.startVotingSession({from: owner});
            await expectRevert(this.VotingInstance.setVote(1, {from: unregistered}),
                "You're not a voter");
        });

        it('should not vote if not in the appropriate workflow', async function () {
            await expectRevert(this.VotingInstance.setVote(1, {from: registeredVoter}),
                "Voting session havent started yet");
        });

        it('should not vote if you have already voted', async function () {
            await this.VotingInstance.startVotingSession({from: owner});
            await this.VotingInstance.setVote(1, {from: registeredVoter});
            await expectRevert(this.VotingInstance.setVote(1, {from: registeredVoter}),
                "You have already voted");
        });

        it('should not vote if the proposal does not exist', async function () {
            await this.VotingInstance.startVotingSession({from: owner});
            await expectRevert(this.VotingInstance.setVote(inexistantProposalId, {from: registeredVoter}),
                "Proposal not found");
        });

        it('should record vote properly', async function () {
            await this.VotingInstance.startVotingSession({from: owner});
            let voter = await this.VotingInstance.getVoter.call(registeredVoter, {from: registeredVoter});
            expect(voter.votedProposalId).to.be.bignumber.equal(zero);
            expect(voter.hasVoted).to.be.false;
            await this.VotingInstance.setVote(otherVoteId, {from: registeredVoter});
            voter = await this.VotingInstance.getVoter.call(registeredVoter, {from: registeredVoter});
            expect(voter.votedProposalId).to.be.bignumber.equal(otherVoteId);
            expect(voter.hasVoted).to.be.true;
        });

        it('should increase proposal vote count', async function () {
            await this.VotingInstance.startVotingSession({from: owner});
            let proposal = await this.VotingInstance.getOneProposal.call(otherVoteId, {from: registeredVoter});
            expect(proposal.voteCount).to.be.bignumber.equal(zero);
            await this.VotingInstance.setVote(otherVoteId, {from: registeredVoter});
            proposal = await this.VotingInstance.getOneProposal.call(otherVoteId, {from: registeredVoter});
            expect(proposal.voteCount).to.be.bignumber.equal(one);
        });

        it('should emit the vote event', async function () {
            await this.VotingInstance.startVotingSession({from: owner});
            result = await this.VotingInstance.setVote(someVoteId, {from: registeredVoter});
            expectEvent(result, 'Voted', {voter: registeredVoter, proposalId : someVoteId});
        });
    });

    describe('STATE', () => {

        describe('only owner', () => {

            it('should not start proposal registering if not by the owner', async function () {
                await expectRevert(this.VotingInstance.startProposalsRegistering({from: registeredVoter}),
                    "Ownable: caller is not the owner");
            });

            it('should not end proposal registering if not by the owner', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.endProposalsRegistering({from: registeredVoter}),
                    "Ownable: caller is not the owner");
            });

            it('should not start voting session if not by the owner', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.startVotingSession({from: registeredVoter}),
                    "Ownable: caller is not the owner");
            });

            it('should not end voting session if not by the owner', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await expectRevert(this.VotingInstance.endVotingSession({from: registeredVoter}),
                    "Ownable: caller is not the owner");
            });

            it('should not tally votes if not by the owner', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await this.VotingInstance.endVotingSession({from: owner});
                await expectRevert(this.VotingInstance.tallyVotes({from: registeredVoter}),
                    "Ownable: caller is not the owner");
            });
        });

        describe('wrong workflow', () => {

            it('should not start proposal registering if not in the right workflow', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.startProposalsRegistering({from: owner}),
                    "Registering proposals cant be started now");
            });

            it('should not end proposal registering if not in the right workflow', async function () {
                await expectRevert(this.VotingInstance.endProposalsRegistering({from: owner}),
                    "Registering proposals havent started yet");
            });

            it('should not start voting session if not in the right workflow', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.startVotingSession({from: owner}),
                    "Registering proposals phase is not finished");
            });

            it('should not end voting session if not in the right workflow', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await expectRevert(this.VotingInstance.endVotingSession({from: owner}),
                    "Voting session havent started yet");
            });

            it('should not tally votes if not in the right workflow', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await expectRevert(this.VotingInstance.tallyVotes({from: owner}),
                    "Current status is not voting session ended");
            });
        });

        describe('Workflow changes', () => {

            it('should change workflow status to ProposalsRegistrationStarted', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                const res = await this.VotingInstance.workflowStatus();
                expect(res).to.be.bignumber.equal(WF1);
            });

            it('should change workflow status to ProposalsRegistrationEnded', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                const res = await this.VotingInstance.workflowStatus();
                expect(res).to.be.bignumber.equal(WF2);
            });

            it('should change workflow status to VotingSessionStarted', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                const res = await this.VotingInstance.workflowStatus();
                expect(res).to.be.bignumber.equal(WF3);
            });

            it('should change workflow status to VotingSessionEnded', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await this.VotingInstance.endVotingSession({from: owner});
                const res = await this.VotingInstance.workflowStatus();
                expect(res).to.be.bignumber.equal(WF4);
            });

            it('should change workflow status to VotesTallied', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await this.VotingInstance.endVotingSession({from: owner});
                await this.VotingInstance.tallyVotes({from: owner});
                const res = await this.VotingInstance.workflowStatus();
                expect(res).to.be.bignumber.equal(WF5);
            });
        });

        describe('Emit event', () => {

            it('should emit event when changing workflow from RegisteringVoters to ProposalsRegistrationStarted', async function () {
                const result = await this.VotingInstance.startProposalsRegistering({from: owner});
                expectEvent(result, 'WorkflowStatusChange', {previousStatus : WF0, newStatus : WF1});
            });

            it('should emit event when changing workflow from ProposalsRegistrationStarted to ProposalsRegistrationEnded', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                const result = await this.VotingInstance.endProposalsRegistering({from: owner});
                expectEvent(result, 'WorkflowStatusChange', {previousStatus : WF1, newStatus : WF2});
            });

            it('should emit event when changing workflow from ProposalsRegistrationEnded to VotingSessionStarted', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                const result = await this.VotingInstance.startVotingSession({from: owner});
                expectEvent(result, 'WorkflowStatusChange', {previousStatus : WF2, newStatus : WF3});
            });

            it('should emit event when changing workflow from VotingSessionStarted to VotingSessionEnded', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                const result = await this.VotingInstance.endVotingSession({from: owner});
                expectEvent(result, 'WorkflowStatusChange', {previousStatus : WF3, newStatus : WF4});
            });

            it('should emit event when changing workflow from VotingSessionEnded to VotesTallied', async function () {
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
                await this.VotingInstance.endVotingSession({from: owner});
                const result = await this.VotingInstance.tallyVotes({from: owner});
                expectEvent(result, 'WorkflowStatusChange', {previousStatus : WF4, newStatus : WF5});
            });
        });

        describe('Winning Proposal ID ', () => {

            const voter2 = accounts[2];
            const voter3 = accounts[3];
            const voter4 = accounts[4];
            const voter5 = accounts[5];
            const voter6 = accounts[6];
            const voter7 = accounts[7];
            const voter8 = accounts[8];
            const voter9 = accounts[9];

            beforeEach(async function () {
                await this.VotingInstance.addVoter(voter2, {from: owner});
                await this.VotingInstance.addVoter(voter3, {from: owner});
                await this.VotingInstance.addVoter(voter4, {from: owner});
                await this.VotingInstance.addVoter(voter5, {from: owner});
                await this.VotingInstance.addVoter(voter6, {from: owner});
                await this.VotingInstance.addVoter(voter7, {from: owner});
                await this.VotingInstance.addVoter(voter8, {from: owner});
                await this.VotingInstance.addVoter(voter9, {from: owner});
                await this.VotingInstance.startProposalsRegistering({from: owner});
                await this.VotingInstance.addProposal(proposalDescription1, {from: registeredVoter});
                await this.VotingInstance.addProposal(proposalDescription2, {from: voter2});
                await this.VotingInstance.addProposal(proposalDescription3, {from: voter3});
                await this.VotingInstance.addProposal(proposalDescription4, {from: voter4});
                await this.VotingInstance.endProposalsRegistering({from: owner});
                await this.VotingInstance.startVotingSession({from: owner});
            });

            it('should return the right winning proposal ID. Case #1', async function () {
                await this.VotingInstance.setVote(0, {from: registeredVoter});
                await this.VotingInstance.setVote(1, {from: voter2});
                await this.VotingInstance.setVote(2, {from: voter7});
                await this.VotingInstance.setVote(3, {from: voter3});
                await this.VotingInstance.setVote(1, {from: voter9});
                await this.VotingInstance.setVote(1, {from: voter5});
                await this.VotingInstance.setVote(2, {from: voter8});
                await this.VotingInstance.setVote(1, {from: voter4});
                await this.VotingInstance.setVote(3, {from: voter6});

                await this.VotingInstance.endVotingSession({from: owner});
                await this.VotingInstance.tallyVotes({from: owner});
                const result = await this.VotingInstance.winningProposalID();
                expect(result).to.be.bignumber.equal(one);
            });

            it('should return the right winning proposal ID. Case #2', async function () {
                await this.VotingInstance.setVote(2, {from: registeredVoter});
                await this.VotingInstance.setVote(1, {from: voter2});
                await this.VotingInstance.setVote(0, {from: voter7});
                await this.VotingInstance.setVote(3, {from: voter3});
                await this.VotingInstance.setVote(2, {from: voter9});
                await this.VotingInstance.setVote(3, {from: voter5});
                await this.VotingInstance.setVote(0, {from: voter8});
                await this.VotingInstance.setVote(3, {from: voter4});
                await this.VotingInstance.setVote(3, {from: voter6});

                await this.VotingInstance.endVotingSession({from: owner});
                await this.VotingInstance.tallyVotes({from: owner});
                const result = await this.VotingInstance.winningProposalID();
                expect(result).to.be.bignumber.equal(three);
            });

            it('should return the right winning proposal ID. Case #3. Ex-aequo.', async function () {
                await this.VotingInstance.setVote(2, {from: registeredVoter});
                await this.VotingInstance.setVote(1, {from: voter2});
                await this.VotingInstance.setVote(3, {from: voter7});
                await this.VotingInstance.setVote(3, {from: voter3});
                await this.VotingInstance.setVote(2, {from: voter9});
                await this.VotingInstance.setVote(2, {from: voter5});
                await this.VotingInstance.setVote(3, {from: voter8});
                await this.VotingInstance.setVote(2, {from: voter4});
                await this.VotingInstance.setVote(3, {from: voter6});

                await this.VotingInstance.endVotingSession({from: owner});
                await this.VotingInstance.tallyVotes({from: owner});
                const result = await this.VotingInstance.winningProposalID();
                expect(result).to.be.bignumber.equal(two);
            });
        });
    });
});