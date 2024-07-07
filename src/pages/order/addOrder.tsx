import React, { useState, useEffect } from "react";
import axios from "axios";
import { Button, Form, Toast, Row, Col } from "react-bootstrap";

interface User {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
}

interface Product {
    id: number;
    productName: string;
    productPrice: number;
    productStock: number;
}

interface AddOrderModalProps {
    closeModal: () => void;
    onOrderAdded: () => void;
}

function AddOrderModal({ closeModal, onOrderAdded }: AddOrderModalProps) {
    const [users, setUsers] = useState<User[]>([]);
    const [products, setProducts] = useState<Product[]>([]);
    const [selectedUserId, setSelectedUserId] = useState<string>("");
    const [selectedProductId, setSelectedProductId] = useState<number>(0);
    const [orderQuantity, setQuantity] = useState<number>(1);
    const [orderTotal, setOrderTotal] = useState<number>(0);
    const [orderDate, setOrderDate] = useState<string>(new Date().toISOString().split('T')[0]);
    const [description, setDescription] = useState<string>("");
    const [showToast, setShowToast] = useState(false);
    const [message, setMessage] = useState<string | null>(null);
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        axios.get(`${API_BASE_URL}/api/users/all`)
            .then((response) => {
                setUsers(response.data);
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });

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
            const total = orderQuantity * selectedProduct.productPrice;
            const totalWithVAT = total * 1.20;
            setOrderTotal(totalWithVAT);
            setOrderDate(new Date().toISOString().split('T')[0]);
        }
    }, [orderQuantity, selectedProductId, products]);

    function handleQuantityChange(e: React.ChangeEvent<HTMLInputElement>) {
        const selectedProduct = products.find(product => product.id === selectedProductId);
        const newQuantity = Number(e.target.value);
        if (selectedProduct) {
            if (newQuantity > selectedProduct.productStock) {
                setQuantity(selectedProduct.productStock);
            } else {
                setQuantity(newQuantity);
            }
        } else {
            setQuantity(newQuantity);
        }
    }

    function handleAddOrder(e: React.FormEvent) {
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

        const newOrder = {
            userId: selectedUserId,
            orderDate,
            orderQuantity,
            productId: selectedProductId,
            orderTotal,
            description,
        };

        axios
            .post(`${API_BASE_URL}/api/orders`, newOrder)
            .then((response) => {
                console.log("New order added:", response.data);
                setMessage("New order added successfully");
                setShowToast(true);
                onOrderAdded();
                closeModal();

                // Update product stock
                const updatedProduct = { ...selectedProduct, productStock: selectedProduct.productStock - orderQuantity };
                axios
                    .put(`${API_BASE_URL}/api/products/edit`, updatedProduct)
                    .then((response) => {
                        console.log("Product stock updated:", response.data);
                    })
                    .catch((error) => {
                        console.error("Error updating product stock:", error);
                    });
            })
            .catch((error) => {
                console.error("Error adding order:", error);
                setMessage("Error adding order");
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
            <Form onSubmit={handleAddOrder}>
                <div className="mb-3">
                    <Form.Group controlId="formUser">
                        <Form.Label>User</Form.Label>
                        <Form.Control as="select" value={selectedUserId} onChange={(e) => setSelectedUserId(e.target.value)}>
                            <option value="">Select a user</option>
                            {users.map((user) => (
                                <option key={user.id} value={user.id}>
                                    {user.userName}
                                </option>
                            ))}
                        </Form.Control>
                    </Form.Group>
                </div>
                <div className="mb-3">
                    <Form.Group controlId="formProduct">
                        <Form.Label>Product</Form.Label>
                        <Form.Control as="select" value={selectedProductId} onChange={(e) => setSelectedProductId(Number(e.target.value))}>
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
                        <Form.Control as="textarea" rows={3} value={description} onChange={(e) => setDescription(e.target.value)} />
                    </Form.Group>
                </div>
                <div className="mb-3">
                    <Button variant="primary mt-2" type="submit">Add Order</Button>
                    <Button variant="secondary mt-2" onClick={closeModal}>Close</Button>
                </div>
            </Form>
        </>
    );
}

export default AddOrderModal;
