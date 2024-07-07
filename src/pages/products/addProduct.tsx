import React, { useState, useRef } from "react";
import axios from "axios";
import { Button, Toast, Row, Col } from "react-bootstrap";

interface AddProductProps {
  onClose: () => void;
}

function AddProduct({ onClose }: AddProductProps) {
  const productNameRef = useRef<HTMLInputElement | null>(null);
  const productDescriptionRef = useRef<HTMLTextAreaElement | null>(null);
  const productPriceRef = useRef<HTMLInputElement | null>(null);
  const productStockRef = useRef<HTMLInputElement | null>(null);

  const [message, setMessage] = useState<string | null>(null);
  const [showToast, setShowToast] = useState(false);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    const newProduct = {
      productName: productNameRef.current?.value,
      productDescription: productDescriptionRef.current?.value,
      productPrice: productPriceRef.current?.value,
      productStock: productStockRef.current?.value,
    };

    axios
      .post(`${API_BASE_URL}/api/products`, newProduct)
      .then((response) => {
        console.log("Product added successfully:", response.data);
        setMessage("Product added successfully");
        setShowToast(true);
        if (productNameRef.current) productNameRef.current.value = "";
        if (productDescriptionRef.current) productDescriptionRef.current.value = "";
        if (productPriceRef.current) productPriceRef.current.value = "0.00";
        if (productStockRef.current) productStockRef.current.value = "0";
        onClose();
      })
      .catch((error) => {
        setMessage("Error adding product");
        setShowToast(true);
        console.error("Error adding product:", error);
      });
  }

  return (
    <div>
      <h2>Add Product</h2>
      {message && (
        <Toast show={showToast} onClose={() => setShowToast(false)}>
          <Toast.Header>
            <strong className="me-auto">Product Status</strong>
          </Toast.Header>
          <Toast.Body>{message}</Toast.Body>
        </Toast>
      )}

      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="productName" className="form-label">Name:</label>
          <input type="text" className="form-control" id="productName" ref={productNameRef} required />
        </div>
        <Row>
          <Col className="mb-3">
            <label htmlFor="productPrice" className="form-label">Price:</label>
            <input type="text" className="form-control" id="productPrice" ref={productPriceRef} required />
          </Col>
          <Col className="mb-3">
            <label htmlFor="productStock" className="form-label">Stock:</label>
            <input type="number" className="form-control" id="productStock" ref={productStockRef} required />
          </Col>
        </Row>
        <div className="mb-3">
          <label htmlFor="productDescription" className="form-label">Description:</label>
          <textarea className="form-control" id="productDescription" ref={productDescriptionRef} rows={5} required />
        </div>
        <div className="d-grid gap-2">
          <Button variant="primary" type="submit">Add Product</Button>
          <Button variant="secondary" onClick={onClose}>Close</Button>
        </div>
      </form>
    </div>
  );
}

export default AddProduct;
