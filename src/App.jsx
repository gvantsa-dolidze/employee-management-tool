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
  const [errorMessage, setErrorMessage] = useState(""); // State for error message
  const [searchResult, setSearchResult] = useState(null); // State to hold search result
  const [isModalOpen, setIsModalOpen] = useState(false); // State to control modal visibility

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
    const found = employees.filter(
      (emp) => emp.name.toLowerCase() === searchTerm.toLowerCase()
    );
    // Instead of alert, set the found result to state
    setSearchResult(found.length > 0 ? found : "No match found.");
    setIsModalOpen(true); // Open the modal when search result is set
  };

  const handleAddEmployee = () => {
    if (!newEmployee.name || !newEmployee.department) {
      setErrorMessage("Name and department cannot be empty"); // Set error message
      return;
    }
    setErrorMessage(""); // Clear the error message if everything is valid
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

  // Close modal
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

        {/* Modal for search result */}
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
                <p>{searchResult}</p> // No match found
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

          {/* Display error message */}
          {errorMessage && <p className="error-message">{errorMessage}</p>}
        </div>
      </div>
    </div>
  );
};

export default App;
