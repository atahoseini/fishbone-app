import React from "react";
import { Button, Modal } from "react-bootstrap";
import axios from "axios";

interface UpdateComponentProps {
    selectedUserId: string | null;
    selectedUserName: string | null;
    showModal: boolean;
    closeModal: () => void;
    updateFirstName: string;
    updateLastName: string;
    handleFirstNameChange: (value: string) => void;
    handleLastNameChange: (value: string) => void;
}

function UpdateUser({
    selectedUserId, selectedUserName, showModal, closeModal, updateFirstName,
    updateLastName, handleFirstNameChange, handleLastNameChange,
}: UpdateComponentProps) {
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;  

    function handleUpdateUser() {
        if (selectedUserId) {
            const updatedUser = {
                id: selectedUserId,
                userName: selectedUserName,
                firstName: updateFirstName,
                lastName: updateLastName,
            };
            axios
                .post(`${API_BASE_URL}/api/users/edit`, updatedUser) 
                .then((response) => {
                    console.log("User updated successfully:", response.data);
                    handleFirstNameChange("");
                    handleLastNameChange("");
                    closeModal();
                })
                .catch((error) => {
                    console.error("Error updating user:", error);
                });
        }
    }

    return (
        <Modal show={showModal} onHide={closeModal}>
            <Modal.Header closeButton>
                <Modal.Title>Update User</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <div>
                    <p>Update user - user name {selectedUserName}</p>
                    <div className="mb-3">
                        <label htmlFor="newFirstName" className="form-label">New First Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="newFirstName"
                            value={updateFirstName}
                            onChange={(e) => handleFirstNameChange(e.target.value)}
                        />
                    </div>
                    <div className="mb-3">
                        <label htmlFor="newLastName" className="form-label">New Last Name</label>
                        <input
                            type="text"
                            className="form-control"
                            id="newLastName"
                            value={updateLastName}
                            onChange={(e) => handleLastNameChange(e.target.value)}
                        />
                    </div>
                </div>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={closeModal}>Close</Button>
                <Button variant="primary" onClick={handleUpdateUser}>Save Changes</Button>
            </Modal.Footer>
        </Modal>
    );
}

export default UpdateUser;
