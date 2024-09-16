import React, { useState, useEffect, useMemo } from "react";
import { Toast } from "react-bootstrap";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import { AgGridReact } from "ag-grid-react";
import "ag-grid-community/styles/ag-grid.css";
import "ag-grid-enterprise";
import "ag-grid-community/styles/ag-theme-alpine.css";
import "./BootstrapTable.css";
import { useAppContext } from "../AppContext";
import Select from "react-select";
import CommentsTooltip from "./CommentToolTip";
import ETAToolTip from "./ETAToolTip";
import PlaToolTip from "./PlaToolTip";
import CustomLoadingCellRenderer from "./CustomLoadingCellRenderer";
import barrier from "./server.gif"
import axios from "axios"; // Import Axios
import Backendapi from "../designAuditor/Backendapi";
// import { UserComponentFactory } from "ag-grid-enterprise";

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

const BootstrapTable = () => {
  const { isMain } = useAppContext();
  // console.log(isMain);
  const MainId = localStorage.getItem("mainDashboard");
  const [gridApi, setGridApi] = useState(null);

  const [data, setData] = useState([]);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(""); // State for the toast message
  const [showToast, setShowToast] = useState(false); // State to control the visibility of the toast
  const [showLoader, setShowLoader] = useState(false); // State to control the visibility of the loader GIF
  const [column, setColumn] = useState([]);
  const [isId, setIsId] = useState(null);
  const undoRedoCellEditing = true;
  const undoRedoCellEditingLimit = 20;
  const [rowData, setRowData] = useState([]);
  // const [isLoading, setIsLoading] = useState(true); // Track loading state
  // State for managing the theme class
  const [themeClass, setThemeClass] = useState("ag-theme-alpine");
  // const [isSpinning, setIsSpinning] = useState(false);
  const [tableMaximized, setTableMaximized] = useState(true);
  const toggleTable = () => {
    setTableMaximized(!tableMaximized);
  };

  const UserInfo = JSON.parse(localStorage.getItem("auth"));
  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setShowLoader(true); // Show the loader GIF when the toast is displayed
    // Set a timeout to hide the loader and toast after a certain duration (e.g., 3000 milliseconds)
    setTimeout(() => {
      setShowLoader(false);
      setShowToast(false);
    }, 8000);
  };

  const columnColors = [
    "column1",
    "column2",
    "column3",
    "column4",
    "column5",
    "column6",
  ];

  const handleChange = async (option) => {
    setSelectedOption(option);
    setLoading(true);
    localStorage.setItem("mainDashboard", option.value);
    setIsId(option.value);

    try {
      const response = await axios.get(
        `${Backendapi.PYTHON_APP_BACKEND_API_URL}/choose-mainrun/?param1=${option.value}`
      );

      function generateColumnDefs(data) {
        const columnDefs = [];

        if (!data || !Array.isArray(data)) {
          return columnDefs; // Return an empty array if data is undefined or not an array
        }

        columnDefs.push({
          headerName: "Partition",
          field: "Partition_Name",
          filter: "agTextColumnFilter",
          sortable: true,
          pinned: "left", // Pin the column to the left
        });
        columnDefs.push({
          headerName: "Lead",
          field: "Lead",
          filter: "agTextColumnFilter",
          sortable: true,
          pinned: "left", // Pin the column to the left
        });

        const headerNames = new Set();

        data.forEach((entry) => {
          if (entry && typeof entry === "object") {
            Object.keys(entry).forEach((header) => {
              headerNames.add(header);
            });
          }
        });

        // Create column definitions for the extracted headers
        headerNames.forEach((headerName, index) => {
          if (
            headerName !== "ETA" &&
            headerName !== "Comments" &&
            headerName !== "Plan_of_Action" &&
            headerName !== "Directory" &&
            headerName !== "Partition_Name" &&
            headerName !== "Lead"
          ) {
            // Handle other columns
            const columnDef = {
              headerName: headerName,
              children: [],
            };

            data.forEach((entry) => {
              if (entry[headerName]) {
                Object.keys(entry[headerName]).forEach((subHeader, index) => {
                  if (entry[headerName][subHeader]) {
                    const subColumnDef = {
                      headerName: subHeader,
                      children: [],
                    };
                    Object.keys(entry[headerName][subHeader]).forEach(
                      (field, columnIndex) => {
                        if (
                          entry[headerName][subHeader][field] &&
                          entry[headerName][subHeader][field].value !==
                            undefined
                        ) {
                          subColumnDef.children.push({
                            headerName: field,
                            field: `${headerName}.${subHeader}.${field}.value`,
                            filter: "agNumberColumnFilter",
                            suppressMovable: true,
                            onCellDoubleClicked: onCellClicked,
                            lockVisible: true,
                            cellClass: columnColors[index], // Apply the color class based on the columnIndex
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

        // Add columns "ETA," "Comments," "Plan of Action," and "Directory" at the end
        columnDefs.push({
          headerName: "Congestion",
          field: "Congestion.value",
          filter: "agNumberColumnFilter",
          onCellDoubleClicked: onCellClicked, // Add number column filter
        });
        columnDefs.push({
          headerName: "Util_Ratio",
          field: "Utilization.value",
          filter: "agNumberColumnFilter",
          onCellDoubleClicked: onCellClicked, // Add number column filter
        });

        columnDefs.push({
          headerName: "ETA",
          field: "ETA",
          filter: "agTextColumnFilter",
          editable: true,
          cellEditor: "agLargeTextCellEditor",
          cellEditorPopup: true,
          onCellValueChanged: onCellValueEta,
          tooltipComponent: ETAToolTip,
          tooltipField: "ETA",
          valueParser: (params) => params.newValue.toString(),
        });
        columnDefs.push({
          headerName: "Comments",
          field: "Comments",
          filter: "agTextColumnFilter",
          editable: true,
          cellEditor: "agLargeTextCellEditor",
          cellEditorPopup: true,
          onCellValueChanged: onCellValueComment,
          tooltipComponent: CommentsTooltip,
          tooltipField: "Comments",
          valueParser: (params) => params.newValue.toString(),
        });
        columnDefs.push({
          headerName: "Plan of Action",
          field: "Plan_of_Action",
          filter: "agTextColumnFilter",
          editable: true,
          cellEditor: "agLargeTextCellEditor",
          cellEditorPopup: true,
          onCellValueChanged: onCellValuePla,
          tooltipComponent: PlaToolTip,
          tooltipField: "Plan_of_Action",
          valueParser: (params) => params.newValue.toString(),
        });
        columnDefs.push({
          headerName: "Directory",
          field: "Directory",
          editable: false,
        });

        return columnDefs;
      }

      const newArray = new Array(response.data.content[0]);
      const dynamicColumnDefs = generateColumnDefs(newArray);
      setColumn(dynamicColumnDefs);
      setData(response.data.content);

      setLoading(false);
    } catch (error) {
      console.log(error);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isMain.length !== 0 && selectedOption === null) {
      if (isMain[isMain.length - 1]) {
        handleChange({
          value: isMain[isMain.length - 1].id,
          label: isMain[isMain.length - 1].project_name,
        });
      } else {
        setData(null);
      }
    }
  }, [isMain, selectedOption]);

  const onCellValueComment = async (params) => {
    if (!UserInfo || !UserInfo.username) {
      showToastMessage("Editing privileges are reserved for registered users only. Any alterations made will not affect the underlying data sources.");
      return;
    }

    // Check if the role is "Admin" or "Manager"
  if (UserInfo.role === "Admin" || UserInfo.role === "Manager") {
      // Display alert
      alert("You do not have edit access. Only Dev and Lead have edit access.Changes made will not affect the data sources");
      return;
    }

    const data = {
      id: MainId,
      S_no: params.data.S_no,
      comment: params.newValue,
      user: UserInfo.username,
    };

    try {
      const response = await axios.put(`${Backendapi.PYTHON_APP_BACKEND_API_URL}/update_comment/`, data);
      // console.log(response.data);
      // Reload the page after a successful update
  window.location.reload();
    } catch (error) {
      console.error("Error updating comment:", error);

      // Log more details about the error
    // console.log("Response status:", error.response.status);
    // console.log("Response data:", error.response.data);
    }
  };

  const onCellValueEta = async (params) => {
    if (!UserInfo || !UserInfo.username) {
      showToastMessage("Editing privileges are reserved for registered users only. Any alterations made will not affect the underlying data sources.");
      return;
    }

    if (UserInfo.role === "Admin" || UserInfo.role === "Manager") {
      // Display alert
      alert("You do not have edit access. Only Dev and Lead have edit access.Changes made will not affect the data sources");
      return;
    }

    const data = {
      id: localStorage.getItem("mainDashboard"),
      S_no: params.data.S_no,
      eta: params.newValue,
      user: UserInfo.username,
    };
    // console.log(data);

    try {
      const response = await axios.put(
        `${Backendapi.PYTHON_APP_BACKEND_API_URL}/update_eta/`,
        data
      );
      // console.log(response.data);
  window.location.reload();

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const onCellValuePla = async (params) => {
    if (!UserInfo || !UserInfo.username) {
      showToastMessage("Editing privileges are reserved for registered users only. Any alterations made will not affect the underlying data sources.");
      return;
    }

    if (UserInfo.role === "Admin" || UserInfo.role === "Manager") {
      // Display alert
      alert("You do not have edit access. Only Dev and Lead have edit access.Changes made will not affect the data sources");
      return;
    }

    const data = {
      id: localStorage.getItem("mainDashboard"),
      S_no: params.data.S_no,
      pla: params.newValue,
      user: UserInfo.username,
    };

    try {
      const response = await axios.put(
        `${Backendapi.PYTHON_APP_BACKEND_API_URL}/update_pla/`,
        data
      );
      console.log(response.data);
  window.location.reload();

    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const columnDefs = column;

  const loadingCellRendererParams = useMemo(() => {
    return {
      loadingMessage: "One moment please...",
    };
  }, []);

  const onGridReady = (params) => {
    setGridApi(params.api);
    // console.log("Grid is ready!"); // Log when the grid is ready for debugging
  };

  const onCellValueChanged = (event) => {
    console.log(event);
    // Check if the edited cell is in the "Comments" column
    if (event.column.colId === "Comments") {
      // Get the previous value of "Comments"
      const previousComments = event.oldValue || "";

      // Update the "pre-info" array
      const preInfo = event.data["pre_info"];
      if (Array.isArray(preInfo)) {
        // Create a new comment object with the previous value and date/time in IST
        const newComment = {
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
          comment: previousComments,
        };

        // Add the new comment to the beginning of the "pre-info" array
        preInfo.unshift(newComment);

        // Update the "Comments" field in the data with the new comment
        event.data["Comments"] = event.newValue; // event.newValue contains the edited comment

        // Update the state to reflect the changes
        setRowData([...rowData]); // Make sure to create a new array to trigger a re-render
      }
    } else if (event.column.colId === "ETA") {
      // Handle changes for the "ETA" column (similar functionality to Comments)
      const previousETA = event.oldValue || "";

      // Update the "pre-eta" array
      const preETA = event.data["pre_ETA"];
      if (Array.isArray(preETA)) {
        const newETANote = {
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
          ETA: previousETA,
        };

        preETA.unshift(newETANote);
        event.data["ETA"] = event.newValue;
        setRowData([...rowData]);
      }
    } else if (event.column.colId === "Plan_of_Action") {
      const previousPLA = event.oldValue || "";

      // Update the "pre-eta" array
      const prePLA = event.data["pre_PLA"];
      if (Array.isArray(prePLA)) {
        const newPLANote = {
          timestamp: new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
          }),
          PLA: previousPLA,
        };

        prePLA.unshift(newPLANote);
        event.data["PLA"] = event.newValue;
        setRowData([...rowData]);
      }
    }
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
      console.log(lineNumberToHighlight);
      const newTab = window.open("", "_blank");
      newTab.document.write("");

      // Split the file content into lines
      const lines = fileContent.split("\n");

      // Set the content of the new tab's document
      newTab.document.write(`
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
        ${lines
          .map((line, lineNumber) => {
            const highlightedClass =
              lineNumber === lineNumberToHighlight ? "highlighted" : "";
            return `<a id="line${lineNumber}"></a><span class="${highlightedClass}">${lineNumber}:</span> ${line}`;
          })
          .join("\n")}
      </pre>
        </body>
      </html>
    `);

      newTab.document.close();
      setTimeout(() => {
        const highlightedElement = newTab.document.getElementById(
          `line${lineNumberToHighlight + 1}`
        );
        if (highlightedElement) {
          highlightedElement.scrollIntoView({
            behavior: "smooth",
            block: "center",
            inline: "nearest",
          });
        }
      }, 100);
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

  const defaultColDef = useMemo(() => {
    return {
      sortable: true,
      flex: 1,
      minWidth: 100,
      filter: true,
      resizable: true,
    };
  }, []);

  const renderContent = () => {
    // console.log(loading);
    switch (true) {
      case loading:
        return (
          <div>
            <CustomLoadingCellRenderer {...loadingCellRendererParams} />
          </div>
        );
      case !data:
        return <div>No data available</div>;
      default:
        return (
          <>
            <AgGridReact
              onGridReady={onGridReady}
              rowData={data}
              columnDefs={columnDefs}
              rowSelection="multiple"
              enableRangeSelection={true}
              undoRedoCellEditing={undoRedoCellEditing}
              undoRedoCellEditingLimit={undoRedoCellEditingLimit}
              defaultColDef={defaultColDef}
              tooltipShowDelay={0}
              onCellValueChanged={onCellValueChanged}
              pagination={true}
              paginationPageSize={10}
            ></AgGridReact>
          </>
        );
    }
  };

  return (
    <div
      className={`tableContainer ${tableMaximized ? "maximized" : "minimized"}`}
    >
      <div className="tableHeader">
        <div>
          {isMain.length !== 0 ? (
            <div
        style={{
          width: "100%", // Full width of the container
          display: "flex",
          alignItems: "center",
        }}
      >
              <label
                style={{ fontWeight: "bold", fontSize: "20px",marginRight:"10px"}}
              >
                Design
              </label>
              <div style={{ width: "300px" }}>
                <Select
                  options={isMain.map((option, index) => ({
                    value: option.id,
                    label: option.project_name,
                  }))}
                  isSearchable={false}
                  styles={customStyles}
                  maxMenuHeight={150}
                  menuPortalTarget={document.body}
                  menuPosition={"fixed"}
                  onChange={handleChange}
                  value={selectedOption || isMain[isMain.length - 1].id}
                  
                />
              </div>
              <h3 style={{ marginLeft:"350px",fontWeight:"bold"}}>Main Dashboard</h3>
            </div>
          ) : (
            <p>No data available</p>
          )}
        </div>
        <button className="toggle-button" onClick={toggleTable}>
          {tableMaximized ? <FaChevronUp /> : <FaChevronDown />}
        </button>
      </div>
      <div className={themeClass} style={{ width: "100%" }}>
        {renderContent()}
      </div>
      <Toast
  show={showToast}
  onClose={() => setShowToast(false)}
  style={{
    position: "fixed",
    top: "20px", // Adjust the top position as needed
    left: "50%", // Center the Toast horizontally
    transform: "translateX(-50%)", // Center the Toast horizontally
    zIndex: 9999, // Set a high z-index to ensure it appears on top
    backgroundColor: "#eae7dc",
    fontSize: "22px",
    width: "550px",
  }}
>
  <Toast.Header style={{
  backgroundImage: "linear-gradient(to right top, #2f4454, #4b5574, #77638d, #aa6e97, #da7b93)",
  fontSize: "30px",
  color: '#feffff'
}}
>
    <strong className="mr-auto">Notification</strong>
  </Toast.Header>
  <Toast.Body style={{ color: '#ea584f' }}>
  {showLoader && (
            <img
              src={barrier}
              alt="Loader"
              style={{ marginRight: "10px", width: "30px", height: "30px", background: "transparent"}}
            />
          )}{toastMessage}</Toast.Body>
</Toast>

    </div>
  );
};

export default BootstrapTable;
