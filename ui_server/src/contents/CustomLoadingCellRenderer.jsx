import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSyncAlt } from "@fortawesome/free-solid-svg-icons";

const CustomLoadingCellRenderer = (props) => {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        minHeight: "100vh", // Makes the loader full height
      }}
    >
      <FontAwesomeIcon
        icon={faSyncAlt}
        spin
        size="3x" // Adjust the size here (e.g., "3x" for large)
        style={{
          color: "#0aff54", // Set the primary color here,
          height : "150px",
          width :"150px"
        }}
      />
      <span style={{color: "#050505",marginTop:"10px",fontSize:"30px"}}>
        {props.loadingMessage}
      </span>
    </div>
  );
};

export default CustomLoadingCellRenderer;