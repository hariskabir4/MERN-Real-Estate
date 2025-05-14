// This script runs the deploy.js script, parses the output for contract addresses, and updates client/src/blockchain/contractAddresses.js
// Usage: node updateFrontendAddresses.js

const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const DEPLOY_SCRIPT = path.join(__dirname, 'deploy.js');
const FRONTEND_ADDRESSES = path.join(__dirname, '../../client/src/blockchain/contractAddresses.js');

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

console.log('Running deploy.js to get contract addresses...');
exec(`npx hardhat run ${DEPLOY_SCRIPT} --network localhost`, (err, stdout, stderr) => {
    if (err) {
        console.error('Error running deploy.js:', err);
        return;
    }
    if (stderr) {
        console.error('Deploy script stderr:', stderr);
    }
    const { PKRTokenAddress, EscrowAddress, PropertyNFTAddress } = extractAddresses(stdout);
    if (!PKRTokenAddress || !EscrowAddress) {
        console.error('Could not find all contract addresses in deploy output.');
        return;
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
}); 