import React, { useState, useContext } from 'react'
import { FromToContext } from './Draw'
import { pathsData } from './AppContent'
import draw from '../css/draw.module.css'
const Path = (props) => {
    // ****** Collecting the backend data *******
    const { setFromPath, setToPath, setLine } = useContext(FromToContext)
    const { timingPath } = useContext(pathsData)
    const [from, setFrom] = useState(0)
    const [to, setTo] = useState(0)
    const [error, setError] = useState(false)
    const [outOfPath, setOutOfPath] = useState(false)


    // ****** Sending the data to test.js page ******
    const sendToTest = (e) => {
        e.preventDefault()

        if (to <= timingPath.length && from >= 1 && from <= to) {
            console.log("one", from, to)
            setFromPath(from)
            setToPath(to)
            if (pathArr.length === 0) {
                setPathpopup(true)
                for (var i = from; i <= to; i++) {
                    pathArr.push(i)
                }
                setPathpopup(pathArr)
            }
        } else if (timingPath.length > to) {
            console.log("two")
            setLine(line => [])
            setOutOfPath(!false)
            setTimeout(() => setOutOfPath(!true), 3000)
        } else {
            console.log("three")
            setLine(line => [])
            setError(!false)
            setTimeout(() => setError(!true), 3000)
        }
    }

    // ***** Clearing the checkbox ******
    const clearThePath = () => {
        setLine(line => [])
        document.getElementById("rangeForm").reset();
        setPathArr([])
        setFrom(0)
        setTo(0)
    }

    //code by veera
    const [pathpopup, setPathpopup] = useState(false)
    const [pathArr, setPathArr] = useState([])
    const handleCancel = () => {
        [...Array(20)].map((path, pathId) => [...document.getElementsByClassName(`Path_${pathId}`)].map((allPaths) => allPaths.style.borderTop = "25mm solid violet"))
        setPathpopup(false)
        setPathArr([])
    }
    const handleSubmitBtn = (e) => {

        [...Array(20)].map((path, pathId) => [...document.getElementsByClassName(`Path_${pathId}`)].map((allPaths) => allPaths.style.borderTop = "25mm solid violet"))
        e.target.checked && [...document.getElementsByClassName(e.target.value)].map((item) => item.style.borderTop = "50mm solid red")
        setPathpopup(true)
    }
    // console.log(pathArr)

    return (
        <React.Fragment>
            {
                error ? <span style={{ color: "#000", marginBottom: "5px", background: "#ffb3b3", padding: "7px 4px" }}>
                    Path points should be in between 1 - {timingPath.length}
                </span> : ""
            }
            {
                outOfPath ? <span style={{ color: "#000", marginBottom: "5px", background: "#ffb3b3", padding: "7px 4px" }}>
                    From path should be less than To path
                </span> : ""
            }
            {
                pathpopup ? <div style={{
                    position: "fixed",
                    bottom: "0",
                    height: "300px",
                    right: "0px",
                    border: "3px solid #f1f1f1",
                    zIndex: "9",
                    bottom: 25,
                    overflow: "auto",
                    background: 'powderblue',
                    width: '15%'
                }}><h3 onClick={() => handleCancel()} style={{ color: "red", cursor: 'pointer', padding: "10px 10px 10px 0px" }}><span>❌</span>Close</h3>
                    {pathArr.length > 0 ? <table border='1' style={{ width: "100%", background: "powderblue" }}>
                        <thead>
                            <tr>
                                <th>Select Path</th>
                                <th>Path Name</th>
                            </tr>
                        </thead>
                        <tbody>
                            {
                                pathArr.map((item, key) => <tr key={key}>
                                    <td><input onClick={handleSubmitBtn} value={`Path_${item}`} name='Path' type="checkbox" /></td>
                                    <td>{`Path_${item}`}</td>
                                </tr>
                                )
                            }
                        </tbody>
                    </table> : <p>Sorry! Please Select Path...</p>}
                </div> : null
            }
            <form onSubmit={sendToTest} id={"rangeForm"}>
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "space-evenly" }}>
                    <label style={{ color: "black" }}>From: <input type={'search'} size={5} onChange={(e) => setFrom(Number(e.target.value))} ></input></label>
                    &nbsp;
                    <label style={{ color: "black" }}>To: <input type={'search'} size={5} onChange={(e) => setTo(Number(e.target.value))} ></input></label>
                </div>
                <br></br>
                <div style={{ position: "relative", width: "100%", display: "flex", justifyContent: "space-evenly" }}>
                    <button onClick={handleSubmitBtn} type='submit' className={draw.btn}>submit</button>
                    <span style={{ border: "2px solid #333", padding: "5px", background: "#fff" }} type='submit' className={draw.btn} onClick={() => clearThePath()}>Clear</span>
                    {/* <button id="openForm" style={{height:"200px",width:"200px",border:"2px solid red",position:"absolute"}}></button> */}
                </div>
            </form>

        </React.Fragment >
    )
}

export default Path
