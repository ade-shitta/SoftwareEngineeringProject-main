import React from 'react';
import { useState, useEffect } from 'react';
import './finance.css';
import closedEyeIcon from '../resources/closed-eye-icon.png';
import eyeIcon from '../resources/eye-icon.png';
import profileIcon from '../resources/profile-icon.png';
import Table from '../components/TimesheetTable/timesheetTable';
import PDFFile from '../components/PDF/PDFexport.js';
import { PDFDownloadLink } from '@react-pdf/renderer';
import { database }  from "../firebase.js";
import { getDocs, deleteDoc , getDoc, doc, collection } from 'firebase/firestore';

function Finance() {

  const [selectedUser, setSelectedUser] = useState();
  const [userData, setUserData] = useState([]);
  const [selectedTimesheetDate, setTimesheetDate] = useState();

  async function getData() {
    try{
      const usersRef = collection(database, "users");
      const financeInboxRef = collection(doc(collection(database, "users"), sessionStorage.getItem("loggedIn")), "inbox");

      const usersSnapshot = await getDocs(usersRef);
      const inboxSnapshot = await getDocs(financeInboxRef);

      const inboxDocs = inboxSnapshot.docs.map(doc => doc.id); // array of all inbox docs in firebase user collection

      const matchingUserDocs = usersSnapshot.docs.filter(doc => {
        const userDocId = doc.id;
        return inboxDocs.includes(userDocId);
      });

      const userData = matchingUserDocs.map(doc => ({
        name: doc.data().fname + " " + doc.data().sname,
        email: doc.data().email,
        role: doc.data().role
      }));
    
      setUserData(userData);
    }
    catch(e){
      console.log(e);
    }
  }

  useEffect(() => {
    getData();
  }, [])

  useEffect(() => {
    if (userData.length > 0){
      setSelectedUser(userData[0]);
    }
  }, [userData])

  useEffect(() => {
    if (selectedUser){
      const docRef = doc(database, "users/"+sessionStorage.getItem("loggedIn")+"/inbox/"+selectedUser.email)
      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          const dateGet = {
            date: doc.data().date
          }
          setTimesheetDate(dateGet.date)
        }
      })
    }
  }, [selectedUser])

  function inboxPlaceHolders() {
    const divHolder = []
    if (userData != 0) {
      for (let i=0; i<(5-userData.length); i++){
        divHolder.push(<div className='inbox-messages' key={`placeholder-${i}`}><h1 style={{ color: 'rgba(0, 0, 0, 0.5)' }}>empty</h1></div>)
      }
    }
    
    return divHolder;
  }

  async function removeSelected() {
    const docRef = doc(database, "users/finance@mail.com/inbox/"+selectedUser.email);
    console.log(selectedUser)
    await deleteDoc(docRef)
    window.location.reload()
  }

  return (
    <div id="finance-page-content">
      <div className="finance-sections" id="view-area">
        {<Table userInfo={selectedUser} date={selectedTimesheetDate} id="timesheetTable" />}
      </div>

      <div className="finance-sections" id="inbox-area">
          <h1>Inbox</h1>
          <div className="inbox-messages-holder">
            {userData.length == 0? <><h2 id="inbox-empty-msg">inbox is  empty</h2></> : null}
            {userData.map((user, index) => (
              <div onClick={() => setSelectedUser(user)} key={"{message}"+Math.random().toString()} id={`inbox-message-${selectedUser === user? "selected": ""}`} className='inbox-messages'>
                <img src={profileIcon} className='message-icon' id="inbox-profile-icon" />
                <h1>{user.name}</h1>
                <img src={selectedUser === user? eyeIcon: closedEyeIcon} className='message-icon' id="inbox-view-icon" />
            </div>
            ))}
            {userData.length < 5 && inboxPlaceHolders()}
          </div>
      </div>

      <div className="finance-sections" id="modifiers">
        <PDFDownloadLink document={<PDFFile user={selectedUser} date={selectedTimesheetDate}/>} fileName='Invoice.pdf' className='modifier-button'>
          {({ blob, url, loading, error }) =>
            loading ? "Loading document..." : <button>Download Invoice</button>
          }
        </PDFDownloadLink>
        <button className='modifier-button' id="remove-from-inbox" onClick={removeSelected}>Remove selected user from inbox</button>
      </div>
  </div>
  );
}

export default Finance;