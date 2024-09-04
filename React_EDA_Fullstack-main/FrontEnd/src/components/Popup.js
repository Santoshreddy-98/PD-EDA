import React, { useState } from 'react'
import pop from '../css/popup.module.css';
import { FaRegTimesCircle } from 'react-icons/fa'

function Popup(props) {
    // ***** Collecting data from components ********
    const data = Object.entries(props.open)

    return (props.trigger) ? (
        <div className={pop.popup}>
            <div className={pop.popupInner}>
                <a className={pop.closeBtn} onClick={() => props.setTrigger(false)} ><FaRegTimesCircle /></a>
                <table>
                    <tbody>
                        {
                            data.map((itemName, index) => {
                                return (
                                    <tr>

                                        <th>{itemName[0]}</th>
                                        <td>{(typeof (itemName[1] === Object)) ? JSON.stringify(itemName[1]) : itemName[1]}</td>
                                    </tr>
                                )
                            })
                        }
                    </tbody>

                </table>
                {/* {
                data.map((itemName, index)=>{
                    return (<h3 key={index}>{itemName[0]} : { (typeof(itemName[1] === Object)) ? JSON.stringify(itemName[1]) : itemName[1]}</h3>)
                })
               } */}
            </div>
        </div>
    ) : "";
}

export default Popup
