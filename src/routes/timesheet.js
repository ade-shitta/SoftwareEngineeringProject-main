import React from 'react';
import './timesheet.css';
import { useState, useEffect, useRef } from 'react';
import { database }  from "../firebase.js";
import { setDoc, collection } from "@firebase/firestore";
import { getDoc, doc } from 'firebase/firestore';
import { Timesheet, TimesheetInventory } from '../models/timesheet.js';

function TimesheetPage() {

  const [timesheet, setTimesheet] = useState(new Timesheet());
  const [error, setError] = useState('');

  function deleteEntry(index) {
    timesheet.deleteEntry(index);
    setTimesheet(Object.create(timesheet));
  }

  function addEntry() {
    let id = new Date().getTime();
    timesheet.addEntry({entryID: id });
    setTimesheet(Object.create(timesheet));
  }

  useEffect(() => {
    const fetchData = async () => {
      try {
        const convertedDate = convertDate(getDate());
        let timesheetInventory = TimesheetInventory.getInstance();
        let tm = await timesheetInventory.viewTimesheet(convertedDate);
        if (tm) {
          setTimesheet(tm);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
      }
    };
  
    fetchData();
  }, []);
  

  const getDate = () => {
    var date = new Date()
    date = new Date(date.getFullYear(), date.getMonth(), date.getDate() - date.getDay());
    var edate = new Date(date.getFullYear(), date.getMonth(), date.getDate() + 7);
    return `${date.getDate()}/${date.getMonth()+1}/${date.getFullYear()} - ${edate.getDate()}/${edate.getMonth()+1}/${edate.getFullYear()}`;
  }

  const convertDate = () => {
    var date = getDate();
    if (date.includes("/")){
      var converted = date.replaceAll("/", ".");
      return converted;
    }
    else if (date.includes(".")) {
      var converted = date.replaceAll(".", "/");
      return converted;
    }
  }

  function renderProjectSelect(val) {
    var isDisabled = timesheet.getStatus() == 'submitted' ? true : false;
    return(
      <select defaultValue={val? val: "0"} disabled={isDisabled} className='project-input form-control' name='project_name'>
        <option value='0'>Choose project</option>
        <option value='project1'>Project 1</option>
        <option value='project2'>Project 2</option>
        <option value='project3'>Project 3</option>
        <option value='project4'>Project 4</option>
        <option value='project5'>Project 5</option>
        <option value='annualleave'>Annual Leave</option>
        <option value='companyevents'>Company Events</option>
      </select>
    );
  }
  
  function renderTask(val) {
    var isDisabled = timesheet.getStatus() == 'submitted' ? true : false;
    return(
    //Task name dropdown
    <select defaultValue={val? val : "0"} disabled={isDisabled} className='task-input form-control' name='task_name'>
      <option value='0'>Choose project</option>
      <option value='task1'>Task 1</option>
      <option value='task2'>Task 2</option>
      <option value='task3'>Task 3</option>
      <option value='task4'>Task 4</option>
      <option value='task5'>Task 5</option>
    </select>
    );
  }
  
  function renderProject(rowData, index) {
    let daysData = null;
    if (rowData != undefined) {
      daysData = [
        rowData.Sun,
        rowData.Mon,
        rowData.Tue,
        rowData.Wed,
        rowData.Thu,
        rowData.Fri,
        rowData.Sat
      ]
    } else {
      daysData = [
        0,
        0,
        0,
        0,
        0,
        0,
        0
      ]
      rowData = {};
    }
    //Project name dropdown
    var html = [];
    var isDisabled = timesheet.getStatus() == 'submitted' ? true : false;
    for (let i = 1; i <= 7; i++) {
      html.push(<td key={i}><input type="number" disabled={isDisabled} defaultValue={daysData[i-1]} min="0" max="24" name="hours_day{i-1}"/></td>);
    }
    return <tr key={rowData.entryID}>
      <td>{renderProjectSelect(rowData.project)}</td>
      <td>{renderTask(rowData.task)}</td>
      {html}
      <td><button type='button' onClick={deleteEntry.bind(this, index)}><i className="far fa-trash-alt me-2"></i>Delete</button></td>
    </tr>;
  }

  // firebaseStuff
  let dataHolder = document.getElementById("data-entry-holder");

  function getData(validate) {
    let rows = [];
    let total = [0, 0, 0, 0, 0, 0, 0];
    try{
      for (let i=0; i<dataHolder.children.length; i++){
        let row = dataHolder.children[i];
        let data = {
          project: row.children[0].children[0].value,
          task: row.children[1].children[0].value,
          Sun: row.children[2].children[0].value,
          Mon: row.children[3].children[0].value,
          Tue: row.children[4].children[0].value,
          Wed: row.children[5].children[0].value,
          Thu: row.children[6].children[0].value,
          Fri: row.children[7].children[0].value,
          Sat: row.children[8].children[0].value,
        };
        for (let j = 2; j <= 8; j++) {
          total[j - 2] += +row.children[j].children[0].value;
        }
        if (validate && data.project == '0') {
          setError("You must choose a project and task you are working on, please check and submit again.");
          return null;
        }
        rows.push(data);
      }
    }
    catch(e){
      console.log(e);
    }
    if (validate) {
      for (let i = 0; i < total.length; i++) {
        if (total[i] >= 24) {
          setError("The total sum of working hours per day must not exceed 24 hours, please check and submit again.");
          return null;
        }
      }
    }
    let objectRows = Object.assign({}, rows);
    return objectRows;
  }

  function saveTimesheet(e) {
    e.preventDefault();
    const convertedDate = convertDate(getDate());
    const docRef = doc(database, "users", sessionStorage.getItem("loggedIn"));
    const timesheetCollection = collection(docRef, "timesheets");
    const timesheetsDoc = doc(timesheetCollection, convertedDate);
    let data = getData(false);
    setDoc(timesheetsDoc, data).then(() => setError("Timesheet has been saved"));
  }

  function submitTimesheet(e) {
    e.preventDefault();
    const convertedDate = convertDate(getDate());
    const docRef = doc(database, "users", sessionStorage.getItem("loggedIn"));
    const timesheetCollection = collection(docRef, "timesheets");
    const timesheetsDoc = doc(timesheetCollection, convertedDate);
    let data = getData(true);
    if (data != null) {
      setDoc(timesheetsDoc, data).then(() => {
        timesheet.setStatus('submitted');
        setTimesheet(Object.create(timesheet));
        setError("Timesheet has been submitted");
      });
    }
  }

  return (
    <div>
      <form id="timesheetForm">
        <div className="title">Timesheet</div>
        <div id="day">{getDate()}</div>
          <fieldset id="timesheetFieldset">
                  <table id="timesheetTable" className="table-responsive">
                    <thead>
                      <tr>
                          <th id='projectName'>Project Name</th>
                          <th>Task</th>
                          <th className="day">Sun</th>
                          <th className="day">Mon</th>
                          <th className="day">Tue</th>
                          <th className="day">Wed</th>
                          <th className="day">Thu</th>
                          <th className="day">Fri</th>
                          <th className="day">Sat</th>
                          <th></th>
                      </tr>
                    </thead>
                    <tbody id="data-entry-holder">
                      {timesheet.getEntries().map((item, index) => renderProject(item, index))}
                    </tbody>
                  </table>
                  <div className="timesheetButtons">
                      <button className="tbuttons" type="button" id="addProject" onClick={addEntry}><i className="fas fa-folder-plus me-2"></i>Add project</button>
                      <button className="tbuttons" type="button" id="save" onClick={saveTimesheet}><i className="far fa-save me-2"></i>Save</button>
                      <button className="tbuttons" type="button" id="submit" onClick={submitTimesheet}><i className="fas fa-paper-plane me-2"></i>Submit</button>
                  </div>
          </fieldset>
      </form>
      {error && (
        <div className="overlay">
          <div className="error-message">
            {error}
            <button className="close-button" onClick={() => setError('')}>X</button>
          </div>
        </div>
      )}
    </div>
  );
}
export default TimesheetPage;
