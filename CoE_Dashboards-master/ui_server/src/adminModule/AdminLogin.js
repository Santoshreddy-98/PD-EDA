import React, { useState } from "react";
import {
    Form,
    Button,
    Card,
    Col,
    Row,
    InputGroup,
    Dropdown,
    DropdownButton,
    FormControl,
    Toast,
} from "react-bootstrap";
import "./adminlogin.css";
import axios from "axios";
import Backendapi from "../designAuditor/Backendapi";
import { useNavigate } from "react-router-dom";

const AdminLogin = () => {
    const [adminInfo, setAdminInfo] = useState({
        name: "",
        email: "",
        password: "",
        isAdmin: "no", // Default to "yes"
        role: "PD Dev", // Default role
    });
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);

    const handleInputChange = (event) => {
        const { name, value } = event.target;
        setAdminInfo({ ...adminInfo, [name]: value });
    };
    const navigate=useNavigate()

    const handleSubmit = async (event) => {
        event.preventDefault();
        try {
            const response = await axios.post(
                `${Backendapi.REACT_APP_BACKEND_API_URL}/adminregister`,
                adminInfo
            );

            if (response.status === 201) {
                console.log("Admin added successfully");
                // navigate("/admin/list")
                setShowSuccessToast(true);
            } else {
                console.log("Failed to add admin");
                setShowErrorToast(true);
            }
        } catch (err) {
            console.log(err.message);
            setShowErrorToast(true);
        }
    };

    return (
        <div>
            <Toast
                show={showSuccessToast}
                onClose={() => setShowSuccessToast(false)}
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundImage:
                        "linear-gradient(to right top, #051937, #004d7a, #008793, #00bf72, #a8eb12)",
                }}
                delay={3000}
                autohide
            >
                <Toast.Body style={{ fontSize: "16px", padding: "20px", color: "white" }}>Admin added successfully!</Toast.Body>
            </Toast>

            <Toast
                show={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundImage: "linear-gradient(to right top, #FF5733, #C03C00)",
                }}
                delay={3000}
                autohide
            >
                <Toast.Body style={{ fontSize: "16px", padding: "20px", color: "white" }}>Error adding admin. Please check the format.</Toast.Body>
            </Toast>

            <Card style={{ width: "800px", margin: "0 auto", marginTop: "20px" }}>
                <Card.Header
                    className="head"
                    style={{ fontFamily: "Verdana, sans-serif", color: "white" }}
                >
                    Admin User Panel
                </Card.Header>
                <Card.Body>
                    <Form onSubmit={handleSubmit}>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Name
                            </Form.Label>
                            <Col sm="10">
                                <FormControl
                                    type="text"
                                    name="name"
                                    value={adminInfo.name}
                                    onChange={handleInputChange}
                                    placeholder="Enter your full name (letters and spaces only)"
                                    style={{ marginBottom: "10px" }}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Email
                            </Form.Label>
                            <Col sm="10">
                                <FormControl
                                    type="email"
                                    name="email"
                                    value={adminInfo.email}
                                    onChange={handleInputChange}
                                    style={{ marginBottom: "10px" }}
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Password
                            </Form.Label>
                            <Col sm="10">
                                <FormControl
                                    type="password"
                                    name="password"
                                    value={adminInfo.password}
                                    onChange={handleInputChange}
                                    style={{ marginBottom: "10px" }}
                                    placeholder="Enter a password (1 number, 1 uppercase, 1 special character)"
                                />
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2" style={{ marginBottom: "10px" }}>
                                Admin
                            </Form.Label>
                            <Col sm="10">
                                <InputGroup>
                                    <DropdownButton
                                        as={InputGroup.Prepend}
                                        // variant="outline-dark"
                                        title={adminInfo.isAdmin === "yes" ? "Yes" : "No"}
                                        id="input-group-dropdown-1"
                                    >
                                        <Dropdown.Item
                                            onClick={() =>
                                                setAdminInfo({ ...adminInfo, isAdmin: "yes" })
                                            }
                                        >
                                            Yes
                                        </Dropdown.Item>
                                        <Dropdown.Item
                                            onClick={() =>
                                                setAdminInfo({ ...adminInfo, isAdmin: "no" })
                                            }
                                        >
                                            No
                                        </Dropdown.Item>
                                    </DropdownButton>
                                </InputGroup>
                            </Col>
                        </Form.Group>
                        <Form.Group as={Row}>
                            <Form.Label column sm="2">
                                Role
                            </Form.Label>
                            <Col sm="10">
                                <Form.Control
                                    as="select"
                                    name="role"
                                    value={adminInfo.role}
                                    onChange={handleInputChange}
                                >
                                    <option value="PD Dev">PD Developer</option>
                                    <option value="PD Lead">PD Lead</option>
                                    <option value="Manager">Manager</option>
                                    <option value="Admin">Admin</option>

                                </Form.Control>
                            </Col>
                        </Form.Group>
                        <Button type="submit" className="btn-grad">
                            Add
                        </Button>
                    </Form>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminLogin
