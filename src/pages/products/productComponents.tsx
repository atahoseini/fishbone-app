import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";
import "../../App.css";
import ProductList from "./productList";
import AddProduct from "./addProduct";

function ProductComponents() {
    const [showModal, setShowModal] = useState(false);
    const [refreshList, setRefreshList] = useState(false);

    function handleProductAdded() {
        setRefreshList(!refreshList);
        setShowModal(false);
    }

    function handleModalClose() {
        setShowModal(false);
    }

    function handleModalOpen() {
        setShowModal(true);
    }

    return (
        <>
            <div>
                <Button variant="success" onClick={handleModalOpen}>Add New Product</Button>
            </div>
            <div>
                <ProductList refresh={refreshList} />
            </div>
            <Modal show={showModal} onHide={handleModalClose}>
                <Modal.Header closeButton>
                    <Modal.Title>Add Product</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <AddProduct onClose={handleProductAdded} />
                </Modal.Body>
            </Modal>
        </>
    );
}

export default ProductComponents;
