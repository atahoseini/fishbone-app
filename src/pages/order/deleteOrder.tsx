import React from "react";
import { Modal, Button } from "react-bootstrap";
import axios from "axios";

interface DeleteOrderConfirmationProps {
  orderId: number;
  productId: number;
  quantity: number;
  closeModal: () => void;
  onOrderDeleted: () => void;
}

function DeleteOrderConfirmation({
  orderId,
  productId,
  quantity,
  closeModal,
  onOrderDeleted,
}: DeleteOrderConfirmationProps) {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  function handleDeleteOrder() {
    console.log("Deleting order with ID:", orderId);
    axios
      .delete(`${API_BASE_URL}/api/orders/delete?id=${orderId}`)
      .then((response) => {
        console.log("Order deleted successfully");
        return axios.get(`${API_BASE_URL}/api/products/${productId}`);
      })
      .then((response) => {
        const product = response.data;
        const updatedProduct = {
          ...product,
          productStock: product.productStock + quantity,
        };
        console.log("Updated product details:", updatedProduct);
        return axios.put(`${API_BASE_URL}/api/products/edit`, updatedProduct);
      })
      .then((response) => {
        console.log("Product stock updated successfully");
        onOrderDeleted();
        closeModal();
      })
      .catch((error) => {
        console.error("Error deleting order or updating product stock:", error);
      });
  }

  return (
    <Modal show={true} onHide={closeModal}>
      <Modal.Header closeButton>
        <Modal.Title>Confirm Delete</Modal.Title>
      </Modal.Header>
      <Modal.Body>Are you sure you want to delete this order?</Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={closeModal}>
          Cancel
        </Button>
        <Button variant="danger" onClick={handleDeleteOrder}>
          Delete
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default DeleteOrderConfirmation;
