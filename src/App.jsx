import './App.css'
import React, { useState, useEffect } from "react";

const initialEmployees = [
  { name: "Alice", department: "HR", role: "Manager" },
  { name: "Bob", department: "Engineering", role: "Developer" },
  { name: "Charlie", department: "Sales", role: "Representative" }
];

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [departmentFilter, setDepartmentFilter] = useState("");
  const [newEmployee, setNewEmployee] = useState({ name: "", department: "", role: "" });

  useEffect(() => {
    const savedEmployees = JSON.parse(localStorage.getItem("employees"));
    if (savedEmployees && savedEmployees.length > 0) {
      setEmployees(savedEmployees);
    } else {
      setEmployees(initialEmployees);
    }
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      localStorage.setItem("employees", JSON.stringify(employees));
    }
  }, [employees]);

  const handleSearch = () => {
    const found = employees.find(emp => emp.name.toLowerCase() === searchTerm.toLowerCase());
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

  return (
    <div>
      <h1>Employee Management Tool</h1>
      <button onClick={() => setEmployees(initialEmployees)}>List Employees</button>
      <button onClick={() => setEmployees([...employees].sort((a, b) => a.name.localeCompare(b.name)))}>Sort Employees</button>
      <input type="text" placeholder="Search by name" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
      <button onClick={handleSearch}>Search</button>
      <input type="text" placeholder="Filter by department" value={departmentFilter} onChange={(e) => setDepartmentFilter(e.target.value)} />
      <ul>
        {employees.filter(emp => (departmentFilter ? emp.department.toLowerCase().includes(departmentFilter.toLowerCase()) : true))
          .map((emp, index) => (
            <li key={index}>{emp.name} - {emp.department} - {emp.role}</li>
          ))}
      </ul>
      <h2>Add New Employee</h2>
      <input type="text" placeholder="Name" value={newEmployee.name} onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })} />
      <input type="text" placeholder="Department" value={newEmployee.department} onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })} />
      <input type="text" placeholder="Role" value={newEmployee.role} onChange={(e) => setNewEmployee({ ...newEmployee, role: e.target.value })} />
      <button onClick={handleAddEmployee}>Add Employee</button>
    </div>
  );
};

export default App;

