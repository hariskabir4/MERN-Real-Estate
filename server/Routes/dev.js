const express = require('express');
const axios = require('axios');
const ethers = require('ethers');
const Offer = require('../Models/Offer'); // Example model
const fs = require('fs');
const path = require('path');

// Path to the Escrow ABI
const escrowAbiPath = path.join(__dirname, '../../blockchain/artifacts/contracts/Escrow.sol/Escrow.json');
if (!fs.existsSync(escrowAbiPath)) {
  throw new Error(`ABI file not found at ${escrowAbiPath}. Please compile the contracts.`);
}
const EscrowABI = require(escrowAbiPath);

const router = express.Router();
const HARDHAT_RPC_URL = "http://127.0.0.1:8545"; // Hardhat node RPC URL
const ESCROW_ADDRESS = "0x0165878A594ca255338adfa4d48449f69242Eb8F"; // Replace with your deployed Escrow contract address
const PKR_DECIMALS = 18; // PKR token decimals

router.post('/sync-offers-to-chain', async (req, res) => {
  try {
    const provider = new ethers.JsonRpcProvider(HARDHAT_RPC_URL);
    const wallet = new ethers.Wallet(process.env.DEV_PRIVATE_KEY, provider); // Use the private key from .env
    const escrow = new ethers.Contract(ESCROW_ADDRESS, EscrowABI.abi, wallet); // Attach the wallet as the signer

    const offers = await Offer.find({});
    if (offers.length === 0) {
      console.log('No offers to sync.');
      return res.json({ message: 'No offers to sync.' });
    }

    let syncedOffersCount = 0;

    for (const offer of offers) {
      try {
        const numericPropertyId = parseInt(offer.propertyId.toString().slice(-8), 16); // Generate numeric propertyId
        console.log(`Syncing offer ${offer._id}: propertyId ${offer.propertyId} -> ${numericPropertyId}`);

        const tx = await escrow.makeOffer(
          numericPropertyId,
          ethers.parseUnits(offer.offerAmount, PKR_DECIMALS),
          ethers.parseUnits(offer.tokenAmount, PKR_DECIMALS)
        );
        await tx.wait();
        syncedOffersCount++;
      } catch (err) {
        console.error(`Failed to sync offer ${offer._id}:`, err.message);
      }
    }

    res.json({ message: `Synced ${syncedOffersCount} offers to blockchain.` });
  } catch (err) {
    console.error('Sync error:', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;