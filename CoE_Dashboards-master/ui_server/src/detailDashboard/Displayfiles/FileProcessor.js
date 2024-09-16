import React, { useState } from 'react';

function FileProcessor() {
  const [fileContent, setFileContent] = useState('');
  
  // Function to handle file upload
  const handleFileUpload = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      setFileContent(e.target.result);
    };

    reader.readAsText(file);
  };


// Function to add serial numbers
const addSerialNumbers = () => {
  const lines = fileContent.split('\n');
  const numberedLines = lines.map((line, index) => {
    // Add line number and line content, each followed by <br/>
    return `${index + 1}: ${line.trim()}<br/>`;
  });
  setFileContent(numberedLines.join('\n'));
};




  // Function to download the file
  const downloadFile = () => {
    const element = document.createElement('a');
    const file = new Blob([fileContent], { type: 'text/plain' });
    element.href = URL.createObjectURL(file);
    element.download = 'numbered_file.txt';
    element.click();
  };

  return (
    <div>
      <input type="file" onChange={handleFileUpload} />
      <button onClick={addSerialNumbers}>Add Serial Numbers</button>
      <button onClick={downloadFile}>Download File</button>
      <textarea rows="10" cols="50" value={fileContent} readOnly />
    </div>
  );
}

export default FileProcessor;
