import { ethers } from 'ethers';
import EscrowABI from '../blockchain/abis/Escrow.json';
import PKRTokenABI from '../blockchain/abis/PKRToken.json';
import { EscrowAddress, PKRTokenAddress } from '../blockchain/contractAddresses';

// Initialize contracts
export const getEscrowContract = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return new ethers.Contract(EscrowAddress, EscrowABI.abi, signer);
    } catch (error) {
        console.error("Error initializing Escrow contract:", error);
        throw error;
    }
};

export const getPKRTokenContract = async () => {
    try {
        const provider = new ethers.BrowserProvider(window.ethereum);
        const signer = await provider.getSigner();
        return new ethers.Contract(PKRTokenAddress, PKRTokenABI.abi, signer);
    } catch (error) {
        console.error("Error initializing PKRToken contract:", error);
        throw error;
    }
};

// Helper function to set property owner
export const setPropertyOwner = async (propertyId, ownerAddress) => {
    try {
        const escrow = await getEscrowContract();
        const tx = await escrow.setPropertyOwner(propertyId, ownerAddress);
        await tx.wait();
        return tx;
    } catch (error) {
        console.error("Error setting property owner:", error);
        throw error;
    }
}; 