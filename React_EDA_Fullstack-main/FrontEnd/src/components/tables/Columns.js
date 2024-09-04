import React, { useState, useMemo } from "react";
import "./table.module.css";
import Table from "./TableContainer";

const Columns = ({ column }) => {
  const [data, setData] = useState([]);

  // ****** Column header and data ********
  const columns = useMemo(
    () => [
      Object.keys(column[0]).map((item) => {
        return setData((data) =>
          data.concat({
            Header: item,
            accessor: item,
          })
        );
      }),
    ],
    []
  );
  
  return(
    <div>
        {
            (data.length === 0) ? "" : <Table columns={data} data={column} />
        }
    </div>
  );
};

export default Columns;
