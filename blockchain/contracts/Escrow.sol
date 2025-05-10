// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

interface IERC20 {
    function transferFrom(address sender, address recipient, uint256 amount) external returns (bool);
    function transfer(address recipient, uint256 amount) external returns (bool);
    function balanceOf(address account) external view returns (uint256);
}

contract Escrow {
    address public tokenAddress;
    mapping(uint256 => address) public propertyOwners;
    mapping(uint256 => Offer[]) public propertyOffers;

    struct Offer {
        address buyer;
        uint256 amount;
        uint256 tokenAmount;
        bool refunded;
    }

    event OfferAccepted(uint256 indexed propertyId, uint256 indexed offerIndex, address buyer, uint256 amount);
    event OfferRejected(uint256 indexed propertyId, uint256 indexed offerIndex, address buyer);
    event TokenTransferred(address indexed from, address indexed to, uint256 amount);

    constructor(address _tokenAddress) {
        tokenAddress = _tokenAddress;
    }

    function setPropertyOwner(uint256 propertyId, address owner) external {
        require(owner != address(0), "Invalid owner address");
        propertyOwners[propertyId] = owner;
    }

    function makeOffer(uint256 propertyId, uint256 offerAmount, uint256 tokenAmount) external {
        require(propertyOwners[propertyId] != address(0), "Property owner not set");
        IERC20(tokenAddress).transferFrom(msg.sender, address(this), tokenAmount);
        propertyOffers[propertyId].push(Offer(msg.sender, offerAmount, tokenAmount, false));
    }

    function acceptOffer(uint256 propertyId, uint256 offerIndex, address ownerAddress) external {
        require(ownerAddress != address(0), "Invalid owner address");
        Offer[] storage offers = propertyOffers[propertyId];
        require(offerIndex < offers.length, "Invalid offer index");

        // Accept the selected offer
        Offer storage acceptedOffer = offers[offerIndex];
        IERC20(tokenAddress).transfer(ownerAddress, acceptedOffer.tokenAmount);
        emit TokenTransferred(address(this), ownerAddress, acceptedOffer.tokenAmount);
        emit OfferAccepted(propertyId, offerIndex, acceptedOffer.buyer, acceptedOffer.amount);

        // Reject all other offers
        for (uint i = 0; i < offers.length; i++) {
            if (i != offerIndex && !offers[i].refunded) {
                IERC20(tokenAddress).transfer(offers[i].buyer, offers[i].tokenAmount);
                offers[i].refunded = true;
                emit TokenTransferred(address(this), offers[i].buyer, offers[i].tokenAmount);
                emit OfferRejected(propertyId, i, offers[i].buyer);
            }
        }
    }

    function getOffersCount(uint256 propertyId) external view returns (uint256) {
        return propertyOffers[propertyId].length;
    }

    function getOffer(uint256 propertyId, uint256 index) external view returns (
        address buyer,
        uint256 amount,
        uint256 tokenAmount,
        bool refunded
    ) {
        Offer storage offer = propertyOffers[propertyId][index];
        return (offer.buyer, offer.amount, offer.tokenAmount, offer.refunded);
    }
}

