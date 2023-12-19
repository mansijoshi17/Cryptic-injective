import React, { useState, createContext, useEffect, useCallback } from "react";
import {
  crypticVaultContractEthAddress,
  crypticAgreementFactoryEthAddress,
} from "../config";
import crypticVault from "../abi/CrypticVault.json";
import crypticVaultToken from "../abi/CrypticVaultToken.json";
import crypticAgreementFactory from "../abi/CrypticAgreementFactory.json";
import crypticAgreement from "../abi/CrypticAgreement.json";
import { ethers, Contract } from "ethers";

import cryptoJs from "crypto-js";

import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import web3 from "web3";

import { Web3StorageContext } from "./Web3Storage";
import { firebaseDataContext } from "./FirebaseDataContext";

import emailjs from "@emailjs/browser";

import lighthouse from "@lighthouse-web3/sdk";

export const Web3Context = createContext(undefined);

export const Web3ContextProvider = (props) => {
  const navigate = useNavigate();

  const [address, setAddress] = useState("");
  const [accounts, setAccount] = useState("");
  const [aLoading, setaLoading] = useState(false);
  const [mLoading, setmLoading] = useState(false);
  const [sLoading, setSLoaing] = useState(false);

  const [agreementLoading, setAgreementLoading] = useState(false);
  const [crypticVaultContractEthAddressobj, setcrypticVaultContractEthAddress] =
    useState();
  const [signer, setSigner] = useState();
  const [agreements, setAgreements] = useState([]);
  const [pdfUrl, setPdfUrl] = useState("");

  const [members, setMembers] = useState([]);
  const [emergencyAlert, setEmergencyAlert] = useState();

  const web3StorageContext = React.useContext(Web3StorageContext);
  const {
    decryptData,
    base64toBlob,
    storeJsonFiles,
    makeFileObjects,
    getEncryptData,
    Decrypt,
    storeDriveFiles,
  } = web3StorageContext;

  const firebasedatacontext = React.useContext(firebaseDataContext);
  const {
    getMembersData,
    StoreEmergencyAlert,
    getEmergencyAlertMessage,
    updateEmergencyAlert,
  } = firebasedatacontext;

  useEffect(() => {
    getAddress();
  }, []);

  async function getAddress() {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    const crypticVaultCon = new ethers.Contract(
      crypticVaultContractEthAddress,
      crypticVault,
      signer
    );

    setcrypticVaultContractEthAddress(crypticVaultCon);
    setSigner(signer);
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
  }

  const connectWallet = async () => {
    const { ethereum } = window;

    if (!ethereum) {
      alert("Please install the Metamask Extension!");
    }
    try {
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });

      setAddress(accounts[0]);
    } catch (err) {
      console.log(err);
      if (err.code === 4902) {
        try {
          const accounts = await ethereum.request({
            method: "eth_requestAccounts",
          });

          setAddress(accounts[0]);
        } catch (err) {
          alert(err.message);
        }
      }
    }
  };

  const signInAsAdmin = async (data) => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
    setaLoading(true);
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContractEthAddress,
        crypticVault,
        signer
      );
      let status = await crypticVaultCon.getLoginStatus(accounts[0]);

      if (status) {
        setaLoading(false);
        localStorage.setItem("admin", accounts[0]);
        localStorage.setItem("role", "admin");
        toast.success("Successfully Signed In as a Admin!!");
        navigate("/dashboard/drive");
      } else {
        let createTokenTransaction = await crypticVaultCon.createToken(
          data.tName,
          data.symbol
        );
        let tx = await createTokenTransaction.wait();
        if (tx) {
          let event = await tx.events[0];
          let tokenContractAddress = event?.args[1];

          let transactionMint = await crypticVaultCon.bulkMintERC721(
            tokenContractAddress,
            0,
            6
          );
          let tx1 = await transactionMint.wait();

          if (tx1) {
            setaLoading(false);
            localStorage.setItem("admin", accounts[0]);
            localStorage.setItem("role", "admin");
            toast.success("Successfully Signed In as a Admin!!");
            navigate("/dashboard/drive");
          }
        }
      }
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
      setaLoading(false);
    }
  };

  const encryptionSignature = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    const address = await signer.getAddress();
    const messageRequested = (await lighthouse.getAuthMessage(address)).data
      .message;
    const signedMessage = await signer.signMessage(messageRequested);
    return {
      signedMessage: signedMessage,
      publicKey: address,
    };
  };

  const signInAsMember = async (data) => {
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });
    setAddress(accounts[0]);
    setaLoading(true);

    // try {
    //   let tokenAddress =
    //     await crypticVaultContractEthAddressobj.getTokenAddress(data.address);

    //   // Conditions to add
    //   const conditions = [
    //     {
    //       id: 1,
    //       chain: "hyperspace",
    //       method: "balanceOf",
    //       standardContractType: "ERC721",
    //       contractAddress: tokenAddress,
    //       returnValueTest: { comparator: ">=", value: "1" },
    //       parameters: accounts[0],
    //     },
    //   ];

    //   const aggregator = "([1])";
    //   const { publicKey, signedMessage } = await encryptionSignature();

    //   /*
    //   accessCondition(publicKey, cid, signedMessage, conditions, aggregator)
    //     Parameters:
    //       publicKey: owners public key
    //       CID: CID of file to decrypt
    //       signedMessage: message signed by owner of publicKey
    //       conditions: should be in format like above
    //       aggregator: aggregator to apply on conditions
    // */
    //   const response = await lighthouse.accessCondition(
    //     publicKey,
    //     signedMessage,
    //     conditions,
    //     aggregator
    //   );

    //   console.log(response);
    // } catch (error) {
    //   console.log(error);
    // }

    try {
      let tokenAddress =
        await crypticVaultContractEthAddressobj.getTokenAddress(data.address);
      console.log(tokenAddress);

      const tokenContract = new ethers.Contract(
        tokenAddress,
        crypticVaultToken,
        signer
      );

      let balance = await tokenContract.balanceOf(accounts[0]);

      if (balance.toString() !== "0") {
        toast.success("Successfully Signed In as a Member!!");
        localStorage.setItem("admin", data.address);
        localStorage.setItem("role", "member");
        navigate("/dashboard/drive");
      } else {
        toast.error("You are not member!!");
      }

      setaLoading(false);
    } catch (err) {
      console.log(err);
      toast.error("Something want wrong!!", err);
      setaLoading(false);
    }
  };

  const getMembers = async () => {
    try {
      let arr = [];

      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContractEthAddress,
        crypticVault,
        signer
      );

      const add = localStorage.getItem("admin");
      let cids = await getMembersData(web3.utils.toChecksumAddress(add));

      for (var i = 0; i < cids.length; i++) {
        const meta = await axios.get(
          `https://${cids[i].cid}.ipfs.w3s.link/member.json`
        );
        arr[i] = meta.data;
        let status = await crypticVaultCon.getTransferStatus(
          localStorage.getItem("admin"),
          meta?.data?.address
        );

        arr[i].transferStatus = status;
      }

      setMembers(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const createEmergencyAlert = async (data, emergencyAlert) => {
    try {
      if (Object.keys(emergencyAlert).length === 0) {
        await StoreEmergencyAlert({
          address: web3.utils.toChecksumAddress(localStorage.getItem("admin")),
          subject: data.subject,
          message: data.message,
        });
      } else {
        await updateEmergencyAlert({
          id: emergencyAlert.id,
          subject: data.subject,
          message: data.message,
        });
      }

      return true;
    } catch (err) {
      console.log(err);
      toast.error(err);
      return;
    }
  };

  const getEmergencyAlert = async () => {
    try {
      let emergencyalert = await getEmergencyAlertMessage(
        web3.utils.toChecksumAddress(localStorage.getItem("admin"))
      );

      setEmergencyAlert(emergencyalert);
    } catch (err) {
      console.log(err);
    }
  };

  const sendEmail = async (values) => {
    emailjs
      .send(
        process.env.REACT_APP_EMAIL_JS_SERVICE_ID,
        process.env.REACT_APP_EMAIL_JS_TEMPLATE_ID,
        values,
        process.env.REACT_APP_EMAIL_JS_USER_ID
      )
      .then(
        (result) => {
          toast.success("Permission given and message has been sent !!");
        },
        (error) => {
          toast.error("Something went wrong!!", err);
        }
      );
  };

  const transferToken = async (address, data) => {
    const admin = localStorage.getItem("admin");
    var tx;
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContractEthAddress,
        crypticVault,
        signer
      );
      let tokenAddress = await crypticVaultCon.getTokenAddress(admin);

      const tokenContract = new ethers.Contract(
        tokenAddress,
        crypticVaultToken,
        signer
      );
      const accounts = await provider.listAccounts();
      let role = localStorage.getItem("role");

      let tokenId;
      if (role == "admin") {
        tokenId = await crypticVaultCon.getTokenId(accounts[0]);
      } else {
        tokenId = await crypticVaultCon.getTokenId(admin);
      }
      if (parseInt(tokenId.toString()) > 0) {
        let approveTransaction = await tokenContract.approve(
          address,
          parseInt(tokenId.toString())
        );
        let atx = await approveTransaction.wait();
        if (atx) {
          let transactionTransfer = await crypticVaultCon.transferToken(
            admin,
            address,
            tokenAddress,
            parseInt(tokenId.toString())
          );
          let ttx = await transactionTransfer.wait();
          if (ttx) {
            if (role == "admin") {
              tx = await crypticVaultCon.setTokenId(
                accounts[0],
                parseInt(tokenId.toString()) - 1
              );
            } else {
              tx = await crypticVaultCon.setTokenId(
                admin,
                parseInt(tokenId.toString()) - 1
              );
            }

            if (tx) {
              await sendEmail(data);
            }
          }
        }
      } else {
        toast.error("You don't have enough token to transfer!");
      }

      return tx;
    } catch (error) {
      console.log(error);
    }
  };

  const createAgreement = async (dataObj, file) => {
    try {
      setAgreementLoading(true);
      const agreementFactoryCon = new ethers.Contract(
        crypticAgreementFactoryEthAddress,
        crypticAgreementFactory,
        signer
      );

      console.log(dataObj, "dataObj");

      let agreementContAddress = await agreementFactoryCon.createAgreement(
        dataObj.name,
        dataObj.cid,
        "Unsigned"
      );

      console.log(agreementContAddress, "agreementContAddress");
      let txca = await agreementContAddress.wait();
      if (txca) {
        let agreement = txca.events[1].args.agreement;
        console.log(agreement, "agreement");
        const agreementCont = new ethers.Contract(
          agreement,
          crypticAgreement,
          signer
        );
        let addMembersTransaction = await agreementCont.addMembers(
          dataObj.members
        );
        let txam = await addMembersTransaction.wait();
        if (txam) {
          setAgreementLoading(false);
        }
      }
    } catch (error) {
      setAgreementLoading(false);
      console.log(error);
    }
  };

  const getAgreements = async () => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const signer = provider.getSigner();
    const agreementFactoryCon = new Contract(
      crypticAgreementFactoryEthAddress,
      crypticAgreementFactory,
      signer
    );

    try {
      const agreements = await agreementFactoryCon.getAgrrements(accounts[0]);
      var array = [];
      for (let i = 0; i < agreements.length; i++) {
        let object;
        let agreementCon = await getAgreementContract(agreements[i]);

        object = {
          name: await agreementCon.getName(),
          creator: await agreementCon.getOwner(),
          status: await agreementCon.checkAgreementStatus(),
          aggAddress: agreements[i],
        };

        array.push(object);
      }

      setAgreements(array);
    } catch (error) {
      console.log(error, "err");
    }
  };

  const getAgreementContract = async (agreement) => {
    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();
    const agreementCon = new Contract(agreement, crypticAgreement, signer);
    return agreementCon;
  };

  const signAgreement = async (agreement, pdfFile) => {
    setSLoaing(true);
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    let agreementCon = await getAgreementContract(agreement);

    try {
      let signTransaction = await agreementCon.signAgreement(accounts[0]);

      let txs = await signTransaction.wait();
      if (txs) {
        const files = [new File([pdfFile], "CrypticAgreement")];

        let pdfcid = await storeDriveFiles(files[0], "CrypticAgreement");
        const pdfmeta = await axios.get(
          `https://${pdfcid}.ipfs.w3s.link/CrypticAgreement`
        );

        let jsonfiles = await makeFileObjects(
          {
            pdfcid: pdfcid,
            members: await agreementCon.getMembers(),
          },
          "agreement.json",
          "application/json"
        );
        let cid = await storeJsonFiles(jsonfiles);
        let updateCidTransaction = await agreementCon.setCid(cid);
        let txuc = await updateCidTransaction.wait();
        if (txuc) {
          toast.success("Agreement is signed!");
          setSLoaing(false);
        }
      }
    } catch (error) {
      console.log(error);
      toast.error("You are not member or you have allready signed it!");
      setSLoaing(false);
    }
  };

  const viewPdf = async (agreement) => {
    var iv = cryptoJs.enc.Base64.parse("");
    var key = cryptoJs.SHA256("test");
    let agreementCon = await getAgreementContract(agreement);

    const cid = await agreementCon.getCid();

    const meta = await axios.get(`https://${cid}.ipfs.w3s.link/agreement.json`);

    try {
      const pdfmeta = await axios.get(
        `https://${meta.data.pdfcid}.ipfs.w3s.link/CrypticAgreement`
      );

      let d = decryptData(pdfmeta.data.file, iv, key);
      const blob = base64toBlob(d, pdfmeta.data.type);
      const url = URL.createObjectURL(blob);

      console.log(url, "url");

      setPdfUrl(url);
    } catch (error) {
      console.log(error);
    }
  };

  const checkMember = async (agreement) => {
    console.log("I am called context");
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    let agreementCon = await getAgreementContract(agreement);
    let isMember = await agreementCon.checkMember(accounts[0]);
    return isMember;
  };

  return (
    <Web3Context.Provider
      value={{
        connectWallet,
        signInAsAdmin,
        signInAsMember,
        getMembers,
        createEmergencyAlert,
        getEmergencyAlert,
        sendEmail,
        transferToken,
        createAgreement,
        getAgreements,
        signAgreement,
        getAgreementContract,
        viewPdf,
        checkMember,
        agreements,
        agreementLoading,
        emergencyAlert,
        members,
        address,
        accounts,
        aLoading,
        sLoading,
        pdfUrl,
      }}
      {...props}
    >
      {props.children}
    </Web3Context.Provider>
  );
};
