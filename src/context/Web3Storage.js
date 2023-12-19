import React, { useState, createContext, useEffect, useCallback } from "react";
import { ethers } from "ethers";

import { toast } from "react-toastify";
import { Web3Storage } from "web3.storage";
import { useNavigate } from "react-router-dom";

import { v4 as uuidv4 } from "uuid";
import cryptoJs from "crypto-js";

import { crypticVaultContractEthAddress } from "../config";
import crypticVault from "../abi/CrypticVault.json";

import { firebaseDataContext } from "./FirebaseDataContext";

import { getAuthMessage } from "@lighthouse-web3/kavach";

import axios from "axios";

import lighthouse from "@lighthouse-web3/sdk";
import web3 from "web3";

export const Web3StorageContext = createContext(undefined);

export const Web3StorageContextProvider = (props) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [isUpdated, setIsUpdated] = useState(false);
  const [docsFiles, setDocFiles] = useState([]);
  const [agreementCid, setAggrCid] = useState();

  const firebasedatacontext = React.useContext(firebaseDataContext);
  const { getDriveData, storeDriveData } = firebasedatacontext;

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

  const getToken = async () => {
    const signer = new ethers.Wallet(process.env.REACT_APP_PRIVATE_KEY);
    const publicKey = signer.address;

    const authMessage = await getAuthMessage(signer.address);
    const signedMessage = await signer.signMessage(authMessage.message);
    const jwtToken = await axios.post(
      "https://encryption.lighthouse.storage/api/message/get-jwt",
      {
        address: publicKey,
        signature: signedMessage,
      }
    );
    return jwtToken.data.token;
  };

  function getAccessToken() {
    // If you're just testing, you can paste in a token
    // and uncomment the following line:
    // return 'paste-your-token-here'

    // In a real app, it's better to read an access token from an
    // environement variable or other configuration that's kept outside of
    // your code base. For this to work, you need to set the
    // WEB3STORAGE_TOKEN environment variable before you run your code.
    return process.env.REACT_APP_WEB3STORAGE_TOKEN;
  }

  function makeStorageClient() {
    return new Web3Storage({ token: getAccessToken() });
  }

  function makeFileObjects(data, name) {
    // You can create File objects from a Blob of binary data
    // see: https://developer.mozilla.org/en-US/docs/Web/API/Blob
    // Here we're just storing a JSON object, but you can store images,
    // audio, or whatever you want!
    const obj = data;
    const blob = new Blob([JSON.stringify(obj)], { type: "application/json" });

    const files = [new File([blob], name)];
    return files;
  }

  async function storeJsonFiles(files) {
    const client = makeStorageClient();
    const cid = await client.put(files);
    console.log("stored files with cid:", `https://${cid}.ipfs.w3s.link/`);
    return cid;
  }

  async function storeDriveFiles(file, name) {
    setLoading(true);
    var iv = cryptoJs.enc.Base64.parse("");
    var key = cryptoJs.SHA256("test");
    const filePromises =
      // Return a promise per file
      await new Promise((resolve, reject) => {
        var reader = new FileReader();
        reader.readAsDataURL(file);

        reader.onload = async function () {
          var b64 = reader.result.replace(/^data:.+;base64,/, "");

          var encryptedString = getEncryptData(b64, iv, key);
          let cidd = await encryptedString.then(async (e) => {
            let files = await makeFileObjects(
              {
                file: e,
                name: name,
                type: "application/pdf",
              },
              name
            );
            let cid = await storeJsonFiles(files);
            return cid;
          });
          resolve(cidd);
        };
      });

    const cid = await Promise.all(filePromises);

    return cid.join("");
  }

  async function storeDriveFilesWithLighthouse(e) {
    setLoading(true);
    const file = e.target.files[0];
    let token = await getToken();
    let sig = await encryptionSignature();
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const accounts = await provider.listAccounts();
    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      process.env.REACT_APP_LIGHTHOUSE_API_KEY,
      token
    );

    let files = await makeFileObjects(
      {
        file: response.data.Hash,
        name: file.name.substring(0, file.name.indexOf(".")).toString(),
        type: file.type,
      },
      "CrypticVault"
    );
    let cid = await storeJsonFiles(files);

    let role = localStorage.getItem("role");

    if (role == "admin") {
      await storeDriveData({
        address: accounts[0],
        cid: cid,
      });
      setLoading(false);
      setIsUpdated(!isUpdated);
      toast.success("Successfully Uploaded!");
    } else {
      await storeDriveData({
        address: web3.utils.toChecksumAddress(localStorage.getItem("admin")),
        cid: cid,
      });
      setLoading(false);
      setIsUpdated(!isUpdated);
      toast.success("Successfully Uploaded!");
    }
  }

  async function storeAgreementFileWithLighthouse(e) {
    let token = await getToken();
    let sig = await encryptionSignature();

    const response = await lighthouse.uploadEncrypted(
      e,
      sig.publicKey,
      process.env.REACT_APP_LIGHTHOUSE_API_KEY,
      token
    );

    console.log(response, "response");

    return response.data.Hash;
  }

  const getEncryptData = async (data, iv, key) => {
    var encryptedString;
    if (typeof data == "string") {
      data = data.slice();
      encryptedString = cryptoJs.AES.encrypt(data, key, {
        iv: iv,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7,
      });
    } else {
      encryptedString = cryptoJs.AES.encrypt(JSON.stringify(data), key, {
        iv: iv,
        mode: cryptoJs.mode.CBC,
        padding: cryptoJs.pad.Pkcs7,
      });
    }
    return encryptedString.toString();
  };

  const getDocuments = async () => {
    var iv = cryptoJs.enc.Base64.parse("");
    var key = cryptoJs.SHA256("");
    try {
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const crypticVaultCon = new ethers.Contract(
        crypticVaultContractEthAddress,
        crypticVault,
        signer
      );
      let arr = [];

      let cids = await crypticVaultCon.getDocuments(
        localStorage.getItem("admin")
      );

      console.log(cids);

      for (var i = 0; i < cids.length; i++) {
        const meta = await axios.get(
          `https://${cids[i]}.ipfs.w3s.link/CrypticVault`
        );

        // console.log(meta.data);
        let d = decryptData(meta.data.file, iv, key);
        const blob = base64toBlob(d, meta.data.type);
        const url = URL.createObjectURL(blob);
        arr[i] = {
          file: url,
          name: meta.data.name,
          type: meta.data.type,
        };
      }
      setDocFiles(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const getDocumentsFromLightHouse = async () => {
    try {
      let arr = [];

      let cids = await getDriveData(
        web3.utils.toChecksumAddress(localStorage.getItem("admin"))
      );

      for (var i = 0; i < cids.length; i++) {
        const meta = await axios.get(
          `https://${cids[i].cid}.ipfs.w3s.link/CrypticVault`
        );

        let token = await getToken();
        let sig = await encryptionSignature();

        const keyObject = await lighthouse.fetchEncryptionKey(
          meta.data.file,
          sig.publicKey,
          token
        );

        const fileType = meta.data.type;
        const decrypted = await lighthouse.decryptFile(
          meta.data.file,
          keyObject.data.key,
          fileType
        );

        const url = URL.createObjectURL(decrypted);

        arr[i] = {
          file: url,
          name: meta.data.name,
          type: meta.data.type,
        };
      }
      setDocFiles(arr);
    } catch (err) {
      console.log(err);
    }
  };

  const base64toBlob = (data, type) => {
    // Cut the prefix `data:application/pdf;base64` from the raw base 64
    console.log(type, "type");
    // const base64WithoutPrefix = data.substr(`data:${type};base64,`.length);

    // console.log(base64WithoutPrefix, "base64WithoutPrefix");

    const bytes = atob(data);
    let length = bytes.length;
    let out = new Uint8Array(length);

    while (length--) {
      out[length] = bytes.charCodeAt(length);
    }
    return new Blob([out], { type: type });
  };

  function decryptData(encrypted, iv, key) {
    var decrypted = cryptoJs.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    });
    return decrypted.toString(cryptoJs.enc.Utf8);
  }

  function Decrypt(encrypted, iv, key) {
    let decData = cryptoJs.enc.Base64.parse(encrypted.toString()).toString(
      cryptoJs.enc.Utf8
    );
    let bytes = cryptoJs.AES.decrypt(decData, key).toString(cryptoJs.enc.Utf8);
    return JSON.parse(bytes);
  }

  return (
    <Web3StorageContext.Provider
      value={{
        makeFileObjects,
        storeJsonFiles,
        storeDriveFiles,
        getDocuments,
        getEncryptData,
        decryptData,
        base64toBlob,
        storeDriveFilesWithLighthouse,
        Decrypt,
        getDocumentsFromLightHouse,
        storeAgreementFileWithLighthouse,
        docsFiles,
        loading,
        isUpdated,
        agreementCid,
      }}
      {...props}
    >
      {props.children}
    </Web3StorageContext.Provider>
  );
};
