import React, { useEffect, useState, useRef } from "react";
import Navbar from "../components/Navbar";
import Controls from "../components/Controls";
import DSR_Table from "../components/DSR_Table";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";

const DSR = () => {
  const [allEntries, setAllEntries] = useState([]);
  const [userInfo, setUserInfo] = useState(null);
  const [department, setDepartment] = useState("");
  const [lab, setLab] = useState("");
  const [section, setSection] = useState("");
  const tableRef = useRef(null);
  const navigate = useNavigate();

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/get-user");
      if (
        response.data &&
        response.data.user &&
        response.data.user.role !== "Admin"
      ) {
        setUserInfo(response.data.user);
        setDepartment(response.data.user.department || "");
        setLab(response.data.user.lab || "");
        setSection(response.data.user.section || "");
      } else {
        navigate("/home");
      }
    } catch (error) {
      if (error.response && error.response.status) {
        localStorage.clear();
        navigate("/login");
      }
    }
  };

  const getAllEntries = async (department, lab, section) => {
    try {
      const response = await axiosInstance.get("/get-all-entries", {
        params: {
          department: department,
          lab: lab,
          section: section,
        },
      });
      if (response.data && response.data.entries) {
        setAllEntries(response.data.entries);
      }
    } catch (error) {
      console.log("An unexpected error occurred. Please try again later.");
    }
  };

  useEffect(() => {
    getUserInfo();
    getAllEntries(department, lab, section);
  }, []);

  const handleConfirm = () => {
    getAllEntries(department, lab, section);
  };

  const handleExport = async () => {
    if (!tableRef.current) {
      alert("Table reference is not available.");
      return;
    }

    const doc = new jsPDF({ orientation: "landscape" });

    doc.text("Dead Stock Register", 14, 16); // Add a title to the PDF

    // Generate the table in the PDF
    doc.autoTable({
      html: tableRef.current,
      theme: "striped",
      startY: 20, // Start the table below the title
      margin: { top: 20 },
    });

    const pdfBlob = doc.output("blob");

    // Optionally, you can directly download the PDF
    // doc.save('DSR_Report.pdf');

    const pdfData = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(",")[1]); // Convert to base64
      reader.readAsDataURL(pdfBlob);
    });

    try {
      const response = await axiosInstance.post("/send-email", {
        to: userInfo.email,
        hodEmail: "hod@example.com", // Replace with the actual HOD's email
        subject: "DSR Report",
        body: "Please find the attached DSR report.",
        attachment: pdfData,
        filename: "DSR_Report.pdf",
      });

      if (response.status === 200) {
        alert("Email sent successfully!");
      } else {
        alert("Failed to send email.");
      }
    } catch (error) {
      console.error("Error sending email:", error);
      alert("An error occurred while sending the email.");
    }
  };

  const columns = [
    { header: "Component Name", accessor: "componentName" },
    { header: "Configuration", accessor: "config" },
    { header: "Model", accessor: "model" },
    { header: "POD", accessor: "pod" },
    { header: "Vendor", accessor: "vendor" },
    { header: "Purchase Order No.", accessor: "purchaseOrderNum" },
    { header: "Quantity", accessor: "quantity" },
    { header: "Per Unit Price", accessor: "perUnitPrice" },
    { header: "Total Price", accessor: "totalPrice" },
    { header: "Balance Amt", accessor: "balanceAmt" },
    { header: "Status", accessor: "status" },
    { header: "Location Of Component", accessor: "locationOfComponent" },
    { header: "Validated By", accessor: "validatedBy" },
    { header: "Comments", accessor: "comments" },
  ];

  return (
    <>
      <Navbar
        userInfo={userInfo}
        selectedDept={department} // Pass selectedDept to Navbar
      />
      <Controls
        selectedDept={department}
        selectedLab={lab}
        selectedSection={section}
        getAllEntries={getAllEntries}
        onSelectDept={setDepartment}
        onSelectLab={setLab}
        onSelectSection={setSection}
        onConfirm={handleConfirm}
        onExport={(department, lab, section) => {
          handleExport;
        }}
        tableRef={tableRef}
        userInfo={userInfo}
      />
      <DSR_Table
        ref={tableRef}
        columns={columns}
        data={allEntries}
        selectedDept={department}
        selectedLab={lab}
        selectedSection={section}
        getAllEntries={getAllEntries}
      />
    </>
  );
};

export default DSR;
