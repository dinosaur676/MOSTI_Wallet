// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.16;

import "./SBTVirtual.sol";

contract SBTUser is SBTVirtual {

    constructor(string memory uri) SBTVirtual(uri) {

    }

    event Mint(address to, uint256 tokenId);
    event Burn(address to, uint256 tokenId);

    function mintSBT(address to, uint256 tokenId) external onlyOwner {
        require(!_locked[tokenId][to], "already has token");

        super._mint(to, tokenId, 1, "");
        emit Mint(to, tokenId);

        _locked[tokenId][to] = true;
        emit Locked(to, tokenId);
    }

    function burnSBT(address to, uint256 tokenId) external onlyOwner{
        require(tokenOwnerOf[tokenId] != to);
        require(_locked[tokenId][to], "not has token");

        super._burn(to, tokenId, 1);
        emit Burn(to, tokenId);

        _locked[tokenId][to] = false;
        emit Unlocked(to, tokenId);
    }

}