import React, { useState, useRef } from "react";
import axios from "axios";
import { Button, Toast } from "react-bootstrap";

interface AddUserProps {
   onClose: () => void;
   onUserAdded: () => void; 
}

function AddUser({ onClose, onUserAdded }: AddUserProps) {
   const userNameRef = useRef<HTMLInputElement | null>(null);
   const firstNameRef = useRef<HTMLInputElement | null>(null);
   const lastNameRef = useRef<HTMLInputElement | null>(null);
   const passwordRef = useRef<HTMLInputElement | null>(null);

   const [message, setMessage] = useState<string | null>(null);
   const [showToast, setShowToast] = useState(false);
   const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

   function handleSubmit(e: React.FormEvent) {
      e.preventDefault();

      const newUser = {
         userName: userNameRef.current?.value,
         firstName: firstNameRef.current?.value,
         lastName: lastNameRef.current?.value,
         password: passwordRef.current?.value,
      };

      axios
         .post(`${API_BASE_URL}/api/users`, newUser)
         .then((response) => {
            console.log("User added successfully:", response.data);
            setMessage("User added successfully");
            setShowToast(true);
            if (userNameRef.current) userNameRef.current.value = "";
            if (firstNameRef.current) firstNameRef.current.value = "";
            if (lastNameRef.current) lastNameRef.current.value = "";
            if (passwordRef.current) passwordRef.current.value = "";
            onClose();
            onUserAdded(); // Trigger the user added callback
         })
         .catch((error) => {
            setMessage("Error adding user");
            setShowToast(true);
            console.error("Error adding user:", error);
         });
   }

   return (
      <div>
         <h2>Add User</h2>
         {message && (
            <Toast show={showToast} onClose={() => setShowToast(false)}>
               <Toast.Header><strong className="me-auto">User Status</strong></Toast.Header>
               <Toast.Body>{message}</Toast.Body>
            </Toast>
         )}

         <form onSubmit={handleSubmit}>
            <div className="mb-3">
               <label htmlFor="userName" className="form-label">Username:</label>
               <input type="text" className="form-control" id="userName" ref={userNameRef} required />
            </div>
            <div className="mb-3">
               <label htmlFor="firstName" className="form-label">First Name:</label>
               <input type="text" className="form-control" id="firstName" ref={firstNameRef} required />
            </div>
            <div className="mb-3">
               <label htmlFor="lastName" className="form-label">Last Name:</label>
               <input type="text" className="form-control" id="lastName" ref={lastNameRef} required />
            </div>
            <div className="mb-3">
               <label htmlFor="password" className="form-label">Password:</label>
               <input type="password" className="form-control" id="password" ref={passwordRef} required />
            </div>
            <div className="mb-3">
               <Button variant="primary mt-2" type="submit">Add User</Button>
               <Button variant="secondary mt-2" onClick={onClose}>Close</Button>
            </div>
         </form>
      </div>
   );
}

export default AddUser;
