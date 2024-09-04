import React, { useState, useEffect, useRef, useContext } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import draw from "../css/draw.module.css";
import { BsEyeFill, BsEyeSlashFill } from "react-icons/bs";
// **** importing chatbot****//
import ChatBot from "react-simple-chatbot";
import { ThemeProvider } from "styled-components";
import chatImg from "../images/r1.jpg";
import steps from "./Chatbot";

// ****** Components Files ******
import DefDraw from "./DefDraw";
import CellDraw from "./CellDraw";
import Test from "./Test";
import Pins from "./Pins";
import Path from "./Path";
import Wires from "./Wires";
import HighlightWires from "./HighlightWires";

import { CContainer } from '@coreui/react'

export const FromToContext = React.createContext()

import { dieareaData } from "./AppContent";
import { pathsData } from './AppContent'

const Draw = ({ zooming, setOpen, setButtonPopup }) => {


  const { dieAreaData, pinsData } = useContext(dieareaData)
  const { timingPath } = useContext(pathsData)

  // ****chatbot start here****//
  const theme = {
    background: "#808080",
    headerBgColor: "#197B22",
    headerFontSize: "20px",
    botBubbleColor: "#0F3789",
    headerFontColor: "white",
    botFontColor: "white",
    userBubbleColor: "#FF5733",
    userFontColor: "white"
  };

  const con = {
    botAvatar: chatImg, Wires,
    floating: true,
  };
  // ************** chatbot end here ***********//

  const [diearea, setDiearea] = useState({
    width: "",
    height: "",
    position: "",
    border: "",
    transformOrigin: "",
    transform: "",
    zoom: "",
    top: "",
    left: "",
  });

  useEffect(() => {
    setDiearea({
      width: dieAreaData && `${dieAreaData.x3}mm`,
      height: dieAreaData && `${dieAreaData.y3}mm`,
      position: "relative",
      border: "30px solid violet",
      transformOrigin: "0px 0px",
      transform: "scale(0.5) translate(0px, 0px)",
      zoom: dieAreaData && (dieAreaData.x3 < 7000) ? "0.04" : "0.02",
      left: "10%",
      top: "10%",
      marginBottom: "10%"
    });
  }, []);


  // ******* show and Disable chart *******

  const [cellShape, setCellShape] = useState(true);
  const [pinShape, setPinShape] = useState(true);
  const [wireShape, setWireShape] = useState(true);
  const [portShape, setPortShape] = useState(true);
  const [pathValue, setPathValue] = useState({
    "Path": "Path_0",
    "Path_check": true
  })

  const [fromPath, setFromPath] = useState(0)
  const [toPath, setToPath] = useState(0)
  const [line, setLine] = useState([])

  const [wirePath, setWirePath] = useState({
    wires: "",
    wireClicked: !true
  })
  // /////////////////////////////////////////////////////////////

  // ****** Zoom in functionality *******
  const zoom = useRef();

  useEffect(() => {
    if (zooming.z === "zoomIn") {
      zoom?.current?.zoomIn();
    } else if (zooming.z === "zoomOut") {
      zoom?.current?.zoomOut();
    } else {
      zoom?.current?.resetTransform();
    }
  }, [zooming.count]);

  // ******* Ended **********

  // **** Get data from CellDraw and send to Header *******
  const getDataFromCell = (messages) => {
    setOpen(messages);
  };
  const getDataForPopup = (popUp) => {
    setButtonPopup(popUp);
  };
  const getDataFromPath = (message) => {
    setPathValue(message)
  }


  // *************************************************
  return (
    <>
      <CContainer style={{ backgroundColor: "black", border: "2px solid red", display: "flex", height: "auto" }}>


        <TransformWrapper
          ref={zoom}
          centerZoomedOut
          defaultScale={0}
          defaultPositionX={0.2}
          defaultPositionY={0.2}
          doubleClick={{
            disabled: "false",
          }}
          initialScale={1}
          minScale={1}
          maxScale={50}
        // panning={{disabled:"True"}}
        >

          {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
            <TransformComponent>
              <div
                style={{ width: "85vw", height: "90vh", overflow: "hidden" }}
              >
                <FromToContext.Provider value={{ fromPath, toPath, line, setLine, setWirePath, wirePath }}>
                  <div style={dieAreaData && diearea}>
                    {cellShape ? (
                      <CellDraw
                        getDataFromCell={getDataFromCell}
                        getDataForPopup={getDataForPopup}
                      />
                    ) : (
                      ""
                    )}
                    {pinShape ? (
                      <DefDraw
                        getDataFromCell={getDataFromCell}
                        getDataForPopup={getDataForPopup}
                      />
                    ) : (
                      ""
                    )}
                    {wireShape ? (
                      <Wires
                        getDataFromCell={getDataFromCell}
                        getDataForPopup={getDataForPopup}
                      />
                    ) : (
                      ""
                    )}
                    <HighlightWires />
                    {portShape ? (
                      (pinsData) && <Pins getDataFromCell={getDataFromCell}
                        getDataForPopup={getDataForPopup} />
                    ) : (
                      ""
                    )}


                    {
                      timingPath && <Test pathValue={timingPath} />
                    }

                  </div>
                </FromToContext.Provider>
              </div>
            </TransformComponent>
          )}
        </TransformWrapper>

        {/* ******** Chatbot ************** */}
        <div className="App">
          <ThemeProvider theme={theme}>
            <ChatBot
              // This appears as the header
              // text for the chat bot
              headerTitle="EDA CHAT"
              steps={steps}
              {...con}
            />
          </ThemeProvider>
        </div>
        {/* ******** Chatbot Ended Here ************** */}

        {/* ****** Sidebar Start Here ******** */}
        <div className={draw.sideBar}>
          <FromToContext.Provider value={{ setFromPath, setToPath, setLine }}>
            <div className={draw.sideBarItems}>
              <ul>
                <li onClick={() => setCellShape(!cellShape)}>
                  {" "}
                  {cellShape ? (
                    <i>
                      <BsEyeFill />
                    </i>
                  ) : (
                    <i>
                      <BsEyeSlashFill />
                    </i>
                  )}{" "}
                  Cell
                </li>
                <li onClick={() => setPinShape(!pinShape)}>
                  {pinShape ? (
                    <i>
                      <BsEyeFill />
                    </i>
                  ) : (
                    <i>
                      <BsEyeSlashFill />
                    </i>
                  )}{" "}
                  Ports
                </li>
                <li onClick={() => setWireShape(!wireShape)}>
                  {wireShape ? (
                    <i>
                      <BsEyeFill />
                    </i>
                  ) : (
                    <i>
                      <BsEyeSlashFill />
                    </i>
                  )}{" "}
                  Wires
                </li>
                <li onClick={() => setPortShape(!portShape)}>
                  {portShape ? (
                    <i>
                      <BsEyeFill />
                    </i>
                  ) : (
                    <i>
                      <BsEyeSlashFill />
                    </i>
                  )}{" "}
                  Pins
                </li>
              </ul>
            </div>
            <div className={draw.line}></div>
            <div className={draw.pathItems}>
              <ul>
                {
                  timingPath && <Path getDataFromPath={getDataFromPath} />
                }
              </ul>
            </div>
          </FromToContext.Provider>
        </div>
        {/* ********** Sidebar Ended Here ********** */}

      </CContainer>
    </>
  );
};

export default Draw;
