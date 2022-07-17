import React, { useState, useEffect, useContext } from "react";
import Axios from "axios";
import { AppContext } from "store/AppContext";
import './OrdersHistory.scss';
import WorkspacesList from "../../components/WorkspacesList";
import {workspaceListType} from "../../helpers/consts";

const OrdersHistory = () => {
  const [orders, setOrders] = useState([]);
  const [{ user }] = useContext(AppContext);
  let [loading, setLoading] = useState(true);

  useEffect(async () => {
    try {
      const query = {};
      const res = await Axios.get(`${process.env.REACT_APP_SERVER_URL}orders/user/${user.id}`, query);
      setOrders(res.data);
      setLoading(false)
    } catch (err) {
      console.log(`Failed to fetch orders ${err.message}`);
    }
  }, []);

  return (
    <div className={'m-16'}>
      <div className="flex text-primary text-5xl font-medium mb-6">Here are the orders you've been made!</div>
      <WorkspacesList
          orders={orders}
          setOrders={setOrders}
          workspaceCardBody={workspaceListType.history}
          loading={loading}
      />
    </div>
  );
};

export default OrdersHistory;
