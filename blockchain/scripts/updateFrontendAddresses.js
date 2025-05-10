// This script updates client/src/blockchain/contractAddresses.js and server/.env with the latest contract addresses and dev private key.
// Usage: node updateFrontendAddresses.js

const fs = require('fs');
const path = require('path');

const DEPLOY_OUTPUT = path.join(__dirname, '../deploy-output.txt'); // We'll write deploy output here
const FRONTEND_ADDRESSES = path.join(__dirname, '../../client/src/blockchain/contractAddresses.js');
const BACKEND_ENV = path.join(__dirname, '../../server/.env');
const ACCOUNTS_CONFIG = path.join(__dirname, '../config/accounts.js');

// Helper to extract address from deploy output
function extractAddresses(output) {
    const lines = output.split('\n');
    let PKRTokenAddress = null;
    let EscrowAddress = null;
    let PropertyNFTAddress = null;
    for (const line of lines) {
        if (line.includes('PKR Token deployed to:')) {
            PKRTokenAddress = line.split('PKR Token deployed to:')[1].trim();
        }
        if (line.includes('Escrow Contract deployed to:')) {
            EscrowAddress = line.split('Escrow Contract deployed to:')[1].trim();
        }
        if (line.includes('PropertyNFT Contract deployed to:')) {
            PropertyNFTAddress = line.split('PropertyNFT Contract deployed to:')[1].trim();
        }
    }
    return { PKRTokenAddress, EscrowAddress, PropertyNFTAddress };
}

// Read deploy output
if (!fs.existsSync(DEPLOY_OUTPUT)) {
    console.error('Deploy output file not found:', DEPLOY_OUTPUT);
    process.exit(1);
}
const deployOutput = fs.readFileSync(DEPLOY_OUTPUT, 'utf8');
const { PKRTokenAddress, EscrowAddress, PropertyNFTAddress } = extractAddresses(deployOutput);
if (!PKRTokenAddress || !EscrowAddress) {
    console.error('Could not find all contract addresses in deploy output.');
    process.exit(1);
}
// Prepare new content for contractAddresses.js
let content = `export const PKRTokenAddress = "${PKRTokenAddress}"; // from deploy output\n`;
content += `export const EscrowAddress = "${EscrowAddress}";\n`;
if (PropertyNFTAddress) {
    content += `// export const PropertyNFTAddress = "${PropertyNFTAddress}";\n`;
}
// Write to contractAddresses.js
fs.writeFileSync(FRONTEND_ADDRESSES, content, 'utf8');
console.log('Updated contractAddresses.js with new addresses:');
console.log(content);

// Update backend .env
let env = '';
if (fs.existsSync(BACKEND_ENV)) {
    env = fs.readFileSync(BACKEND_ENV, 'utf8');
}
// Update or add ESCROW_ADDRESS and PKR_TOKEN_ADDRESS
env = env.replace(/ESCROW_ADDRESS=.*/g, `ESCROW_ADDRESS=${EscrowAddress}`);
env = env.replace(/PKR_TOKEN_ADDRESS=.*/g, `PKR_TOKEN_ADDRESS=${PKRTokenAddress}`);
// If not present, add them
if (!env.match(/ESCROW_ADDRESS=/)) env += `\nESCROW_ADDRESS=${EscrowAddress}`;
if (!env.match(/PKR_TOKEN_ADDRESS=/)) env += `\nPKR_TOKEN_ADDRESS=${PKRTokenAddress}`;

// Get last private key from accounts.js using require
let lastKey = '';
try {
    const accountsConfig = require(ACCOUNTS_CONFIG);
    const testAccounts = accountsConfig.testAccounts;
    if (testAccounts && testAccounts.length > 0) {
        lastKey = testAccounts[testAccounts.length - 1].privateKey;
        console.log('Extracted lastKey for DEV_PRIVATE_KEY:', lastKey);
    }
} catch (e) {
    console.error('Error loading accounts.js:', e.message);
}
// Validate private key format (should be 0x + 64 hex chars)
const isValidKey = /^0x[a-fA-F0-9]{64}$/.test(lastKey);
if (lastKey && isValidKey) {
    if (env.match(/DEV_PRIVATE_KEY=/)) {
        env = env.replace(/DEV_PRIVATE_KEY=.*/g, `DEV_PRIVATE_KEY=${lastKey}`);
    } else {
        env += `\nDEV_PRIVATE_KEY=${lastKey}`;
    }
} else if (lastKey) {
    console.error('Extracted DEV_PRIVATE_KEY is not a valid private key:', lastKey);
}
fs.writeFileSync(BACKEND_ENV, env, 'utf8');
console.log('Updated server/.env with new addresses and dev private key.'); 