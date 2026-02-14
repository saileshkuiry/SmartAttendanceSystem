import React from "react";
import "../styles/InfoPage.css";
import { FaQuestionCircle } from "react-icons/fa";

const Help = () => {
  return (
    <div className="info-container">
      <h1><FaQuestionCircle /> Help</h1>

      <section>
        <h3>Dashboard</h3>
        <p>View teachers, students, and quick actions from the dashboard.</p>
      </section>

      <section>
        <h3>Add Teacher</h3>
        <p>Add new teachers by filling in required details.</p>
      </section>

      <section>
        <h3>Add Students</h3>
        <p>Register students and assign them to classes.</p>
      </section>

      <section>
        <h3>Manage Classes</h3>
        <p>Create and manage classes and sections.</p>
      </section>

      <section>
        <h3>Attendance</h3>
        <p>Mark daily attendance and save records securely.</p>
      </section>

      <section>
        <h3>Reports</h3>
        <p>View attendance reports by date, class, or student.</p>
      </section>

      <section>
        <h3>Need Support?</h3>
        <p>Please contact the system administrator for help.</p>
      </section>
    </div>
  );
};

export default Help;
