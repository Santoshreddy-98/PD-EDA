import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Form, Button, Alert, Card } from "react-bootstrap";
import axios from "axios";
import Backendapi from "../designAuditor/Backendapi";

const PasswordChange = () => {
    const { token } = useParams();
    const navigate = useNavigate();
    const [newPassword, setNewPassword] = useState("");
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    const handlePasswordChange = (e) => {
        setNewPassword(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            console.log("Token:", token); // Log the token to check its value
            const response = await axios.post(
                `${Backendapi.REACT_APP_BACKEND_API_URL}/reset/password`,
                {
                    token,
                    newPassword,
                }
            );
            setMessage(response.data.message);
        } catch (error) {
            console.error(error.response.data.error);
            setError(
                "Password reset failed. Token expired or invalid token. Please try again."
            );
        }
    };

    const handleGoToLogin = () => {
        navigate("/");
    };

    // Log the token value on component mount for debugging
    useEffect(() => {
    }, [token]); // Include 'token' in the dependency array

    if (!token) {
        return (
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
                <Card style={{ width: '600px', padding: '20px' }}>
                    <Alert variant="danger">
                        Invalid token. Cannot open this module without a valid token.
                    </Alert>
                </Card>
            </div>
        );
    }

    return (
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '50vh' }}>
            <Card style={{ width: '600px', padding: '20px' }}>
                <Card.Title>Password Change</Card.Title>
                <Form onSubmit={handleSubmit}>
                    <Form.Group controlId="formBasicPassword">
                        <Form.Label>New Password:</Form.Label>
                        <Form.Control
                            type="password"
                            placeholder="Enter new password"
                            value={newPassword}
                            onChange={handlePasswordChange}
                            required
                        />
                    </Form.Group>

                    <Button variant="primary" type="submit" className='mt-2'>
                        Set Password
                    </Button>
                </Form>

                {message && (
                    <Alert variant="success">
                        {message}
                        <Button variant="link" onClick={handleGoToLogin}>
                            Go to Login
                        </Button>
                    </Alert>
                )}

                {error && <Alert variant="danger">{error}</Alert>}
            </Card>
        </div>
    );
};

export default PasswordChange;
