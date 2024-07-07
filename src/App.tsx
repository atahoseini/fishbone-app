import React, { useState } from 'react';
import UserComponnets from './pages/users/userComponents';
import ProductComponents from './pages/products/productComponents';
import OrderComponnents from './pages/order/orderComponent';
import { Button } from "react-bootstrap";

const App = () => {
  const [activeComponent, setActiveComponent] = useState('order');  

  const componentMap: Record<string, React.ReactNode> = {
    order: <OrderComponnents />,
    users: <UserComponnets />,
    products: <ProductComponents />,
  };

  const renderActiveComponent = () => componentMap[activeComponent] || null;

  return (
    <div className="App">
      <header className="header">
        <h1>Order Register</h1>
      </header>
<main>
          {/* <div>{activeComponent}</div> */}
      <div className="menu m-10">
          <Button className="btn btn-light m-10 " onClick={() => setActiveComponent('order')}>Orders</Button>
          <Button className="btn btn-light m-10" onClick={() => setActiveComponent('users')}>Users</Button>
          <Button className="btn btn-light m-10" onClick={() => setActiveComponent('products')}>Products</Button>
        </div>
        <br />
        <div className='m-50 p-10'>
          {renderActiveComponent()}
        </div>
      </main>
    </div>
  );
}

export default App;
