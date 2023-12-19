import { getDoc } from "firebase/firestore";
import React, { useState, createContext, useEffect } from "react";

import {
  collection,
  addDoc,
  db,
  updateDoc,
  doc,
  query,
  where,
  getDocs,
} from "../firebase";

export const firebaseDataContext = createContext(undefined);

export const FirebaseDataContextProvider = (props) => {
  async function storeDriveData(data) {
    await addDoc(collection(db, "drive"), {
      admin: data.address,
      cid: data.cid,
    });
  }

  async function getDriveData(address) {
    try {
      var array = [];
      const driveData = query(
        collection(db, "drive"),
        where("admin", "==", address)
      );
      const driveSnapshot = await getDocs(driveData);
      driveSnapshot.forEach((e) => {
        array.push(e.data());
      });
      return array;
    } catch (error) {}
  }

  async function storeMembers(data) {
    await addDoc(collection(db, "members"), {
      admin: data.address,
      cid: data.cid,
    });
  }

  async function getMembersData(address) {
    try {
      var array = [];
      const membersData = query(
        collection(db, "members"),
        where("admin", "==", address)
      );
      const membersSnapshot = await getDocs(membersData);
      membersSnapshot.forEach((e) => {
        array.push(e.data());
      });
      return array;
    } catch (error) {}
  }

  async function StoreEmergencyAlert(data) {
    await addDoc(collection(db, "alertMessages"), {
      admin: data.address,
      subject: data.subject,
      message: data.message,
    });
  }

  async function updateEmergencyAlert(data) {
    const messageRef = doc(db, "alertMessages", data.id);
    await updateDoc(messageRef, {
      subject: data.subject,
      message: data.message,
    });
  }

  async function getEmergencyAlertMessage(address) {
    try {
      var messageObj = {};
      const messageData = query(
        collection(db, "alertMessages"),
        where("admin", "==", address)
      );
      const messageSnapshot = await getDocs(messageData);
      messageSnapshot.forEach((e) => {
        messageObj = e.data();
        messageObj.id = e.id;
      });
      return messageObj;
    } catch (error) {}
  }

  async function storeNotes(data) {
    await addDoc(collection(db, "notes"), {
      admin: data.address,
      cid: data.cid,
    });
  }

  async function getNotes(address) {
    try {
      var array = [];
      const notesData = query(
        collection(db, "notes"),
        where("admin", "==", address)
      );
      const notesSnapshot = await getDocs(notesData);
      notesSnapshot.forEach((e) => {
        let obj = e.data();
        obj.id = e.id;
        array.push(obj);
      });
      return array;
    } catch (error) {}
  }

  async function updateNotes(data) {
    console.log(data)
    const noteRef = doc(db, "notes", data.id);
    await updateDoc(noteRef, {
      cid: data.cid,
    });
  }

  return (
    <firebaseDataContext.Provider
      value={{
        storeDriveData,
        getDriveData,
        storeMembers,
        getMembersData,
        StoreEmergencyAlert,
        updateEmergencyAlert,
        getEmergencyAlertMessage,
        storeNotes,
        getNotes,
        updateNotes,
      }}
      {...props}
    >
      {props.children}
    </firebaseDataContext.Provider>
  );
};
