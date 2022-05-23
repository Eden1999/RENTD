import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "store/AppContext";
import './OrdersHistory.scss'
import Review from "./Review"

const OrdersHistory = () => {
  const [open, setOpen] = useState(false);
  const [workspace_id, setWorkspaceId] = useState(-1);
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
    <div className={'m-16'}>
      <div className="flex text-3xl text-zinc-200">Here are the orders you've been made!</div>
      {orders.map((order) => (
        <div key={order.id}
             className={`flex flex-row flex-1 bg-zinc-500 hover:bg-zinc-500/90 rounded-lg p-3 mt-5 w-1/3`}>
          <div className={'flex w-11/12'}>
            <img className={"h-28 w-48 bg-zinc-400 rounded-md"} src={order.workspace.photo} alt="Man looking at item at a store"/>
            <span className={"flex flex-col text-left flex-1 ml-8 hover:cursor-default"}>
              <span className={"text-xl text-zinc-100"}>{order.workspace.name}</span>
              <span className={"text-sm text-zinc-300 mt-1.5"}>Rent start time : {order.startdate}</span>
              <span className={"text-sm text-zinc-300 mt-1.5"}>Rent end time : {order.enddate} </span>
              <span className={"text-sm text-zinc-300 mt-1.5"}>Number of people included : {order.capacity} </span>
            </span>
          </div>
          <div className={'flex flex-col flex-1 self-center'}>
            {new Date(order.enddate) <= new Date() && 
            <button className="btn btn-ghost text-zinc-300" onClick={() => {setOpen(true); setWorkspaceId(order.workspace.id)}}>Write Review</button>}
            <button className="btn btn-ghost text-zinc-300" onClick={() => {onItemClick(order.workspace)}}>order again</button>
          </div>
        </div>
      ))}
      <Review open={open} setOpen={setOpen} setOrders={setOrders} orders={orders} workspace_id={workspace_id}/>
    </div>
  );
};

export default OrdersHistory;
