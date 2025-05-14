// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC721/extensions/ERC721URIStorage.sol";

contract PropertyNFT is ERC721URIStorage {
    uint256 public tokenCounter;

    constructor() ERC721("PropertyNFT", "PROP") {
        tokenCounter = 0;
    }

    function mintProperty(string memory tokenURI) public returns (uint256) {
        uint256 newTokenId = tokenCounter;
        _safeMint(msg.sender, newTokenId);
        _setTokenURI(newTokenId, tokenURI);
        tokenCounter++;
        return newTokenId;
    }

    function transferProperty(address to, uint256 tokenId) public {
        require(ownerOf(tokenId) == msg.sender, "Only owner can transfer property");
        _transfer(msg.sender, to, tokenId);
    }
}
