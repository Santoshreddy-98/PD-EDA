import React, { useState, useEffect, useRef, useMemo, useContext } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import { useAppContext } from "../AppContext";
import Select from "react-select";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./LNLtable.css"; // Import the static JSON data
import "./Popup.css";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-community/styles/ag-theme-alpine.css";
import axios from "axios";
import Backendapi from "../designAuditor/Backendapi";

const customStyles = {
  control: (provided) => ({
    ...provided,
    width: "100%",
    backgroundColor: "#f0f0f0",
    color: "#333",
    padding: "8px",
    border: "1px solid #ccc",
    borderRadius: "4px",
    outline: "none",
  }),
  option: (provided, state) => ({
    ...provided,
    backgroundColor: state.isSelected ? "#007bff" : "white",
    color: state.isSelected ? "white" : "black",
    padding: "8px",
  }),
  menu: (provided) => ({
    ...provided,
    maxHeight: "150px", // Maximum height of the menu
  }),
  dropdownIndicator: (provided) => ({
    ...provided,
    display: "none", // Hide the dropdown indicator
  }),
};

const LNLtable = () => {
  const { isMulti } = useAppContext();
  console.log(isMulti);
  const detailId = localStorage.getItem("detailDashboard");

  const [gridApi, setGridApi] = useState(null);
  const [data, setData] = useState([]);
  const [column, setColumn] = useState([]);
  const [tableMaximized, setTableMaximized] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState("default");
  const [selectedCell, setSelectedCell] = useState(null);
  const [selectedData, setSelectedData] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [filterValue, setFilterValue] = useState(""); // State for filter input value
  const [filteredCount, setFilteredCount] = useState(0); // State for filtered count
  const [filteredRows, setFilteredRows] = useState([]);
  const [buttonsVisible, setButtonsVisible] = useState(false); // State to track button visibility

  const [multiDataChoose, setMultiDataChoose] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  // const [multData, setMultData] = useState([]);
  const [pageSize, setPageSize] = useState(15); // Default page size

  const columnColors = [
    "col1",
    "col2",
    "col3",
    "col4",
    "col5",
    "col6",
    "col7",
  ];

  const scrollableRef = useRef();

  const toggleButtons = () => {
    setButtonsVisible(!buttonsVisible); // Toggle button visibility
  };

  const handleChange = async (option) => {
    setSelectedOption(option);
    setLoading(true);

    try {
      const response = await axios.get(
        `${Backendapi.PYTHON_APP_BACKEND_API_URL}/choose-multirun/?param1=${option.value}`
      );

      console.log(response.data);
      if (response.status === 200) {
        function generateColumnDefs(data) {
          const columnDefs = [];
          if (!data || !Array.isArray(data)) {
            return columnDefs; // Return an empty array if data is undefined or not an array
          }
          const headerNames = new Set();

          data.forEach((entry) => {
            if (entry && typeof entry === "object") {
              Object.keys(entry).forEach((header) => {
                if (
                  header !== "Directory" &&
                  header !== "Lead" &&
                  header !== "Utilization" &&
                  header !== "partition_stages"
                ) {
                  headerNames.add(header);
                }
              });
            }
          });
          columnDefs.push({
            headerName: "Stage",
            field: "Stage",
            filter: "agMultiColumnFilter",
            sortable: true,
            pinned: "left",
            filter: "agTextColumnFilter",
          });
          columnDefs.push({
            headerName: "Partition_Name",
            field: "Partition_Name",
            filter: "agMultiColumnFilter",
            sortable: true,
            pinned: "left",
            filter: "agTextColumnFilter",
          });
          // Create column definitions for the extracted headers
          headerNames.forEach((headerName,index) => {
            if (
              headerName !== "Partition_Name" &&
              headerName !== "Stage" &&
              headerName !== "Lead" &&
              headerName !== "Directory"
            ) {
              const columnDef = {
                headerName: headerName,
                children: [],
              };

              data.forEach((entry) => {
                if (entry[headerName]) {
                  Object.keys(entry[headerName]).forEach((subHeader,index) => {
                    if (entry[headerName][subHeader]) {
                      const subColumnDef = {
                        headerName: subHeader,
                        children: [],
                      };
                      Object.keys(entry[headerName][subHeader]).forEach(
                        (field) => {
                          if (
                            entry[headerName][subHeader][field] !== null &&
                            entry[headerName][subHeader][field] !== undefined
                          ) {
                            subColumnDef.children.push({
                              headerName: field,
                              field: `${headerName}.${subHeader}.${field}.value`,
                              filter: "agNumberColumnFilter",
                              sortable: true,
                              cellClass:columnColors[index]
                            });
                          }
                        }
                      );
                      columnDef.children.push(subColumnDef);
                    }
                  });
                }
              });

              columnDefs.push(columnDef);
            }
          });

          return columnDefs;
        }
        const newArray = new Array(response.data.content[0]);
        console.log(newArray);
        console.log(response.data.content);
        const dynamicColumnDefs = generateColumnDefs(newArray);
        console.log(dynamicColumnDefs);
        setColumn(dynamicColumnDefs);
        setData(response.data["content"]);
        localStorage.setItem("detailDashboard", response.data.id);
        const runNameJSON = JSON.stringify(
          response.data["content"][0]["partition_stages"]
        );
        // Store the JSON string in localStorage
        localStorage.setItem("run_name", runNameJSON);

        setLoading(false);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMulti.length !== 0 && selectedOption === null) {
      if (isMulti[isMulti.length - 1]) {
        handleChange({
          value: isMulti[isMulti.length - 1].id,
          label: isMulti[isMulti.length - 1].project_name,
        });
      } else {
        setData(null);
      }
    }
  }, [isMulti, selectedOption]);

  const handleFilterChange = (e) => {
    const value = e.target.value;
    setFilterValue(value);

    // Filter the data and update the filtered count
    const filteredData = data.filter((row) => {
      // Combine all fields you want to filter on into a single string
      const rowString =
        `${row.Label} ${row.Partition} ${row.Dst} ${row.WNS} ${row.TNS} ${row.Viols} ${row["MaxTrans Viols"]} ${row["MaxCap Viols"]} ${row["Net Length"]} ${row["Net Count"]} ${row.Short} ${row["NullShort"]} ${row["Real Short"]} ${row["Total DRCs"]} ${row["Both %"]} ${row["Horz %"]} ${row["Vert %"]} ${row["Cell Area"]} ${row["Die Area Utilization %"]} ${row["Design Utilization %"]} ${row.Gatecount} ${row.All} ${row.Stdcell} ${row.Seq} ${row["Buf/Inv"]} ${row["Hold Buf/Inv"]} ${row["Unclocked Seqs"]} ${row["Stdcell Growth %"]} ${row["Clk Buf/Inv"]} ${row["Clk Gates"]} ${row.Combinational} ${row.Pfet} ${row.Macro} ${row["Mbit flop %"]} ${row["Octa flop %"]} ${row["Non-RP Octa flop %"]} ${row["Datapath fubs count"]} ${row.Inputs} ${row.Outputs} ${row.Feedthrus} ${row["Total Z"]} ${row["Norm Z"]} ${row["Avg Z"]} ${row["Avg Norm Z"]} ${row.svt} ${row.lvtll} ${row.lvt} ${row.ulvtll} ${row.ulvt} ${row["ulvt %"]} ${row["ulvtll %"]} ${row["lvt %"]} ${row["svt %"]} ${row["lvtll %"]} ${row.Clk} ${row.Internal} ${row.Switching} ${row.Leakage} ${row.Total} ${row["5_2"]} ${row["5_16"]} ${row["5_20"]} ${row["7_2"]} ${row["10_6"]} ${row["Task TPT (hrs)"]} ${row["Cumulative TPT (hrs)"]} ${row["Memory (MB)"]}`.toLowerCase();

      return rowString.includes(value.toLowerCase()); // Check if the filter value exists in the rowString
    });

    setFilteredCount(filteredData.length);
    setFilteredRows(filteredData); // Store filtered rows in state
    setData(filteredData);

    // Update the rowData to display the filtered data
    setData(filteredData);
  };

  const openFileAndHighlight = async (cellValue, cellPath) => {
    const combData = {
      data: cellValue,
      path: cellPath,
    };

    try {
      const response = await axios.post(
        `${Backendapi.PYTHON_APP_BACKEND_API_URL}/cross_probing/`,
        combData
      );

      const fileContent = response.data["content"];
      const lineNumberToHighlight = Number(response.data["lineNumber"]) - 1;

      const blob = new Blob([fileContent], { type: "text/html" });
      const blobURL = URL.createObjectURL(blob);

      const newTab = window.open(blobURL, "_blank");

      if (newTab) {
        newTab.onload = function () {
          newTab.document.body.innerHTML = `
            <html>
              <head>
                <style>
                  /* Add some custom styling if needed */
                  .highlighted {
                    background-color: yellow;
                  }
                </style>
              </head>
              <body>
                <pre>
                ${fileContent
                  .split("\n")
                  .map((line, lineNumber) => {
                    const highlightedClass =
                      lineNumber === lineNumberToHighlight ? "highlighted" : "";
                    return `<a id="line${lineNumber}"></a><span class="${highlightedClass}">${lineNumber}:</span> ${line}`;
                  })
                  .join("\n")}
                </pre>
              </body>
            </html>
          `;
          setTimeout(() => {
            const highlightedElement = newTab.document.getElementById(
              `line${lineNumberToHighlight}`
            );
            if (highlightedElement) {
              highlightedElement.scrollIntoView({
                behavior: "smooth",
                block: "center",
                inline: "nearest",
              });
            }
          }, 100);
        };
      } else {
        console.error("Failed to open a new tab.");
        alert("No data Found");
      }
    } catch (error) {
      console.error("An error occurred:", error);
      alert("No data Found");
    }
  };

  const onCellClicked = (params) => {
    const cellValue = params.data;
    const modifiedField = params.column.colDef.field.replace(".value", "");

    openFileAndHighlight(cellValue, modifiedField);
  };

  const PartitionDst = [column[0], column[1]];

  const timingDataColumnDefs = [column[5]];

  const routingDataColumnDefs = [column[3]];

  const designDataColumnDefs = [column[4]];

  const powerDataColumnDefs = [column[2]];

  const computeDataColumnsDefs = [
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
              sortable: true,
              width: 160,
              cellClass: "TPT",
              rowStyle: { border: "1px solid black" },
              cellStyle: { border: "1px solid black" },
            },
            {
              headerName: "Cumulative TPT (hrs)",
              field: "Cumulative TPT (hrs)",
              filter: "agNumberColumnFilter",
              sortable: true,
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
              sortable: true,
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

  const getCategoryColumnDefs = () => {
    switch (selectedCategory) {
      case "default":
        return column;
      case "timingData":
        return [...PartitionDst, ...timingDataColumnDefs];
      case "routingData":
        return [...PartitionDst, ...routingDataColumnDefs];
      case "powerData":
        return [...PartitionDst, ...powerDataColumnDefs];
      case "designData":
        return [...PartitionDst, ...designDataColumnDefs];
      // case "caliberSummaryData":
      //   return [...PartitionDst, ...CaliberSummaryDataColumnDefs];
      case "computeData":
        return [...PartitionDst, ...computeDataColumnsDefs];
      // Add cases for other categories here
      default:
        return [
          {
            sortable: true,
            flex: 1,
            minWidth: 100,
            filter: true,
            resizable: true,
          },
        ];
    }
  };

  const gridOptions = {
    onCellClicked: (params) => {
      const cellValue = params.value;
      setSelectedCell(cellValue);
      // Find the corresponding row data based on the selected cell value and dynamic field
      const fieldNameToSearch = params.colDef.field;
      const rowData = data.find((row) => row[fieldNameToSearch] === cellValue);
      setSelectedData(rowData);
      setSelectedField(fieldNameToSearch);
    },

    getRowStyle: (params) => {
      const partitionValue = params.data.Partition;

      // Create a map to store unique colors for each unique "Partition" value
      if (!gridOptions.colorMap) {
        gridOptions.colorMap = {};
      }

      const colors = [
        "rgba(255, 0, 0, 0.2)", // Very Light Red
        "rgba(0, 255, 0, 0.2)", // Very Light Green
        "rgba(0, 0, 255, 0.2)", // Very Light Blue
        "rgba(255, 255, 0, 0.2)", // Very Light Yellow
        "rgba(128, 0, 128, 0.2)", // Very Light Purple
        "rgba(255, 165, 0, 0.2)", // Very Light Orange
        "rgba(255, 182, 193, 0.5)", // Very Light Pink
        "rgba(173, 216, 230, 0.5)", // Very Light Cyan
        "rgba(255, 215, 0, 0.5)", // Very Light Gold
        "rgba(230, 230, 250, 0.5)", // Very Light Lavender
        "rgba(152, 251, 152, 0.5)", // Very Light Mint
      ];
      // If the partition value is not in the map, assign it a color
      if (!gridOptions.colorMap[partitionValue]) {
        // Get the next color from the array and assign it to the partition value
        const colorIndex =
          Object.keys(gridOptions.colorMap).length % colors.length;
        gridOptions.colorMap[partitionValue] = colors[colorIndex];
      }

      // Apply the background color based on the assigned color
      return { background: gridOptions.colorMap[partitionValue] };
    },
    pagination: true,
    paginationPageSize: pageSize,
  };

  const onCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const onGridReady = (params) => {
    setGridApi(params.api);
  };

  useEffect(() => {
    if (gridApi) {
      gridApi.paginationSetPageSize(pageSize);
    }
  }, [gridApi, pageSize]);

  const handlePageSizeChange = (event) => {
    const newSize = parseInt(event.target.value, 10);
    if (!isNaN(newSize) && newSize > 0) {
      setPageSize(newSize);
    }
  };
  const rowCount = data.length; // Assuming your JSON data is an array

  const renderContent = () => {
    switch (true) {
      case loading:
        return <div>Loading...</div>;
      case !data:
        return <div>No data available</div>;
      default:
        return (
          <>
            <AgGridReact
              onGridReady={onGridReady}
              gridOptions={gridOptions}
              rowData={data}
              columnDefs={getCategoryColumnDefs()}
              rowSelection="multiple"
              enableRangeSelection={true}
              suppressMenuHide={true}
              onCellDoubleClicked={onCellClicked}
            ></AgGridReact>
          </>
        );
    }
  };

  return (
    <div className="mainWrapper">
      <div className="mainContainer" ref={scrollableRef}>
        <div className="header-right">
          <div>
            {isMulti.length !== 0 ? (
              <div
                style={{
                  width: "100%",
                  display: "flex",
                  alignItems: "center",
                }}
              >
                <label style={{ fontWeight: "bold", fontSize: "20px", marginRight:"10px" }}>
                  Design
                </label>
                <div style={{ width: "300px" }}>
                  <Select
                    options={isMulti.map((option, index) => ({
                      value: option.id,
                      label: option.project_name,
                    }))}
                    isSearchable={false}
                    styles={customStyles}
                    maxMenuHeight={150}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    onChange={handleChange}
                    value={selectedOption || isMulti[isMulti.length - 1].id}
                  />
                </div>
                <h3 style={{ marginLeft:"350px",fontWeight:"bold"}}>Detail Dashboard</h3>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
          <div>
            <button
              className={`category-button ${
                selectedCategory === "default" ? "active" : ""
              } purple-button`}
              onClick={() => onCategoryChange("default")}
            >
              𝐃𝐄𝐅𝐀𝐔𝐋𝐓
            </button>
            <button
              className={`category-button ${
                selectedCategory === "timingData" ? "active" : ""
              } red-button`}
              onClick={() => onCategoryChange("timingData")}
            >
              𝐓𝐈𝐌𝐈𝐍𝐆
            </button>
            <button
              className={`category-button ${
                selectedCategory === "routingData" ? "active" : ""
              } yellow-button `}
              onClick={() => onCategoryChange("routingData")}
            >
              𝐑𝐎𝐔𝐓𝐄
            </button>
            <button
              className={`category-button ${
                selectedCategory === "designData" ? "active" : ""
              } green-button `}
              onClick={() => onCategoryChange("designData")}
            >
              𝐃𝐄𝐒𝐈𝐆𝐍
            </button>
            <button
              className={`category-button ${
                selectedCategory === "powerData" ? "active" : ""
              } blue-button`}
              onClick={() => onCategoryChange("powerData")}
            >
              𝐏𝐎𝐖𝐄𝐑
            </button>
            <button
              className={`category-button ${
                selectedCategory === "computeData" ? "active" : ""
              } orange-button`}
              onClick={() => onCategoryChange("computeData")}
            >
              𝐂𝐎𝐌𝐏𝐔𝐓𝐄
            </button>
          </div>
        </div>
      </div>

      <div className="ag-theme-alpine">{renderContent()}</div>

      <div>
        <label htmlFor="pageSizeInput">Rows per Page:</label>
        <input
          id="pageSizeInput"
          type="number"
          min="1"
          value={pageSize}
          onChange={handlePageSizeChange}
        />
      </div>

      <div className="row-count">Total Rows: {rowCount}</div>
    </div>
  );
};

export default LNLtable;
