// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract Escrow {
    address public propertyOwner;
    IERC20 public token;

    struct Offer {
        address buyer;
        uint256 amount;
        uint256 tokenAmount;
        bool refunded;
    }

    mapping(uint256 => Offer[]) public propertyOffers;

    event OfferMade(address indexed buyer, uint256 propertyId, uint256 offerAmount);

    constructor(address tokenAddress) {
        propertyOwner = msg.sender;
        token = IERC20(tokenAddress);
    }

    function makeOffer(uint256 propertyId, uint256 offerAmount, uint256 tokenAmount) public {
        require(propertyId > 0, "Invalid property ID");
        require(offerAmount > 0, "Offer amount must be greater than zero");
        require(tokenAmount > 0, "Token amount must be greater than zero");

        uint256 allowance = token.allowance(msg.sender, address(this));
        require(allowance >= tokenAmount, "Insufficient allowance");

        uint256 balance = token.balanceOf(msg.sender);
        require(balance >= tokenAmount, "Insufficient token balance");

        // Transfer tokens from buyer to escrow
        bool success = token.transferFrom(msg.sender, address(this), tokenAmount);
        require(success, "Token transfer failed");

        propertyOffers[propertyId].push(Offer(msg.sender, offerAmount, tokenAmount, false));

        emit OfferMade(msg.sender, propertyId, offerAmount);
    }

    function acceptOffer(uint256 propertyId, uint256 offerIndex) external {
        require(msg.sender == propertyOwner, "Only owner can accept offer");
        Offer[] storage offers = propertyOffers[propertyId];
        require(offerIndex < offers.length, "Invalid offer index");

        for (uint i = 0; i < offers.length; i++) {
            if (i == offerIndex) {
                token.transfer(propertyOwner, offers[i].tokenAmount);
            } else if (!offers[i].refunded) {
                token.transfer(offers[i].buyer, offers[i].tokenAmount);
                offers[i].refunded = true;
            }
        }
    }
}
