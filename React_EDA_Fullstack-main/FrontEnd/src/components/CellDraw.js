import React, { useState, useContext, useEffect, useRef } from "react";

import { dieareaData } from "./AppContent";

const CellDraw = ({ getDataFromCell, getDataForPopup }) => {

  const [highlightedDiv, setHighlightedDiv] = useState(null);
  const componentRef = useRef(null);

  const [cellsData, setCellsData] = useState()
  const { cellData } = useContext(dieareaData)


  useEffect(() => {
    setCellsData(cellData)
  }, [cellData])

  const sendDataToHeader = (id) => {
    console.log(id)

    const product = cellData.find((p) => p.Comp_id == id);
    getDataFromCell(product);
  };

  const sendPopupData = (popupTrue) => {
    getDataForPopup(popupTrue);
  };

  // ******** Highlighting Cells **********
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

  // ********* Highlighting Cells Ends Here **********


  return (cellsData) ?
    (
      <div ref={componentRef}>
        {cellsData.map((item, index) => {
          return (
            <div
              id={`cell_${item.Comp_id}`}

              onClick={() => { handleDivClick(`cell_${item.Comp_id}`); sendDataToHeader(item.Comp_id); }}
              onDoubleClick={() => sendPopupData(true)}
              key={index}
              style={{
                position: "absolute",
                bottom: `${item.y + 1}mm`,
                left: `${item.x}mm`,
                width: `${item.x1}mm`,
                height: `${item.y1}mm`,
                border: highlightedDiv === `cell_${item.Comp_id}` ? '30px solid yellow' : '20px solid red',
                background: "transparent"
              }}
            >
              <h2 className={`cell_${item.Comp_id}`}
                style={{ textAlign: "center", fontSize: "25rem", color: "white", zIndex: "-1" }}
              >
                {item.instance_name}
              </h2>
            </div>
          );
        })}


      </div>
    ) : ""
};

export default CellDraw;
