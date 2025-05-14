// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
}

contract Escrow {
    address public propertyOwner;
    address public tokenAddress;

    struct Offer {
        address buyer;
        uint256 amount;
        uint256 tokenAmount;
        bool refunded;
    }

    mapping(uint256 => Offer[]) public propertyOffers;

    constructor(address _tokenAddress) {
        propertyOwner = msg.sender;
        tokenAddress = _tokenAddress;
    }

    function makeOffer(uint256 propertyId, uint256 offerAmount, uint256 tokenAmount) external {
        require(tokenAmount > 0, "Token amount must be greater than zero");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount);
        propertyOffers[propertyId].push(Offer(msg.sender, offerAmount, tokenAmount, false));
    }

    function acceptOffer(uint256 propertyId, uint256 offerIndex) external {
        require(msg.sender == propertyOwner, "Only owner can accept offer");
        Offer[] storage offers = propertyOffers[propertyId];
        require(offerIndex < offers.length, "Invalid offer index");

        for (uint i = 0; i < offers.length; i++) {
            if (i == offerIndex) {
                IERC20(tokenAddress).transfer(propertyOwner, offers[i].tokenAmount);
            } else if (!offers[i].refunded) {
                IERC20(tokenAddress).transfer(offers[i].buyer, offers[i].tokenAmount);
                offers[i].refunded = true;
            }
        }
    }
}
