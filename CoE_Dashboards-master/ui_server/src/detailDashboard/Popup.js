import React, { useState } from "react";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import jsonData from "./DetailLNLData.json";
import "./Popup.css";

const Popup = () => {
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [popupVisible, setPopupVisible] = useState(false);
  const [filterValue, setFilterValue] = useState(""); // State for filter input value
  const [filteredCount, setFilteredCount] = useState(0); // State for filtered count
  const [rowData, setRowData] = useState(jsonData); // State for rowData
  const [popupActions, setPopupActions] = useState([]);


  const openPopup = () => {
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setSelectedCell(null);
    setSelectedData(null);
    setSelectedField(null);
    setPopupActions([]); 
  };

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    // Filter the data and update the filtered count
    const filteredData = jsonData.filter((row) => {
      // Add your filtering logic here, for example:
      return (
        row.Label.toLowerCase().includes(value.toLowerCase()) ||
        row.Partition.toLowerCase().includes(value.toLowerCase()) ||
        row.Dst.toLowerCase().includes(value.toLowerCase())
        // Add more fields as needed
      );
    });

    setFilteredCount(filteredData.length);

    // Update the rowData to display the filtered data
    setRowData(filteredData);
  };

  const addPopupAction = (actionText) => {
    // Add a new action to the top of the actions list
    setPopupActions((prevActions) => [actionText, ...prevActions]);
  };

  const gridOptions = {
    pagination: true, // Enable pagination
    paginationPageSize: 20, // Number of rows per page
    domLayout:
      "paginationPrevPage,paginationPage,paginationNextPage,paginationPageSize",
    suppressScrollOnNewData: true,
    onCellClicked: (params) => {
      const cellValue = params.value;
      setSelectedCell(cellValue);

      // Find the corresponding row data based on the selected cell value and dynamic field
      const fieldNameToSearch = params.colDef.field;
      const rowData = jsonData.find(
        (row) => row[fieldNameToSearch] === cellValue
      );
      setSelectedData(rowData);
      setSelectedField(fieldNameToSearch);
      openPopup();

      addPopupAction(`Clicked on cell: ${cellValue}`);
    },

    // Highlight rows based on the selected cell value
   // Highlight rows based on the selected cell value and filter
getRowStyle: (params) => {
    const isHighlighted = selectedCell && params.node.data[selectedField] === selectedCell;
  
    // Highlight filtered rows with a different background color (blue)
    const isFiltered = params.node.rowIndex < filteredCount;
  
    if (isHighlighted) {
      return { background: "yellow" }; // Add your highlight style here
    } else if (isFiltered) {
      return { backgroundColor: "lightblue" }; // Apply the CSS class
    }
  
    return null;
  },
  
  };

  const columnDefs = [
    {
      field: "select",
      width: 50,
      checkboxSelection: true,
      headerCheckboxSelection: true,
      pinned: "left",
    },
    {
      headerName: "Partition",
      field: "Partition",
      width: 125,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },
    {
      headerName: "Dst",
      field: "Dst",
      width: 220,
      pinned: "left",
      filter: "agTextColumnFilter",
      rowStyle: { border: "1px solid black" },
      cellStyle: { border: "1px solid black" },
    },

    // Timing Data
    {
      headerName: "TIMING",
      cellClass: "typ_0p85v_85c_typ_max_IO",
      children: [
        {
          headerName: "typ_0p85v_85c_typ_max:IO",
          children: [
            {
              headerName: "WNS",
              field: "WNS",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "TNS",
              field: "TNS",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Viols",
              field: "Viols",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_IO",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "typ_0p85v_85c_typ_max:R2R",
          children: [
            {
              headerName: "WNS",
              field: "WNS",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "TNS",
              field: "TNS",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Viols",
              field: "Viols",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "typ_0p85v_85c_typ_max_R2R",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Routing Data
    {
      headerName: "ROUTE",
      children: [
        {
          headerName: "Routing",
          children: [
            {
              headerName: "Net Length",
              field: "Net Length",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Net Count",
              field: "Net Count",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Short",
              field: "Short",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "NullShort",
              field: "NullShort",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Real Short",
              field: "Real Short",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Total DRCs",
              field: "Total DRCs",
              filter: "agNumberColumnFilter",
              width: 135,
              cellClass: "Routing",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Congestion",
          children: [
            {
              headerName: "Both %",
              field: "Both %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Horz %",
              field: "Horz %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Vert %",
              field: "Vert %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Congestion",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Design Data
    {
      headerName: "DESIGN",
      children: [
        {
          headerName: "Area",
          children: [
            {
              headerName: "Cell Area",
              field: "Cell Area",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Die Area Utilization %",
              field: "Die Area Utilization %",
              filter: "agNumberColumnFilter",
              width: 230,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },

            {
              headerName: "Design Utilization %",
              field: "Design Utilization %",
              filter: "agNumberColumnFilter",
              width: 230,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Gatecount",
              field: "Gatecount",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Counts",
          children: [
            {
              headerName: "All",
              field: "All",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell",
              field: "Stdcell",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Seq",
              field: "Seq",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Buf/Inv",
              field: "Buf/Inv",
              filter: "agNumberColumnFilter",
              width: 165,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Hold Buf/Inv",
              field: "Hold Buf/Inv",
              filter: "agNumberColumnFilter",
              width: 165,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Unclocked Seqs",
              field: "Unclocked Seqs",
              filter: "agNumberColumnFilter",
              width: 175,
              cellClass: "Cell_Counts",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Area",
          children: [
            {
              headerName: "All",
              field: "All",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell",
              field: "Stdcell",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Stdcell Growth %",
              field: "Stdcell Growth %",
              filter: "agNumberColumnFilter",
              width: 185,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Seq",
              field: "Seq",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Buf/Inv",
              field: "Buf/Inv",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Hold Buf/Inv",
              field: "Hold Buf/Inv",
              filter: "agNumberColumnFilter",
              width: 165,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk Buf/Inv",
              field: "Clk Buf/Inv",
              filter: "agNumberColumnFilter",
              width: 165,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk Gates",
              field: "Clk Gates",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Combinational",
              field: "Combinational",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Pfet",
              field: "pfet",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Macro",
              field: "Macro",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Cell_Area",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Cell:Flops",
          children: [
            {
              headerName: "Mbit flop %",
              field: "Mbit flop %",
              filter: "agNumberColumnFilter",
              width: 165,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Octa flop %",
              field: "Octa flop %",
              filter: "agNumberColumnFilter",
              width: 165,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Non-RP Octa flop %",
              field: "Non-RP Octa flop %",
              filter: "agNumberColumnFilter",
              width: 200,
              cellClass: "Cell_Flops",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "num_dcudp_datapathfubs",
          children: [
            {
              headerName: "Datapath fubs count",
              field: "Datapath fubs count",
              filter: "agNumberColumnFilter",
              width: 230,
              cellClass: "num_dcudp_datapathfubs",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Ports",
          children: [
            {
              headerName: "Inputs",
              field: "Inputs",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Outputs",
              field: "Outputs",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Feedthrus",
              field: "Feedthrus",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Ports",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Power Data
    {
      headerName: "POWER",
      children: [
        {
          headerName: "Z",
          children: [
            {
              headerName: "Total Z",
              field: "Total Z",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Total_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Norm Z",
              field: "Norm Z",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Avg Z",
              field: "Avg Z",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Avg Norm Z",
              field: "Avg Norm Z",
              filter: "agNumberColumnFilter",
              width: 140,
              cellClass: "Norm_ZAvg_ZAvgNorm_Z",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "svt",
              field: "svt",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "svt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvtll",
              field: "lvtll",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvt",
              field: "lvt",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvtll",
              field: "ulvtll",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },

            {
              headerName: "ulvt",
              field: "ulvt",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvt %",
              field: "ulvt %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "ulvtll %",
              field: "ulvtll %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvt %",
              field: "lvt %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "svt %",
              field: "svt %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "lvtll %",
              field: "lvtll %",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "ivt_ll",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Clk",
              field: "Clk",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Clk",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Constant_Switching_Activity",
          children: [
            {
              headerName: "Internal",
              field: "Internal",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Switching",
              field: "Switching",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Leakage",
              field: "Leakage",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Total",
              field: "Total",
              filter: "agNumberColumnFilter",
              width: 125,
              cellClass: "Constant_Switching_Activity",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },

    // Compute Data
    {
      headerName: "COMPUTE",
      children: [
        {
          headerName: "TPT",
          children: [
            {
              headerName: "Task TPT (hrs)",
              field: "Task TPT (hrs)",
              filter: "agNumberColumnFilter",
              width: 160,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Cumulative TPT (hrs)",
              field: "Cumulative TPT (hrs)",
              filter: "agNumberColumnFilter",
              width: 205,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
        {
          headerName: "Mem",
          children: [
            {
              headerName: "Memory (MB)",
              field: "Memory (MB)",
              filter: "agNumberColumnFilter",
              width: 160,
              cellClass: "Mem",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
          ],
        },
      ],
    },
  ];

  //   const rowData = jsonData;

  return (
    <div className="App">
      <h1>ag-Grid Popup Example</h1>

      {/* Filter input */}
      <div className="filter-container">
        <input
          type="text"
          placeholder="Filter..."
          value={filterValue}
          onChange={handleFilterChange}
          className="filter-input"
        />
        <div className="filtered-count">{filteredCount} items</div>
      </div>
      <div className="ag-theme-alpine" style={{ height: 400, width: 600 }}>
        <AgGridReact
          gridOptions={gridOptions}
          columnDefs={columnDefs}
          rowData={rowData}
        />
      </div>
      {popupVisible && (
        <div className="popup">
          <button className="close-button" onClick={closePopup}>
            X
          </button>
          <div className="popup-content">
            <div className="popup-actions">
              {popupActions.map((action, index) => (
                <div key={index} className="popup-action">
                  {action}
                </div>
              ))}
            </div>
            <div className="popup-top">
              <span className={selectedCell ? "highlight" : ""}>
                {selectedField ? `${selectedField}:` : ""}{" "}
                {selectedData ? selectedData[selectedField] : ""}, Selected Cell
                Value: {selectedCell}
              </span>
            </div>
            {selectedData && (
              <pre className="json-data">
                {JSON.stringify(selectedData, null, 2)}
              </pre>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Popup;
