import { Link } from "react-router-dom";
import "./myaccount.css";


function Account() {

  return (
    <div className="my-account-container">
      <div className="card">
        <h2>User Information</h2>
        <p>Contact your <a href="mailto:admin@mail.com">admin</a> to change personal information</p>
      </div>
      <div className="card">
        <h2>Change Password</h2>
        <p>Click the button below to change your password.</p>
        <Link to="/forgotPassword" id="back">
          Change Password
        </Link>
      </div>
    </div>
  );
}

export default Account;
