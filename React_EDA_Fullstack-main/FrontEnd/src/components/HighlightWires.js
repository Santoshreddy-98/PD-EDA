import React, { useState, useEffect, useContext } from 'react';
import { FromToContext } from "./Draw";
import { pathsData } from './AppContent';
import { dieareaData } from './AppContent';

const HighlightWires = () => {

    const { netPath } = useContext(pathsData)
    const { wiresData } = useContext(dieareaData)
    const [wire, setWire] = useState(wiresData);
    const [pathNets, setPathNets] = useState(netPath)
    const [netCounts, setnetCounts] = useState([])
    const { wirePath } = useContext(FromToContext)

    useEffect(() => {
        // ******** Collecting wires data for POPUP message *********
        if (wirePath.wires) {
            Object.keys(pathNets[wirePath.wires]).map(item => {
                console.log(item)
                const product = wire.find((p) => p["net name"] === item);
                setnetCounts(netCounts => netCounts.concat(product))
            })
        }
        return () => {
            setnetCounts(netCounts => [])
        }
    }, [wirePath.wires])

    return (wirePath.wires) ? (
        <React.Fragment>
            {
                wirePath.wireClicked ? netCounts.map((itemOne, indexOne) => {
                    return (
                        <React.Fragment key={indexOne}>
                            {
                                itemOne.route.map((valOne, numOne) => {
                                    return (
                                        <div key={numOne}
                                            // ******* Drawing wires based on the co-ordinates *******
                                            style={{
                                                position: "absolute",
                                                left: `${valOne.line.x0}mm`,
                                                bottom: `${valOne.line.y0}mm`,
                                                width: `calc(${valOne.line.x1}mm - ${valOne.line.x0}mm)`,
                                                height: `calc(${valOne.line.y1}mm - ${valOne.line.y0}mm)`,
                                                animation: "blinking 1s infinite",
                                                border: "40mm solid #fff"

                                            }}
                                        ></div>
                                    )
                                })
                            }
                        </React.Fragment>
                    )
                }) : ""
            }
        </React.Fragment>
    ) : ""
}

export default HighlightWires
