import React, { useState, useEffect, useRef, useContext } from 'react'
import { dieareaData } from './AppContent'

const Pins = ({ getDataFromCell, getDataForPopup }) => {

    // ****** Collection pins data from backend *******
    const { pinsData } = useContext(dieareaData)
    const [data, setData] = useState(pinsData.components)
    const [highlightedDiv, setHighlightedDiv] = useState(null);
    const componentRef = useRef(null);

    // ******* Sending Data to header ******
    const sendDataToHeader = (CompId, PinId) => {
        let value = data.filter(e => e.Comp_id === CompId)
        let id = value[0].pins.filter(eve => eve.id === PinId)
        getDataFromCell(id[0]);
    };

    // **** Sending data to popup page *******
    const sendPopupData = (popupTrue) => {
        getDataForPopup(popupTrue);
    };


    // ******* Highlighting Pins **********


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

    // Highlighting Pins Ends Here ***********

    return (data) ? (
        <>
            {
                data.map((val, index) => {
                    return (
                        <React.Fragment key={index}>
                            {

                                val.pins.map((pinitems, val1) => {
                                    return (
                                        <React.Fragment key={val1}>

                                            {
                                                pinitems.Route.map((route, rounteIndex) => {
                                                    return (
                                                        <div key={rounteIndex}
                                                            onClick={() => {
                                                                sendDataToHeader(val.Comp_id, pinitems.id);
                                                            }}
                                                            onDoubleClick={() => sendPopupData(true)}
                                                            style={{
                                                                position: 'absolute', bottom: `${route.y0}mm`,
                                                                left: `${route.x0}mm`,
                                                                width: `${route.x1}mm`, background: 'palegreen', height: `${route.y1}mm`
                                                            }}></div>
                                                    )
                                                })
                                            }
                                        </React.Fragment>
                                    )
                                })


                            }
                        </React.Fragment>
                    )
                })
            }
        </>
    ) : ""
}

export default Pins







