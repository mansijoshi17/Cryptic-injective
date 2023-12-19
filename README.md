## Cryptic : Privacy proof eSignature, Decentralized Digital Vault!

![MicrosoftTeams-image (70)](https://user-images.githubusercontent.com/54347081/216899865-a67a3649-06fc-4e62-ad5f-b87af1c5b50b.png)

## Cryptic is perpetual data storage, management and privacy proof multiuser eSignature Dapp

### Key Features:

1. Cryptic Sign

- Multiuser eSignature to Agreements

2. Cryptic Vault

- Perpetual data Storage
- NFT based Access
- Information Inheritance
- Data Encryption on Top of IPFS

### What problem we are solving:

1. Currently we are using docusign to sign agreements digitally. But in that users personal data and agreements gets stored on the centrealised database. So here we have built cryptic sign which totally decentralised. User can add agreements with sign placeholders and then can share the link with the member of that agreement. Only added whitelisted members will be able to access the link. Members will sign the agreement using that sharabale link.

2. If something happens to a person or in case of death families are not aware of a) How much crypto person is having and especially how to get access to it b) Millions of dollars worth of insurance are unclaimed because families don't know if there was any medical insurance or life insurance. c) Property will deed etc

3. no central point of failure and censorship resistance. Currently, we store our data on Dropbox, Google Drive, etc but there are chances that someone from the internal team can access our data so we have encrypted data using SHA 256 and the encrypted hash is getting stored on IPFS

4. Persistent storage & Perpetual storage: Physical copy of data may get lost or damaged due to any reason but data stored on IPFS and Pinned using Filecoin are totally secure and everlasting. Even if the big bang happens on eath, data on the File coin will be accessible from other planets through satellite node which Protocol Labs team is planning :)

### Contracts on Patex Sepolia:

**1) Cryptic Vault Contract : https://testnet.patexscan.io/address/0x0005A12fFB8edf3D93E49fEb79E3ea45883B1de2**  
**2) Cryptic Agreement Contract : https://testnet.patexscan.io/address/0x89d050840d9B93AA6E5f73A350921dD1818059f7** 

## It includes:

**1) Sign In with Admin and Member:** Admin can create token from sign with admin which will be used for membership. and in login with member, member can login with admin address which will check that member have that admin's nft or not.

<img width="1435" alt="Screenshot 2023-07-06 at 11 31 13 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/a3e171ae-1974-4057-96e1-d6a248d569f2">

<img width="1428" alt="Screenshot 2023-07-06 at 11 31 29 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/6d4adf5b-1dfe-4176-b5e7-0cc029d2ffd7">


**1) Crypic Sign to Agreements:** User can add agreements with sign placeholders and then can share the link with the member of that agreement. Only added whitelisted members will be able to access the link. Members will sign the agreement using that sharabale link.

<img width="1424" alt="Screenshot 2023-07-06 at 11 32 59 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/bef07a19-6126-4414-821d-0c451ae81525">


<img width="1423" alt="Screenshot 2023-07-06 at 11 34 52 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/be2043af-d28b-424e-941a-1858d6325c39">


**3) Decentralized Encrypted Perpetual Storage :** In Drive we can store different type of file which will stored encrypted on IPFS.


<img width="1421" alt="Screenshot 2023-07-06 at 11 31 47 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/b4493957-6dfd-4739-a775-029accc116e2">


**4) Members:** Add Members to give access of your digital vault.

<img width="1397" alt="Screenshot 2023-07-06 at 11 32 20 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/6f37d567-9bfa-492c-8a33-ce2045900b57">


<img width="1424" alt="Screenshot 2023-07-06 at 11 32 06 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/72515798-d5fd-4bb2-ad4c-993ad236d18e">


**5) Emergency Alert:** Set Emergency alert email message to notify the member about access permission.

<img width="1412" alt="Screenshot 2023-07-06 at 11 32 32 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/46cf753e-4d9e-4eef-ae1e-6033ab02e191">


**6) Access Permission:** There are three ways to give access permission. 1) Give access right away which will transfer token and send email to the particular member right away 2) Emergency Transfer is set number of days the when transfer should be executed, if admin is not active from defined days. 3) On selected date is token should be transfered on particular date.

<img width="1424" alt="Screenshot 2023-07-06 at 11 32 40 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/91248c08-a983-4a24-b707-347ad4c07e89">


**7) Encrypted Notes:** In notes, added notes will be stored encrypted on IPFS.

<img width="1423" alt="Screenshot 2023-07-06 at 11 32 48 AM" src="https://github.com/cryptbuilder/Cryptic/assets/104611242/135950a2-406d-41a0-968c-95d084505254">


### Patex

```
require("@nomicfoundation/hardhat-toolbox");
require("hardhat-deploy");
require("hardhat-deploy-ethers");
require("./tasks");
require("dotenv").config();

const PRIVATE_KEY = process.env.REACT_APP_PRIVATE_KEY;
const patexSepoliaUrl = process.env.REACT_APP_PATEX_SEPOLIA_URL

module.exports = {
  solidity: "0.8.4",
  settings: {
    optimizer: {
      enabled: true,
      runs: 10000,
    },
  },
  defaultNetwork: "patex-sepolia",
  networks: {
    hardhat: {},
    "patex-sepolia": {
      url: patexSepoliaUrl,
      accounts: [ PRIVATE_KEY ]
   }  
  },
  paths: {
    sources: "./contracts",
    tests: "./test",
    cache: "./cache",
    artifacts: "./artifacts",
  },
};
```



