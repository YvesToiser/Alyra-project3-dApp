const Voting = artifacts.require("Voting");
const SimpleStorage = artifacts.require("SimpleStorage");

module.exports = function (deployer) {
  deployer.deploy(Voting);
  deployer.deploy(SimpleStorage);
};
