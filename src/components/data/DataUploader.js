import React, { useState } from 'react';
import { parseCSV } from '../../utils/parseCSV';

const DataUploader = ({ onDataUpload }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    const uploadedFile = e.target.files[0];
    setFile(uploadedFile);
  };

  const handleUpload = async () => {
    if (file) {
      const data = await parseCSV(file);
      onDataUpload(data);
    }
  };

  return (
    <div>
      <input type="file" accept=".csv" onChange={handleFileChange} />
      <button onClick={handleUpload}>Upload Data</button>
    </div>
  );
};

export default DataUploader;