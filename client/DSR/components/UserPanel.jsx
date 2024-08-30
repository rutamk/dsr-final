import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import axiosInstance from '../utils/axiosInstance';
import AddEditUsers from '../components/AddEditUsers';

const UserPanel = () => {
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);

  const fetchAllUsers = async () => {
    try {
      const response = await axiosInstance.get('/get-all-users');
      const sortedUsers = sortUsers(response.data);
      setUsers(sortedUsers);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  // Function to sort users by department and role
  const sortUsers = (users) => {
    return users.sort((a, b) => {
      // Extract department names from the nested structure
      const deptA = (a.departments && a.departments[0] && a.departments[0].name) ? a.departments[0].name.toLowerCase() : '';
      const deptB = (b.departments && b.departments[0] && b.departments[0].name) ? b.departments[0].name.toLowerCase() : '';

      // Sort by department alphabetically
      if (deptA < deptB) return -1;
      if (deptA > deptB) return 1;

      // If in the same department, sort by role
      const roleOrder = ['HOD', 'Lab Incharge', 'Lab Assistant'];
      return roleOrder.indexOf(a.role) - roleOrder.indexOf(b.role);
    });
  };

  useEffect(() => {
    fetchAllUsers();
  }, []);

  const handleAddUser = () => {
    setSelectedUser(null); // Clear selected user for adding
    setModalOpen(true);
  };

  const handleRowDoubleClick = (user) => {
    setSelectedUser(user); // Set the selected user for editing
    setModalOpen(true);
  };

  const handleModalClose = () => {
    setModalOpen(false);
    fetchAllUsers(); // Fetch users again to reflect changes
  };

  // Inline styles for modal
  const customStyles = {
    overlay: {
      backgroundColor: 'rgba(17 ,24 ,39, 0.5)', // Semi-transparent dark background
    },
    content: {
      border: 'none',
      backgroundColor: 'transparent'
    }
  };

  return (
  <div className="mt-4 p-4 mb-4 bg-slate-50 border border-slate-400 rounded-lg shadow-md">
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <h1 className="text-3xl mt-3 mb-2 md:mb-0">User Management</h1>
      <button
        onClick={handleAddUser}
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
      >
        Add New User
      </button>
    </div>
    
    <div className="overflow-y-auto max-h-screen">
      <table className="bg-white border border-gray-300 rounded-lg shadow-md w-full">
        <thead>
          <tr className="bg-gray-200 text-gray-700 text-left text-xl">
            <th className="border-b border-gray-300 px-6 py-3 font-semibold">Full Name</th>
            <th className="border-b border-gray-300 px-6 py-3 font-semibold">Email</th>
            <th className="border-b border-gray-300 px-6 py-3 font-semibold">Department</th>
            <th className="border-b border-gray-300 px-6 py-3 font-semibold">Role</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr
              key={user._id}
              onDoubleClick={() => handleRowDoubleClick(user)}
              className="hover:bg-gray-100 transition duration-200"
            >
              <td className="border-b border-gray-300 px-6 py-4">{user.fullName}</td>
              <td className="border-b border-gray-300 px-6 py-4">{user.email}</td>
              <td className="border-b border-gray-300 px-6 py-4">
                {(user.departments && user.departments[0] && user.departments[0].name) || 'N/A'}
              </td>
              <td className="border-b border-gray-300 ">{user.role}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
      {/* Modal for adding/editing user */}
      <Modal isOpen={modalOpen} 
             onRequestClose={handleModalClose}
             style={customStyles}
      >
        <AddEditUsers user={selectedUser} onClose={handleModalClose} />
      </Modal>
    </div>
  );
}; 

export default UserPanel;
