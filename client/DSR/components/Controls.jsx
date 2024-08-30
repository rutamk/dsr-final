import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import AddEditEntries from './AddEditEntries';
import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import axiosInstance from '../utils/axiosInstance';
import { pdf_Logo } from '../utils/url';

// Set the app element for accessibility
Modal.setAppElement('#root');

const Controls = ({
  selectedDept,
  selectedLab,
  selectedSection,
  getAllEntries,
  onSelectDept,
  onSelectLab,
  onSelectSection,
  onExport,
  onConfirm,
  tableRef,
  userInfo
}) => {
  const [openAddEditModal, setOpenAddEditModal] = useState({
    isShown: false,
    type: 'add',
    data: null,
  });

  const [isTableReady, setIsTableReady] = useState(false);
  const [isExporting, setIsExporting] = useState(false); // New state for export button

  useEffect(() => {
    if (tableRef && tableRef.current) {
      setIsTableReady(true);
    }
  }, [tableRef]);

  // Open modal for adding new entry
  const handleAdd = () => {
    setOpenAddEditModal({
      isShown: true,
      type: 'add',
      data: null,
    });
  };

  // Handle department selection
  const handleSelectDept = (event) => {
    onSelectDept(event.target.value);
  };

  // Handle lab selection
  const handleSelectLab = (event) => {
    onSelectLab(event.target.value);
  };

  // Handle section selection
  const handleSelectSection = (event) => {
    onSelectSection(event.target.value);
  };

  // Close modal and refresh entries
  const closeModal = () => {
    setOpenAddEditModal({
      isShown: false,
      type: 'add',
      data: null,
    });

    getAllEntries(selectedDept, selectedLab, selectedSection);
  };

  // Extract departments, labs, and sections
  const departments = userInfo?.departments || [];
  const selectedDeptObj = departments.find(dept => dept.name === selectedDept);
  const labs = selectedDeptObj ? selectedDeptObj.labs : [];
  const selectedLabObj = labs.find(lab => lab.name === selectedLab);
  const sections = selectedLabObj ? selectedLabObj.sections : [];
  
  // Get the Lab Assistant's name
  const labAssistant = selectedLabObj?.assistantName || 'Lab Assistant';

  const sendEmail = async (pdfBlob) => {
    try {
      const formData = new FormData();
      formData.append('email', userInfo.email);
      formData.append('body', `Please find the attached DSR report for ${selectedDept} department, lab ${selectedLab}, section ${selectedSection}. Changes made by ${userInfo.fullName}.`);
      formData.append('attachment', pdfBlob, 'DSR_Report.pdf');
      formData.append('selectedDept', selectedDept);  // Ensure selectedDept is being appended
      const response = await axiosInstance.post('/send-email', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      if (response.status === 200) {
        alert('Email sent successfully!');
      } else {
        alert('Failed to send email.');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('An error occurred while sending the email.');
    }
  };

  const handleExport = async () => {
    if (isExporting) return; // Prevent multiple clicks
  
    setIsExporting(true); // Disable button and indicate exporting
  
    try {
      onExport(selectedDept, selectedLab, selectedSection);
  
      if (tableRef.current && tableRef.current.querySelectorAll('tr').length > 0) {
        const doc = new jsPDF({ orientation: 'landscape' });
        const head = [];
        const body = [];
  
        // Add logo
        const logoUrl = pdf_Logo;
         // Replace with your base64 logo
        const logoWidth = 30; // Adjust logo width
        const logoHeight = 12; // Adjust logo height
        const marginTop = 5; // Reduce top margin
        const marginRight = 5; // Reduce right margin
        const marginLeft = 5;
        // Add title
        const title = `Dead Stock Register ${selectedDept} lab ${selectedLab} section ${selectedSection}`;
        const pageWidth = doc.internal.pageSize.width;
        const titleWidth = doc.getTextWidth(title);
        
        const titleX = marginLeft ; // Center title horizontally
        const titleY = marginTop + 8 ; // Adjust Y position for title
  
        doc.addImage(logoUrl, 'PNG', pageWidth - logoWidth - marginRight, marginTop, logoWidth, logoHeight);
        doc.setFontSize(18);
        doc.text(title, titleX, titleY);
  
        const headers = tableRef.current.querySelectorAll('thead tr th');
        headers.forEach(header => {
          head.push(header.innerText);
        });
  
        const rows = tableRef.current.querySelectorAll('tbody tr');
        rows.forEach(row => {
          const rowData = [];
          const cells = row.querySelectorAll('td');
          cells.forEach(cell => {
            rowData.push(cell.innerText);
          });
          body.push(rowData);
        });
  
        doc.autoTable({
          head: [head],
          body: body,
          theme: 'striped',
          startY: titleY + 10, // Start table below the title with some space
          margin: { top: titleY + 5, left: 5, right: 5 }, // Adjust margins
        });
  
        // Add digital signature at the bottom right
        const pageHeight = doc.internal.pageSize.height;
        const marginBottom = 20; // Increase bottom margin
  
        const name = userInfo ? userInfo.fullName : 'Unknown';
        const role = userInfo ? userInfo.role : 'Unknown';
        const signatureText = `Digitally Signed By: ${name} (${role})\n`;
  
        doc.setFontSize(12);
        doc.text(signatureText, pageWidth - 15, pageHeight - marginBottom, { 
          align: 'right', 
          baseline: 'bottom' 
        });
  
        // Add system-generated text at the bottom left
        const systemGeneratedText = 'This is a system-generated document';
        doc.setFontSize(12);
        doc.text(systemGeneratedText, 15, pageHeight - marginBottom, { 
          align: 'left', 
          baseline: 'bottom' 
        });

        const pdfBlob = doc.output('blob');
  
        // Send the email with the PDF as an attachment
        await sendEmail(pdfBlob);
      } else {
        console.error('Table is not ready or has no data.');
        alert('Table is not ready or has no data.');
      }
    } catch (error) {
      console.error('Error during export:', error);
      alert('An error occurred during export.');
    } finally {
      setIsExporting(false); // Re-enable button after export is complete
    }
  };
  
  return (
    <div className="p-4 flex flex-row items-center justify-evenly space-x-4">
      {/* Button to open modal */}
      <button
        onClick={handleAdd}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 w-1/4"
      >
        Add New Entry
      </button>

      {/* Modal for adding/editing entries */}
      <Modal
        isOpen={openAddEditModal.isShown}
        onRequestClose={closeModal}
        style={{
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.2)',
            backdropFilter: 'blur(3px)',
          },
          content: {
            width: '90%',
            maxHeight: '90%',
            backgroundColor: 'white',
            borderRadius: '8px',
            margin: 'auto',
            padding: '20px',
            overflowY: 'auto',
          },
        }}
        contentLabel="Add/Edit Entry"
      >
        <AddEditEntries 
          type={openAddEditModal.type}
          entryData={openAddEditModal.data}
          onClose={closeModal}
          selectedDept={selectedDept}
          selectedLab={selectedLab}
          selectedSection={selectedSection}
        />
      </Modal>

      {/* Dropdown for departments */}
      <select
        value={selectedDept}
        onChange={handleSelectDept}
        className="block p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/4"
      >
        <option value="" disabled>Select Department</option>
        {departments.map((dept) => (
          <option key={dept._id.$oid} value={dept.name}>
            {dept.name}
          </option>
        ))}
      </select>

      {/* Dropdown for labs */}
      <select
        value={selectedLab}
        onChange={handleSelectLab}
        disabled={!selectedDept}
        className="block p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/4"
      >
        <option value="" disabled>Select Lab</option>
        {labs.map((lab) => (
          <option key={lab._id.$oid} value={lab.name}>
            {lab.name}
          </option>
        ))}
      </select>

      {/* Dropdown for sections */}
      <select
        value={selectedSection}
        onChange={handleSelectSection}
        disabled={!selectedLab}
        className="block p-2 border border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 w-1/4"
      >
        <option value="" disabled>Select Section</option>
        {sections.map((section) => (
          <option key={section._id.$oid} value={section.name}>
            {section.name}
          </option>
        ))}
      </select>

      {/* Confirm button */}
      <button
        onClick={onConfirm}
        disabled={!selectedDept || !selectedLab || !selectedSection}
        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed w-1/4"
      >
        Confirm
      </button>
      
      {/* Export button */}
      <button
        onClick={handleExport}
        disabled={!selectedDept || !selectedLab || !selectedSection || isExporting}
        className="bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600 disabled:opacity-50 disabled:cursor-not-allowed w-1/4"
      >
        {isExporting ? 'Exporting...' : 'Export to PDF'}
      </button>
    </div>
  );
};

export default Controls;