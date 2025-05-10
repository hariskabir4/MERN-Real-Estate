const { ethers } = require("hardhat");
const { testAccounts } = require("../config/accounts");
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

    // Save the contract address to .env
    fs.appendFileSync('../server/.env', `ESCROW_ADDRESS=${escrow.target}\n`);

    // Deploy PropertyNFT
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    const propertyNFT = await PropertyNFT.deploy();
    await propertyNFT.waitForDeployment();
    console.log("PropertyNFT Contract deployed to:", propertyNFT.target);

    // Collect deploy output
    let deployOutput = '';
    deployOutput += `PKR Token deployed to: ${pkrToken.target}\n`;
    deployOutput += `Escrow Contract deployed to: ${escrow.target}\n`;
    deployOutput += `PropertyNFT Contract deployed to: ${propertyNFT.target}\n`;

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

    // Write deploy output to file for updateFrontendAddresses.js
    const DEPLOY_OUTPUT = path.join(__dirname, '../deploy-output.txt');
    fs.writeFileSync(DEPLOY_OUTPUT, deployOutput, 'utf8');
    console.log('Deploy output written to', DEPLOY_OUTPUT);

    // Run updateFrontendAddresses.js to update addresses and keys
    try {
        execSync('node scripts/updateFrontendAddresses.js', { stdio: 'inherit', cwd: path.join(__dirname, '..') });
    } catch (err) {
        console.error('Failed to run updateFrontendAddresses.js:', err.message);
    }

    // Call backend sync endpoint to sync offers to blockchain
    try {
        const fetch = require('node-fetch');
        fetch('http://localhost:5000/api/dev/sync-offers-to-chain', { method: 'POST' })
            .then(res => res.json())
            .then(data => console.log('Offer sync result:', data))
            .catch(err => console.error('Offer sync error:', err.message));
    } catch (err) {
        console.error('Failed to call backend sync endpoint:', err.message);
    }
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});