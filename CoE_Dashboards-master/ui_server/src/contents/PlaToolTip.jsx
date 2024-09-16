import React from 'react';
import './CommentToolTip.css';

const PlaToolTip = (props) => {
  // Check if props.api and data are defined
  if (!props.api || !props.data) {
    return null;
  }

  const { data } = props;
  let prePLA = data['pre_PLA']; // Get the "pre-PLA" field from the data

  // Function to sort PLA entries by timestamp in reverse order
  const sortPLAsByTimestamp = (plas) => {
    return plas.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  };

  // Sort prePLA array by timestamp in reverse order
  prePLA = Array.isArray(prePLA) ? sortPLAsByTimestamp(prePLA) : [];

  // Check if prePLA is an array and contains previous PLA information
  if (prePLA.length > 0) {
    return (
      <div className="custom-tooltip">
        <div className="pla-heading">
          <h3 className="panel-title">Partition: {data.Partition_Name}</h3>
          <h3 className="panel-title">Lead: {data.Lead}</h3>
        </div>
        <div className="panel-body">
          <ul>
            <li>Previous POA:</li>
            <ul>
              {prePLA.map((pla, index) => (
                <li key={index}>
                  {pla.user}-{pla.timestamp}: {pla.PLA}
                </li>
              ))}
            </ul>
          </ul>
        </div>
      </div>
    );
  } else {
    return null; // Return null if there are no previous PLA entries
  }
};

export default PlaToolTip;
