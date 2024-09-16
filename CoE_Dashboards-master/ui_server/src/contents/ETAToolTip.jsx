import React from "react";
import "./CommentToolTip.css";

const ETAToolTip = (props) => {
  // Check if props.api and data are defined
  if (!props.api || !props.data) {
    return null;
  }

  const { data } = props;
  let preETA = data["pre_ETA"]; // Get the "pre-eta" field from the data

  // Function to sort ETA entries by timestamp in reverse order
  const sortETAsByTimestamp = (etas) => {
    return etas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Sort preETA array by timestamp in reverse order
  preETA = Array.isArray(preETA) ? sortETAsByTimestamp(preETA) : [];

  // Check if preETA is an array and contains previous ETA information
  if (preETA.length > 0) {
    return (
      <div className="custom-tooltip">
        <div className="eta-heading">
          <h3 className="panel-title">Partition: {data.Partition_Name}</h3>
          <h3 className="panel-title">Lead: {data.Lead}</h3>
        </div>
        <div className="panel-body">
          <ul>
            <li>Previous ETA:</li>
            <ul>
              {preETA.map((eta, index) => (
                <li key={index}>
                  {eta.user}-{eta.timestamp}: {eta.ETA}
                </li>
              ))}
            </ul>
          </ul>
        </div>
      </div>
    );
  } else {
    return null; // Return null if there are no previous ETA entries
  }
};

export default ETAToolTip;
