const { ethers } = require("hardhat");

async function main() {
    // Deploy PKRToken
    const PKRToken = await ethers.getContractFactory("PKRToken");
    const initialSupply = ethers.parseUnits("1000000", 18); // ethers v6+
    const pkrToken = await PKRToken.deploy(initialSupply);
    console.log("PKR Token deployed to:", pkrToken.target);

    // Deploy Escrow Contract
    const Escrow = await ethers.getContractFactory("Escrow");
    const escrow = await Escrow.deploy(pkrToken.target);
    console.log("Escrow Contract deployed to:", escrow.target);

    // Deploy PropertyNFT
    const PropertyNFT = await ethers.getContractFactory("PropertyNFT");
    const propertyNFT = await PropertyNFT.deploy();
    console.log("PropertyNFT Contract deployed to:", propertyNFT.target);
}

main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});