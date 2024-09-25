import React, { useState, useEffect } from 'react';
import { Routes, Route, Outlet } from 'react-router-dom';
import NavBar from './components/NavBar/navBar';
import Footer from './components/Footer/footer';
import Finance from './routes/finance';
import Index from './routes/index';
import Login from './routes/login';
import ForgotPassword from './routes/forgotPassword';
import Register from './routes/register';
import Timesheet from './routes/timesheet';
import ManagerView from './routes/managerview';
import Admin from './routes/admin';
import Dashboard from './routes/dashboard';
import Account from './routes/myaccount';

import { database }  from "./firebase.js";
import { getDoc, doc } from 'firebase/firestore';

function Layout() {
  return (
    <div>
      <Outlet />
    </div>
  );
}

function App() {
  const [userRole, setUserRole] = useState(null);

  useEffect(() => {
    checkSessionStorage();
  }, []);

  function checkSessionStorage() {
    const loggedIn = sessionStorage.getItem("loggedIn");
    if (loggedIn && loggedIn != "") {
      const docRef = doc(database, "users", loggedIn);

      getDoc(docRef).then((doc) => {
        if (doc.exists()) {
          setUserRole(doc.data().role);
        } else {
          alert("User not found");
        }
      }).catch(error => {
        console.error("Error fetching user:", error);
      });
    }
  }

  return (
    <div className="App">
      <NavBar />
      <Routes>
        
        {userRole === "consultant" && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="timesheet" element={<Timesheet />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="myaccount" element={<Account />} />
          </>
        )}
        {userRole === "manager" && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="myaccount" element={<Account />} />
            <Route path="manager" element={<ManagerView />} />
          </>
        )}
        {userRole === "finance" && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="myaccount" element={<Account />} />
            <Route path="finance" element={<Finance />} />
          </>
        )}
        {userRole === "admin" && (
          <>
            <Route index element={<Dashboard />} />
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="myaccount" element={<Account />} />
            <Route path="admin" element={<Admin />} />
          </>
        )}
        {!userRole && (
          <>
            <Route path='/' element={<Index />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
          </>
        )}
        <Route path='*' element={<Index />} />
        <Route path="forgotPassword" element={<ForgotPassword />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
