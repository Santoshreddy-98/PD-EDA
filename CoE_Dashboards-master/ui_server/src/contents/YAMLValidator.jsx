import React, { useState } from 'react';
import axios from 'axios';
import Backendapi from '../designAuditor/Backendapi';

function YAMLValidator() {
  const [filePath, setFilePath] = useState('');
  const [validationResult, setValidationResult] = useState('');

  const handleValidation = async () => {
    if (!filePath) {
      setValidationResult('Please enter a file path.');
      return;
    }
     

    try {
      const {data} = await axios.post(`${Backendapi.PYTHON_APP_BACKEND_API_URL}/detail_parser/`, {'FilePath':filePath});
      console.log(data)
      if (data.success) {
        // const data = await response.json();
        localStorage.setItem("mainDashboard", data.mainDashboard_ID)
        localStorage.setItem("detailDashboard",data.detailDashboard_ID)
        const runNameJSON = JSON.stringify(data['partition_stages']);

        // Store the JSON string in localStorage
        localStorage.setItem("run_name", runNameJSON);
        setValidationResult(data.isValid ? 'YAML file is valid' : 'YAML file is not valid');
      } else {
        setValidationResult('Error validating the YAML file.');
      }
    } catch (error) {
      console.error('Error:', error);
      setValidationResult('An error occurred during validation.');
    }
  };

  return (
    <div className="container mt-5">
      <h2 className="mb-4">YAML Validator</h2>
      <div className="input-group mb-3">
        <input
          type="text"
          className="form-control"
          placeholder="PIF File Path"
          value={filePath}
          onChange={(e) => setFilePath(e.target.value)}
        />
        <div className="input-group-append">
          <button className="btn btn-primary" type="button" onClick={handleValidation}>
            Validate YAML
          </button>
        </div>
      </div>
      <div>
        <p className="mt-2">{validationResult}</p>
      </div>
    </div>
  );
}

export default YAMLValidator;
