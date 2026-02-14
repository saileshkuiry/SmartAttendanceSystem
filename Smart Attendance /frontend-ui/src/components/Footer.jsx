import React from 'react'

const Footer = () => {
  return (
    <div>
      <footer className="dashboard-footer">
        <p>&copy; {new Date().getFullYear()} <strong>Smart Attendance</strong>. All rights reserved.</p>
      </footer>
    </div>
  )
}

export default Footer
