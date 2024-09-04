import React from "react";
import { Line } from "react-chartjs-2";
import { Chart as ChartJS } from "chart.js/auto";

const SetupChart = ({
  labels,
  setupReg2RegWNS,
  setupReg2RegTNS,
  setupReg2RegNVP,
  setupIOWNS,
  setupIOTNS,
  setupIONVP,
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "SetupReg2RegWNS",
        data: setupReg2RegWNS.map(Number),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 3,
      },
      {
        label: "SetupReg2RegTNS",
        data: setupReg2RegTNS.map(Number),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 3,
      },
      {
        label: "SetupReg2RegNVP",
        data: setupReg2RegNVP.map(Number),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 3,
      },
      {
        label: "SetupIOWNS",
        data: setupIOWNS.map(Number),
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
        borderWidth: 3,
      },
      {
        label: "SetupIOTNS",
        data: setupIOTNS.map(Number),
        borderColor: "rgb(54, 162, 235)",
        backgroundColor: "rgba(54, 162, 235, 0.5)",
        borderWidth: 3,
      },
      {
        label: "SetupIONVP",
        data: setupIONVP.map(Number),
        borderColor: "rgb(153, 102, 255)",
        backgroundColor: "rgba(153, 102, 255, 0.5)",
        borderWidth: 3,
      },
    ],
  };

  const options = {
    scales: {
      x: {
        type: "category",
        position: "bottom",
        offset: 3,
      },
      y: {
        left: {
          type: "linear",
          position: "left",
          grid: {
            color: "rgba(75, 192, 192, 0.9)",
          },
        },
        right: {
          type: "linear",
          position: "right",
          grid: {
            color: "rgba(255, 99, 132, 0.9)",
          },
        },
        title: {
          display: true,
          text: "Time (ns)",
        },
      },
    },
  };

  return (
    <div style={{ width: "600px" }}>
      <h2>Setup Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default SetupChart;
