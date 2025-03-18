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
  const [searchResult, setSearchResult] = useState([]); // State to hold search results
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
    // Use filter to find all employees with the same name
    const found = employees.filter(
      (emp) => emp.name.toLowerCase() === searchTerm.toLowerCase()
    );
    // Set the search results, even if it's an empty array (no matches)
    setSearchResult(found.length > 0 ? found : "No match found.");
    setIsModalOpen(true); // Open the modal when search result is set
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

  // Close modal
  const closeModal = () => {
    setIsModalOpen(false);
    setSearchResult([]);
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
              {typeof searchResult === "string" ? (
                <p>{searchResult}</p> // No match found
              ) : (
                <div>
                  {searchResult.map((emp, index) => (
                    <div key={index}>
                      <p>
                        <strong>Name:</strong> {emp.name}
                      </p>
                      <p>
                        <strong>Department:</strong> {emp.department}
                      </p>
                      <p>
                        <strong>Role:</strong> {emp.role}
                      </p>
                      <hr />
                    </div>
                  ))}
                </div>
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
        </div>
      </div>
    </div>
  );
};

export default App;
