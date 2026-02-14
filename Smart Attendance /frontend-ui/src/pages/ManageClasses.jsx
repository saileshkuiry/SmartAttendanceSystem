import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import "../styles/ManageClasses.css";

const ManageClasses = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [search, setSearch] = useState("");

  const [newClass, setNewClass] = useState({
    class_name: "",
    teacher_name: "",
  });

  const [editId, setEditId] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem("token");

  /* ================= FETCH TEACHERS ================= */
  const fetchTeachers = async () => {
    const res = await axios.get("/api/manageclass/teacher", {
      headers: { Authorization: `Bearer ${token}` },
    });
    setTeachers(res.data);
  };

  /* ================= FETCH CLASSES ================= */
  const fetchClasses = async (searchText = "") => {
    const res = await axios.get(
      `/api/manageclass?search=${searchText}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );
    setClasses(res.data);
  };

  useEffect(() => {
    fetchTeachers();
    fetchClasses();
  }, []);

  /* ================= INPUT CHANGE ================= */
  const handleChange = (e) => {
    setNewClass({ ...newClass, [e.target.name]: e.target.value });
  };

  /* ================= ADD / UPDATE ================= */
  const submitClass = async () => {
    if (!newClass.class_name || !newClass.teacher_name) {
      toast.error("Please fill all fields");
      return;
    }

    setLoading(true);

    try {
      if (editId) {
        // UPDATE
        await axios.post(
          `/api/manageclass/update/${editId}`,
          newClass,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Class updated successfully!");
      } else {
        // ADD
        await axios.post(
          "/api/manageclass",
          newClass,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success("Class added successfully!");
      }

      setNewClass({ class_name: "", teacher_name: "" });
      setEditId(null);
      fetchClasses(search);

    } catch (err) {
      toast.error(err.response?.data?.message || "Operation failed");
    } finally {
      setLoading(false);
    }
  };

  /* ================= EDIT ================= */
  const handleEdit = (cls) => {
    setEditId(cls.manage_class_id);
    setNewClass({
      class_name: cls.class_name,
      teacher_name: cls.teacher_name,
    });
  };

  /* ================= DELETE ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure to delete?")) return;

    await axios.delete(
      `/api/manageclass/delete/${id}`,
      { headers: { Authorization: `Bearer ${token}` } }
    );

    toast.success("Class deleted successfully!");
    fetchClasses(search);
  };

  /* ================= SEARCH ================= */
  const handleSearch = (e) => {
    const value = e.target.value;
    setSearch(value);
    fetchClasses(value);
  };

  return (
    <div className="manage-container">
      {/* Header */}
      <header className="manage-header">
        <h2>Manage Classes</h2>
        <p>Create & assign teachers to classes</p>
      </header>

      {/* Add / Edit Class */}
      <div className="manage-card">
        <h3>{editId ? "Update Class" : "Assign Teachers To Classes"}</h3>

        <div className="form-grid">
          <input
            type="text"
            name="class_name"
            placeholder="Class Name"
            value={newClass.class_name}
            onChange={handleChange}
          />

          <select
            name="teacher_name"
            value={newClass.teacher_name}
            onChange={handleChange}
          >
            <option value="">Assign Teacher</option>
            {teachers.map((t, i) => (
              <option key={i} value={t.teacher_name}>
                {t.teacher_name}
              </option>
            ))}
          </select>
        </div>

        <button className="add-btn" onClick={submitClass} disabled={loading}>
          {loading
            ? "Processing..."
            : editId
            ? "Update Class"
            : "Add Class ⤵"}
        </button>
      </div>

      {/* Class List */}
      <div className="manage-card">
        <div className="list-header">
          <h3>Class List</h3>
          <input
            type="text"
            placeholder="Search class..."
            value={search}
            onChange={handleSearch}
          />
        </div>

        <div className="table-responsive">
          <table>
            <thead>
              <tr>
                <th>Class</th>
                <th>Teacher</th>
                <th>Action</th>
              </tr>
            </thead>

            <tbody>
              {classes.length > 0 ? (
                classes.map((cls) => (
                  <tr key={cls.manage_class_id}>
                    <td>{cls.class_name}</td>
                    <td>{cls.teacher_name}</td>
                    <td className="action-cell">
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(cls)}
                      >
                        Edit
                      </button>
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(cls.manage_class_id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="no-data">
                    No classes found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ManageClasses;
