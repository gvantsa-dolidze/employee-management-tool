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
  const [showEmployees, setShowEmployees] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [searchResult, setSearchResult] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (savedEmployees && savedEmployees.length > 0) {
      setEmployees(savedEmployees);
    } else {
      fetch("/employees.json")
        .then((response) => response.json())
        .then((data) => setEmployees(data))
        .catch((error) => console.error("Error loading employees:", error));
    }
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, [employees]);

  const handleSearch = () => {
    const found = employees.filter(
      (emp) => emp.name.toLowerCase() === searchTerm.toLowerCase()
    );
    setSearchResult(found.length > 0 ? found : "No match found.");
    setIsModalOpen(true);
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      setErrorMessage("Name and department cannot be empty");
      return;
    }
    setErrorMessage("");
    setEmployees([...employees, newEmployee]);
    setNewEmployee({ name: "", department: "", role: "" });
  };

  const handleListEmployees = () => {
    setShowEmployees(true);
    const savedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (savedEmployees) {
      setEmployees(savedEmployees);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSearchResult(null);
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

        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal">
              <h2>Search Result</h2>
              {Array.isArray(searchResult) ? (
                searchResult.map((result, index) => (
                  <div key={index} className="border">
                    <p>
                      <strong>Name:</strong> {result.name}
                    </p>
                    <p>
                      <strong>Department:</strong> {result.department}
                    </p>
                    <p>
                      <strong>Role:</strong> {result.role}
                    </p>
                  </div>
                ))
              ) : (
                <p>{searchResult}</p>
              )}
              <button onClick={closeModal}>Close</button>
            </div>
          </div>
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

          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
