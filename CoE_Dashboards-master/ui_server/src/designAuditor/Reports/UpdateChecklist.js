import axios from "axios";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Backendapi from "../Backendapi";
import { getRequiredParameter } from "../logout";
import BackButton from "./BackButton";

function UpdateChecklist() {
    const [loading, setLoading] = useState(false)
    const userRole = JSON.parse(localStorage.getItem('auth')).role
    const userName = JSON.parse(localStorage.getItem('auth')).username
    const navigate = useNavigate()
    const [checklistData, setChecklistData] = useState([]);
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
            })
            .catch(err => console.log(err))
    }, [DesignName,stage,type])

    //Save the checklist into database: 
    const handleSubmitChecklist = async () => {
        setLoading(true)
        console.log("Checklist data submitted:", checklistData);
        const ChecklistData = {
            projectName: DesignName,
            role: userRole,
            name: userName,
            questions: checklistData
        }
        try {
            const data = await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/${milestoneName}/${DesignName}/${stage}/${type}`, ChecklistData)
            console.log(data)
            toast.success("Checklist has been submited successfully.")
            navigate(`/designAuditorPage/summary/${milestoneName}/${DesignName}/${stage}/${type}`)//have to choose best
            setLoading(false)
        }
        catch (err) {
            console.log(err)
            toast.warning("Failed to submit checklist. Please try after sometime !")
            setLoading(false)
        }
    }
    
    //Submit checklist model code starts here.
    const sumbitChecklistModel = <div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Submit Your Checklist
        </button>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div style={{background:"powderblue"}} class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"><b>Do you want to submit the following checklist?</b></h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <p>
                            <b> DESIGN &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;: <span style={{ color: "green" }}>{DesignName.toLocaleUpperCase()}</span></b><br />
                            <b> STAGE&nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; &nbsp; :<span style={{ color: "green" }}> {stage.toLocaleUpperCase()}</span></b><br />
                            <b> MILESTONE &nbsp; &nbsp; :<span style={{ color: "green" }}> {milestoneName.toUpperCase()}</span></b>
                        </p>
                        
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                        <button type="button" class="btn btn-primary" onClick={handleSubmitChecklist} data-bs-dismiss="modal">Submit</button>
                        {/* <button type="button" class="btn btn-primary"  onClick={handleSubmitChecklist}>Save changes</button> */}
                    </div>
                </div> 
            </div>
        </div>
    </div>
    //Submit checklist code ends here.


    return (
        <div>
            <div>
                <h2 style={{ background: "powderblue", textTransform: "uppercase", padding: '10px', textAlign: 'center' }}> {stage} {milestoneName} checklist questions info</h2>
            </div>
            {
                <div style={{ border: '1px solid #efefef', borderRadius: '10px', margin: '10px', padding: '10px', boxShadow: '0 0 10px 2px rgba(0, 0, 0, .1)' }}>
                    <div >
                        <BackButton />
                    </div>
                    {/* table for summarydetails */}
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
                                    <td style={{textAlign:"left"}}>
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
                                    <td style={{background:"#fff"}}>
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
                                            row.pdLeadAnswer === "" ? "No access" : row.pdLeadAnswer
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
                                            row.pdLeadComment === "" ? "No access" : row.pdLeadComment
                                        )}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                   
                   {/* submit checklist handle rendering */}
                    <div style={{ display: "flex", justifyContent: "center" }}>
                        {
                            loading === false ? sumbitChecklistModel : <button className="btn btn-primary" disabled={loading === true} onClick={handleSubmitChecklist}>
                                Your checklist is being submitted. Please wait..
                            </button>
                        }

                    </div>
             
                </div>
            }
        </div>
    );
}
export default UpdateChecklist;