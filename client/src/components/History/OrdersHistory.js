import React, { useState, useEffect, useContext, useCallback } from "react";
import Axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "store/AppContext";
import './OrdersHistory.scss'

const OrdersHistory = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [{ user }] = useContext(AppContext);

  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}orders/user/${user.id}`, query);
      console.log(res.data);
      setOrders(res.data);
    } catch (err) {
      console.log(`Failed to fetch orders ${err.message}`);
    }
  }, []);

  const onItemClick = (workspace) => {
    navigate(`/workspaces/${workspace.id}`, { state: { workspace } });
  }
  
  return (
    <div>
      <div className="orders-title uppercase tracking-wide text-sm text-gray-500 font-semibold">Here are the orders you've been made!</div>
      {orders.map((order) => (
        <div onClick={() => {onItemClick(order.workspace)}} key={order.id} className="order max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden md:max-w-2xl bg-zinc-300/20">
        <div className="md:flex">
          <div className="md:flex-shrink-0">
            <img className="h-48 w-full object-cover md:w-48" src={order.workspace.photo} alt="Man looking at item at a store"/>
          </div>
          <div className="order-details p-8">
            <div className="uppercase tracking-wide text-sm text-gray-500 font-semibold">{order.workspace.name}</div>
            <div className="uppercase tracking-wide text-sm text-gray-500 font-semibold">Rent start time : {order.startdate}</div>
            <div className="uppercase tracking-wide text-sm text-gray-500 font-semibold">Rent end time : {order.enddate} </div>
            <div className="uppercase tracking-wide text-sm text-gray-500 font-semibold">Number of people included : {order.capacity} </div>
          </div>
        </div>
      </div>
      ))}
    </div>
  );
};

export default OrdersHistory;
