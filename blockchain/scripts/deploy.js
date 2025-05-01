const { ethers } = require("hardhat");
const { testAccounts } = require("../config/accounts");

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
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});