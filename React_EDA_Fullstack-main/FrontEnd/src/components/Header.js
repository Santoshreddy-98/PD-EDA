import React, { useState, useEffect, useContext } from "react";
import nav from "../css/header.module.css"; // **** CSS ****
import {
  AiOutlineFullscreen,
  AiOutlineZoomOut,
  AiOutlineZoomIn,
} from "react-icons/ai";

import { GetId } from "./Parent";

const Header = ({ setZooming, dataCell }) => {

  const [count, setCount] = useState(0);
  const [drop, setDrop] = useState({});
  const { idOpen } = useContext(GetId)


  // ****** Collecting components data for Headers *******
  useEffect(() => {
    const cellData = Object.keys(dataCell)

    if (cellData.includes("ref_name")) {
      setDrop({
        "Name": "Cell",
        "Cell_Name": dataCell.ref_name
      })
    }
    else if (cellData.includes("net_name")) {
      setDrop({
        "Name": "Ports",
        "Cell_Name": dataCell.pin_name
      })
    }
    else if (cellData.includes("layer") && cellData.includes("line1")) {
      setDrop({
        "Name": "Wires",
        "Cell_Name": idOpen["net name"] + " - Id - " + dataCell.id
      })
    }
    else if (cellData.includes("Route") && cellData.includes("direction")) {
      setDrop({
        "Name": "Pins",
        "Cell_Name": dataCell.pin_name
      })
    }
  }, [dataCell])

  // ****** Sending data to draw.js *****
  const sendToTranform = (zoomValue) => {
    setZooming({ z: zoomValue, count: count });
  };

  return (
    <div>
      <header>
        <nav>
          <ul className={nav.nav__link}>
            <li>
            </li>
            <li>
              <span>
                <AiOutlineZoomIn
                  onClick={() => sendToTranform("zoomIn", setCount(count + 1))}
                />
              </span>
            </li>
            <li>
              <span>
                <AiOutlineZoomOut
                  onClick={() => sendToTranform("zoomOut", setCount(count - 1))}
                />
              </span>
            </li>
            <li>
              <span>
                <AiOutlineFullscreen
                  onClick={() => sendToTranform("resetTransform", setCount(count + 1))}
                />
              </span>
            </li>
          </ul>
        </nav>

        <nav>
          <ul className={nav.text}>
            <li>
              <span>{drop.Name}-&nbsp;{drop.Cell_Name}</span>
            </li>
          </ul>
        </nav>
      </header>
    </div>
  );
};

export default Header;
