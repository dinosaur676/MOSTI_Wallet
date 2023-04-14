// SPDX-License-Identifier: Apache-2.0
pragma solidity ^0.8.16;

import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/erc1155/ERC1155.sol";
import "@openzeppelin/contracts/utils/Counters.sol";

contract SBTVirtual is Ownable, ERC1155 {

    constructor(string memory uri) ERC1155(uri) {

    }

    //Token
    using Counters for Counters.Counter;
    Counters.Counter private _tokenIdCounter;

    mapping(uint256 => mapping(address => bool)) _locked;
    mapping(uint256 => address) tokenOwnerOf;
    mapping(uint256 => string) tokenURIs;

    event Locked(address to, uint256 tokenId);
    event Unlocked(address to, uint256 tokenId);
    event CreateToken(address tokenOwner, uint256 tokenId, string tokenURI);

    function _mint(address to, uint256 tokenId, uint256 amount, bytes memory data) override(ERC1155) internal {
        super._mint(to, tokenId, amount, data);
    }

    function _burn(address from, uint256 id, uint256 amount) override(ERC1155) internal {
        super._burn(from, id, amount);
    }

    function createToken(address tokenOwner, string memory tokenURI) external onlyOwner{
        _tokenIdCounter.increment();

        uint256 tokenId = _tokenIdCounter.current();
        super._mint(tokenOwner, tokenId, 1, "");

        tokenOwnerOf[tokenId] = tokenOwner;
        tokenURIs[tokenId] = tokenURI;

        _locked[tokenId][tokenOwner] = true;
        emit Locked(tokenOwner, tokenId);

        emit CreateToken(tokenOwner, tokenId, tokenURI);
    }



    //Transfer, Batch 막아둠
    modifier IsTransferAllowed(address soulOwner, uint256 tokenId) {
        require(!_locked[tokenId][soulOwner]);
        _;
    }

    function _burnBatch(
        address from,
        uint256[] memory ids,
        uint256[] memory amounts
    ) internal virtual override(ERC1155) {}

    function _mintBatch(
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155) {
    }

    function safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) public virtual override (ERC1155) IsTransferAllowed(from, id) {
        super.safeTransferFrom(from, to, id, amount, data);
    }

    function safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) public virtual override (ERC1155) {}

    function _safeTransferFrom(
        address from,
        address to,
        uint256 id,
        uint256 amount,
        bytes memory data
    ) internal virtual override(ERC1155) IsTransferAllowed(from, id) {
        super._safeTransferFrom(from, to, id, amount, data);
    }

    function _safeBatchTransferFrom(
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155) {}

    function _beforeTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155) {}

    function _afterTokenTransfer(
        address operator,
        address from,
        address to,
        uint256[] memory ids,
        uint256[] memory amounts,
        bytes memory data
    ) internal virtual override(ERC1155) {}


}