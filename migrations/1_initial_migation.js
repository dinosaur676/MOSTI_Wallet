/// /////// 1_initial_migration.js /////////
/* const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const Migrations = artifacts.require("GLDToken");

module.exports = async function (deployer) {
  const instance = await deployProxy(Migrations(12000), [42], { deployer });
  console.log('Deployed', instance);
}; */

const Web3 = require("web3");
const accounts = require("@openzeppelin/cli/lib/scripts/accounts");
const truffleConfig = require("../truffle-config");

const web3 = new Web3(
  new Web3.providers.HttpProvider(
    `http://${truffleConfig.networks.development.host}:${truffleConfig.networks.development.port}`
  )
);

/* const AToken = artifacts.require("AToken");
module.exports = function(deployer) {
  deployer.deploy(AToken,web3.utils.toWei(web3.utils.toBN(21000000),"ether"));
}; */

const UserRightNFT = artifacts.require("UserRightNFT");
module.exports = function (deployer) {
  deployer.deploy(UserRightNFT);
};

/* const DGToken = artifacts.require("DGToken");
module.exports = function (deployer) {
  deployer.deploy(DGToken);
}; */

/*
const MTNFT = artifacts.require("MTNFT");
module.exports = function (deployer) {
  deployer.deploy(MTNFT);
};
*/
