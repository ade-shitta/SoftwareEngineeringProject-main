import React, { useState, useEffect } from "react";
import { database }  from "../../firebase.js";
import { getDoc, doc } from 'firebase/firestore';

export default function Table(props) {

    const [timesheetData, setTimesheetData] = useState([]);
    var totalWorkedHours = 0;
    
    useEffect(() => {
        if (props.userInfo && props.date) {
            const userDocRef = doc(database, "users", props.userInfo.email);
            const timesheetDocRef = doc(userDocRef, "timesheets", props.date);

            getDoc(timesheetDocRef).then((doc) => {
                if (doc && doc.data() != undefined) {
                    const filteredData = Object.entries(doc.data()).filter(([key]) => key !== "approved")
                    setTimesheetData(filteredData);
                }
            });    
        }
    }, [props])
    
    function loadRows(item, index) {
        const rowData = item[1];

        if (rowData != undefined) {
        let daysData = [
            rowData.Sun,
            rowData.Mon,
            rowData.Tue,
            rowData.Wed,
            rowData.Thu,
            rowData.Fri,
            rowData.Sat
        ]

        //Project name dropdown
        var html = []
        for (let i = 1; i <= 7; i++) {
            html.push(<td key={i}>{daysData[i-1] == 0? 0 : daysData[i-1]}</td>);
            totalWorkedHours += Number(daysData[i-1]);
        }
        
        if (rowData.project != 0 || rowData.task != 0) {
            return (
            <tr key={index}>
                <td>{rowData.project}</td>
                <td>{rowData.task}</td>
                {html}
            </tr>
            )}    
        }
    }

    return (
        <div id="timesheetViewTable">
            <table>
                <thead>
                    <tr>
                        <th id='projectName'>Project Name</th>
                        <th>Task</th>
                        <th className="day">Mon</th>
                        <th className="day">Tue</th>
                        <th className="day">Wed</th>
                        <th className="day">Thu</th>
                        <th className="day">Fri</th>
                        <th className="day">Sat</th>
                        <th className="day">Sun</th>
                    </tr>
                </thead>
                <tbody>
                    {timesheetData.map((item, index) => loadRows(item, index))}
                    <tr>
                        <td colSpan={2}>Total hours:</td>
                        <td colSpan={7}>{totalWorkedHours}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
}