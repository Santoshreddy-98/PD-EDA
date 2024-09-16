import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Backendapi from "../Backendapi";
import { getBackgroundColor ,getRequiredParameter,options} from '../logout';
import BackButton from "./BackButton";

function ChecklistSummary() {
    const retake = JSON.parse(localStorage.getItem('auth')).role === "PD Dev" || JSON.parse(localStorage.getItem('auth')).role === "PD Lead"
    const [checklistData, setChecklistData] = useState([]);
    const [summarydetails, setSummaryDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const userRole = "View"
    const handleInputChange = (event, rowIndex, columnName) => {
        const updatedData = [...checklistData];
        updatedData[rowIndex][columnName] = event.target.value;
        setChecklistData(updatedData);
    };

    const handleRadioChange = (event, rowIndex, columnName, value) => {
        console.log(event)
        if (
            (userRole === "PD Dev" && columnName.startsWith("pdDevAnswer")) ||
            (userRole === "PD Lead" && columnName.startsWith("pdLeadAnswer"))
        ) {
            const updatedData = [...checklistData];
            updatedData[rowIndex][columnName] = value;
            setChecklistData(updatedData);
        }
    };

   const type = getRequiredParameter(1)
    const stage = getRequiredParameter(2)
    const DesignName = getRequiredParameter(3)
    const milestoneName = getRequiredParameter(4)
    console.log(type, "type", stage, "stage", DesignName, "DesignName", milestoneName, "milestoneName")

    //Get the checklist : 
    useEffect(() => {
        axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/${milestoneName}/${DesignName}/${stage}/${type}`)
            .then(res => {
                setChecklistData(res.data.questions)
                setSummaryDetails(res.data)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            }
            )
    }, [DesignName,stage,type,milestoneName])


    return (
        <div>
            <div>
                <h2 style={{ background: "powderblue", textTransform: "uppercase", padding: '10px', textAlign: 'center' }}> {stage} {milestoneName} checklist summary </h2>
            </div>


            {
                checklistData.length > 0 ? <>
                    <div style={{ border: '1px solid #efefef', borderRadius: '10px', margin: '10px', padding: '10px', boxShadow: '0 0 10px 2px rgba(0, 0, 0, .1)' }}>
                        <div>
                            <BackButton />
                            {
                                retake && <Link to={`/designAuditorPage/info/${milestoneName}/${DesignName}/${stage}/${type}`}>
                                    <button style={{color:"black"}} className="btn btn-warning float-right mb-2">Take Quality Checks</button>
                                </Link>
                            }

                        </div>
                        {/* Checklist Summary table */}
                        <table border={1} className="table">
                            <thead style={{ background: "#eeefaa" }}>
                                <tr>
                                    <th>Stage </th>
                                    <th>Milestone</th>
                                    <th>Dev Name</th>
                                    <th>Dev(%)</th>
                                    <th>Lead Name</th>
                                    <th>Lead(%)</th>
                                    <th>Modified Time</th>
                                    <th>QC Score (%)</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>{stage.toUpperCase()}</td>
                                    <td>{milestoneName.toUpperCase()}</td>
                                    <td>{summarydetails?.DevName ? summarydetails?.DevName : "-"}</td>
                                    <td style={{
                                        backgroundColor: getBackgroundColor(summarydetails?.pdDevPercentage ? summarydetails?.pdDevPercentage : "no")
                                    }}>{summarydetails?.pdDevPercentage ? summarydetails?.pdDevPercentage + "%" : "0 %"}</td>
                                    <td>{summarydetails?.LeadName ? summarydetails?.LeadName : "-"}</td>
                                    <td
                                        style={{
                                            backgroundColor: getBackgroundColor(summarydetails?.pdLeadPercentage ? summarydetails?.pdLeadPercentage : "no")
                                        }}
                                    >{summarydetails?.pdLeadPercentage !== 0 ? summarydetails?.pdLeadPercentage + "%" : "0 %"}</td>
                                    <td>{summarydetails?.updatedAt ? new Date(summarydetails?.updatedAt).toLocaleDateString('en-US', options) : "-"}</td>
                                    <td
                                        style={{
                                            backgroundColor: getBackgroundColor(summarydetails?.summaryPercentage ? summarydetails?.summaryPercentage : "no")
                                        }}
                                    >{summarydetails?.summaryPercentage + "%"}</td>
                                </tr>
                            </tbody>
                        </table>

                        {/* list of questions */}
                        <table className="table" border={1}>
                            <thead>
                                <tr style={{ background: "powderblue" }}>
                                    <th>S.No</th>
                                    <th style={{ textAlign: "left" }}>Question</th>
                                    <th>PD Dev</th>
                                    <th>PD Dev Comment</th>
                                    <th>PD Lead</th>
                                    <th>PD Lead Comment</th>
                                </tr>
                            </thead>
                            <tbody>
                                {checklistData.map((row, rowIndex) => (
                                    <tr key={rowIndex}>
                                        <td>{rowIndex + 1}</td>
                                        <td style={{ textAlign: "left" }} >
                                            <b>{row.question}</b>
                                        </td>
                                        <td>
                                            {userRole === "PD Dev" ? (
                                                <>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`pdDevAnswer-${rowIndex}`}
                                                            value="YES"
                                                            checked={row.pdDevAnswer === "YES"}
                                                            onChange={(e) =>
                                                                handleRadioChange(e, rowIndex, "pdDevAnswer", "YES")
                                                            }
                                                        />
                                                        Yes
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`pdDevAnswer-${rowIndex}`}
                                                            value="NO"
                                                            checked={row.pdDevAnswer === "NO"}
                                                            onChange={(e) =>
                                                                handleRadioChange(e, rowIndex, "pdDevAnswer", "NO")
                                                            }
                                                        />
                                                        No
                                                    </label>
                                                </>
                                            ) : (
                                                row.pdDevAnswer === "" ? "" : row.pdDevAnswer
                                            )}
                                        </td>
                                        <td style={{ background: "#fff" }}>
                                            {userRole === "PD Dev" ? (
                                                <input
                                                    type="text"
                                                    style={{ borderRadius: "3px", width: "100%", padding: '5px' }}
                                                    value={row.pdDevComment}
                                                    onChange={(e) =>
                                                        handleInputChange(e, rowIndex, "pdDevComment")
                                                    }
                                                />
                                            ) : (
                                                row.pdDevComment === "" ? "" : row.pdDevComment
                                            )}
                                        </td>
                                        <td style={{ background: "#fff" }}>
                                            {userRole === "PD Lead" ? (
                                                <>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`pdLeadAnswer-${rowIndex}`}
                                                            value="YES"
                                                            checked={row.pdLeadAnswer === "YES"}
                                                            onChange={(e) =>
                                                                handleRadioChange(e, rowIndex, "pdLeadAnswer", "YES")
                                                            }
                                                        />
                                                        Yes
                                                    </label>
                                                    <label>
                                                        <input
                                                            type="radio"
                                                            name={`pdLeadAnswer-${rowIndex}`}
                                                            value="NO"
                                                            checked={row.pdLeadAnswer === "NO"}
                                                            onChange={(e) =>
                                                                handleRadioChange(e, rowIndex, "pdLeadAnswer", "NO")
                                                            }
                                                        />
                                                        No
                                                    </label>
                                                </>
                                            ) : (
                                                // "No access"
                                                row.pdLeadAnswer === "" ? "" : row.pdLeadAnswer
                                            )}
                                        </td>
                                        <td style={{ background: "#fff" }}>
                                            {userRole === "PD Lead" ? (
                                                <input
                                                    type="text"
                                                    style={{ borderRadius: "3px", width: "100%", padding: '5px' }}
                                                    value={row.pdLeadComment}
                                                    onChange={(e) =>
                                                        handleInputChange(e, rowIndex, "pdLeadComment")
                                                    }
                                                />
                                            ) : (
                                                row.pdLeadComment === "" ? "" : row.pdLeadComment
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </> : loading !== true ?
                    <center style={{ padding: "10px", color: "red", background: "#efefef", marginTop: "100px" }}><h3>Checklist Summary Not Availble!</h3></center> :
                    <center style={{ marginTop: "100px", padding: "10px" }}>
                        <h3>Retrieving the checklist. Please be patient...</h3>
                    </center>
            }
        </div>
    );
}

export default ChecklistSummary;