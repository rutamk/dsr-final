import React, { useState, useEffect } from 'react';
import { MdClose } from 'react-icons/md';
import axiosInstance from '../utils/axiosInstance';

const AddEditEntries = ({ type, entryData, onClose, selectedDept, selectedLab, selectedSection }) => {
  
  // const [srNo, setSrNo] = useState(entryData?.srNo || "");
  const [componentName, setComponentName] = useState(entryData?.componentName || "");
  const [config, setConfig] = useState(entryData?.config || "");
  const [model, setModel] = useState(entryData?.model || "");
  const [pod, setPod] = useState(entryData?.pod || ""); 
  const [vendor, setVendor] = useState(entryData?.vendor || "");
  const [purchaseOrderNum, setPurchaseOrderNum] = useState(entryData?.purchaseOrderNum || "");
  const [totalPrice, setTotalPrice] = useState(entryData?.totalPrice || "");
  const [perUnitPrice, setPerUnitPrice] = useState(entryData?.perUnitPrice || "");
  const [balanceAmt, setBalanceAmt] = useState(entryData?.balanceAmt || "");
  const [quantity, setQuantity] = useState(entryData?.quantity || "");
  const [status, setStatus] = useState(entryData?.status || "");
  const [locationOfComponent, setLocationOfComponent] = useState(entryData?.locationOfComponent || "");
  const [validatedBy, setValidatedBy] = useState(entryData?.validatedBy || "");
  const [comments, setComments] = useState(entryData?.comments || "");
  const [error, setError] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false); //to disable button after one click

  
  useEffect(() => {
    calculateTotalPrice();
  }, [perUnitPrice, quantity]);

  const calculateTotalPrice = () => {
    if (perUnitPrice && quantity) {
      setTotalPrice(perUnitPrice * quantity);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    switch (name) {
      // case 'srNo':
      //   setSrNo(value);
      //   break;
      case 'componentName':
        setComponentName(value);
        break;
      case 'config':
        setConfig(value);
        break;
      case 'model':
        setModel(value);
        break;
      case 'pod':
        setPod(value);
        break;
      case 'vendor':
        setVendor(value);
        break;
      case 'purchaseOrderNum':
        setPurchaseOrderNum(value);
        break;
      case 'perUnitPrice':
        setPerUnitPrice(value);
        break;
      case 'balanceAmt':
        setBalanceAmt(value);
        break;
      case 'quantity':
        setQuantity(value);
        break;
      case 'status':
        setStatus(value);
        break;
      case 'locationOfComponent':
        setLocationOfComponent(value);
        break;
      case 'validatedBy':
        setValidatedBy(value);
        break;
      case 'comments':
        setComments(value);
        break;
      default:
        break;
    }
  };

  const handleAddEntry = async () => {
    const entry = {
      // srNo,
      componentName,
      config,
      model,
      pod,
      vendor,
      purchaseOrderNum,
      totalPrice,
      perUnitPrice,
      balanceAmt,
      quantity,
      status,
      locationOfComponent,
      validatedBy,
      comments
    };

    if (isUpdating) return; // Prevent multiple clicks
  
    setIsUpdating(true); // Disable button and indicate updating

    try {
      if (type === 'edit') {
        // console.log("1");
        // console.log("fff",selectedDept, selectedLab, selectedSection);
          await axiosInstance.put(`/update-dsr-entry/${entryData._id}`, {
          selectedDept,
          selectedLab,
          selectedSection,
          ...entry
        });
      } else {
        // console.log("1");
        // console.log("fff",selectedDept, selectedLab, selectedSection);
        await axiosInstance.post(`/add-dsr-entry`, {
          selectedDept,
          selectedLab,
          selectedSection,
          ...entry
        });
      }
      onClose();
    } catch (err) {
      setError('Error processing request');
      console.error(err);
    }
    finally {
        setIsUpdating(false); // Re-enable button after update is complete
      }
  };

  const handleDelete = async () => {
    try {
      // console.log("1");
      await axiosInstance.delete(`/delete-dsr-entry/${entryData._id}`, {
        params: {
          selectedDept,
          selectedLab,
          selectedSection
        }
      });
      onClose();
    } catch (err) {
      setError('Error deleting entry');
      console.error(err);
    }
  };
  

  const isFormValid = () => {
    return componentName && config && model && pod && vendor && purchaseOrderNum && totalPrice && balanceAmt && quantity && status && locationOfComponent && validatedBy;
  };

  return ( 
    <div className='relative p-3 flex-col'>
      <button 
        onClick={onClose} 
        className='w-8 h-8 rounded-md flex items-center justify-center absolute -top-2 -right-2'>
        <MdClose className='text-2xl hover:scale-150 transition-all ease-in-out'/>
      </button>

      <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
        {/* <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Serial Number</label>
          <input 
            type='number'
            name='srNo'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add a serial number'
            value={srNo}
            onChange={handleChange}
          />
        </div> */}
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Component Name</label>
          <input 
            type='text'
            name='componentName'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add component name'
            value={componentName}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Config</label>
          <input 
            type='text'
            name='config'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add config'
            value={config}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Model</label>
          <input 
            type='text'
            name='model'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add model'
            value={model}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Pod</label>
          <input 
            type='text'
            name='pod'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add pod'
            value={pod}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Vendor</label>
          <input 
            type='text'
            name='vendor'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add vendor'
            value={vendor}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Purchase Order Number</label>
          <input 
            type='text'
            name='purchaseOrderNum'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add purchase order number'
            value={purchaseOrderNum}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Per Unit Price</label>
          <input 
            type='number'
            name='perUnitPrice'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add per unit price'
            value={perUnitPrice}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Quantity</label>
          <input 
            type='number'
            name='quantity'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add quantity'
            value={quantity}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Total Price</label>
          <input 
            type='number'
            name='totalPrice'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Total price'
            value={totalPrice}
            readOnly
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Balance Amount</label>
          <input 
            type='number'
            name='balanceAmt'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add balance amount'
            value={balanceAmt}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Status</label>
          <input 
            type='text'
            name='status'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add status'
            value={status}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Location of Component</label>
          <input 
            type='text'
            name='locationOfComponent'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add location of component'
            value={locationOfComponent}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Validated By</label>
          <input 
            type='text'
            name='validatedBy'
            className='text-xl text-slate-950 bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            placeholder='Add validated by'
            value={validatedBy}
            onChange={handleChange}
          />
        </div>
        <div className='flex flex-col gap-2'>
          <label className='input-label text-lg text-slate-500'>Comments</label>
          <textarea 
            name='comments'
            className='text-xl text-slate-950  bg-slate-100 border rounded-md border-neutral-700 p-2 outline-none'
            rows={1}
            placeholder='Add comments'
            value={comments}
            onChange={handleChange}
          />
        </div>
      </div>

      <div className='w-fit mx-auto'>
        {error && <p className='text-red-500 pt-3 text-sm'>{error}</p>}
      </div>

      <div className='w-fit mx-auto flex gap-5'>
        <button 
          className={`my-2 w-60 text-base font-medium mt-3 border rounded-md p-2
            ${isFormValid() ? 'bg-blue-500 text-white hover:bg-blue-600 ' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}
          `}
          onClick={handleAddEntry}
          disabled={!isFormValid()}
        >
          {type === 'edit' ? 'UPDATE' : 'ADD'}
        </button>
        {type === 'edit' && (
          <button
            className='my-2 w-60 text-base font-medium mt-3 border rounded-md p-2 bg-red-500 text-white hover:bg-red-600'
            onClick={handleDelete}
          >
            DELETE
          </button>
        )}
      </div>
    </div>
  );
};

export default AddEditEntries;
