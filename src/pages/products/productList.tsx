import React, { useEffect, useState } from "react";
import axios from "axios";
import { Table } from "react-bootstrap";

interface Product {
  id: number;
  productName: string;
  productPrice: number;
  productStock: number;
}

interface ProductListProps {
  refresh: boolean;
}

function ProductList({ refresh }: ProductListProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  function fetchProducts() {
    axios.get(`${API_BASE_URL}/api/products`)
      .then((response) => {
        const fetchedProducts = response.data;
        setProducts(fetchedProducts);
      })
      .catch((error) => {
        console.error("Error fetching products:", error);
      });
  }

  useEffect(() => {
    fetchProducts();
  });

  return (
    <>
      <div>
        <h1 className="text-center">Product List</h1>
        <Table striped bordered hover className="mx-auto" style={{ width: "40%" }}>
          <thead>
            <tr>
              <th>ID</th>
              <th>Name</th>
              <th>Price</th>
              <th>Stock</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id}>
                <td>{product.id}</td>
                <td>{product.productName}</td>
                <td>{product.productPrice}</td>
                <td>{product.productStock}</td>
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    </>
  );
}

export default ProductList;
