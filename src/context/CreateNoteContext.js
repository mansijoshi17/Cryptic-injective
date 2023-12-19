import React, { useState, createContext, useEffect } from "react";
import cryptoJs from "crypto-js";
import axios from "axios";
import { create } from "ipfs-http-client";
import { Web3StorageContext } from "./Web3Storage";
import { firebaseDataContext } from "./FirebaseDataContext";
import { ethers, Signer } from "ethers";

import { crypticVaultContractEthAddress } from "../config";
import crypticVault from "../abi/CrypticVault.json";
import Web3 from "web3";

export const NoteContext = createContext();

export const NoteContextProvider = (props) => {
  const [search, setSearch] = useState(null);
  const [editNote, seteditNote] = useState({ title: "", input: "" });
  const [deleted, setDeleted] = useState({ title: "", input: "" });
  const [note, setNote] = useState({ title: "", input: "" });
  const [search_list, setSearch_list] = useState([]);
  const [notes_list, setNotes_list] = useState([]);
  const [visible, setVisible] = useState(false);
  const [pinned_id, setPinned_id] = useState(null);
  const [showPopUp, setShowPopUp] = useState(false);
  const [popUp_id, setPopUp_id] = useState(null);
  const [noteCid, setNoteCid] = useState(null);
  const [trash_list, setTrash_list] = useState([]);
  const [isUpdate, setIsUpdate] = useState(false);
  const [noteInput, setNoteInput] = useState("");
  const [noteTitle, setNoteTitle] = useState("");
  const [loading, setLoading] = useState(false);

  const client = create("https://ipfs.infura.io:5001/api/v0");

  const web3StorageContext = React.useContext(Web3StorageContext);
  const { makeFileObjects, storeJsonFiles } = web3StorageContext;

  const firebasedatacontext = React.useContext(firebaseDataContext);
  const { storeNotes, getNotes, updateNotes } = firebasedatacontext;

  async function getNoteData() {
    var array = [];
    var iv = cryptoJs.enc.Base64.parse("");
    var key = cryptoJs.SHA256("test123");

    const provider = new ethers.providers.Web3Provider(window.ethereum);

    const accounts = await provider.listAccounts();

    var cids;
    let role = localStorage.getItem("role");
    let admin = localStorage.getItem("admin");

    if (role !== null && admin !== null) {
      if (role == "admin") {
        cids = await getNotes(accounts[0]);
      } else {
        cids = await getNotes(
          Web3.utils.toChecksumAddress(localStorage.getItem("admin"))
        );
      }
    }



    if (cids.length > 0) {
      for (var i = 0; i < cids.length; i++) {
        const meta = await axios.get(
          `https://${cids[i].cid}.ipfs.w3s.link/notes.json`
        );

        let data;
        if (typeof meta.data == "string") {
          data = JSON.parse(meta.data);
        } else {
          data = meta.data;
        }

        var decryptTitle = decryptData(data.title, iv, key);
        var decryptInput = decryptData(data.input, iv, key);

        const decDeta = {
          id: cids[i].id,
          title: decryptTitle,
          input: decryptInput,
          cid: cids[i].cid,
          url: `https://${cids[i].cid}.ipfs.w3s.link/notes.json`,
        };

        array[i] = decDeta;
      }
      setNotes_list(array);
    }

    // if (array != null && array != []) {
    //   setNotes_list(array);
    // }
  }

  function decryptData(encrypted, iv, key) {
    var decrypted = cryptoJs.AES.decrypt(encrypted, key, {
      iv: iv,
      mode: cryptoJs.mode.CBC,
      padding: cryptoJs.pad.Pkcs7,
    });
    return decrypted.toString(cryptoJs.enc.Utf8);
  }

  const handleClick = () => {
    setVisible(true);
  };

  const handleSearch = (value) => {
    if (value.length > 0) {
      setSearch(value);
      const dd = notes_list.filter((note) => {
        return note.title.includes(value) || note.input.includes(value);
      });
      setSearch_list(dd);
    } else {
      setSearch(null);
      setSearch_list([]);
    }
  };
  const handleChangeNote = (value) => {
    setNote({ input: value, title: note.title, url: note.url });
  };

  const handleChangeTitle = (value) => {
    setNote({ input: note.input, title: value, url: note.url });
  };

  const handleChangeEditNote = (value) => {
    seteditNote({ input: value, title: editNote.title });
  };

  const handleChangeEditTitle = (value) => {
    seteditNote({ input: editNote.input, title: value });
  };

  const getEncryptData = async (data, iv, key, type) => {
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
    if (type == "title") {
      setNoteTitle(encryptedString.toString());
    } else {
      setNoteInput(encryptedString.toString());
    }
    return encryptedString.toString();
  };

  const addToNotes = async () => {
    setLoading(true);
    var inp;
    var ttl;
    var iv = cryptoJs.enc.Base64.parse("");
    var key = cryptoJs.SHA256("test123");
    const enDataInput = getEncryptData(note.input, iv, key, "input");
    const enDataTitle = getEncryptData(note.title, iv, key, "input");

    await enDataInput.then((e) => {
      inp = e;
    });
    await enDataTitle.then((e) => {
      ttl = e;
    });

    if (inp.length > 0 || ttl.length > 0) {
      let files = await makeFileObjects(
        {
          id: Date.now(),
          title: ttl,
          input: inp,
        },
        "notes.json"
      );

      let cid = await storeJsonFiles(files);
      let url = `https://${cid}.ipfs.w3s.link/notes.json`;

      console.log(url, "url");

      const provider = new ethers.providers.Web3Provider(window.ethereum);

      const accounts = await provider.listAccounts();

      let role = localStorage.getItem("role");

      if (role == "admin") {
        await storeNotes({
          address: accounts[0],
          cid: cid,
        });

        seteditNote({
          title: "",
          input: "",
          url: "",
        });
        setVisible(false);
        setIsUpdate(!isUpdate);
        setLoading(false);
        getNoteData();
      } else {
        await storeNotes({
          address: Web3.utils.toChecksumAddress(localStorage.getItem("admin")),
          cid: cid,
        });
        seteditNote({
          title: "",
          input: "",
          url: "",
        });
        setVisible(false);
        setIsUpdate(!isUpdate);
        setLoading(false);
        getNoteData();
      }
    } else {
      setVisible(false);
      setIsUpdate(!isUpdate);
      setLoading(false);
    }
  };

  // const removeFromNotes = (i, id) => {
  //   setLoading(true);
  //   let deleted_note = notes_list.filter((item) => {
  //     return item.id === id;
  //   })[0];
  //   trash_list.unshift(deleted_note);
  //   setTrash_list(trash_list);
  //   const notes_li = notes_list.filter((note, index) => {
  //     return index !== i;
  //   });
  //   if (pinned_id) {
  //     setNotes_list(notes_li);
  //     setIsUpdate(!isUpdate);
  //     setPinned_id(null);
  //   } else {
  //     setShowPopUp(false);
  //     setNotes_list(notes_li);
  //     setIsUpdate(!isUpdate);
  //   }
  //   localStorage.setItem("list", JSON.stringify(notes_li));
  //   localStorage.setItem("trash", JSON.stringify(trash_list));
  //   setIsUpdate(!isUpdate);
  //   setLoading(false);
  // };
  const pinNote = (id) => {
    setPinned_id(id);
  };
  const removePin = () => {
    setPinned_id(null);
  };
  const showNote = (id) => {
    let edited_note = notes_list.filter((item) => {
      return item.id === id;
    })[0];
    seteditNote(edited_note);
    setShowPopUp(true);
    setPopUp_id(id);
    setNoteCid(edited_note.cid);
    setIsUpdate(!isUpdate);
  };

  const updateNote = async (id) => {
    try {
      setLoading(true);
      var updateInput;
      var updateTitle;
      var iv = cryptoJs.enc.Base64.parse("");
      var key = cryptoJs.SHA256("test123");
      const enDataInput = getEncryptData(editNote.input, iv, key, "input");
      const enDataTitle = getEncryptData(editNote.title, iv, key, "input");

      await enDataInput.then((e) => {
        updateInput = e;
      });
      await enDataTitle.then((e) => {
        updateTitle = e;
      });

      const enData = JSON.stringify({
        title: updateTitle,
        input: updateInput,
      });

      let files = await makeFileObjects(
        enData,
        "notes.json",
        "application/json"
      );
      let cid = await storeJsonFiles(files);

      await updateNotes({
        id: id,
        cid: cid,
      });

      getNoteData();
      seteditNote({
        title: "",
        input: "",
        url: "",
      });
      setShowPopUp(false);
      setPopUp_id(null);
      setIsUpdate(!isUpdate);
      setLoading(false);
    } catch (error) {
      console.log(error);
    }
  };
  // const removeFromTrash = (id) => {
  //   setLoading(true);
  //   const trash_l = trash_list.filter((item) => {
  //     return item.id !== id;
  //   });
  //   setTrash_list(trash_l);
  //   localStorage.setItem("trash", JSON.stringify(trash_l));
  //   setIsUpdate(!isUpdate);
  //   setLoading(false);
  // };

  let styles = {
    inputStyle: {
      display: "flex",
    },
    inputStyle1: {
      display: "none",
    },
  };

  return (
    <NoteContext.Provider
      value={{
        pinned_id,
        notes_list,
        showPopUp,
        editNote,
        popUp_id,
        noteCid,
        search,
        search_list,
        handleChangeNote,
        pinNote,
        updateNote,
        // removeFromNotes,
        showNote,
        isUpdate,
        note,
        visible,
        handleClick,
        handleChangeTitle,
        addToNotes,
        handleChangeEditNote,
        handleChangeEditTitle,
        removePin,
        // removeFromTrash,
        trash_list,
        styles,
        handleSearch,
        decryptData,
        getNoteData,
        loading,
      }}
    >
      {props.children}
    </NoteContext.Provider>
  );
};
