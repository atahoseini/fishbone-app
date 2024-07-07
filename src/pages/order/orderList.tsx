import React, { useEffect, useState } from "react";
import axios from "axios";
import UpdateOrderModal from "./updateOrder";
import DeleteOrderConfirmation from "./deleteOrder";
import Pagination from "../users/paginationProps";
import { Button, Table } from "react-bootstrap";

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

interface OrderListProps {
  refreshList: boolean;
  onOrderDeleted: () => void;
  onOrderUpdated: () => void;
}

function OrderList({ refreshList, onOrderDeleted, onOrderUpdated }: OrderListProps) {
  const pageSize = 5;
  const [page, setPage] = useState<number>(1);
  const [pageCount, setPageCount] = useState<number>(1);
  const [orders, setOrders] = useState<Order[]>([]);
  const [selectedOrderId, setSelectedOrderId] = useState<number | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDetails, setShowDetails] = useState<{ [key: number]: boolean }>({});
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/api/orders?page=${page}&size=${pageSize}`)
      .then((response) => {
        const fetchedOrders = response.data.data;
        setOrders(fetchedOrders);
        setPageCount(response.data.pageCount);
      })
      .catch((error) => {
        console.error("Error fetching orders:", error);
      });
  }, [page, refreshList, API_BASE_URL]);

  function handlePageChange(newPage: number) {
    setPage(newPage);
  }

  function handleUpdateClick(orderId: number) {
    setSelectedOrderId(orderId);
    setShowUpdateModal(true);
  }

  function handleDeleteClick(orderId: number) {
    setSelectedOrderId(orderId);
    setShowDeleteModal(true);
  }

  function handleUpdateModalClose() {
    setSelectedOrderId(null);
    setShowUpdateModal(false);
  }

  function handleDeleteModalClose() {
    setSelectedOrderId(null);
    setShowDeleteModal(false);
  }

  function toggleDetails(orderId: number) {
    setShowDetails((prev) => ({ ...prev, [orderId]: !prev[orderId] }));
  }

  return (
    <div>
      <div>
        <h1 className="text-center">All Orders</h1>
        <Table striped bordered hover className="mx-auto" style={{ width: "70%" }}>
          <thead>
            <tr>
              <th>Order ID</th>
              <th>User Name</th>
              <th>Product</th>
              <th>Quantity</th>
              <th>Total Price</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <React.Fragment key={order.id}>
                <tr>
                  <td>{order.id}</td>
                  <td>{order.userName || "Unknown User"}</td>
                  <td>{order.productName || "Unknown Product"}</td>
                  <td>{order.orderQuantity}</td>
                  <td>{order.orderTotal.toFixed(2)}</td>
                  <td>
                    <Button className="m-1" variant="warning" onClick={() => handleUpdateClick(order.id)}>
                      Edit
                    </Button>
                    <Button className="m-1" variant="danger" onClick={() => handleDeleteClick(order.id)}>
                      Delete
                    </Button>
                    <Button className="m-1" variant="info" onClick={() => toggleDetails(order.id)}>
                      {showDetails[order.id] ? "Hide" : "Show"} Details
                    </Button>
                  </td>
                </tr>
                {showDetails[order.id] && (
                  <tr>
                    <td colSpan={6}>
                      <div>
                        <strong>Product Description:</strong> {order.productDescription || "N/A"}
                      </div>
                      <div>
                        <strong>Order Date:</strong> {order.orderDate}
                      </div>
                      <div>
                        <strong>Description:</strong> {order.description || "N/A"}
                      </div>
                    </td>
                  </tr>
                )}
              </React.Fragment>
            ))}
          </tbody>
        </Table>
      </div>
      <div className="d-flex justify-content-center align-items-center">
        <Pagination
          total={pageSize * pageCount}
          page={page}
          pageCount={pageCount}
          size={pageSize}
          onPageChange={handlePageChange}
        />
      </div>
      {showUpdateModal && (
        <UpdateOrderModal
          order={orders.find((order) => order.id === selectedOrderId)}
          closeModal={handleUpdateModalClose}
          onOrderUpdated={onOrderUpdated}
        />
      )}
      {showDeleteModal && selectedOrderId !== null && (
        <DeleteOrderConfirmation
          orderId={selectedOrderId}
          productId={orders.find((order) => order.id === selectedOrderId)?.productId || 0}
          quantity={orders.find((order) => order.id === selectedOrderId)?.orderQuantity || 0}
          closeModal={handleDeleteModalClose}
          onOrderDeleted={onOrderDeleted}
        />
      )}
    </div>
  );
}

export default OrderList;
