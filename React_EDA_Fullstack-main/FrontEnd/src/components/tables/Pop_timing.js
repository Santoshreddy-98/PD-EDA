import React from "react";
import popup from "../../css/Pop_timing.module.css"
import { FaRegTimesCircle } from "react-icons/fa";

function Pop_timing(props) {

  return (
    <div className={props.closeBtn ? popup.bodyone : popup.body}>
      <span className={popup.close} onClick={() => props.setCloseBtn(false)}>
        <FaRegTimesCircle />
      </span>
      <div>
        {props.popupData
          ? props.popupData.map((item) => {
              return(
                <pre>{item}</pre>
              )
            })
          : ''
          }
      </div>
    </div>
  );
}

export default Pop_timing;
