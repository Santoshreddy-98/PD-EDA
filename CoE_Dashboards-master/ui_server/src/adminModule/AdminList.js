import React, { useState, useEffect } from "react";
import axios from "axios";
import { Card, Table, Button, Modal, Form, Toast, FormControl } from "react-bootstrap";
import Backendapi from "../designAuditor/Backendapi";
import "./adminlogin.css";
import { Link } from "react-router-dom";

const AdminList = () => {
    const [admins, setAdmins] = useState([]);
    const [editAdmin, setEditAdmin] = useState(null);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [adminToDelete, setAdminToDelete] = useState(null);
    const [showSuccessToast, setShowSuccessToast] = useState(false);
    const [showDeleteToast, setShowDeleteToast] = useState(false);
    const [showErrorToast, setShowErrorToast] = useState(false);
    const [nameFilter, setNameFilter] = useState(""); // State for name filtering

    // Function to fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await axios.get(
                `${Backendapi.REACT_APP_BACKEND_API_URL}/admins`
            );
            setAdmins(response.data);
        } catch (error) {
            console.error("Error fetching data:", error);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    // Handle "Edit" button click
    const handleEditClick = (admin) => {
        setEditAdmin(admin);
        setShowEditModal(true);
    };

    // Handle "Delete" button click
    const handleDeleteClick = (admin) => {
        setAdminToDelete(admin);
        setShowDeleteModal(true);
    };

    // Handle "Save Changes" button click
    const handleSaveChanges = async () => {
        try {
            // Send a PUT request to update the admin data
            await axios.put(
                `${Backendapi.REACT_APP_BACKEND_API_URL}/admin/${editAdmin.id}`,
                editAdmin
            );
            // Refresh the admin list
            fetchData();
            setShowEditModal(false); // Close the edit modal
            setShowSuccessToast(true);
        } catch (error) {
            console.error("Error updating admin:", error);
            setShowErrorToast(true);
        }
    };

    // Handle "Confirm Delete" button click
    const handleConfirmDelete = async () => {
        try {
            // Make a DELETE request to delete the admin
            await axios.delete(
                `${Backendapi.REACT_APP_BACKEND_API_URL}/admin/${adminToDelete.id}`
            );
            // Refresh the admin list
            fetchData();
            setShowDeleteModal(false); // Close the delete modal
            setShowDeleteToast(true);
        } catch (error) {
            console.error("Error deleting admin:", error);
        }
    };

    // Filter admins based on the name filter
    const filteredAdmins = admins.filter((admin) =>
        admin.name.toLowerCase().includes(nameFilter.toLowerCase())
    );
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
                        "linear-gradient(to right top, #6bd8ba, #00c5d1, #00acf1, #008cff, #3a5bf0)",
                }}
                delay={3000}
                autohide
            >
                <Toast.Body
                    style={{ fontSize: "16px", padding: "20px", color: "white" }}
                >
                    User Updated!
                </Toast.Body>
            </Toast>

            <Toast
                show={showErrorToast}
                onClose={() => setShowErrorToast(false)}
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundImage:
                        "linear-gradient(to right top, #fb3640, #db3180, #9a4da1, #4f5a9c, #22577a)",
                }}
                delay={3000}
                autohide
            >
                <Toast.Body
                    style={{ fontSize: "16px", padding: "20px", color: "white" }}
                >
                    Error updating user. Please try again.
                </Toast.Body>
            </Toast>
            {/* Deleted Admin Toast */}
            <Toast
                show={showDeleteToast}
                onClose={() => setShowDeleteToast(false)}
                style={{
                    position: "absolute",
                    top: 20,
                    right: 20,
                    backgroundImage:
                        "linear-gradient(to right top, #6bd8ba, #00c5d1, #00acf1, #008cff, #3a5bf0)",
                }}
                delay={3000}
                autohide
            >
                <Toast.Body
                    style={{ fontSize: "16px", padding: "20px", color: "white" }}
                >
                    User Deleted!
                </Toast.Body>
            </Toast>

            <Card style={{ width: "100%", margin: "0 auto", marginTop: "20px" }}>
                <Card.Body>
                    <h2 className="fw-bold">User List</h2>
                    {/* Filter input field */}
                    <div style={{display:"flex",justifyContent:"space-between",marginBottom:"10px"}} className="name-filter">
                        <Form className="mb-3">
                            <FormControl
                                type="text"
                                placeholder="Filter by Name"
                                value={nameFilter}
                                onChange={(e) => setNameFilter(e.target.value)}
                            />
                        </Form>
                        <Link to="/admin/create">
                            <button className="btn btn-primary">Add User</button>
                        </Link>
                        

                    </div>
                  
                    <Table striped bordered hover>
                        <thead>
                            <tr>
                                <th>Name </th>
                                <th>Email</th>
                                <th>Role</th>
                                <th>Admin</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredAdmins.map((admin) => (
                                <tr key={admin.id}>
                                    <td>{admin.name}</td>
                                    <td>{admin.email}</td>
                                    <td>{admin.role}</td>
                                    <td>{admin.isAdmin}</td>
                                    <td>
                                        <Button variant="info" onClick={() => handleEditClick(admin)}>
                                            Edit
                                        </Button>{" "}
                                        <Button
                                            variant="danger"
                                            onClick={() => handleDeleteClick(admin)}
                                        >
                                            Delete
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </Table>

                    {/* Edit Admin Modal */}
                    <Modal show={showEditModal} onHide={() => setShowEditModal(false)}>
                        <Modal.Header closeButton className="modalheadedit">
                            <Modal.Title>Edit Admin</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <Form>
                                <Form.Group controlId="editName">
                                    <Form.Label>Name</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editAdmin ? editAdmin.name : ""}
                                        onChange={(e) =>
                                            setEditAdmin({ ...editAdmin, name: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="editEmail">
                                    <Form.Label>Email</Form.Label>
                                    <Form.Control
                                        type="text"
                                        value={editAdmin ? editAdmin.email : ""}
                                        onChange={(e) =>
                                            setEditAdmin({ ...editAdmin, email: e.target.value })
                                        }
                                    />
                                </Form.Group>
                                <Form.Group controlId="editRole">
                                    <Form.Label>Role</Form.Label>
                                    <Form.Control
                                        as="select"
                                        value={editAdmin ? editAdmin.role : ""}
                                        onChange={(e) =>
                                            setEditAdmin({ ...editAdmin, role: e.target.value })
                                        }
                                    >
                                        <option value="PD Dev">PD Developer</option>
                                        <option value="PD Lead">PD Lead</option>
                                        <option value="Manager">Manager</option>
                                    </Form.Control>
                                </Form.Group>
                            </Form>
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setShowEditModal(false)}
                            >
                                Close
                            </Button>
                            <Button variant="primary" onClick={handleSaveChanges}>
                                Save Changes
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    {/* Delete Admin Modal */}
                    <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
                        <Modal.Header closeButton className="modalheaddelete">
                            <Modal.Title>Confirm Delete</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            Flagged for deletion{" "}
                            {adminToDelete ? adminToDelete.name : ""}.
                        </Modal.Body>
                        <Modal.Footer>
                            <Button
                                variant="secondary"
                                onClick={() => setShowDeleteModal(false)}
                            >
                                Cancel
                            </Button>
                            <Button variant="danger" onClick={handleConfirmDelete}>
                                Confirm Delete
                            </Button>
                        </Modal.Footer>
                    </Modal>
                </Card.Body>
            </Card>
        </div>
    );
};

export default AdminList;

