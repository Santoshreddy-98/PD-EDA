import React from "react";
import { Line } from "react-chartjs-2";

const AreaChart = ({ labels, areaInstCounts, areaTotalAreas }) => {
  const data = {
    labels: labels,
    datasets: [
      {
        label: "Inst_Count",
        data: areaInstCounts,
        borderColor: "rgb(255, 99, 132)",
        backgroundColor: "rgba(255, 99, 132, 0.5)",
        borderWidth: 1,
        yAxisID: "leftYaxis",
      },
      {
        label: "Total_Area",
        data: areaTotalAreas,
        backgroundColor: "rgba(53, 162, 235, 0.5)",
        borderColor: "rgb(53, 162, 235)",
        borderWidth: 1,
        yAxisID: "rightYaxis",
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
      leftYaxis: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Inst_Count Label",
        },
        grid: {
          color: "rgba(75, 192, 192, 0.2)",
        },

        position: "left",
        suggestedMin: 0,
        suggestedMax: Math.max(...areaInstCounts) + 10,
      },
      rightYaxis: {
        beginAtZero: true,
        title: {
          display: true,
          text: "Total_Area Label",
        },
        grid: {
          color: "rgba(75, 192, 192, 0.2)", // Use the same color as the left grid
          drawOnChartArea: false, // Do not draw the grid on the chart area
        },

        position: "right",
        suggestedMin: 0,
        suggestedMax: Math.max(...areaTotalAreas) + 10,
      },
    },
    layout: {
      padding: {
        top: 20,
      },
    },
  };

  return (
    <div style={{ width: "600px" }}>
      <h2>Area Chart</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AreaChart;
