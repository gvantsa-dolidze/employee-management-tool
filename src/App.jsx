import "./App.css";
import React, { useState, useEffect } from "react";

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [newEmployee, setNewEmployee] = useState({
    name: "",
    department: "",
    role: "",
  });
  const [showEmployees, setShowEmployees] = useState(false); // State to control visibility

  // Fetch the employees.json file on mount
  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (savedEmployees && savedEmployees.length > 0) {
      setEmployees(savedEmployees);
    } else {
      // Fetch the employees.json file if no data is found in localStorage
      fetch("/employees.json")
        .then((response) => response.json())
        .then((data) => setEmployees(data))
        .catch((error) => console.error("Error loading employees:", error));
    }
  }, []);

  useEffect(() => {
    // Save the employees data to localStorage whenever it changes
    if (employees.length > 0) {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, [employees]);

  const handleSearch = () => {
    const found = employees.find(
      (emp) => emp.name.toLowerCase() === searchTerm.toLowerCase()
    );
    alert(found ? JSON.stringify(found, null, 2) : "No match found.");
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      alert("Name and department cannot be empty");
      return;
    }
    setEmployees([...employees, newEmployee]);
    setNewEmployee({ name: "", department: "", role: "" });
  };

  const handleListEmployees = () => {
    setShowEmployees(true); // Show the employee list when the button is clicked
    const savedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (savedEmployees) {
      setEmployees(savedEmployees);
    }
  };

  return (
    <div className="container">
      <div>
        <h1>Employee Management Tool</h1>
        <div className="controls">
          <button onClick={handleListEmployees}>List Employees</button>
          <button
            onClick={() =>
              setEmployees(
                [...employees].sort((a, b) => a.name.localeCompare(b.name))
              )
            }
          >
            Sort Employees
          </button>

          <input
            type="text"
            placeholder="Search by name"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>

          <input
            type="text"
            placeholder="Filter by department"
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
          />
        </div>

        {/* Conditionally render employee list */}
        {showEmployees && (
          <ul className="employee-list">
            {employees
              .filter((emp) =>
                departmentFilter
                  ? emp.department
                      .toLowerCase()
                      .includes(departmentFilter.toLowerCase())
                  : true
              )
              .map((emp, index) => (
                <li key={index} className="employee-item">
                  {emp.name} - {emp.department} - {emp.role}
                </li>
              ))}
          </ul>
        )}
      </div>

      <div className="add-section">
        <h2>Add New Employee</h2>
        <div className="add-employee-form">
          <input
            type="text"
            placeholder="Name"
            value={newEmployee.name}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, name: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Department"
            value={newEmployee.department}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, department: e.target.value })
            }
          />
          <input
            type="text"
            placeholder="Role"
            value={newEmployee.role}
            onChange={(e) =>
              setNewEmployee({ ...newEmployee, role: e.target.value })
            }
          />
          <button onClick={handleAddEmployee}>Add Employee</button>
        </div>
      </div>
    </div>
  );
};

export default App;
