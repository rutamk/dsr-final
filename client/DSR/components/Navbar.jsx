import React from 'react';
import ProfileInfo from './ProfileInfo';
import { useNavigate } from 'react-router-dom';

const Navbar = ({ userInfo, selectedDept }) => {
  const navigate = useNavigate();

  const onLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  // Check if the user is an admin
  const isAdmin = userInfo?.role?.trim().toLowerCase() === 'admin';
  // console.log(userInfo);

  // Extract the department name from userInfo, only if the user is not an admin
  const departmentName = selectedDept || (userInfo?.departments?.length > 0 ? userInfo.departments[0].name : 'Department');

  return (
    <div className={`grid ${!isAdmin ? 'grid-cols-3' : 'grid-cols-3'} items-center shadow-lg bg-white h-20 pt-2 pb-2 my-auto`}>
      {/* VIT Logo */}
      <img src="../../src/assets/Logo1.png" alt="VIT Logo" className="w-[150px] justify-start pl-4 "/>

      {/* Conditionally display department name or "Admin Login" */}
      <div className='font-medium text-3xl text-center'>
        {isAdmin ? 'Admin Login' : `Department of ${departmentName}`}
      </div>

      {/* ProfileInfo */}
      <div className={`flex justify-end  mt-0 ${!isAdmin ? '' : ''}`}>
        <ProfileInfo userInfo={userInfo} onLogout={onLogout} selectedDept={selectedDept} />
      </div>
    </div>
  );
};

export default Navbar;
