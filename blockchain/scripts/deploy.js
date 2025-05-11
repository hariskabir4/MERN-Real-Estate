const { ethers } = require("hardhat");
const { testAccounts } = require("../config/accounts");
const fs = require("fs");
const path = require("path");

async function main() {
    // Deploy PKRToken
    const PKRToken = await ethers.getContractFactory("PKRToken");
    const pkrToken = await PKRToken.deploy();
    await pkrToken.waitForDeployment();
    console.log("PKR Token deployed to:", pkrToken.target);

    // Mint tokens to all test accounts
    const addresses = testAccounts.map(account => account.address);
    const amounts = addresses.map(() => ethers.parseUnits("1000000", 18)); // 1M tokens each
    
    console.log("Minting tokens to test accounts...");
    await pkrToken.mintBatchForTesting(addresses, amounts);
    console.log("Tokens minted to all test accounts");

    // Deploy Escrow Contract
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(pkrToken.target);
    await escrow.waitForDeployment();
    console.log("Escrow Contract deployed to:", escrow.target);

    // Deploy PropertyNFT
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    const propertyNFT = await PropertyNFT.deploy();
    await propertyNFT.waitForDeployment();
    console.log("PropertyNFT Contract deployed to:", propertyNFT.target);

    // Print instructions
    console.log("\nDeployment complete! Follow these steps:");
    console.log("1. Add these accounts to MetaMask (they all have 1M PKR tokens):");
    testAccounts.forEach((account, index) => {
        console.log(`\nAccount ${index + 1}:`);
        console.log(`Address: ${account.address}`);
        console.log(`Private Key: ${account.privateKey}`);
    });
    console.log("\n2. Add PKR Token to MetaMask:");
    console.log(`Contract Address: ${pkrToken.target}`);
    console.log("Symbol: PKR");
    console.log("Decimals: 18");

    // === New Logic to Save Escrow Address to config.json ===
    const configPath = path.join(__dirname, "..", "config.json");
    const config = {
        escrowAddress: escrow.target, // Save the Escrow contract address
        pkrTokenAddress: pkrToken.target, // Save the PKRToken contract address
        propertyNFTAddress: propertyNFT.target // Save the PropertyNFT contract address
    };

    fs.writeFileSync(configPath, JSON.stringify(config, null, 2));
    console.log(`\nContract addresses saved to ${configPath}`);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});