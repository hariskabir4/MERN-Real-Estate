// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/access/Ownable.sol";

contract PKRToken is ERC20, Ownable {
    constructor() ERC20("PKRToken", "PKR") Ownable(msg.sender) {
        // Initial supply of 1,000,000 PKR tokens to deployer
        _mint(msg.sender, 1000000 * 10 ** decimals());
    }

    // Function to mint new tokens (only owner can call this)
    function mint(address to, uint256 amount) public onlyOwner {
        _mint(to, amount);
    }

    // Function to mint tokens to multiple addresses at once (only owner can call this)
    function mintBatch(address[] memory to, uint256[] memory amounts) public onlyOwner {
        require(to.length == amounts.length, "Arrays must have same length");
        for(uint i = 0; i < to.length; i++) {
            _mint(to[i], amounts[i]);
        }
    }

    // Function for testing - allows anyone to mint tokens (REMOVE IN PRODUCTION)
    function mintForTesting(address to, uint256 amount) public {
        _mint(to, amount);
    }

    // Function for testing - mint to multiple addresses (REMOVE IN PRODUCTION)
    function mintBatchForTesting(address[] memory to, uint256[] memory amounts) public {
        require(to.length == amounts.length, "Arrays must have same length");
        for(uint i = 0; i < to.length; i++) {
            _mint(to[i], amounts[i]);
        }
    }
}
