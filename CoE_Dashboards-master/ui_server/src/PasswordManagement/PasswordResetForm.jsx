import React, { useState } from "react";
import { Form, Button, Alert, Card, Spinner } from "react-bootstrap";
import { Link } from "react-router-dom"; // Import Link from react-router-dom
import axios from "axios";
import Backendapi from "../designAuditor/Backendapi";

const PasswordResetForm = () => {
    const [email, setEmail] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [linkGenerated, setLinkGenerated] = useState(false); // New state to track if the link is generated
    const [resetToken, setResetToken] = useState(""); // State to store the reset token

    const handleEmailChange = (e) => {
        setEmail(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        try {
            const response = await axios.post(
                `${Backendapi.REACT_APP_BACKEND_API_URL}/request/reset`,
                { email }
            );
            setMessage(response.data.message);
            setResetToken(response.data.resetToken);
            setLinkGenerated(true); // Set linkGenerated to true when the link is successfully generated
            console.log("Reset Token:", response.data.resetToken);
        } catch (error) {
            console.error(error.response.data.error);
            setMessage("An error occurred while sending the reset email.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            className="d-flex align-items-center justify-content-center"
            style={{ minHeight: "50vh" }}
        >
            <Card style={{ width: "600px" }}>
                <Card.Body>
                    <Card.Title>Password Reset</Card.Title>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group controlId="formBasicEmail">
                            <Form.Label>Email:</Form.Label>
                            <Form.Control
                                type="email"
                                placeholder="Enter email"
                                value={email}
                                onChange={handleEmailChange}
                                required
                            />
                        </Form.Group>

                        {linkGenerated ? (
                            <>
                                <Link
                                    to={`/reset/password/${resetToken}`}
                                    className="btn btn-warning"
                                    disabled={loading}
                                    style={{ marginTop: "10px" }}
                                >
                                    {loading ? (
                                        <>
                                            <Spinner
                                                as="span"
                                                animation="border"
                                                size="sm"
                                                role="status"
                                                aria-hidden="true"
                                            />{" "}
                                            Loading...
                                        </>
                                    ) : (
                                        "Set New Password"
                                    )}
                                </Link>
                            </>
                        ) : (
                            // If link is not generated, show the regular reset password button
                            <Button
                                variant="primary"
                                type="submit"
                                disabled={loading}
                                className="mt-2"
                            >
                                {loading ? (
                                    <>
                                        <Spinner
                                            as="span"
                                            animation="border"
                                            size="sm"
                                            role="status"
                                            aria-hidden="true"
                                        />{" "}
                                        Loading...
                                    </>
                                ) : (
                                    "Reset Password"
                                )}
                            </Button>
                        )}
                    </Form>

                    {message && <Alert variant="info">{message}</Alert>}
                </Card.Body>
            </Card>
        </div>
    );
};

export default PasswordResetForm;
