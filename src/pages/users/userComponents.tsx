import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../App.css";
import UserList from "./userList";
import AddUser from "./addUser";

function UserComponents() {
    const [showModal, setShowModal] = useState(false);

    function handleOpenModal() {
        setShowModal(true);
    }

    function handleCloseModal() {
        setShowModal(false);
    }

    return (
        <>
            <div>
                <Button variant="success" onClick={handleOpenModal}>Add New User</Button>
            </div>
            <div>
                <UserList />
            </div>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton>
                    <Modal.Title>Add User</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddUser onClose={handleCloseModal} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default UserComponents;
