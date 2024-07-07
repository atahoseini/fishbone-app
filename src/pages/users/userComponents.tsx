import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../App.css";
import UserList from "./userList";
import AddUser from "./addUser";

function UserComponents() {
    const [showModal, setShowModal] = useState(false);
    const [refreshUsers, setRefreshUsers] = useState(false);

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    function handleUserAdded() {
        setRefreshUsers(!refreshUsers); // Toggle the state to trigger a refresh in UserList
    }

    return (
        <>
            <div>
                <Button variant="success" onClick={handleOpenModal}>Add New User</Button>
            </div>
            <div>
                <UserList refresh={refreshUsers} />
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddUser onClose={handleCloseModal} onUserAdded={handleUserAdded} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default UserComponents;
