import React, { useState } from "react"
import Table from '../components/TimesheetTable/timesheetTable.js';
import { database }  from "../firebase.js";
import { doc, updateDoc, addDoc, setDoc } from "firebase/firestore";

function Timesheetpopout(person){
    const [showTimesheet, setShowTimesheet] = useState(false)
    const approveTimesheet = async () => {
        const approvedDoc = doc(database, "users/"+person.email+"/timesheets/"+person.date)
        await updateDoc(approvedDoc, {approved: true})
        const financeInbox = doc(database, "users/finance@mail.com/inbox/"+person.email)
        await setDoc(financeInbox, {date: person.date})
        window.location.reload()
    }
    
    const disapproveTimesheet = async () => {
        const disapprovedDoc = doc(database, "users/"+person.email+"/timesheets/"+person.date)
        await updateDoc(disapprovedDoc, {approved: false})
        window.location.reload()
    }
    
    return (showTimesheet) ? (
        <div className="popout">
            <button onClick={() => setShowTimesheet(false)}>Close</button>
            <Table userInfo={{email: person.email}} date={person.date}/>
            <button onClick={() => approveTimesheet()}>Approve</button>
            <p></p>
            <button onClick={() => disapproveTimesheet()}>Reject</button>
        </div>
    ) : (
        <div>
            <button onClick={() => setShowTimesheet(true)}>View Timesheet</button>
        </div>
    );
}


export default Timesheetpopout;