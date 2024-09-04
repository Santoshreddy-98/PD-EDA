import React, { useState, useContext, useEffect, useRef } from "react";

import { GetId } from "./Parent";
import { dieareaData } from "./AppContent";


const Wires = ({ getDataFromCell, getDataForPopup }) => {

  // ******* Storing the data from backend ********
  const { wiresData } = useContext(dieareaData)
  const { setIdOpen } = useContext(GetId)

  const [highlightedDiv, setHighlightedDiv] = useState(null);
  const componentRef = useRef(null);

  // **** Sending the data to header *****
  const sendDataToHeader = (netId, routeId) => {
    let value = wiresData.filter(e => e.id === netId)
    let id = value[0].route.filter(eve => eve.id === routeId)
    getDataFromCell(id[0]);
    setIdOpen(value[0])
  };

  // **** Sending the data to Popup *****
  const sendPopupData = (popupTrue) => {
    getDataForPopup(popupTrue);
  };


  //***** Highlighting Fly lines ******* */
  const METAL = {
    M1: "aqua",
    M2: "green",
    M3: "orange",
    M4: "#fff"
  }

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
  // ****** Highlighting Fly lines ends here *******

  return (wiresData) ? (

    <div ref={componentRef}>
      <React.Fragment>
        {wiresData.map((item, index) => {
          return (
            <React.Fragment key={index}>
              {
                item.route.map((val, num) => {
                  return (
                    <div key={num}
                      id={`Wires${item.id}_${val.id}_${val.layer}`}
                      onClick={() => {
                        handleDivClick(`Wires${item.id}_${val.id}_${val.layer}`);
                        sendDataToHeader(item.id, val.id);
                      }}
                      onDoubleClick={() => sendPopupData(true)}
                      style={{
                        position: "absolute",
                        left: `${val.line.x0}mm`,
                        bottom: `${val.line.y0}mm`,
                        width: ((val.line.x1 - val.line.x0) === 0 || isNaN(val.line.x1 - val.line.x0)) ? "30mm" : `calc(${val.line.x1}mm - ${val.line.x0}mm)`,
                        height: ((val.line.y1 - val.line.y0) === 0 || isNaN(val.line.y1 - val.line.y0)) ? "30mm" : `calc(${val.line.y1}mm - ${val.line.y0}mm)`,
                        background: highlightedDiv === `Wires${item.id}_${val.id}_${val.layer}` ? `${METAL[val.layer]}` : `${METAL[val.layer]}`,
                        border: highlightedDiv === `Wires${item.id}_${val.id}_${val.layer}` ? "15mm solid red" : ""
                      }}
                    ></div>
                  )
                })
              }
            </React.Fragment>
          )
        })}
      </React.Fragment>
    </div>
  ) : ""

};

export default Wires;
