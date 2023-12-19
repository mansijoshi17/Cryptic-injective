const hre = require("hardhat");

async function main() {
  const [deployer] = await hre.ethers.getSigners();


  const crypticVault = await hre.ethers.getContractFactory(
    "CrypticVault"
  );
  const CrypticVault = await crypticVault.deploy();

  const crypticAgreementFactory = await hre.ethers.getContractFactory("CrypticAgreementFactory");
  const CrypticAgreementFactory = await crypticAgreementFactory.deploy();

  console.log(
    "CrypticVault Contract Address",
    CrypticVault.address
  );
  console.log("CrypticAgreementFactory contract address:", CrypticAgreementFactory.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });