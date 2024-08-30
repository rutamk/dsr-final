import React, { useState, forwardRef } from 'react';
import Modal from 'react-modal';
import AddEditEntries from './AddEditEntries'; 

const DSR_Table = forwardRef(({ columns, data, selectedDept, selectedLab, selectedSection, getAllEntries }, ref) => {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalType, setModalType] = useState('add');
  const [entryData, setEntryData] = useState(null);

  const openModal = (type, entry = null) => {
    setModalType(type);
    setEntryData(entry);
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
    setEntryData(null);
    getAllEntries(selectedDept, selectedLab, selectedSection);
  };

  const handleRowDoubleClick = (entry) => {
    // console.log(selectedDept, selectedLab, selectedSection);
    // console.log("Entry ID:", entry._id);
    if (entry._id) {
      openModal('edit', entry); // Pass the entire entry, including `id`
    } else {
      console.error('Entry ID is missing:', entry);
    }
  };

  const columnStyles = {
    componentName: {
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      width: '200px',
    },
    purchaseOrderNum: {
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      width: '150px',
    },
    locationOfComponent: {
      whiteSpace: 'nowrap',
      verticalAlign: 'middle',
      width: '200px',
    },
  };

  return ( 
    <div className="p-4">
      <Modal isOpen={modalIsOpen} onRequestClose={closeModal} style={{
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
        }}>
        <AddEditEntries
          type={modalType}
          entryData={entryData}
          onClose={closeModal}
          selectedDept={selectedDept}
          selectedLab={selectedLab}
          selectedSection={selectedSection}
        />
      </Modal>

      <div className="overflow-x-auto" ref={ref} id='dsr-table-id'>
  <table className="min-w-full bg-white content-center table-auto">
    <thead>
      <tr>
        {/* Add the "Sr. No." header */}
        <th className="text-[13px] py-2 px-2 bg-gray-100 border border-neutral-600 mb-2">Sr. No.</th>
        {columns.map((column) => (
          <th
            key={column.accessor}
            className="text-[13px] py-2 px-2 bg-gray-100 border border-neutral-600 mb-2"
            style={columnStyles[column.accessor] || {}}
          >
            {column.header}
          </th>
        ))}
      </tr>
    </thead>
    <tbody className="text-[11px]">
      {data.length > 0 ? (
        data.map((entry, index) => (
          <tr
            key={entry.id}
            className="content-center hover:bg-slate-100 cursor-pointer"
            onDoubleClick={() => handleRowDoubleClick(entry)}
          >
            {/* Render the "Sr. No." for each row */}
            <td className="py-2 mt-2 border border-neutral-600 px-2 border-collapse">{index + 1}</td>
            {columns.map((column) => (
              <td
                key={column.accessor}
                className="py-2 mt-2 border border-neutral-600 px-2 border-collapse"
                style={columnStyles[column.accessor] || {}}
              >
                {entry[column.accessor]}
              </td>
            ))}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan={columns.length + 1} className="text-center py-4">
            No data available
          </td>
        </tr>
      )}
    </tbody>
  </table>
</div>

    </div>
  );
});

export default DSR_Table;
