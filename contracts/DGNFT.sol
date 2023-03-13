//SPDX-License-Identifier: MIT
pragma solidity ^0.8.1;

import "@openzeppelin/contracts/token/ERC721/ERC721.sol";
import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract DGNFT is ERC721URIStorage, Ownable{
    mapping(uint256 => address[]) private tokensHistory;
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIds;
    constructor() public ERC721("DGNFT","DGNFT"){}
    function mintNFT(address user, string memory tokenURI) public onlyOwner returns(uint256){
        _tokenIds.increment();

        uint256 newItemId = _tokenIds.current();
        //_mint(msg.sender, newItemId);
        _mint(user, newItemId);
        _setTokenURI(newItemId, tokenURI);

        return newItemId;
    }

    function transferInfo(uint256 tokenId) public view returns(address[] memory){
        return tokensHistory[tokenId];
    }

    function _afterTokenTransfer(
        address from,
        address to,
        uint256 tokenId
    ) internal virtual override {
        tokensHistory[tokenId].push(to);
        super._afterTokenTransfer(from, to, tokenId);
    }
}
