import React, { useState, useEffect, useMemo, useContext } from 'react';

import { FromToContext } from './Draw';
import { dieareaData } from "./AppContent";

const Test = (props) => {

    // ***** storing the data *****
    const { fromPath, toPath, setError, line, setLine, setOutOfPath, setWirePath } = useContext(FromToContext)
    const { cellData } = useContext(dieareaData)
    const [countPaths, setCountPaths] = useState(props.pathValue)
    const [position, setPosition] = useState([])
    const { point } = useContext(dieareaData);
    const [instanceName, setInstanceName] = useState([])


    const handleButtonClick = () => {
        setError(!false)
        setTimeout(() => {
            setError(!true);
        }, 3000);
    }

    const handlePathClick = () => {
        setOutOfPath({
            Pathlen: countPaths.length,
            PathBoolean: !false
        })
        setTimeout(() => {
            setOutOfPath({
                Pathlen: 0,
                PathBoolean: !true
            })
        }, 3000);
    }


    let dict = {}

    const val = useMemo(() => {
        return (
            countPaths.map((item, index) => {
                const data = []
                item[`path_${index + 1}`].map(val => {
                    const product = cellData.find((p) => p.instance_name === val)
                    data.push(product)
                })
                dict[`Path_${index + 1}`] = data
                setInstanceName(({ ...dict }))
            })
        )
    }, [])

    console.log(instanceName)

    // ********** Algorithm for triangle **********

    useEffect(() => {
        if (fromPath > 0 && toPath > 0) {
            if (fromPath <= toPath) {
                console.log("====>", fromPath, toPath)
                for (let j = fromPath; j <= toPath; j++) {
                    let count = 1
                    let position = []

                    // console.log(instanceName[`Path_${j}`])
                    for (let i = 0; i <= instanceName[`Path_${j}`].length; i++) {
                        // ****** Describing the center position of Cells *******
                        const first_left = instanceName[`Path_${j}`][i].x1 / 2 + instanceName[`Path_${j}`][i].x
                        const first_bottom = instanceName[`Path_${j}`][i].y1 / 2 + instanceName[`Path_${j}`][i].y
                        const sec_left = instanceName[`Path_${j}`][count].x1 / 2 + instanceName[`Path_${j}`][count].x
                        const sec_bottom = instanceName[`Path_${j}`][count].y1 / 2 + instanceName[`Path_${j}`][count].y

                        // **** Calculating length of line using hypot ******
                        const x = Number(Math.hypot(Math.abs(first_left - sec_left), Math.abs(first_bottom - sec_bottom)).toFixed(2))
                        // ******** calculating angle for the length using asin *******
                        const deg = Math.asin(Math.abs(first_bottom - sec_bottom) / x)

                        if (first_bottom < sec_bottom && first_left < sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(-Math.abs(deg * 180 / 3.14).toFixed(2))
                            }
                            position.push(A)
                        }
                        else if (first_bottom > sec_bottom && first_left < sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2))
                            }
                            position.push(A)
                        }
                        else if (first_bottom < sec_bottom && first_left > sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2)) + -180
                            }
                            position.push(A)
                        }
                        else if (first_bottom > sec_bottom && first_left > sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(-Math.abs(deg * 180 / 3.14).toFixed(2)) + -180
                            }
                            position.push(A)
                        }
                        else if (first_bottom === sec_bottom && first_left < sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2))
                            }
                            position.push(A)
                        }
                        else if (first_bottom === sec_bottom && first_left > sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2)) + 180
                            }
                            position.push(A)
                        }
                        // ///////////////////////
                        else if (first_bottom < sec_bottom && first_left === sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2)) + 90
                            }
                            position.push(A)
                        }
                        else if (first_bottom > sec_bottom && first_left === sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(-Math.abs(deg * 180 / 3.14).toFixed(2)) - 90
                            }
                            position.push(A)
                        }
                        if (count < instanceName[`Path_${j}`].length - 1) {
                            count++;
                        }
                        else {
                            break;
                        }
                    }
                    lineDict[`Path_${j}`] = position
                    setLine(({ ...lineDict }))
                }
            }
            else if (fromPath === toPath) {
                setError(!true)
            } else if (countPaths.length > toPath) {
                handlePathClick()
            } else {
                handleButtonClick()
            }
            return () => {
                setPosition(position => [])
            }
        }
    }, [fromPath, toPath])

    let lineDict = {}

    useEffect(() => {
        if (point > 0 && point > 0) {
            if (point <= point) {
                console.log("====>", fromPath, toPath)
                for (let j = point; j <= point; j++) {
                    let count = 1
                    let position = []

                    // console.log(instanceName[`Path_${j}`])
                    for (let i = 0; i <= instanceName[`Path_${j}`].length; i++) {
                        const first_left = instanceName[`Path_${j}`][i].x1 / 2 + instanceName[`Path_${j}`][i].x
                        const first_bottom = instanceName[`Path_${j}`][i].y1 / 2 + instanceName[`Path_${j}`][i].y
                        const sec_left = instanceName[`Path_${j}`][count].x1 / 2 + instanceName[`Path_${j}`][count].x
                        const sec_bottom = instanceName[`Path_${j}`][count].y1 / 2 + instanceName[`Path_${j}`][count].y
                        // **** Calculating length of line using hypot ******
                        const x = Number(Math.hypot(Math.abs(first_left - sec_left), Math.abs(first_bottom - sec_bottom)).toFixed(2))
                        // ******** calculating angle for the length using asin *******
                        const deg = Math.asin(Math.abs(first_bottom - sec_bottom) / x)

                        if (first_bottom < sec_bottom && first_left < sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(-Math.abs(deg * 180 / 3.14).toFixed(2))
                            }
                            position.push(A)
                        }
                        else if (first_bottom > sec_bottom && first_left < sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2))
                            }
                            position.push(A)
                        }
                        else if (first_bottom < sec_bottom && first_left > sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2)) + -180
                            }
                            setPosition(position => position.concat(A))
                            position.push(A)
                        }
                        else if (first_bottom > sec_bottom && first_left > sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(-Math.abs(deg * 180 / 3.14).toFixed(2)) + -180
                            }
                            position.push(A)
                        }
                        else if (first_bottom === sec_bottom && first_left < sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2))
                            }
                            position.push(A)
                        }
                        else if (first_bottom === sec_bottom && first_left > sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2)) + 180
                            }
                            position.push(A)
                        }
                        else if (first_bottom < sec_bottom && first_left === sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(Math.abs(deg * 180 / 3.14).toFixed(2)) + 90
                            }
                            position.push(A)
                        }
                        else if (first_bottom > sec_bottom && first_left === sec_left) {
                            const A = {
                                "X": first_left,
                                "Y": first_bottom,
                                "Width": x,
                                "Tranform": Number(-Math.abs(deg * 180 / 3.14).toFixed(2)) - 90
                            }
                            position.push(A)
                        }
                        if (count < instanceName[`Path_${j}`].length - 1) {
                            count++;
                        }
                        else {
                            break;
                        }
                    }
                    lineDict[`Path_${j}`] = position
                    setLine(({ ...lineDict }))
                }
            }
            else if (point === point) {
                setError(!true)
            } else if (countPaths.length > point) {
                handlePathClick()
            } else {
                handleButtonClick()
            }
            return () => {
                setPosition(position => [])
            }
        }
    }, [point])

    // ********** Algorithm for triangle End Here **********


    // ******** Highlighthing Wires *************
    const sendDataToWires = (data) => {
        setWirePath({
            wires: data,
            wireClicked: !false
        })
        setTimeout(() => {
            setWirePath({
                wires: "",
                wireClicked: !true
            })
        }, 5000);
    }

    // ******** Highlighthing Wires Ends Here *************



    //********* Higlighting Path FlyLines  *********

    const highlightPath = (e) => {
        [...document.getElementsByClassName(e.target.className)].map(item => {
            item.style.borderTop = "50mm solid #ff6347"
        })
    }

    const normalizePath = (e) => {
        [...document.getElementsByClassName(e.target.className)].map(outItem => {
            outItem.style.borderTop = "25mm solid violet"
        })
    }

    //********* Higlighting Path Fly lines ends Here  *********

    return (props.pathValue) ? (
        <React.Fragment>
            {
                Object.keys(line).map((item, index) => {
                    return (
                        <React.Fragment key={index} >
                            {
                                line[item].map((lineItems, secIndex) => {
                                    return (
                                        <div className={item} onClick={(e) => { highlightPath(e); sendDataToWires(item); }} key={secIndex} title={item} onMouseOut={(e) => normalizePath(e)} style={{
                                            position: "absolute", left: `${lineItems.X}mm`,
                                            bottom: `${lineItems.Y}mm`, borderTop: "25mm solid violet",
                                            width: `${lineItems.Width}mm`,
                                            transformOrigin: "bottom left",
                                            transform: `rotateZ(${lineItems.Tranform}deg)`,
                                            cursor: "pointer"
                                        }}></div>
                                    )
                                })
                            }
                        </React.Fragment>
                    )
                })
            }
        </React.Fragment>
    ) : ""
}

export default Test
