import { database }  from "../firebase.js";
import { getDoc, doc } from 'firebase/firestore';

export class Timesheet {
  constructor(timesheetId, date, status, userId) {
    this.timesheetId = timesheetId;
    this.date = date;
    this.status = status;
    this.userId = userId;
    this.timesheetEntries = [];
  }

  deleteEntry(index) {
    let entry = this.timesheetEntries[index];
    this.timesheetEntries = this.timesheetEntries.filter(x => x !== entry);
  }

  addEntry(entry) {
    this.timesheetEntries = [...this.timesheetEntries, entry];
  }

  getTimesheetEntry(id) {
    // find and return timesheet entry
  }

  setStatus(status) {
    this.status = status;
  }

  getStatus() {
    return this.status;
  }
  
  getEntries() {
    return this.timesheetEntries;
  }

  setEntries(entries) {
    this.timesheetEntries = [];
    for (let i = 0;; i++) {
      let item = entries[i];
      if (item) {
        item.entryID = i;
        this.timesheetEntries.push(item);
      } else {
        break;
      }
    }
  }
}

export class TimesheetInventory
{
  static instance = null;

  static getInstance() {
    if (TimesheetInventory.instance == null) {
      TimesheetInventory.instance = new TimesheetInventory();
    }
    return TimesheetInventory.instance;
  }

  async viewTimesheet(id) {
    let userId = sessionStorage.getItem("loggedIn");
    const userDocRef = doc(database, "users", userId);
    const timesheetDocRef = doc(userDocRef, "timesheets", id);
    let timesheetDoc = await getDoc(timesheetDocRef);
    let timesheet = new Timesheet(id, id, '', userId);
    timesheet.setEntries(timesheetDoc.data());
    return timesheet;
  }
}
