import React from 'react';

const SidePanel = ({ selectedOption, setSelectedOption }) => {
  return (
    <div className="w-1/8 bg-gray-800 text-white p-4">
      <h2 className="text-2xl font-bold mb-6">Dashboard</h2>
      <ul>
        <li 
          className={`p-2 cursor-pointer ${selectedOption === 'departments' ? 'bg-gray-600' : ''}`}
          onClick={() => setSelectedOption('departments')}
        >
          Departments
        </li>
        <li 
          className={`p-2 cursor-pointer ${selectedOption === 'userPanel' ? 'bg-gray-600' : ''}`}
          onClick={() => setSelectedOption('userPanel')}
        >
          Users
        </li>
      </ul>
    </div>
  );
};


// const SidePanel = ({ selectedOption, setSelectedOption }) => {
//   return (
//     <div className="bg-gray-800 text-white w-full p-4 flex justify-between items-center">
//       <h2 className="text-2xl font-bold">Dashboard</h2>
//       <ul className="flex space-x-8 justify-center w-full">
//         <li 
//           className={`cursor-pointer ${selectedOption === 'departments' ? 'border-b-2 border-white' : ''}`}
//           onClick={() => setSelectedOption('departments')}
//         >
//           Department Panel
//         </li>
//         <li 
//           className={`cursor-pointer ${selectedOption === 'userPanel' ? 'border-b-2 border-white' : ''}`}
//           onClick={() => setSelectedOption('userPanel')}
//         >
//           User Panel
//         </li>
//       </ul>
//     </div>
//   );
// };

export default SidePanel;

