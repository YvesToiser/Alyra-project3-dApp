// SPDX-License-Identifier: MIT
pragma solidity 0.8.13;

import "@openzeppelin/contracts/access/Ownable.sol";

/// @title Alyra project #3 Voting dApp
/// @author Yves Toiser (yves.toiser@pm.me)
contract Voting is Ownable {

    struct Voter {
        bool isRegistered;
        bool hasVoted;
        uint votedProposalId;
    }

    struct Proposal {
        string description;
        uint voteCount;
    }

    enum  WorkflowStatus {
        RegisteringVoters,
        ProposalsRegistrationStarted,
        ProposalsRegistrationEnded,
        VotingSessionStarted,
        VotingSessionEnded,
        VotesTallied
    }

    uint128 public winningProposalID;
    uint128 highestVoteCount;

    WorkflowStatus public workflowStatus;
    Proposal[] proposalsArray;
    mapping (address => Voter) voters;

    event VoterRegistered(address voterAddress);
    event WorkflowStatusChange(WorkflowStatus previousStatus, WorkflowStatus newStatus);
    event ProposalRegistered(uint proposalId);
    event Voted (address voter, uint proposalId);
    event LogBadCall(address user);
    event LogDepot(address user, uint quantity);

    /**
     * @dev This modifier check if the sender is registered on the whitelist.
     */
    modifier onlyVoters() {
        require(voters[msg.sender].isRegistered, "You're not a voter");
        _;
    }

    /**
     * @dev receive function will emit event in case of ether sent to the contract.
     */
    receive() external payable {
        emit LogDepot(msg.sender, msg.value);
    }

    /**
     * @dev fallback function will emit event in case of bad call of the contract.
     */
    fallback() external {
        emit LogBadCall(msg.sender);
    }

    /**
     * @notice returns a voter.
     *
     * @dev onlyVoters.
     *
     * @param _addr the address of the voter you want to get.
     *
     * @return Voter The voter.
     *
     */
    function getVoter(address _addr) external onlyVoters view returns (Voter memory) {
        return voters[_addr];
    }

    /**
     * @notice returns a proposal.
     *
     * @dev onlyVoters.
     *
     * @param _id the proposal id you want to get.
     *
     * @return Proposal The proposal.
     *
     */
    function getOneProposal(uint _id) external onlyVoters view returns (Proposal memory) {
        return proposalsArray[_id];
    }

    /**
     * @notice Add a voter to the whitelist.
     *
     * @dev Will emit appropriate event. onlyOwner.
     *
     * @param _addr the address of the voter that the owner is adding to the whitelist.
     */
    function addVoter(address _addr) external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Voters registration is not open yet");
        require(voters[_addr].isRegistered != true, "Already registered");

        voters[_addr].isRegistered = true;
        emit VoterRegistered(_addr);
    }

    /**
     * @notice Add a proposal.
     *
     * @dev Will emit appropriate event. Proposal can not be empty string. onlyVoter.
     *
     * @param _desc the proposal description chosen by the voter.
     */
    function addProposal(string memory _desc) external onlyVoters {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Proposals are not allowed yet");
        require(keccak256(abi.encode(_desc)) != keccak256(abi.encode("")), "You can not propose an empty proposal");

        Proposal memory proposal;
        proposal.description = _desc;
        proposalsArray.push(proposal);
        emit ProposalRegistered(proposalsArray.length-1);
    }

    /**
     * @notice Perform the vote of the voter.
     *
     * @dev We set a temporary winning proposal id to prevent making a loop in tally vote and fix security breach.
     * onlyVoter. Will emit appropriate event.
     *
     * @param _id the proposal id chosen by the voter.
     */
    function setVote(uint128 _id) external onlyVoters {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session have not started yet");
        require(voters[msg.sender].hasVoted != true, "You have already voted");
        require(_id < proposalsArray.length, "Proposal not found");

        voters[msg.sender].votedProposalId = _id;
        voters[msg.sender].hasVoted = true;
        proposalsArray[_id].voteCount++;

        if (proposalsArray[_id].voteCount > highestVoteCount) {
            highestVoteCount = uint128(proposalsArray[_id].voteCount);
            winningProposalID = _id;
        }

        emit Voted(msg.sender, _id);
    }

    /**
     * @notice Advance workflow status to 'ProposalsRegistrationStarted'.
     *
     * @dev Change workflow status and emit relative event. onlyOwner.
     */
    function startProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.RegisteringVoters, "Registering proposals can not be started now");
        workflowStatus = WorkflowStatus.ProposalsRegistrationStarted;
        emit WorkflowStatusChange(WorkflowStatus.RegisteringVoters, WorkflowStatus.ProposalsRegistrationStarted);
    }

    /**
     * @notice Advance workflow status to 'ProposalsRegistrationEnded'.
     *
     * @dev Change workflow status and emit relative event. onlyOwner.
     */
    function endProposalsRegistering() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationStarted, "Registering proposals have not started yet");
        workflowStatus = WorkflowStatus.ProposalsRegistrationEnded;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationStarted, WorkflowStatus.ProposalsRegistrationEnded);
    }

    /**
     * @notice Advance workflow status to 'VotingSessionStarted'.
     *
     * @dev Change workflow status and emit relative event. onlyOwner.
     */
    function startVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.ProposalsRegistrationEnded, "Registering proposals phase is not finished");
        workflowStatus = WorkflowStatus.VotingSessionStarted;
        emit WorkflowStatusChange(WorkflowStatus.ProposalsRegistrationEnded, WorkflowStatus.VotingSessionStarted);
    }

    /**
     * @notice Advance workflow status to 'VotingSessionEnded'.
     *
     * @dev Change workflow status and emit relative event. onlyOwner.
     */
    function endVotingSession() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionStarted, "Voting session have not started yet");
        workflowStatus = WorkflowStatus.VotingSessionEnded;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionStarted, WorkflowStatus.VotingSessionEnded);
    }

    /**
     * @notice Advance workflow status to 'tallyVotes'.
     *
     * @dev Change workflow status and emit relative event. onlyOwner.
     * Winning proposal id is already determined by setVote function.
     */
    function tallyVotes() external onlyOwner {
        require(workflowStatus == WorkflowStatus.VotingSessionEnded, "Current status is not voting session ended");
        workflowStatus = WorkflowStatus.VotesTallied;
        emit WorkflowStatusChange(WorkflowStatus.VotingSessionEnded, WorkflowStatus.VotesTallied);
    }
}