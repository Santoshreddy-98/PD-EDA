// BackButton.js
import backicon from './arrow-left.png'
import React from 'react';
import { useNavigate } from 'react-router-dom';

const BackButton = () => {
    const navigate = useNavigate();

    const goBack = () => {
        navigate(-1); 
    };

    return (
        <button className='btn btn-primary mb-2' onClick={goBack}>
            <img style={{ width: "20px", height: "15px" }} src={backicon} alt="go back icon"></img> Back
        </button>
    );
};

export default BackButton;
