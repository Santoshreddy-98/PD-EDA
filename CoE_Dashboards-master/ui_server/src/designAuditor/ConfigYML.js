import React, { useState } from 'react';
import axios from 'axios';
import Backendapi from './Backendapi';

function ConfigYML() {
    const [filePath, setFilePath] = useState('');
    const [loading,setLoading]=useState(false)
    const [validationResult, setValidationResult] = useState('');
    const [successmsg,setSuccessmsg]=useState('')
    //function for validation of the yaml file
    const handleValidation = async () => {
        setValidationResult("")
        setSuccessmsg("")
        setLoading(true)
        if (!filePath) {
            setValidationResult('Please enter a file path.');
            setLoading(false)
            return;
        }
        // Check if the file path ends with ".yml" or ".yaml" to verify it's a YAML file.
        if (!filePath.toLowerCase().endsWith('.yaml')) {
            setValidationResult('Invalid file type. Please select a YAML file.');
            setLoading(false)
            return;
        }else{
            try {
                const { data } = await axios.post(`${Backendapi.PYTHON_APP_BACKEND_API_URL}/detail_parser/`, { 'FilePath': filePath });
                console.log(data, "data")
                if (data.success) {
                    // const data = await response.json();
                    
                    localStorage.setItem("detailDashboard", data.detailDashboard_ID)
                    const runNameJSON = JSON.stringify(data['partition_stages']);

                    // Store the JSON string in localStorage
                    localStorage.setItem("run_name", runNameJSON);
                    setSuccessmsg(data.success && 'YAML file is valid.');

                    //code for add the new checklist: 
                    try {
                        const { data } = await axios.get(`${Backendapi.PYTHON_APP_BACKEND_API_URL}/process_directories/`);

                        if (data.length > 0) {
                            const newProjectname = data[data.length - 1].project_name;

                            console.log(newProjectname, "getProjectName");

                            const response = await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/yaml/add/checklist/design/${newProjectname}`);

                            if (response.status === 201) {
                                alert(`The checklist with the design name ${newProjectname} has been successfully added.`);
                                console.log(response, "add design");
                            }
                        }
                    } catch (error) {
                        console.log(error.response ? error.response.data : "An error occurred.");
                    }

                    window.location.reload()
                    setLoading(false)
                } else {
                    setValidationResult('Error validating the YAML file.');
                    setLoading(false)
                }
            } catch (error) {
                console.error('Error:', error);
                setValidationResult('An error occurred during validation.');
                setLoading(false)
            }
        }
       
    };

    return (
        <div style={{background:"#efefef",width:"100%",height:"100%"}}>
            <div style={{background:"#fff",borderRadius:"20px",padding:"100px"}} className="container mt-5">
                <h2 style={{textDecoration:"underline"}} className="mb-4 text-center">Configuration file</h2>
                <div style={{border:"2px solid #333",background:"#efefef",padding:"20px ",borderRadius:"10px"}}> 
                    <div className='mb-2'>
                        <h4>PIF file path:</h4>
                    </div>
                    <div className="input-group mb-3">
                        <input
                            type="text"
                            className="form-control"
                            placeholder="Paste pif file path here"
                            value={filePath}
                            onChange={(e) => {
                                setFilePath(e.target.value)
                                setValidationResult("")
                                setSuccessmsg("")
                            }
                            }
                    
                        />
                        <div className="input-group-append">
                            <button className="btn btn-primary" type="button" onClick={handleValidation} disabled={loading ===true}>
                               {
                                loading ===false ? "Execute" : "Please wait..."
                               }
                            </button>
                        </div>
                    </div>
                    <div>
                        {
                            validationResult !== "" && <p style={{ backgroundColor: "red", padding: "5px", borderRadius: "5px", color: "white", textAlign: 'center'  }} className="mt-2">{validationResult}</p>
                        }
                    </div>
                    <div>
                        {
                            successmsg !== "" && <p style={{ backgroundColor: "green", padding: "5px", borderRadius: "5px", color: "white", textAlign: 'center' }}>{successmsg}</p>
                        }
                    </div>
                </div>
               
            </div>
        </div>
       
    );
}

export default ConfigYML;
