import React from "react";
import "../styles/InfoPage.css";
import { FaShieldAlt } from "react-icons/fa";

const Privacy = () => {
  return (
    <div className="info-container">
      <h1><FaShieldAlt /> Privacy Policy</h1>

      <section>
        <h3>Information We Collect</h3>
        <p>School, teacher, student, and attendance-related information.</p>
      </section>

      <section>
        <h3>Usage of Data</h3>
        <p>Used only for attendance management and reporting.</p>
      </section>

      <section>
        <h3>Data Security</h3>
        <p>All data is protected using secure authentication methods.</p>
      </section>

      <section>
        <h3>Data Sharing</h3>
        <p>We do not share data with third parties.</p>
      </section>

      <section>
        <h3>User Responsibility</h3>
        <p>Keep your login credentials safe and private.</p>
      </section>

      <section>
        <h3>Policy Updates</h3>
        <p>This policy may change to improve system security.</p>
      </section>
    </div>
  );
};

export default Privacy;
