import React, { useState } from "react";
import { Button, Modal, Toast } from 'react-bootstrap';
import AddOrderModal from "./addOrder";
import OrderList from "./orderList";

function OrderComponent() {
  const [showModal, setShowModal] = useState(false);
  const [refreshList, setRefreshList] = useState(false);
  const [showToast, setShowToast] = useState(false);

  function handleAddOrderModalOpen() {
    setShowModal(true);
  }

  function handleAddOrderModalClose() {
    setShowModal(false);
  }

  function handleOrderAdded() {
    setRefreshList(!refreshList);
    setShowToast(true);
  }

  function handleOrderDeleted() {
    setRefreshList(!refreshList);
  }

  function handleOrderUpdated() {
    setRefreshList(!refreshList);
  }

  function handleCloseToast() {
    setShowToast(false);
  }

  return (
    <>
      <div>
        <Button variant="success" onClick={handleAddOrderModalOpen}>Add Order</Button>
      </div>
      <div>
        <OrderList
          refreshList={refreshList}
          onOrderDeleted={handleOrderDeleted}
          onOrderUpdated={handleOrderUpdated}
        />
      </div>
      <Modal show={showModal} onHide={handleAddOrderModalClose} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Add Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <AddOrderModal
            closeModal={handleAddOrderModalClose}
            onOrderAdded={handleOrderAdded}
          />
        </Modal.Body>
      </Modal>
      {showToast && (
        <Toast
          show={showToast}
          onClose={handleCloseToast}
          delay={5000}
          autohide
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            width: '300px',
            backgroundColor: 'rgba(76, 175, 80, 0.8)',
            color: '#fff',
          }}
        >
          <Toast.Header closeButton={true}>
            <strong className="me-auto">Order</strong>
          </Toast.Header>
          <Toast.Body>Order added successfully</Toast.Body>
        </Toast>
      )}
    </>
  );
}

export default OrderComponent;
