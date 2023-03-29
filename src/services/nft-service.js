const logger = require("../config/logger");
const nftContract = require("../web3/nftContract");
const { CustomError } = require("../error/CustomError");

const nftService = {
  createAccount: async () => {
    const account = await nftContract.createAccount();
    return account;
  },

  admin_mintToken: async (mintDTO) => {
    const data = await nftContract.admin_Mint(
      mintDTO.tokenOwner,
      mintDTO.to,
      mintDTO.tokenId
    );

    if (data === undefined) return { Error: "Required" };

    return {
      tokenOwner: mintDTO.tokenOwner,
      to: data.to,
      tokenId: data.events.Mint.returnValues.tokenId,
    };
  },

  admin_burnToken: async (burnDTO) => {
    const data = await nftContract.admin_Burn(
      burnDTO.tokenOwner,
      burnDTO.to,
      burnDTO.tokenId
    );

    if (data === undefined) return { Error: "Required" };

    return {
      tokenOwner: burnDTO.tokenOwner,
      to: data.to,
      tokenId: data.events.Burn.returnValues.tokenId,
    };
  },

  admin_createToken: async (address) => {
    const data = await nftContract.admin_createToken(address);

    return {
      tokenOwner: data.to,
      tokenId: data.events.CreateToken.returnValues.tokenId,
    };
  },

  user_mintToken: async (mintSoulDTO) => {
    const data = await nftContract.user_Mint(
      mintSoulDTO.tokenOwner,
      mintSoulDTO.to,
      mintSoulDTO.tokenId
    );

    return {
      tokenOwner: mintSoulDTO.tokenOwner,
      to: data.to,
      tokenId: data.events.Mint.returnValues.tokenId,
    };
  },

  user_burnToken: async (burnDTO) => {
    const data = await nftContract.user_Burn(burnDTO.to, burnDTO.tokenId);

    return {
      to: data.to,
      tokenId: data.events.Burn.returnValues.tokenId,
    };
  },

  user_createToken: async (address) => {
    const data = await nftContract.user_createToken(address);

    return {
      tokenOwner: data.to,
      tokenId: data.events.CreateToken.returnValues.tokenId,
    };
  },

  getTransactionInfo: async (transactionHash) => {
    const { transferData, hexTransactionData, blockDateTime } =
      await nftContract.getTransactionInfo(transactionHash);

    return {
      blockHash: hexTransactionData.blockHash,
      blockNumber: hexTransactionData.blockNumber,
      txId: hexTransactionData.transactionHash,
      from: transferData.from,
      to: transferData.to,
      tokenId: transferData.tokenId,
      blockDateTime,
    };
  },
};

module.exports = nftService;
