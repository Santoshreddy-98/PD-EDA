import React, { useState, useContext, useEffect, useRef } from "react";

import { dieareaData } from "./AppContent";

const DefDraw = ({ getDataFromCell, getDataForPopup }) => {

  const [highlightedDiv, setHighlightedDiv] = useState(null);
  const componentRef = useRef(null);



  const { portsData } = useContext(dieareaData)
  const [portsValue, setPortsValue] = useState()

  useEffect(() => {
    setPortsValue(portsData)
  }, [portsData])

  const sendDataToHeader = (id) => {
    const product = portsData.find((p) => p.id == id);
    getDataFromCell(product);
  };

  const sendPopupData = (popupTrue) => {
    getDataForPopup(popupTrue);
  };


  // ******* Highlighting Ports *********
  const handleDivClick = (divId) => {
    if (divId !== highlightedDiv) {
      setHighlightedDiv(divId);
    }
  }
  const handleClickOutside = (event) => {
    if (componentRef.current && !componentRef.current.contains(event.target)) {
      setHighlightedDiv(null);
    }
  };

  useEffect(() => {
    window.addEventListener('click', handleClickOutside);
    return () => {
      window.removeEventListener('click', handleClickOutside);
    };
  }, []);

  // ******* Highlighting Ports Ends Here *********

  return (portsValue) ? (
    <div ref={componentRef}>
      {portsValue.map((defItems, index) => {
        return (
          <div
            id={`ports${defItems.id}`}
            onClick={() => {
              handleDivClick(`ports${defItems.id}`);
              sendDataToHeader(defItems.id);
            }}
            onDoubleClick={() => sendPopupData(true)}
            key={index}
            style={{
              position: "absolute",
              bottom: `${defItems.y}mm`,
              left: `${defItems.x}mm`,
              width: "25rem",
              height: "25rem",
              border: highlightedDiv === `ports${defItems.id}` ? "4px solid yellow" : "1px solid black",
              backgroundColor: "yellowgreen",
              zIndex: "1000",
            }}
          >
            {defItems.pin_name}
          </div>
        );
      })}
    </div>
  ) : ""
};

export default DefDraw;
