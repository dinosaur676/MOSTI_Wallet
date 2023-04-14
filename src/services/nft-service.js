const logger = require("../config/logger");
const nftContract = require("../web3/nftContract");
const { CustomError } = require("../error/CustomError");

const nftService = {
  createAccount: async () => {
    const account = await nftContract.createAccount();
    return account;
  },

  admin_balance: async (balanceDTO) => {
    const data = await nftContract
      .admin_balance(balanceDTO.to, balanceDTO.tokenId)
      .catch((err) => Promise.reject(err));

    return {
      balance: data,
    };
  },

  admin_mintToken: async (mintDTO) => {
    const data = await nftContract
      .admin_Mint(mintDTO.tokenOwner, mintDTO.to, mintDTO.tokenId)
      .catch((err) => Promise.reject(err));

    return {
      tokenOwner: mintDTO.tokenOwner,
      to: mintDTO.to,
      tokenId: data.events.Mint.returnValues.tokenId,
    };
  },

  admin_burnToken: async (burnDTO) => {
    const data = await nftContract
      .admin_Burn(burnDTO.tokenOwner, burnDTO.to, burnDTO.tokenId)
      .catch((err) => Promise.reject(err));

    return Promise.resolve({
      tokenOwner: burnDTO.tokenOwner,
      to: burnDTO.to,
      tokenId: data.events.Burn.returnValues.tokenId,
    });
  },

  admin_createToken: async (dto) => {
    const data = await nftContract
      .admin_createToken(dto.tokenOwner, JSON.stringify(dto.data))
      .catch((err) => Promise.reject(err));

    return {
      tokenOwner: dto.tokenOwner,
      tokenId: data.events.CreateToken.returnValues.tokenId,
      metaData: data.events.CreateToken.returnValues.tokenURI,
    };
  },

  user_mintToken: async (mintSoulDTO) => {
    const data = await nftContract
      .user_Mint(mintSoulDTO.tokenOwner, mintSoulDTO.to, mintSoulDTO.tokenId)
      .catch((err) => Promise.reject(err));

    return {
      tokenOwner: mintSoulDTO.tokenOwner,
      to: mintSoulDTO.to,
      tokenId: data.events.Mint.returnValues.tokenId,
    };
  },

  user_burnToken: async (burnDTO) => {
    const data = await nftContract
      .user_Burn(burnDTO.to, burnDTO.tokenId)
      .catch((err) => Promise.reject(err));

    return {
      to: burnDTO.to,
      tokenId: data.events.Burn.returnValues.tokenId,
    };
  },

  user_createToken: async (dto) => {
    const data = await nftContract
      .user_createToken(dto.tokenOwner, JSON.stringify(dto.data))
      .catch((err) => Promise.reject(err));

    return {
      tokenOwner: data.to,
      tokenId: data.events.CreateToken.returnValues.tokenId,
      metaData: data.events.CreateToken.returnValues.tokenURI,
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
