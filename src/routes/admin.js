import React from 'react';
import './admin.css';

function Admin() {

    return (
        <div>
            <h1>Timesheet Management</h1>
            <table>
                <thead>
                    <tr>
                        <th>Awaiting Response</th>
                        <th>Access Given</th>
                        <th>Access Denied</th>
                    </tr>
                </thead>
                <tbody>
                    {/* Awaiting Response column */}
                    <tr>
                        <td>NewConsultant@mail.com</td>
                        <td>Consultant@example.com</td>
                        <td>BannedUser@mail.com</td>
                    </tr>
                    {/* Access Given column */}
                    <tr>
                        <td></td>
                        <td>Consultant@mail.com</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Manager@mail.com</td>
                        <td></td>
                    </tr>
                    <tr>
                        <td></td>
                        <td>Finance@mail.com</td>
                        <td></td>
                    </tr>
                </tbody>
            </table>
                <div className="button-container">
                    <button className="button">Make a Change</button>
                </div>
        </div>

    );
}

export default Admin;