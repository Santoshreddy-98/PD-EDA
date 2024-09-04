import React from 'react'
import pop from '../css/popup.module.css';
import { FaRegTimesCircle } from 'react-icons/fa'

function Popup(props) {
    
    // Getting timing data from Table container page 
    const data = Object.entries(props.open) 
    
    
    return (props.trigger) ? (
        <div className={pop.popup}>
            <div className={pop.popupInner}>
                <a className={pop.closeBtn} onClick={() => props.setTrigger(false)} ><FaRegTimesCircle /></a>
               {
                data.map((itemName, index)=>{
                    return <h3 key={index}>{itemName[0]} : {itemName[1]}</h3>
                })
               }
            </div>
        </div>
    ) : "";
}

export default Popup
