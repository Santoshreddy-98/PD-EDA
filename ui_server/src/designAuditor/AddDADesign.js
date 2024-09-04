import axios from 'axios'
import React, { useState } from 'react'
import Backendapi from './Backendapi'
import { toast } from 'react-toastify'

const AddDADesign = () => {
    const [designName,setDesingName] = useState("")
    const handleAddDADesign = async() => {
        axios.post(`${Backendapi.REACT_APP_BACKEND_API_URL}/add/checklist/design/${designName}`).then((res)=>{
            if(res.status===201){
                toast.success(`The checklist with the design name ${designName} has been successfully added.`)
                window.location.reload()
            }
        }).catch(err=>{
            toast.warning(err.response.data)
        })
    }
    return (
        <div>
            <button type="button" class="btn btn-primary" data-bs-toggle="modal" data-bs-target="#exampleModal">
                Add Checklist
            </button>

            <div class="modal fade" id="exampleModal" tabindex="-1" aria-labelledby="exampleModalLabel" aria-hidden="true">
                <div class="modal-dialog modal-dialog-centered">
                    <div class="modal-content">
                        <div style={{ background: "lightgreen" }} class="modal-header">
                            <h5 class="modal-title" id="exampleModalLabel"><b>Add Checklist Design</b></h5>
                            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                        </div>
                        <div class="modal-body">
                            <form onSubmit={(e)=>e.preventDefault()}>
                                <label htmlFor='designName' ><b>Name of the Project</b></label>
                                <input id="designName" className='form-control' type='text' onChange={(e)=>{
                                    setDesingName(e.target.value);
                                }}  required />
                               
                            </form>

                        </div>
                        <div class="modal-footer">
                            <button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>
                            <button type="button" class="btn btn-primary" onClick={handleAddDADesign} data-bs-dismiss="modal">Submit</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default AddDADesign
