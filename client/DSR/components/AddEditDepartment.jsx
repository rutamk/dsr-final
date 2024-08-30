import React, { useState, useEffect } from "react";
import axiosInstance from "../utils/axiosInstance";

const AddEditDepartment = () => {
  const [departments, setDepartments] = useState([]);
  const [selectedDepartment, setSelectedDepartment] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState("");
  const [isUpdating, setIsUpdating] = useState(false); //to disable button after one click
  const [formData, setFormData] = useState({
    deptName: "",
    labs: [{ labName: "", sections: [{ sectionName: "" }] }],
  });

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    try {
      const response = await axiosInstance.get("/get-all-departments");
      // console.log(response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("Error fetching departments:", error);
    }
  };

  const handleOpenModal = (department) => {
    if (department) {
      setSelectedDepartment(department);
      setFormData(department);
    } else {
      setSelectedDepartment(null);
      setFormData({
        deptName: "",
        labs: [{ labName: "", sections: [{ sectionName: "" }] }],
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setDeleteConfirm("");
  };

  const handleInputChange = (e, labIndex, sectionIndex) => {
    const { name, value } = e.target;
    const updatedFormData = { ...formData };

    if (name === "deptName") {
      updatedFormData.deptName = value;
    } else if (name.startsWith("labName")) {
      updatedFormData.labs[labIndex].labName = value;
    } else if (name.startsWith("sectionName")) {
      updatedFormData.labs[labIndex].sections[sectionIndex].sectionName = value;
    }

    setFormData(updatedFormData);
  };

  const handleAddLab = () => {
    setFormData({
      ...formData,
      labs: [
        ...formData.labs,
        { labName: "", sections: [{ sectionName: "" }] },
      ],
    });
  };

  const handleAddSection = (labIndex) => {
    const updatedLabs = formData.labs.map((lab, index) => {
      if (index === labIndex) {
        return {
          ...lab,
          sections: [...lab.sections, { sectionName: "" }],
        };
      }
      return lab;
    });
    setFormData({ ...formData, labs: updatedLabs });
  };

  const handleSave = async () => {
    if (isUpdating) return; // Prevent multiple clicks

    setIsUpdating(true); // Disable button and indicate updating

    try {
      // Check if department name is present
      if (!formData.deptName) {
        throw new Error("Department name is required.");
      }

      // Validate labs array
      if (!formData.labs || formData.labs.length === 0) {
        throw new Error("At least one lab is required.");
      }

      // Validate each lab and its sections
      for (const lab of formData.labs) {
        if (!lab.labName) {
          throw new Error("Lab name is required.");
        }

        // Validate sections array within each lab
        if (!lab.sections || lab.sections.length === 0) {
          throw new Error(
            `At least one section is required for lab: ${lab.labName}`
          );
        }

        // Validate each section's name
        for (const section of lab.sections) {
          if (!section.sectionName) {
            throw new Error(`Section name is required in lab: ${lab.labName}`);
          }
        }
      }

      // Proceed with saving if validation passes
      if (selectedDepartment) {
        await axiosInstance.put(
          `/edit-department/${selectedDepartment._id}`,
          formData
        );
      } else {
        await axiosInstance.post("/create-department-structure", formData);
      }

      fetchDepartments();
      handleCloseModal();
    } catch (error) {
      console.error("Error saving department:", error);
      alert(error.message); // Optionally, you can display an alert to the user
    }
    finally {
      setIsUpdating(false); // Re-enable button after update is complete
    }
  };

  const handleDeleteLab = async (labId, labIndex) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      if (labId == null) {
        // console.log("lab is empty");
        const updatedLabs = formData.labs.filter(
          (_, index) => index !== labIndex
        );
        setFormData({ ...formData, labs: updatedLabs });
      } else {
        try {
          await axiosInstance.delete(
            `/delete-lab/${selectedDepartment._id}/${labId}`
          );
          fetchDepartments();
          handleCloseModal();
        } catch (error) {
          console.error("Error deleting lab:", error);
        }
      }
    }
  };

  const handleDeleteSection = async (
    labId,
    sectionId,
    labIndex,
    sectionIndex
  ) => {
    // console.log(sectionId);
    if (window.confirm("Are you sure you want to delete this section?")) {
      if (sectionId == null) {
        // console.log("undefined");
        const updatedLabs = formData.labs.map((lab, index) => {
          if (index === labIndex) {
            return {
              ...lab,
              sections: lab.sections.filter(
                (_, secIndex) => secIndex !== sectionIndex
              ),
            };
          }
          return lab;
        });
        setFormData({ ...formData, labs: updatedLabs });
      } else {
        try {
          await axiosInstance.delete(
            `/delete-section/${selectedDepartment._id}/${labId}/${sectionId}`
          );
          // console.log("deleted from db");
          fetchDepartments();
          handleCloseModal();
        } catch (error) {
          console.error("Error deleting section:", error);
        }
      }
    }
  };

  const handleDelete = async () => {
    if (deleteConfirm === selectedDepartment.deptName) {
      try {
        await axiosInstance.delete(
          `/delete-department/${selectedDepartment._id}`
        );
        fetchDepartments();
        handleCloseModal();
      } catch (error) {
        console.error("Error deleting department:", error);
      }
    } else {
      alert("Department name does not match. Please try again.");
    }
  };

  return (
  <div className="container mt-4 mx-auto p-4 max-w-full h-max sm:max-w-md md:max-w-xl lg:max-w-xl xl:max-w-xl bg-slate-50 border border-slate-400 rounded-lg shadow-md">
    <div className="flex flex-col md:flex-row justify-between items-center mb-4">
      <h1 className="text-3xl mt-3 mb-2 md:mb-0">Departments</h1>
      <button
        className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded mt-3"
        onClick={() => handleOpenModal(null)}
      >
        Add Department
      </button>
    </div>
    <table className="bg-white border border-gray-200 rounded-lg w-full h-[50vh] mt-5">
  <thead>
    <tr>
      <th className="bg-gray-200 text-gray-700 text-2xl border-b border-gray-300 px-8 py-4 font-semibold text-center">
        Department Name
      </th>
      <th className="bg-gray-200 text-gray-700 text-2xl border-b border-gray-300 px-8 py-4 font-semibold text-center">
        Labs
      </th>
    </tr>
  </thead>
  <tbody>
    {departments.map((department) => (
      <tr
        key={department._id}
        onDoubleClick={() => handleOpenModal(department)}
        className="cursor-pointer hover:bg-gray-100 transition duration-200"
      >
        <td className="border-b px-8 py-6 text-center text-lg">{department.deptName}</td>
        <td className="border-b px-8 py-6 text-center text-lg">
          {department.labs.map((lab) => lab.labName).join(', ')}
        </td>
      </tr>
    ))}
  </tbody>
</table>




    {showModal && (
      <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-50 ">
        <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:max-w-md md:max-w-2xl lg:max-w-3xl xl:max-w-4xl max-h-[90vh] overflow-y-auto relative">
          <h2 className="text-2xl md:text-3xl lg:text-4xl mb-6 mt-4">
            {selectedDepartment ? "Edit Department" : "Add Department"}
          </h2>

          {/* Department form fields */}
          <div className="mb-4">
            <label className="block mb-2 text-xl font-medium">
              Department Name
            </label>
            <input
              type="text"
              name="deptName"
              value={formData.deptName}
              onChange={(e) => handleInputChange(e)}
              className="border-slate-400 border bg-slate-50 p-2 w-full rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Enter department name"
            />
          </div>

          {formData.labs.map((lab, labIndex) => (
            <div key={labIndex} className="mb-6">
              <label className="block text-lg font-medium mb-2">Lab Name</label>
              <div className="flex flex-col md:flex-row items-center md:items-start">
                <input
                  type="text"
                  name={`labName-${labIndex}`}
                  value={lab.labName}
                  onChange={(e) => handleInputChange(e, labIndex)}
                  className="border-slate-400 border bg-slate-50 p-2 flex-grow rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter lab name"
                />
                <button
                  className="bg-red-100 text-slate-950 border border-red-500 hover:bg-red-300 px-4 py-2 rounded mt-2 md:mt-0 md:ml-4"
                  onClick={() => handleDeleteLab(lab._id, labIndex)}
                >
                  Delete Lab
                </button>
              </div>

              {lab.sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="ml-14 mb-4 mt-3">
                  <label className="block mb-2 text-md font-medium">Section Name</label>
                  <div className="flex flex-col md:flex-row items-center md:items-start">
                    <input
                      type="text"
                      name={`sectionName-${labIndex}-${sectionIndex}`}
                      value={section.sectionName}
                      onChange={(e) =>
                        handleInputChange(e, labIndex, sectionIndex)
                      }
                      className="border-slate-400 border bg-slate-50 p-2 flex-grow rounded shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Enter section name"
                    />
                    <button
                      className="bg-red-50 text-slate-950 border border-red-500 hover:bg-red-200 px-4 py-2 rounded mt-2 md:mt-0 md:ml-4"
                      onClick={() =>
                        handleDeleteSection(
                          lab._id,
                          section._id,
                          labIndex,
                          sectionIndex
                        )
                      }
                    >
                      Delete Section
                    </button>
                  </div>
                </div>
              ))}
              <button
                className="bg-green-100 text-slate-950 border border-green-500 hover:bg-green-200 px-4 py-2 rounded mt-2 ml-14"
                onClick={() => handleAddSection(labIndex)}
              >
                Add Section
              </button>
            </div>
          ))}

          <button
            className="bg-blue-100 text-slate-950 border border-blue-500 hover:bg-blue-200 px-4 py-2 rounded mt-4 "
            onClick={handleAddLab}
          >
            Add Lab
          </button>

          <div className="mt-6">
            <button
              className="bg-green-500 hover:bg-green-600 text-white text-lg px-4 py-2 rounded w-full disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={handleSave}
              disabled={isUpdating}
            >
              {isUpdating ? 'Saving...' : (selectedDepartment ? "Save Changes" : "Add Department")}
            </button>

            {selectedDepartment && (
              <div className="mt-6 p-4 rounded bg-red-100 border border-red-300">
                <h3 className="text-lg font-semibold mb-2">Delete Department</h3>
                <p className="mb-2">
                  To delete this department, please enter its name below for
                  confirmation.
                </p>
                <input
                  type="text"
                  className="border p-2 w-full mb-4 rounded shadow-sm"
                  placeholder="Enter department name"
                  value={deleteConfirm}
                  onChange={(e) => setDeleteConfirm(e.target.value)}
                />
                <button
                  className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                  onClick={handleDelete}
                >
                  Delete Department
                </button>
              </div>
            )}

            <button
              className="absolute top-4 right-4 bg-slate-500 hover:bg-slate-600 text-white px-4 py-2 rounded mt-6"
              onClick={handleCloseModal}
            >
              Cancel
            </button>
          </div>
        </div>
      </div>
    )}
  </div>
  );
};

export default AddEditDepartment;
