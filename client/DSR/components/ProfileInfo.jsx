import React, { useState, useEffect, useRef } from "react";

const ProfileInfo = ({ userInfo, onLogout }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const modalRef = useRef(null);
  // console.log("user->"+userInfo);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  const handleClickOutside = (event) => {
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      setIsModalOpen(false);
    }
  };

  useEffect(() => {
    if (isModalOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isModalOpen]);

  // Extracting the department name
  const departmentName = userInfo?.departments?.[0]?.name || "N/A";
  // Determine if the user is an admin
  const isAdmin = userInfo?.role?.trim().toLowerCase() === "admin";

  return (
    <>
      <div className="flex items-center gap-1 bg-white border-black border-[1px] rounded-2xl px-2 pt-2 pb-2 ml-2 mr-2">
        <p
          className="text-sm font-normal text-black cursor-pointer"
          onClick={toggleModal}
        >
          {!isAdmin ? (
            <span className="hover:text-blue-600 ">{userInfo?.fullName}</span>
          ) : (
            <span className="hover:text-blue-600 ">{userInfo?.fullName}</span>
          )}
        </p>

        <button
          className="text-sm text-black ml-2 bg-white py-1 px-1 border border-black rounded-lg hover:bg-slate-200"
          onClick={onLogout}
        >
          Logout
        </button>
      </div>

      {isModalOpen && (
        <div
          className="fixed top-[70px] right-3 flex justify-end items-start z-50 w-20"
          ref={modalRef}
        >
          <div className="bg-white p-6 w-80 shadow-lg border border-gray-600 rounded-lg">
            <p>
              <strong>{userInfo?.fullName}</strong>
            </p>
            <p>{userInfo?.email}</p>
            {!isAdmin && <p>{departmentName}</p>}
            <p>{userInfo?.role}</p>
            <button
              className="mt-4 text-sm text-white bg-blue-500 py-2 px-4 rounded hover:bg-blue-600"
              onClick={toggleModal}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </>
  );
};

export default ProfileInfo;
