import React, { useState, useEffect } from "react";
import { Modal, Button, Form, Row, Col, Toast } from "react-bootstrap";
import axios from "axios";

interface UpdateOrderModalProps {
  order: Order | undefined;
  closeModal: () => void;
  onOrderUpdated: () => void;
}

interface Product {
  id: number;
  productName: string;
  productPrice: number;
  productStock: number;
}

interface Order {
  id: number;
  userId: string;
  userName: string;
  firstName: string;
  lastName: string;
  orderDate: string;
  productId: number;
  productName: string;
  productDescription: string;
  productPrice: number;
  orderQuantity: number;
  orderTotal: number;
  description: string | null;
}

function UpdateOrderModal({ order, closeModal, onOrderUpdated }: UpdateOrderModalProps) {
  const [orderQuantity, setOrderQuantity] = useState(order?.orderQuantity || 0);
  const [orderTotal, setOrderTotal] = useState(order?.orderTotal || 0);
  const [orderDescription, setOrderDescription] = useState(order?.description || "");
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedProductId, setSelectedProductId] = useState(order?.productId || 0);
  const [showToast, setShowToast] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios.get(`${API_BASE_URL}/api/products`)
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }, [API_BASE_URL]);

  useEffect(() => {
    const selectedProduct = products.find(product => product.id === selectedProductId);
    if (selectedProduct) {
      setOrderTotal(orderQuantity * selectedProduct.productPrice * 1.20); // Including VAT
    }
  }, [orderQuantity, selectedProductId, products]);

  function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
    const selectedProduct = products.find(product => product.id === selectedProductId);
    const newQuantity = Number(e.target.value);
    if (selectedProduct) {
      if (newQuantity > selectedProduct.productStock) {
        setOrderQuantity(selectedProduct.productStock);
      } else {
        setOrderQuantity(newQuantity);
      }
    } else {
      setOrderQuantity(newQuantity);
    }
  }

  function handleUpdateOrder(e: React.FormEvent) {
    e.preventDefault();
    const selectedProduct = products.find(product => product.id === selectedProductId);
    if (!selectedProduct) return;

    if (orderQuantity > selectedProduct.productStock) {
      setMessage("Quantity exceeds available stock.");
      setShowToast(true);
      return;
    }

    if (orderQuantity <= 0) {
      setMessage("Quantity must be greater than zero.");
      setShowToast(true);
      return;
    }

    const updatedOrder = {
      id: order?.id,
      userId: order?.userId,
      productId: selectedProductId,
      orderQuantity,
      orderTotal,
      orderDate: order?.orderDate || new Date().toISOString(),
      description: orderDescription,
    };

    axios
      .post(`${API_BASE_URL}/api/orders/edit`, updatedOrder)
      .then((response) => {
        console.log("Order updated successfully:", response.data);
        setMessage("Order updated successfully");
        setShowToast(true);
        onOrderUpdated();
        closeModal();
      })
      .catch((error) => {
        console.error("Error updating order:", error);
        setMessage("Error updating order");
        setShowToast(true);
      });
  }

  const selectedProduct = products.find(product => product.id === selectedProductId);

  return (
    <>
      <Toast show={showToast} onClose={() => setShowToast(false)} delay={5000} autohide>
        <Toast.Header>
          <strong className="me-auto">Order Status</strong>
        </Toast.Header>
        <Toast.Body>{message}</Toast.Body>
      </Toast>
      <Modal show={true} onHide={closeModal}>
        <Modal.Header closeButton>
          <Modal.Title>Update Order</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form onSubmit={handleUpdateOrder}>
            <div className="mb-3">
              <Form.Group controlId="formUser">
                <Form.Label>User</Form.Label>
                <Form.Control type="text" value={`${order?.firstName} ${order?.lastName} (${order?.userName})`} readOnly />
              </Form.Group>
            </div>
            <div className="mb-3">
              <Form.Group controlId="formProduct">
                <Form.Label>Product</Form.Label>
                <Form.Control as="select" value={selectedProductId} onChange={(e) => setSelectedProductId(Number(e.target.value))} title="Select a product">
                  <option value="">Select a product</option>
                  {products.map((product) => (
                    <option key={product.id} value={product.id}>
                      {product.productName}
                    </option>
                  ))}
                </Form.Control>
              </Form.Group>
            </div>
            <Row>
              <Col md={6}>
                <div className="mb-3">
                  <Form.Group controlId="formQuantity">
                    <Form.Label>Quantity</Form.Label>
                    <Form.Control type="number" value={orderQuantity} onChange={handleQuantityChange} min="1" max={selectedProduct?.productStock || 1} />
                  </Form.Group>
                </div>
              </Col>
              <Col md={6}>
                <div className="mb-3">
                  <Form.Group controlId="formTotal">
                    <Form.Label>Total with VAT</Form.Label>
                    <Form.Control type="text" value={orderTotal.toFixed(2)} readOnly />
                  </Form.Group>
                </div>
              </Col>
            </Row>
            <div className="mb-3">
              <Form.Group controlId="formDescription">
                <Form.Label>Description</Form.Label>
                <Form.Control as="textarea" rows={3} value={orderDescription} onChange={(e) => setOrderDescription(e.target.value)} />
              </Form.Group>
            </div>
            <div className="mb-3">
              <Button variant="primary mt-2" type="submit">Save Changes</Button>
              <Button variant="secondary mt-2" onClick={closeModal}>Close</Button>
            </div>
          </Form>
        </Modal.Body>
      </Modal>
    </>
  );
}

export default UpdateOrderModal;
