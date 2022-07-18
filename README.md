# Alyra - Blockchain developer - Project 3 - dApps - Yves Toiser

## Description
This is the third project from the Alyra training for blockchain developer.

## Tech
- Solidity - Smart contract language
- openzeppelin - contracts 
- Truffle - Development environment
- Ganache - local blockchain server
- web3.js - javascript library for blockchain integration
- React.js - javascript front-end library
- Node.js - javascript server
- GitHub Pages - Deployment tool
- Metamask - Browser wallet

## Tasks
### Smart Contract
 - Fix security issues on Voting.sol (loop gas limit + receive, fallback & withdraw functions)
 - Add NatSpecs to Voting.sol
 - Follow Solidity code style guidelines
### Front-end
 - Use the Truffle React Box
 - Build React dApp with all functionality
### Deployment
 - Deploy the app (using GitHub Pages)
### Video
 - Make a video to present the dApp
 
## Links
### dApp 
 - https://yvestoiser.github.io/Alyra-project3-dApp/
### Video Demo
Full length video (14 minutes) :
 - https://www.youtube.com/watch?v=53ZeS4y3iII      
 
Short video (4 minutes 30) :
 - https://www.youtube.com/watch?v=fZApgszuVso

## Tests
### Manual Test
You can test this dApp on Ropsten network.

### Unit tests
Unit test from the project #2 are still present. You can find below the documentation of these tests.

## Tech
- Solidity - Smart contract language
- Truffle - Development environment
- Ganache - local blockchain server
- web3.js - javascript library for blockchain integration
- Mocha - test Framework
- Chai - test assertion library
- openzeppelin - contracts and test helpers
- eth-gas-reporter - gas reporter
- Node.js - javascript server

## How to
- You need to have node.js installed
- run a local blockchain server
```sh
ganache
```
- in another terminal run the test script
```sh
truffle test
```

## Tests results
Contract: Voting.   46 tests.

### List of tests

    GETTERS
      getVoter
        ✓ should returns voters correctly (16ms)
        ✓ should not return voters to unregistered voter. (368ms)
      getOneProposal
        ✓ should return one proposal correctly (57ms, 124453 gas)
        ✓ should not return one proposal to unregistered voter (5ms)
    REGISTRATION
      ✓ should add voter correctly (23ms, 50196 gas)
      ✓ should add a lot of voters correctly (221ms, 401568 gas)
      ✓ should not add voter if not by owner (42ms, 49004 gas)
      ✓ should not add voter if not in specific workflow status (RegisteringVoters) (35ms, 74384 gas)
      ✓ should not add voter if already registered (22ms, 28980 gas)
      ✓ should emit appropriate event when registering voter (18ms, 50196 gas)
    PROPOSAL
      ✓ should add proposal correctly (47ms, 124453 gas)
      ✓ should add multiple proposal correctly from multiple voters (315ms, 912745 gas)
      ✓ should not add proposal if not in specific workflow status (ProposalsRegistrationStarted) (20ms, 27490 gas)
      ✓ should not add empty proposal (36ms, 75628 gas)
      ✓ should not add if not by registered voter (35ms, 72932 gas)
      ✓ should emit appropriate event when adding proposal (34ms, 124453 gas)
    VOTE
      ✓ should not vote if not registered (30ms, 54699 gas)
      ✓ should not vote if not in the appropriate workflow (19ms, 26398 gas)
      ✓ should not vote if you have already voted (74ms, 135239 gas)
      ✓ should not vote if the proposal does not exist (38ms, 59357 gas)
      ✓ should record vote properly (52ms, 108543 gas)
      ✓ should increase proposal vote count (86ms, 108543 gas)
      ✓ should emit the vote event (85ms, 108543 gas)
    STATE
      only owner
        ✓ should not start proposal registering if not by the owner (15ms, 23804 gas)
        ✓ should not end proposal registering if not by the owner (32ms, 71479 gas)
        ✓ should not start voting session if not by the owner (45ms, 102009 gas)
        ✓ should not end voting session if not by the owner (57ms, 132518 gas)
        ✓ should not tally votes if not by the owner (68ms, 163072 gas)
      wrong workflow
        ✓ should not start proposal registering if not in the right workflow (27ms, 73686 gas)
        ✓ should not end proposal registering if not in the right workflow (18ms, 26055 gas)
        ✓ should not start voting session if not in the right workflow (27ms, 73663 gas)
        ✓ should not end voting session if not in the right workflow (40ms, 104217 gas)
        ✓ should not tally votes if not in the right workflow (47ms, 134792 gas)
      Workflow changes
        ✓ should change workflow status to ProposalsRegistrationStarted (18ms, 47653 gas)
        ✓ should change workflow status to ProposalsRegistrationEnded (26ms, 78228 gas)
        ✓ should change workflow status to VotingSessionStarted (38ms, 108758 gas)
        ✓ should change workflow status to VotingSessionEnded (50ms, 139267 gas)
        ✓ should change workflow status to VotesTallied (56ms, 174188 gas)
      Emit event
        ✓ should emit event when changing workflow from RegisteringVoters to ProposalsRegistrationStarted (14ms, 47653 gas)
        ✓ should emit event when changing workflow from ProposalsRegistrationStarted to ProposalsRegistrationEnded (28ms, 78228 gas)
        ✓ should emit event when changing workflow from ProposalsRegistrationEnded to VotingSessionStarted (35ms, 108758 gas)
        ✓ should emit event when changing workflow from VotingSessionStarted to VotingSessionEnded (37ms, 139267 gas)
        ✓ should emit event when changing workflow from VotingSessionEnded to VotesTallied (60ms, 174188 gas)
      Winning Proposal ID 
        ✓ should return the right winning proposal ID. Case #1 (219ms, 693659 gas)
        ✓ should return the right winning proposal ID. Case #2 (179ms, 673747 gas)
        ✓ should return the right winning proposal ID. Case #3. Ex-aequo. (183ms, 696479 gas)

### eth-gas-reporter

- Solc version: 0.8.13+commit.abaa5c0e
- Optimizer enabled: false 
- Runs: 200
- Block limit: 6718946 gas

| Methods | | | | | |
| ------ | ------ | ------ | ------ | ------ | ------ |
| Contract | Method | Min | Max | Avg | # calls |  
| Voting | addProposal | 59700 | 76800 | 64800 | 57 |
| Voting | addVoter | - | - | 50196 | 91 |
| Voting | endProposalsRegistering | - | - | 30575 | 25 |
| Voting | endVotingSession | - | - | 30509 | 10 |
| Voting | setVote | 41001 | 78013 | 68209 | 34 |
| Voting | startProposalsRegistering | - | - | 47653 | 37 |
| Voting | startVotingSession | - | - | 30530 | 20 |
| Voting | tallyVotes | 34921 | 66453 | 52435 | 9 |
| Deployments |  |  |  |  | % of limit |
| Voting |  | - | - | 2137238 | 31.8 %  |

## Ideas for more tests
- Test with wrong types entry. For each function that takes a parameter, you can try to call it with a parameter from a wrong type.
- Test all workflowStatus require. For each require of a specific workflow status, you can test it in each workflow status.
- Add more complex scenario when you pursue after some errors to be sure that all tasks are still performed correctly even after triggering errors.
