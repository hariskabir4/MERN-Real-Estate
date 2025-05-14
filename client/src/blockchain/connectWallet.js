import { BrowserProvider } from "ethers";

// No global reload on accountsChanged!

export async function connectWallet() {
    if (window.ethereum) {
        // Prompt MetaMask to select account
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        });

        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        const address = await signer.getAddress();
        console.log("Connected MetaMask address:", address);
        return { provider, signer, address };
    } else {
        alert("Please install MetaMask!");
        throw new Error("MetaMask not installed");
    }
}

// Utility to subscribe to account changes (for use in React components)
export function onAccountChange(callback) {
    if (window.ethereum) {
        window.ethereum.on("accountsChanged", callback);
    }
} 