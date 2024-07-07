import React, { useEffect, useState } from "react";
import axios from "axios";
import Pagination from "./paginationProps";
import { Button, Table } from "react-bootstrap";
import UpdateUser from "./updateuser";

interface User {
    id: string;
    userName: string;
    firstName: string;
    lastName: string;
}

function UserList() {
    const pageSize = 2;
    const [users, setUsers] = useState<User[]>([]);
    const [page, setPage] = useState<number>(1);
    const [pageCount, setPageCount] = useState<number>(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
    const [selectedUserName, setSelectedUserName] = useState<string | null>(null);
    const [updateFirstName, setUpdateFirstName] = useState("");
    const [updateLastName, setUpdateLastName] = useState("");
    const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

    useEffect(() => {
        console.log(`Fetching users from ${API_BASE_URL}/api/users?page=${page}&size=${pageSize}`);
        axios.get(`${API_BASE_URL}/api/users?page=${page}&size=${pageSize}`)
            .then((response) => {
                console.log("API Response:", response.data);
                const fetchedUsers = response.data.data;  
                setUsers(fetchedUsers);
                setPageCount(response.data.pageCount);   
            })
            .catch((error) => {
                console.error("Error fetching users:", error);
            });
    }, [page, API_BASE_URL]);

    function handlePageChange(newPage: number) {
        setPage(newPage);
    }

    function handleUpdateClick(user: User) {
        setSelectedUserId(user.id);
        setSelectedUserName(user.userName);
        setUpdateFirstName(user.firstName);
        setUpdateLastName(user.lastName);
        setShowModal(true);
    }

    function handleModalClose() {
        setSelectedUserId(null);
        setSelectedUserName(null);
        setUpdateFirstName("");
        setUpdateLastName("");
        setShowModal(false);
    }

    return (
        <>
            <div>
                <h1 className="text-center">User List</h1>
                <Table striped bordered hover className="mx-auto" style={{ width: "50%" }}>
                    <thead>
                        <tr>
                            <th>User ID</th>
                            <th>User Name</th>
                            <th>First Name</th>
                            <th>Last Name</th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id}>
                                <td>{user.id}</td>
                                <td>{user.userName}</td>
                                <td>{user.firstName}</td>
                                <td>{user.lastName}</td>
                                <td>
                                    <Button className="btn btn-warning" onClick={() => handleUpdateClick(user)}>
                                        Edit
                                    </Button>
                                </td>
                            </tr>
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
            <UpdateUser
                selectedUserId={selectedUserId}
                selectedUserName={selectedUserName}
                showModal={showModal}
                closeModal={handleModalClose}
                updateFirstName={updateFirstName}
                updateLastName={updateLastName}
                handleFirstNameChange={setUpdateFirstName}
                handleLastNameChange={setUpdateLastName}
            />
        </>
    );
}

export default UserList;
