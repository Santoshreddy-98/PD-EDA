import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import loaderimg from "../loadingBest.gif"
import Backendapi from "../Backendapi";
import { getBackgroundColor, getRequiredParameter,options } from '../logout';
import BackButton from "./BackButton";

function ViewChecklist() {
    const userRole = JSON.parse(localStorage.getItem('auth'))?.role || ""
    const retake = userRole === "PD Dev" || userRole === "PD Lead"
    const [checklistData, setChecklistData] = useState([]);
    const [summarydetails, setSummaryDetails] = useState([])
    const [loading, setLoading] = useState(true)
    const type = getRequiredParameter(1)
    const stage = getRequiredParameter(2)
    const DesignName = getRequiredParameter(3)
    const milestoneName = getRequiredParameter(4)

    //Get the checklist questions: 
    useEffect(() => {
        axios.get(`${Backendapi.REACT_APP_BACKEND_API_URL}/${milestoneName}/${DesignName}/${stage}/${type}`)
            .then(res => {
                setChecklistData(res.data.questions)
                setSummaryDetails(res.data)
                console.log(res.data.questions)
            })
            .catch(err => {
                console.log(err)
                setLoading(false)
            }
            )
    }, [stage,type,DesignName,milestoneName])
    return (
        <div>
            <div>
                <h2 style={{ background: "powderblue", textTransform: "uppercase", padding: '10px', textAlign: 'center' }}>{stage} {milestoneName} checklist view </h2>
            </div>
            {
                checklistData.length > 0 ? <>
                    <div style={{boxSizing:'border-box'}}>
                       
                        {/* table for summary of the checklist */}
                        <div style={{ border: '1px solid #efefef', borderRadius: '10px', margin: '10px', padding: '10px', boxShadow: '0 0 10px 2px rgba(0, 0, 0, .1)' }}>
                            <div>
                                <BackButton />
                                {
                                    retake && <Link to={`/designAuditorPage/info/${milestoneName}/${DesignName}/${stage}/${type}`}>
                                        <button style={{color:"black"}} className="btn btn-warning float-right mb-2">Take Quality Checks</button>
                                    </Link>
                                }
                            </div>
                            {/* summary percentage table */}
                            <table border={1} className="table">
                                <thead style={{ background: "#eeefaa" }}>
                                    <tr>
                                        <th>Stage </th>
                                        <th>Milestone Name</th>
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
                                        <td style={{ backgroundColor: getBackgroundColor(summarydetails?.pdDevPercentage ? summarydetails?.pdDevPercentage : "no") }}>{summarydetails?.pdDevPercentage ? summarydetails?.pdDevPercentage + "%" : "0 %"}</td>
                                        <td>{summarydetails?.LeadName ? summarydetails?.LeadName : "-"}</td>
                                        <td style={{ backgroundColor: getBackgroundColor(summarydetails?.pdLeadPercentage ? summarydetails?.pdLeadPercentage : "no") }}>{summarydetails?.pdLeadPercentage ? summarydetails?.pdLeadPercentage + "%" : "0 %"}</td>
                                        <td>{(summarydetails?.DevName || summarydetails?.LeadName ) && summarydetails?.updatedAt ? new Date(summarydetails?.updatedAt).toLocaleDateString('en-US', options) : "-"}</td>
                                        <td style={{ backgroundColor: getBackgroundColor(summarydetails?.summaryPercentage ? summarydetails?.summaryPercentage : "no") }}>{summarydetails?.summaryPercentage ? summarydetails?.summaryPercentage + "%" : "0 %"}</td>
                                    </tr>
                                </tbody>
                            </table>
                            {/* table for display questions */}
                            <table className="table" border={1}>
                                <thead>
                                    <tr style={{ background: "powderblue" }}>
                                        <th >S.No</th>
                                        <th style={{ textAlign: "left" }} >Question</th>
                                        <th >PD Dev</th>
                                        <th >PD Dev Comment</th>
                                        <th >PD Lead</th>
                                        <th >PD Lead Comment</th>
                                    </tr>
                                </thead>
                                <tbody >
                                    {checklistData.map((row, rowIndex) => (
                                        <tr style={{ border: "1px solid green" }} key={rowIndex}>
                                            <td >{rowIndex + 1}</td>
                                            <td style={{ textAlign: "left" }} ><b>{row.question}</b> </td>
                                            <td > {(row.pdDevAnswer === "" ? "" : row.pdDevAnswer)} </td>
                                            <td style={{ background: "#fff" }} > {(row.pdDevComment === "" ? "" : row.pdDevComment)} </td>
                                            <td style={{ background: "#fff" }} > {(row.pdLeadAnswer === "" ? "" : row.pdLeadAnswer)} </td>
                                            <td style={{ background: "#fff" }} >{(row.pdLeadComment === "" ? "" : row.pdLeadComment)}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                   
                </> : loading !== true ?
                <>
                            <center style={{ marginTop: "200px", padding: "10px" }}>
                                <h3 style={{color:"red"}}>Checklist questions are not available for the <span style={{ color: "green" }}>{stage}</span> stage in <span style={{ color: "green" }}>{milestoneName}</span> !</h3>
                                <br/>
                            </center>
                </>
                :
                    <center style={{ marginTop: "100px", padding: "10px" }}>
                        <img src={loaderimg} alt="loading" />
                        <h3>Retrieving the checklist. Please wait...</h3>
                    </center>
            }

            
        </div>
    );
}

export default ViewChecklist;

