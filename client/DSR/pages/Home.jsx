import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import AddEditDepartment from '../components/AddEditDepartment';
import UserPanel from '../components/UserPanel';
import axiosInstance from '../utils/axiosInstance';
import SidePanel from '../components/SidePanel';

const Home = () => {
  const [userInfo, setUserInfo] = useState(null);
  const [selectedOption, setSelectedOption] = useState('departments'); // State to manage selected option
  const navigate = useNavigate(); // Define navigate here

  const getUserInfo = async () => {
    // console.log("fetching user...");
    try {
      // console.log("inside");
      const response = await axiosInstance.get("/get-user");
      if (response.data && response.data.user && response.data.user.role === 'Admin') {
        // console.log("response" + response.data.user);
        setUserInfo(response.data.user);
      }
      else{
        localStorage.clear();
        navigate("/login"); // Use navigate here
      }
    } catch (error) {
      if (error.response && error.response.status) {
        localStorage.clear();
        navigate("/login"); // Use navigate here
      }
    }
  }

  useEffect(() => { 
    getUserInfo();
  }, []);

  return (
    <>
      <Navbar userInfo={userInfo} selectedDept={""} />

      {/* Horizonal Panel */}
      {/* <SidePanel selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
      <div className="flex justify-center mt-4">
        {selectedOption === 'departments' && (
          <div className="w-8/12">
            <AddEditDepartment />
          </div>
        )}
        {selectedOption === 'userPanel' && (
          <div className="w-8/12">
            <UserPanel />
          </div>
        )}
      </div> */}
      
      {/* Vertical Panel */}
      <div className="flex min-h-screen"> 
        <SidePanel selectedOption={selectedOption} setSelectedOption={setSelectedOption} />
        <div className="w-7/8 p-4 flex-1"> 
          {selectedOption === 'departments' && (
            <div className="ml-7 mt-4">
              <AddEditDepartment />
            </div>
          )}
          {selectedOption === 'userPanel' && (
            <div className="ml-7 mt-4">
              <UserPanel />
            </div>
          )}
        </div>
      </div>

      {/* No Panel */}
      {/* <div className="flex">
        <div className="w-8/12 ml-7 mt-4">
          <UserPanel />
        </div>
        <div className="w-5/12 -mr-7 mt-4">
          <AddEditDepartment />
        </div>
      </div> */}
    </>
  );
};

export default Home;
