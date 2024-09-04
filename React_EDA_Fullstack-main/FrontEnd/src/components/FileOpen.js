import React, { useState } from 'react'
import pop from "../css/popup.module.css"
import { FaRegTimesCircle } from 'react-icons/fa'

import axios from 'axios'

const FileOpen = (props) => {

  const [file, setFile] = useState(null)
  const [defFile, setDefFile] = useState("")
  const [lefFile, setLefFile] = useState("")
  const [error, setError] = useState(false)


  const uploadFile = async (e) => {
    e.preventDefault()


    const reader = new FormData();

    console.log(defFile.name)
    console.log(lefFile.name)

    if (defFile.name.split('.').slice(-1)[0] !== "def" && lefFile.name.split('.').slice(-1)[0] !== "lef") {
      setError(!false)
    } else {
      reader.append("fileDef_name", defFile.name)
      reader.append("fileDef_Data", defFile)
      reader.append("fileLef_name", lefFile.name)
      reader.append("fileLef_Data", lefFile)

      await axios({
        method: 'post',
        url: 'http://127.0.0.1:8000/def',
        data: reader
      }).then(res => {
        console.log(res)
      }).catch(res => {
        console.log(res)
      })
      e.target.reset()

    }
  }
  
  return (
    <React.Fragment>
      <div className={pop.popup}>
        {/* <a><FaRegTimesCircle /></a> */}

        <div className={pop.border}>

          <a className={pop.closeBtn} onClick={() => props.setFileOpen(false)} ><FaRegTimesCircle /></a>
          <div>
            <form onSubmit={uploadFile}>
              {error ? <h3 style={{ color: "red" }}>Please upload Def and lef extension files</h3> : ""}
              <br></br>
              <h2>Upload Def File... &nbsp;</h2>
              <br></br>
              <input multiple type={"file"} name="file1" onChange={(e) => setDefFile(e.target.files[0])} required />
              <br></br>
              <br></br>
              <br></br>
              <h2>Upload Lef File... &nbsp;</h2>
              <br></br>
              <input multiple type={"file"} name="file2" onChange={(e) => setLefFile(e.target.files[0])} required />

              <button type='submit'>Upload</button>
            </form>
          </div>
        </div>

      </div>
    </React.Fragment >
  )

}

export default FileOpen
