import { BrowserProvider } from "ethers";

// Register the accountsChanged event ONCE globally
if (window.ethereum && !window.ethereum._hasReloadOnAccountChange) {
    window.ethereum.on("accountsChanged", () => {
        window.location.reload();
    });
    window.ethereum._hasReloadOnAccountChange = true;
}

export async function connectWallet() {
    if (window.ethereum) {
        // Force MetaMask to prompt for account selection
        await window.ethereum.request({
            method: "wallet_requestPermissions",
            params: [{ eth_accounts: {} }]
        });

        const provider = new BrowserProvider(window.ethereum);
        await provider.send("eth_requestAccounts", []);
        const signer = await provider.getSigner();
        // For debugging: log the current account
        const address = await signer.getAddress();
        console.log("Connected MetaMask address:", address);
        return { provider, signer, address };
    } else {
        alert("Please install MetaMask!");
        throw new Error("MetaMask not installed");
    }
} 