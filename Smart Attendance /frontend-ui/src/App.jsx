import React from 'react'
import { Routes, Route } from 'react-router-dom'
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from './pages/Login'
import Register from './pages/Register'
import Attendance from './pages/Attendance'
import Dashboard from './pages/Dashboard'
import ManageClasses from './pages/ManageClasses'
import ViewReports from './pages/ViewReports'
import AddTeacher from './pages/AddTeacher'
import AddStudent from './pages/AddStudent'
import ForgotPassword from './pages/ForgotPassword';
import Help from './pages/Help';
import Privacy from './pages/Privacy';
// import Footer from './components/Footer';

const App = () => {
  return (
    <div>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop
        closeOnClick
        pauseOnHover
      />
      <Routes>
        <Route path="/help" element={<Help />} />
        <Route path="/Privacy" element={<Privacy />} />
      <Route path="/login" element={<Login/>} />
      <Route path="/register" element={<Register/>} />
      <Route path="/forgot-password" element={<ForgotPassword/>} />
      <Route path="/attendance" element={<Attendance/>} />
      <Route path="/" element={<Dashboard/>} />
      <Route path="/attendance" element={<Attendance/>} />
      <Route path="/manage-classes" element={<ManageClasses/>} />
      <Route path="/view-reports" element={<ViewReports/>} />
      <Route path="/add-teacher" element={<AddTeacher/>} />
      <Route path="/add-student" element={<AddStudent/>} />
      </Routes>
      {/* <Footer /> */}
    </div>
  )
}

export default App
