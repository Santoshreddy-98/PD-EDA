import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Select from "react-select";
import { useAppContext } from "../AppContext"; // Import the AppProvider and useAppContext
import { MainCharts } from "./MainCharts";
import Backendapi from "../designAuditor/Backendapi";
import loaderimg from "../designAuditor/colorloader.gif"
const MainComponent = styled.div`
  position: relative;
  display: grid;
  grid-template-rows: auto 1fr;
  grid-gap: 10px;
  width: 100%;
  height: 100%;
`;

const FileWrapper = styled.form`
  display: flex;
  justify-content: center;
  align-items: center;
`;

const InputWrapper = styled.input`
  border: none;
  border-bottom: 2px solid #000;
  outline: none;
  padding: 5px;
`;

const ButtonWrapper = styled.button`
  background: #98fb98;
  border: none;
  padding: 10px 40px;
  margin: 0 0 0 20px;
  border-radius: 5px;
  cursor: pointer;
  &:active {
    background: #76c776;
  }
`;

const BtnWrapper = styled.button`
  background: #98fb98;
  border: none;
  padding: 7px 30px;
  border-radius: 5px;
  cursor: pointer;
  &:active {
    background: #76c776;
  }
`;

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

const ChartComponent = () => {
  const _id = localStorage.getItem("detailDashboard");
  const runNameJSON = localStorage.getItem("run_name");

  const run_name = JSON.parse(runNameJSON);

  const [isChartData, setIsChartData] = useState({
    _id: _id,
    run_name: run_name,
  });
  console.log(isChartData);
  const [selectedOption, setSelectedOption] = useState(null);
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const handleChange = async (option) => {
    setSelectedOption(option);
    setLoading(true);
    try {
      const response = await axios.get(
        `${Backendapi.PYTHON_APP_BACKEND_API_URL}/chart_read?param1=${_id}&param2=${option.value}`
      );
      console.log(response.data);
      setData(response.data); // Set the fetched data in the state
      setLoading(false); // Set loading back to false when data is fetched
    } catch (error) {
      console.error("Error fetching data:", error);
      setLoading(false);
    }
  };

  const renderContent = () => {
    switch (true) {
      case loading:
        return (<center style={{ marginTop: "100px", padding: "10px" }}>
          <img src={loaderimg} alt="loading" />
        </center>)
      case !data:
        return <div>No data available</div>;
      default:
        return (
          <>
            <MainCharts dataVersionTwo={data} />
          </>
        );
    }
  };

  useEffect(() => {
    if (isChartData != null && selectedOption === null) {
      if (isChartData["run_name"]) {
        handleChange({
          value: isChartData.run_name[0],
          label: isChartData.run_name[0],
        });
      } else {
        setData(null);
      }
    }
  }, [isChartData, selectedOption]);

  return (
    <MainComponent>
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "1fr 1fr",
          gridTemplateRows: "auto 1fr",
          alignItems: "center",
        }}
      >
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <div
            style={{
              width: "100%",
              display: "flex",
              justifyContent: "space-evenly",
            }}
          >
            {isChartData && isChartData["run_name"] ? (
              <div
                style={{
                  width: "400px",
                  display: "flex",
                  justifyContent: "space-evenly",
                  alignItems: "center",
                }}
              >
                <label style={{ fontWeight: "bold", fontSize: "20px" }}>
                  Partition
                </label>
                <div style={{ width: "300px" }}>
                  <Select
                    options={isChartData["run_name"].map((option, index) => ({
                      value: option,
                      label: option,
                    }))}
                    isSearchable={false}
                    styles={customStyles}
                    maxMenuHeight={150}
                    menuPortalTarget={document.body}
                    menuPosition={"fixed"}
                    onChange={handleChange}
                    value={selectedOption || isChartData._id}
                  />
                </div>
              </div>
            ) : (
              <p>No data available</p>
            )}
          </div>
        </div>
      </div>
      <div>{renderContent()}</div>
    </MainComponent>
  );
};

export default ChartComponent;
