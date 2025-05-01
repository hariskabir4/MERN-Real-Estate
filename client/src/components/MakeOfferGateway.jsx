/* global BigInt */
import React, { useState, useEffect } from "react";
import { connectWallet, onAccountChange } from "../blockchain/connectWallet";
import { Escrow, PKRToken } from "../blockchain/contractABIs";
import { EscrowAddress, PKRTokenAddress } from "../blockchain/contractAddresses";
import { ethers, parseUnits } from "ethers";
import "./MakeOfferGateway_make_offer_pg.css";
import { useParams, useNavigate } from "react-router-dom";
import { useUserContext } from "../Usercontext";

const MakeOfferGateway = ({ onOfferMade }) => {
  const { propertyId } = useParams();
  const [offerAmount, setOfferAmount] = useState("");
  const [status, setStatus] = useState("");
  const [account, setAccount] = useState("");
  const { user } = useUserContext();
  const navigate = useNavigate();
  const [isWalletConnecting, setIsWalletConnecting] = useState(false);
  const [pkrBalance, setPkrBalance] = useState("0");

  useEffect(() => {
    if (!user && !isWalletConnecting) {
      navigate("/login", { 
        state: { 
          from: `/make-offer/${propertyId}`,
          intent: 'make-offer'
        } 
      });
    }
  }, [user, navigate, propertyId, isWalletConnecting]);

  useEffect(() => {
    const checkWalletConnection = async () => {
      try {
        if (window.ethereum && window.ethereum.selectedAddress) {
          setAccount(window.ethereum.selectedAddress);
        }
      } catch (error) {
        console.error("Error checking wallet connection:", error);
      }
    };
    checkWalletConnection();
  }, []);

  useEffect(() => {
    const handleAccountChange = (accounts) => {
      if (accounts && accounts.length > 0) {
        setAccount(accounts[0]);
      } else {
        setAccount("");
      }
    };
    onAccountChange(handleAccountChange);
    return () => {
      if (window.ethereum && handleAccountChange) {
        window.ethereum.removeListener("accountsChanged", handleAccountChange);
      }
    };
  }, []);

  // Helper: Convert string to a small uint256 for demo (use last 6 hex digits)
  function stringToSmallUint256(str) {
    // Take last 6 hex digits and parse as integer
    return parseInt(str.slice(-6), 16);
  }

  // Prompt MetaMask to select a different account
  const handleChangeWallet = async () => {
    setIsWalletConnecting(true);
    try {
      const { address } = await connectWallet();
      setAccount(address);
      setStatus("");
    } catch (error) {
      setStatus("Failed to change wallet: " + error.message);
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const handleConnect = async () => {
    setIsWalletConnecting(true);
    try {
      const { address } = await connectWallet();
      setAccount(address);
    } catch (error) {
      console.error("Error connecting wallet:", error);
      setStatus("Failed to connect wallet: " + error.message);
    } finally {
      setIsWalletConnecting(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!account) {
      setStatus("Please connect your wallet first");
      return;
    }

    // Validate offerAmount
    const offerAmountStr = offerAmount.trim();
    if (!offerAmountStr || isNaN(offerAmountStr) || Number(offerAmountStr) <= 0) {
      setStatus("Please enter a valid positive offer amount");
      return;
    }

    setStatus("Processing your offer...");
    try {
      const { signer, address } = await connectWallet();
      setAccount(address);
      const escrow = new ethers.Contract(EscrowAddress, Escrow.abi, signer);
      const pkrToken = new ethers.Contract(PKRTokenAddress, PKRToken.abi, signer);

      // Convert propertyId to a number and ensure it's valid
      const propertyIdNum = parseInt(propertyId);
      if (isNaN(propertyIdNum)) {
        throw new Error("Invalid property ID");
      }

      // Calculate token amount (1% of offer amount)
      const offerAmountWei = parseUnits(offerAmountStr, 18);
      const tokenAmountWei = offerAmountWei / BigInt(100);

      // Check token balance
      const balance = await pkrToken.balanceOf(address);
      if (balance < tokenAmountWei) {
        throw new Error("Insufficient PKR token balance");
      }

      // Check existing allowance
      const allowance = await pkrToken.allowance(address, EscrowAddress);
      if (allowance < tokenAmountWei) {
        setStatus("Approving token transfer...");
        const approveTx = await pkrToken.approve(EscrowAddress, tokenAmountWei);
        await approveTx.wait();
      }

      setStatus("Making offer...");
      const offerTx = await escrow.makeOffer(propertyIdNum, offerAmountWei, tokenAmountWei);
      await offerTx.wait();

      // POST the offer to backend
      const offerData = {
        propertyId,
        buyerId: user._id || user.id || user.email,
        buyerName: user.username || user.email,
        offerAmount: offerAmountStr,
        status: 'Pending',
        time: new Date().toLocaleString(),
        tokenAmount: (Number(offerAmountStr) * 0.01).toString(),
      };
      
      const response = await fetch('http://localhost:5000/api/offers', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(offerData),
      });

      if (!response.ok) {
        throw new Error('Failed to save offer to database');
      }

      setStatus("Offer made successfully!");
      if (onOfferMade) onOfferMade();
    } catch (err) {
      console.error("Offer error:", err);
      setStatus("Error: " + (err.reason || err.message));
    }
  };

  // Add this new function to check PKR balance
  const checkPKRBalance = async (address) => {
    try {
      const provider = new ethers.BrowserProvider(window.ethereum);
      const pkrToken = new ethers.Contract(PKRTokenAddress, PKRToken.abi, provider);
      const balance = await pkrToken.balanceOf(address);
      setPkrBalance(ethers.formatUnits(balance, 18));
    } catch (error) {
      console.error("Error checking PKR balance:", error);
    }
  };

  // Update useEffect to check balance when account changes
  useEffect(() => {
    if (account) {
      checkPKRBalance(account);
    }
  }, [account]);

  // Add this new function to mint test tokens
  const handleMintTestTokens = async () => {
    try {
      setStatus("Minting test PKR tokens...");
      const { signer } = await connectWallet();
      const pkrToken = new ethers.Contract(PKRTokenAddress, PKRToken.abi, signer);
      
      // Mint 1000 PKR tokens for testing using mintForTesting
      const mintAmount = parseUnits("1000", 18);
      const mintTx = await pkrToken.mintForTesting(account, mintAmount);
      await mintTx.wait();
      
      await checkPKRBalance(account);
      setStatus("Successfully minted 1000 PKR tokens!");
    } catch (error) {
      console.error("Error minting tokens:", error);
      setStatus("Error minting tokens: " + (error.reason || error.message));
    }
  };

  // Add batch minting function
  const handleBatchMint = async () => {
    try {
      setStatus("Minting tokens to multiple accounts...");
      const { signer } = await connectWallet();
      const pkrToken = new ethers.Contract(PKRTokenAddress, PKRToken.abi, signer);
      
      // Get all accounts from MetaMask
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      const amounts = accounts.map(() => parseUnits("1000", 18)); // 1000 tokens each
      
      const mintTx = await pkrToken.mintBatchForTesting(accounts, amounts);
      await mintTx.wait();
      
      await checkPKRBalance(account);
      setStatus("Successfully minted tokens to all connected accounts!");
    } catch (error) {
      console.error("Error in batch minting:", error);
      setStatus("Error in batch minting: " + (error.reason || error.message));
    }
  };

  if (!user && !isWalletConnecting) return null;

  return (
    <div className="make-offer-gateway_make_offer_pg">
      <h2 className="make-offer-title_make_offer_pg">Make an Offer</h2>
      {!account ? (
        <button onClick={handleConnect} className="connect-wallet-btn" disabled={isWalletConnecting}>
          {isWalletConnecting ? "Connecting..." : "Connect Wallet"}
        </button>
      ) : (
        <div className="wallet-info">
          <p>Connected Wallet: {account.slice(0, 6)}...{account.slice(-4)}</p>
          <p>PKR Balance: {pkrBalance} PKR</p>
          <button onClick={handleChangeWallet} className="connect-wallet-btn" disabled={isWalletConnecting}>
            {isWalletConnecting ? "Switching..." : "Change Wallet"}
          </button>
          <button onClick={handleMintTestTokens} className="mint-tokens-btn" style={{marginLeft: '10px'}}>
            Get Test PKR Tokens
          </button>
          <button onClick={handleBatchMint} className="mint-tokens-btn" style={{marginLeft: '10px'}}>
            Get Test PKR Tokens to All Connected Accounts
          </button>
        </div>
      )}
      <form onSubmit={handleSubmit} className="make-offer-form_make_offer_pg">
        <label htmlFor="offerAmount_make_offer_pg">Offer Amount (PKR):</label>
        <input
          id="offerAmount_make_offer_pg"
          type="number"
          min="0"
          step="0.01"
          value={offerAmount}
          onChange={e => setOfferAmount(e.target.value.replace(/[^0-9.]/g, ""))}
          required
        />
        <button 
          type="submit" 
          className="submit-offer-btn_make_offer_pg"
          disabled={!account || isWalletConnecting}
        >
          Submit Offer
        </button>
      </form>
      {status && <div className="status_make_offer_pg">{status}</div>}
    </div>
  );
};

export default MakeOfferGateway;