import React from "react";
import { Line } from "react-chartjs-2";

const PowerChart = ({
  labels,
  internalPower,
  switchingPower,
  leakagePower,
  totalPower,
}) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Internal Power",
        data: internalPower.map(Number),
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 3,
      },
      {
        label: "Switching Power",
        data: switchingPower.map(Number),
        borderColor: "rgb(53, 162, 235)",
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderWidth: 3,
      },
      {
        label: "Leakage Power",
        data: leakagePower.map(Number),
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.5)",
        borderWidth: 3,
      },
      {
        label: "Total Power",
        data: totalPower.map(Number),
        borderColor: "rgb(255, 206, 86)",
        backgroundColor: "rgba(255, 206, 86, 0.5)",
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
          text: "Power (Watts)",
        },
      },
    },
  };

  return (
    <div style={{ width: "600px" }}>
      <h2>Power Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default PowerChart;
