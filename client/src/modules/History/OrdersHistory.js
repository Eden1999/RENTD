import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { useNavigate } from "react-router-dom";
import { AppContext } from "store/AppContext";
import './OrdersHistory.scss';
import Review from "./Review";
import WorkspacesList from "../../components/WorkspacesList";
import {workspaceListType} from "../../helpers/consts";

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

  return (
    <div className={'m-16'}>
      <div className="flex text-primary text-5xl font-medium mb-6">Here are the orders you've been made!</div>
      <WorkspacesList
          orders={orders}
          workspaceCardBody={workspaceListType.history}
      />
    </div>
  );
};

export default OrdersHistory;
