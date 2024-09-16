import { useState } from "react";
import { getRequiredParameter } from "../logout";
import Backendapi from "../Backendapi";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function ChecklistQuestions() {
    const [loading, setLoading] = useState(false);
    const [inputString, setInputString] = useState('');
    const [questions, setQuestions] = useState([]);
    const [showPreview, setShowPreview] = useState(false); // New state for controlling preview display
    const type = getRequiredParameter(1)
    const stage = getRequiredParameter(2)
    const DesignName = getRequiredParameter(3) 
    const milestoneName = getRequiredParameter(4)

    const navigate=useNavigate()
    const parseQuestions = (inputString) => {
        const questionsArray = inputString.split('\n');
        const filteredQuestions = questionsArray.filter(question => question.trim() !== '');
        return filteredQuestions.map(question => ({ question: question.trim() }));
    };
    
    // Preview button click handler
    const handlePreview = () => {
        if(inputString.trim() !==""){
            const parsedQuestions = parseQuestions(inputString);
            setQuestions(parsedQuestions);
            setShowPreview(true); // Show the preview  
        }
       
    };
   
    const handleInputChange = (event) => {
        setInputString(event.target.value);
    };

    ///saving questions in to the database: 
    const handleSubmitChecklistQuestions = async (event) => {
        setLoading(true);
        event.preventDefault();
        const parsedQuestions = parseQuestions(inputString);
        setQuestions(parsedQuestions);

        try {
            const response = await axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/questions/create/${milestoneName}/${stage}/${type}`, {
                questions: parsedQuestions,
            });
            console.log(response)

            if (response.status === 201 || response.status ===200) {
                navigate(`/designAuditorPage/view/${milestoneName}/${DesignName}/${stage}/${type}`)
                console.log('Questions submitted successfully!');
            } else {
                console.error('Failed to submit questions.');
            }
        } catch (error) {
            console.error('Error during API request:', error);
        } finally {
            setLoading(false);
        }
    };

    // for checklist questions second stage questions
    //Submit checklist code starts here
    const sumbitChecklistQuestionsModel = <div>
        <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
            Add Questions
        </button>

        <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div style={{ background: "powderblue" }} class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel"><b>Do you want to Add the following checklist questions?</b></h5>
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
                        <button type="button" class="btn btn-primary" onClick={handleSubmitChecklistQuestions} data-bs-dismiss="modal">Submit</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    return (
        <>
            <div>
                <h2 style={{ background: "powderblue", textTransform: "uppercase", padding: '10px', textAlign: 'center' }}> {stage} checklist Questions for Adding</h2>
            </div>
        <div style={{ border: '1px solid #efefef', borderRadius: '10px', margin: '10px', padding: '10px', boxShadow: '0 0 10px 2px rgba(0, 0, 0, .1)' }}>
           
            <div style={{padding:"20px"}}>
                    <div style={{ border: '1px solid #efefef', borderRadius: '10px', margin: '10px', padding: '10px', boxShadow: '0 0 10px 2px rgba(0, 0, 0, .1)' }}>
                        <form onSubmit={(e) => e.preventDefault()} style={{ width: "100%", height: "100%" }}>
                            <div>
                                <h2 className="bg bg-light" style={{ padding: "10px", textAlign: "center",borderRadius:"8px" }}>Paste Your Questions: </h2>
                                <br />
                                <textarea
                                    style={{
                                        width: "100%",
                                        borderRadius: "2px 10px 10px 2px",
                                        padding: "20px",
                                        minHeight: "60px",
                                        height: Math.max(200, inputString.split('\n').length * 20) + "px", // Adjust the height based on content
                                        overflowY: "hidden",
                                    }}
                                    value={inputString}
                                    onChange={handleInputChange}
                                    required
                                />


                            </div>
                            <div style={{ margin: "10px 0px" }}>
                                <button className="btn btn-dark" onClick={handlePreview}>Preview Questions</button>
                            </div>
                        </form>
                </div>
              

                {/* Preview section */}
                {showPreview && (
                    <>
                        <div style={{ border: '1px solid #efefef', borderRadius: '10px', margin: '10px', padding: '10px', boxShadow: '0 0 10px 2px rgba(0, 0, 0, .1)' }}>
                           <div>
                                    <h2 className="bg bg-light" style={{padding:"10px",borderRadius:"8px",textAlign:"center"}}>Preview of the Questions:</h2>
                            <ol>
                                {questions.map((q, index) => (
                                    <li key={index}><b>{q.question}</b></li>
                                ))}
                            </ol>
                        </div>
                        <hr/>
                        {/* Submit checklist questions */}
                        <div style={{ display: "flex", justifyContent: "center" }}>
                            {
                                loading === false ? sumbitChecklistQuestionsModel : <button className="btn btn-primary" disabled={loading === true} onClick={handleSubmitChecklistQuestions}>
                                    Checklist Questions are adding. Please wait..
                                </button>
                            }
                        </div>
                            </div>
                    </>
                )}

            </div>
        </div>
        </>
    );
}

export default ChecklistQuestions;
