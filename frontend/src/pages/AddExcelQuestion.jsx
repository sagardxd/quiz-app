import React, { useState } from 'react';
import axios from 'axios';


const AddExcelQuestion = () => {
  
  const [file, setFile] = useState(null);
  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleSubmit = async () => {
    if (!file) {
      alert('Please select a file');
      return;
    }

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await axios.post('http://localhost:3000/admin/add-questions-excel', formData);
      console.log(response.data);
      alert('Questions added successfully');
      
    } catch (error) {
      console.error('Error:', error);
      alert('An error occurred while adding questions');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-8">
      <h2 className="text-xl font-bold mb-4">Add Questions from Excel</h2>
      <input
        type="file"
        accept=".xlsx, .xls"
        onChange={handleFileChange}
        className="border border-gray-300 rounded px-3 py-2 mb-4"
      />
      <button
        onClick={handleSubmit}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Upload
      </button>
    </div>
  );
};

export default AddExcelQuestion;
