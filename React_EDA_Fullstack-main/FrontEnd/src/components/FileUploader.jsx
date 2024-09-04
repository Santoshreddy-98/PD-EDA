import React, { useState, useContext } from "react";
import '../css/Import.css'
import axios from "axios";

import { dieareaData } from "./AppContent";
import { pathsData } from "./AppContent";


const FileUploader = () => {
  const [defFile, setDefFile] = useState(null);
  const [lefFile, setLefFile] = useState(null);
  const [timingReport, setTimingReport] = useState(null);

  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false)

  const { setCellData, setPortsData, setWiresData, setTimingData, setDieAreaData, setPinsData }  = useContext(dieareaData)
  const  { setTimingPath, setNetPath } = useContext(pathsData)

  const handleSubmit = async (e) => {
    e.preventDefault();
    const reader = new FormData();
    // console.log(defFile.name)
    // console.log(lefFile.name)
    // console.log(timingReport.name)
    if (!defFile || !lefFile || !timingReport) {
      setError("Please select all three files.");
      setSuccess(false)
    } else {

      
      // reader.append("fileDef_name", defFile.name)
      reader.append("fileDef_Data", defFile)
      // reader.append("fileLef_name", lefFile.name)
      reader.append("fileLef_Data", lefFile)
      // reader.append("fileTiming_name", timingReport.name)
      reader.append("fileTiming_Data", timingReport)
      await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/def',
        data: reader
      }).then(res => {
        console.log("This is from FileUpload.js", res)
        setCellData(res.data.Cell_Data)
        setPortsData(res.data.Ports_Data)
        setWiresData(res.data.Wires_Data)
        setTimingData(res.data.Timging_Data)
        setDieAreaData(res.data.Diearea)
        setNetPath(res.data.Net_Path)
        setTimingPath(res.data.Paths_Data)
        setPinsData(res.data.Pins_Data)
        setError('')
        setSuccess(true)
      }).catch(res => {
        setError("Something went wrong");
        setSuccess(false)
      })
      // e.target.reset()
      
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='grid-container'>
        <div>
          <label htmlFor="defFile">Upload DEF file:</label>
          <input
            type="file"
            id="defFile"
            accept=".def"
            onChange={(e) => setDefFile(e.target.files[0])}
            className='btn-grad btn-grad:hover'
          />
        </div>
        <div>
          <label htmlFor="lefFile">Upload LEF file:</label>
          <input
            type="file"
            id="lefFile"
            accept=".txt"
            onChange={(e) => setLefFile(e.target.files[0])}
            className='btn-lef btn-lef:hover'
          />
        </div>
        <div>
          <label htmlFor="timingReport">Upload timing report:</label>
          <input
            type="file"
            id="timingReport"
            accept=".txt"
            onChange={(e) => setTimingReport(e.target.files[0])}
            className='btn-txt btn-txt:hover'
          />
        </div>
      </div>
      <div>{error && <p style={{ color: "red" }}>{error}</p>}
        {success && <h6 style={{ color: 'green', textAlign: "center", fontSize: "20px" }}>All Three Files Uploaded Successfully</h6>}
        <center><button className='subbutton'><h6>SUBMIT</h6></button></center></div>


    </form>
  );
};

export default FileUploader;
