const SBTUser = artifacts.require("SBTUser");
const SBTAdmin = artifacts.require("SBTAdmin");

module.exports = function (deployer) {
  deployer.deploy(SBTUser, "");
  deployer.deploy(SBTAdmin, "");
};
