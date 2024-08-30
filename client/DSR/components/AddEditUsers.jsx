import React, { useEffect, useState } from 'react';
import axiosInstance from '../utils/axiosInstance';

const AddEditUsers = ({ user, onClose }) => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [selectedLabs, setSelectedLabs] = useState([]);
  const [selectedSections, setSelectedSections] = useState({}); 
  const [deleteConfirm, setDeleteConfirm] = useState("");

  // State for user fields
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('Lab Incharge');
  const [isAdmin, setIsAdmin] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false); //to disable button after one click

  // Effect to fetch departments
  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const response = await axiosInstance.get('/get-departments');
        setDepartments(response.data);
      } catch (error) {
        console.error('Error fetching departments:', error);
      }
    };

    fetchDepartments();
  }, []); // Only run on mount

  // Effect to set user details for editing
  useEffect(() => {
    if (user) {
      setFullName(user.fullName);
      setEmail(user.email);
      setPassword(user.password);
      setRole(user.role);
      if(user.role === "Admin") setIsAdmin(true);

      const selectedDept = departments.find(dept => 
        dept.deptName === user.departments[0]?.name
      );

      if (selectedDept) {
        setSelectedDepartment(selectedDept); 

        const labs = selectedDept.labs.map(lab => lab.labName);
        const userLabs = user.departments[0].labs.map(lab => lab.name);
        setSelectedLabs(userLabs);

        const sections = {};
        selectedDept.labs.forEach(lab => {
          if (userLabs.includes(lab.labName)) {
            sections[lab.labName] = [];
            lab.sections.forEach(section => {
              const userLab = user.departments[0].labs.find(userLab => userLab.name === lab.labName);
              if (userLab) {
                const isSelected = userLab.sections.some(sec => sec.name === section.sectionName);
                if (isSelected) {
                  sections[lab.labName].push(section.sectionName);
                }
              }
            });
          }
        });
        setSelectedSections(sections);
      }
    }
  }, [user, departments]); // Only re-run when user or departments change

  useEffect(() => {
    if( role === "Admin"){

      setIsAdmin(true);
    }
    else setIsAdmin(false);
  }, [role])
  
  const handleDepartmentSelection = (department) => {
    setSelectedDepartment(department);
    setSelectedLabs([]);
    setSelectedSections({}); 
  };

  const handleLabSelection = (lab) => {
    setSelectedLabs((prev) =>
      prev.includes(lab) ? prev.filter((l) => l !== lab) : [...prev, lab]
    );
    setSelectedSections((prev) => {
      if (!prev[lab]) {
        return { ...prev, [lab]: [] };
      }
      return prev;
    });
  };

  const handleSectionSelection = (lab, section) => {
    setSelectedSections((prev) => ({
      ...prev,
      [lab]: prev[lab]
        ? prev[lab].includes(section)
          ? prev[lab].filter((s) => s !== section)
          : [...prev[lab], section]
        : [section],
    }));
  };

  const handleSubmit = async () => {
    if (isUpdating) return; // Prevent multiple clicks
  
    setIsUpdating(true); // Disable button and indicate updating
    try {
      const formattedLabs = selectedLabs.map(lab => ({
        labName: lab,
        sections: selectedSections[lab] || []
      }));
  
      const payload = {
        fullName,
        email,
        password,
        role,
        department: selectedDepartment && !isAdmin ? selectedDepartment.deptName : null,
        labs: selectedLabs && !isAdmin ? formattedLabs : []
      };
  
      if (user) {
        // console.log(user);
        await axiosInstance.put(`/edit-user/${user._id}`, payload);
      } else {
        // console.log(payload)
        await axiosInstance.post('/add-user', payload);
      }
  
      onClose(); 
    } catch (error) {
      console.error('Error saving user:', error);
    }
    finally {
      setIsUpdating(false); // Re-enable button after update is complete
    }
  };
  
  const handleDelete = async () => {
    if (deleteConfirm === user.fullName) {
      try {
        if (user) {
          await axiosInstance.delete(`/delete-user/${user._id}`);
          onClose(); 
        }
        
      } catch (error) {
        console.error('Error deleting user:', error);
      }
    } else {
      alert("Username does not match. Please try again.");
    }
  };

  // const handleDelete = async () => {
  //   try {
  //     if (user) {
  //       await axiosInstance.delete(`/delete-user/${user._id}`);
  //       onClose(); 
  //     }
  //   } catch (error) {
  //     console.error('Error deleting user:', error);
  //   }
  // };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto relative">
        <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6 mt-4">
          {user ? 'Edit User' : 'Add User'}
        </h2>
  
        <button
          className="absolute top-4 right-4 bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded mt-6"
          onClick={onClose}
        >
          Cancel
        </button>
  
        <div className="mb-4">
          <label className="block mb-2 mt-1 text-xl font-medium">
            Full Name
            </label>
            <input
              type="text"
              className="border-slate-400 border bg-slate-50 p-2 mb- w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter full name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
         
          </div>
          <div className='mb-4'>
          <label className="block mb-2 mt-1 text-xl font-medium">
            Email
            </label>
            <input
              type="email"
              className="border-slate-400 border bg-slate-50 p-2 mb-2 w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          
          <label className="block mb-2 mt-1 text-xl font-medium">
            Password
            </label>
            <input
              type="text"
              className="border-slate-400 border bg-slate-50 p-2 mb-2 w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required={!user}
            />
          
          <label className="block mb-2 mt-1 text-xl font-medium">
            Role
            </label>
            <select
              className="border-slate-400 border bg-slate-50 p-2 mb-2 w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={role}
              onChange={(e) => setRole(e.target.value)}
            >
              <option value="HOD" >HOD</option>
              <option value="Lab Incharge">Lab Incharge</option>
              <option value="Lab Assistant">Lab Assistant</option>
              <option value="Admin">Admin</option>
            </select>
          
        </div>
  
        { !isAdmin && (
          <div>
          {departments.length > 0 && (
            <div className="mb-6">
              <h3 className="text-xl font-semibold mb-2">Select a Department:</h3>
              <div className="flex flex-wrap gap-6">
              {departments.map((department) => (
                <label key={department._id} className="block mb-2">
                  <input
                    type="radio"
                    name="department"
                    className="mr-2 w-5 h-5 align-middle cursor-pointer"
                    onChange={() => handleDepartmentSelection(department)}
                    checked={selectedDepartment?._id === department._id}
                  />
                  <span className="text-gray-800 text-lg">{department.deptName}</span>
                </label>
              ))}
              </div>
            </div>
          )}
          {selectedDepartment && (
            <div>
              <h3 className="text-xl font-semibold mb-2">{selectedDepartment.deptName} Labs:</h3>
              {selectedDepartment.labs.map((lab) => (
                <div key={lab._id} className="mb-4">
                  <label className="block mb-1 text-lg font-medium ">
                    <input
                      type="checkbox"
                      className="mr-2 w-5 h-5  cursor-pointer"
                      onChange={() => handleLabSelection(lab.labName)}
                      checked={selectedLabs.includes(lab.labName)}
                    />
                    <span className="text-gray-800 ">{lab.labName}</span>
                  </label>
                  {selectedLabs.includes(lab.labName) && (
                    <div className="ml-6 ">
                      <div className="flex flex-wrap gap-6">
                      {lab.sections.map((section) => (
                        <label key={section._id} className="flex items-center text-lg font-medium mb-1">
                          <input
                            type="checkbox"
                            className="mr-2 w-5 h-5 align-middle  cursor-pointer"
                            onChange={() => handleSectionSelection(lab.labName, section.sectionName)}
                            checked={selectedSections[lab.labName]?.includes(section.sectionName)}
                          />
                          <span className="text-gray-600 text-xl">{section.sectionName}</span>
                        </label>
                      ))}
                    </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
          </div>   
        )
        }
  
        <div className="mt-6">
          <button
            className="bg-green-500 hover:bg-green-600 text-white text-lg px-4 py-2 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
            onClick={handleSubmit}
            disabled={isUpdating}
          >
            {isUpdating ? 'Updating...' : (user ? 'Update User' : 'Add User')}
          </button>
          {user && (
            <div className="mt-6 p-4 rounded bg-red-100 border border-red-300">
              <h3 className="text-lg font-semibold mb-2">
                Delete User
              </h3>
              <p className="mb-2">
                To delete this user, please enter their name below for confirmation.
              </p>
              <input
                type="text"
                className="border-slate-400 border bg-slate-50 p-2 w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 mb-4"
                placeholder="Enter User name"
                value={deleteConfirm}
                onChange={(e) => setDeleteConfirm(e.target.value)}
              />
              <button
                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                onClick={handleDelete}
              >
                Delete User
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
  
}; 

export default AddEditUsers;
