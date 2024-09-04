import { useEffect, useState, useContext } from "react";
import Columns from "../components/tables/Columns";
import "../components/tables/table.module.css";
import { dieareaData } from "./AppContent";


const TableApp = () => {
  const { timingData } = useContext(dieareaData)
  const [column, setColumn] =useState()

  useEffect(() => {
    setColumn(timingData)
  },[timingData])
  

  return (
    <div>
      {/* <Uploading setColumn={setColumn} /> */}
      <div>
      {
        (column === undefined) ? "" : <Columns column={column} />
      }
      </div>

    </div>
  )
}

export default TableApp