import React, { useEffect, useState } from 'react';
import './managerview.css';
import './timesheetpopout.js';
import Timesheetpopout from './timesheetpopout.js';
import { database }  from "../firebase.js";
import { getDoc, doc, collection, getDocs } from 'firebase/firestore';


//localStorage.setItem("submitted",localStorage.getItem("approved"))
//localStorage.setItem("approved", "[]")
//const managerEmail = sessionStorage.getItem("loggedIn")

function returnTimesheet(props){
  return(
  <div id="timesheet-div">
    <p>{props.name+" "+props.surname}</p>
    <p>{props.date}</p>
    <Timesheetpopout name={props.name} email={props.email} date={props.date}/>
  </div>
  );
}

function ManagerView() {
  const [submittedEmployees, setSubmittedEmployees] = useState([])

  async function getDisplayInfo(){
    try{
      const userDataQuery = await getDocs(collection(database, "users"))
      const assignedUsersQuery = await getDocs(collection(doc(collection(database, "users"), sessionStorage.getItem("loggedIn")), "consultants"))
      
      const userDataArray = userDataQuery.docs.map(doc => doc.data())
      const assignedIDS = assignedUsersQuery.docs.map(doc => doc.id)
      
      const assignedConsultants = userDataArray.filter(doc => {
        return assignedIDS.includes(doc.email)
      })

      let timesheetArray = []
      for (let x in assignedConsultants){
        const assignedConsultantsArr = await getDocs(collection(doc(collection(database, "users"), assignedConsultants[x].email), "timesheets"))
        if (assignedConsultantsArr.docs.map(docs => docs.id).length === 1){
          if(assignedConsultantsArr.docs.map(docs => docs.data().approved)[0] == undefined){
            timesheetArray.push({email: assignedConsultants[x].email, name: assignedConsultants[x].fname, surname: assignedConsultants[x].sname, date: assignedConsultantsArr.docs.map(docs => docs.id)[0]})
          }
        }
        else{
          const multipleDates = assignedConsultantsArr.docs.map(docs => docs.id)
          for (let y in multipleDates){
            timesheetArray.push({email: assignedConsultants[x].email, name: assignedConsultants[x].fname, surname: assignedConsultants[x].sname, date: assignedConsultantsArr.docs.map(docs => docs.id)[y]})
          }
        }
      }

      setSubmittedEmployees(timesheetArray)
      
    } catch(e){
      console.log(e)
    }
  }

  useEffect(() => {
    getDisplayInfo();
  }, [])

  return (
    <div>
        <div id="page-content">
          <div className="sections">
              <p>Submitted Timesheets</p>
              <div id='timesheet-display'>
                {submittedEmployees.map((employee) => returnTimesheet(employee))}
              </div>
          </div>
        </div>
    </div>
  );
}

export default ManagerView;