import React, { useState, useCallback, useContext, useEffect } from "react";
import Scheduler, { Editing, Resource } from "devextreme-react/scheduler";
import axios from "axios";

import { AppContext } from "../../store/AppContext";
import Appointment from "./Appointment.js";

import "./styles.css";
import { useNavigate } from "react-router-dom";

const views = ["day"];
const groups = ["asset_id"];

const convertHourToFloat = (dateString) => {
  if (!dateString) return null;
  let hour = parseInt(dateString.split(":")[0]);
  let minutes = parseInt(dateString.split(":")[1]);

  let minutesFloat = parseFloat(minutes) / 60;

  let time = hour + minutesFloat;

  return time;
};

const convertCapacityArrayToObject = (capacity) => {
  let capacityArr = [];
  for (let index = 1; index <= capacity; index++) {
    capacityArr.push({ number: index });
  }
  return capacityArr;
};

const Orders = ({ workspace }) => {
  const [orders, setOrders] = useState([]);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [{ user }] = useContext(AppContext);
  const [assetTypes, setAssetTypes] = useState([{ id: 1, name: "" }]);
  const [assets, setAssets] = useState(workspace.assets);
  const navigate = useNavigate();

  const getOrders = async (workspace_id) => {
    await axios
      .get(`${process.env.REACT_APP_SERVER_URL}/orders/${workspace_id}`)
      .then((res) => {
        console.log("get all orders successfully");
        setOrders(res.data);
      })
      .catch((err) => {
        alert(err.response.data);
        setOrders([]);
      });
  };

  useEffect(() => {
    getOrders(workspace.id);
  }, []);

  useEffect(async () => {
    try {
      const query = {};
      const res = await axios.get(`${process.env.REACT_APP_SERVER_URL}/assetTypes`, query);
      setAssetTypes(res.data);
    } catch (err) {
      console.log(`Failed to fetch spaceTypes ${err.message}`);
    }
  }, []);

  useEffect(() => {
    let assets = workspace.assets.map((asset) => {
      let assetType = assetTypes.find((type) => type.id.toString() === asset.asset_id);
      console.log(asset)
      if (assetType) {
        asset.text = assetType.name + ` ${asset.cost_per_hour}₪ per 1 hour/person`;
      }
      return asset;
    });
    setAssets(assets);
  }, [assetTypes]);

  const continueToPayment = useCallback(async (e) => {
    let costPerHour = await axios
      .get(`${process.env.REACT_APP_SERVER_URL}/assets/${e.appointmentData.asset_id}`)
      .then((res) => {
        return res.data.cost_per_hour;
      })
      .catch((err) => {
        alert(err.response.data);
      });

    let rentingDetails = {
      startdate: e.appointmentData.startDate,
      enddate: e.appointmentData.endDate,
      capacity: e.appointmentData.capacity,
      user_id: user.id,
      workspace_id: workspace.id,
      asset_id: e.appointmentData.asset_id,
    };

    navigate(`/payment`, { state: { workspace, rentingDetails, costPerHour } });
  });

  const HandalingUpdateOrder = useCallback(async (e) => {
    let newOrder = {
      startdate: e.appointmentData.startDate,
      enddate: e.appointmentData.endDate,
      capacity: e.appointmentData.capacity,
      user_id: user.id,
      workspace_id: workspace.id,
      id: e.appointmentData.id,
    };

    console.log(newOrder);

    const query = newOrder;

    axios
      .put(`${process.env.REACT_APP_SERVER_URL}/orders/${newOrder.id}`, query)
      .then((res) => {
        console.log("successfully updates");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  });

  const HandalingDeleteOrder = useCallback(async (e) => {
    let id = e.appointmentData.id;

    console.log(`try delete id ${id}`);

    axios
      .delete(`${process.env.REACT_APP_SERVER_URL}/orders/${id}`)
      .then((res) => {
        console.log("successfully deleted");
      })
      .catch((err) => {
        alert(err.response.data);
      });
  });

  const optionChanged = useCallback(async (e) => {
    if (e.fullName === "currentDate") {
      setCurrentDate(e.value);
    }
  });

  const onOrderFormOpening = (e) => {
    let capacity = 1;
    const { form } = e;
    let { startDate, endDate } = e.appointmentData;
    let relAsset = assets.find((asset) => asset.id == e.appointmentData.asset_id);

    form.option("items", [
      {
        label: {
          text: "User Name",
        },
        name: "userName",
        editorType: "dxTextBox",
        editorOptions: {
          value: user.username || "shirel",
          readOnly: true,
          disabled: true,
        },
      },
      {
        dataField: "startDate",
        editorType: "dxDateBox",
        editorOptions: {
          width: "100%",
          type: "time",
          pickerType: "list",
          onValueChanged(args) {
            startDate = args.value;
          },
        },
      },
      {
        dataField: "endDate",
        editorType: "dxDateBox",
        editorOptions: {
          width: "100%",
          type: "time",
          pickerType: "list",
          onValueChanged(args) {
            endDate = args.value;
          },
        },
      },
      {
        label: {
          text: "cost",
        },
        name: "cost",
        editorType: "dxTextBox",
        editorOptions: {
          value: relAsset.cost_per_hour * capacity + "₪",
          readOnly: true,
          disabled: true,
        },
      },
      {
        label: {
          text: "capacity",
        },
        editorType: "dxSelectBox",
        dataField: "capacity",
        editorOptions: {
          items: convertCapacityArrayToObject(relAsset.capacity),
          displayExpr: "number",
          valueExpr: "number",
          value: 1,
          onValueChanged(args) {
            capacity = args.value || args.previousValue;
          },
        },
      },
    ]);
  };

  return (
    <div className="demo-container">
      <div className="text-white long-title">
        <h3>Renting Timeline</h3>
      </div>
      <div id="app">
        <Scheduler
          // timeZone="America/Los_Angeles"
          dataSource={orders}
          views={views}
          defaultCurrentView="day"
          defaultCurrentDate={currentDate}
          groups={groups}
          height={600}
          firstDayOfWeek={0}
          startDayHour={
            0 || convertHourToFloat(workspace.opening_days[currentDate.getDay()].opening_hour)
          }
          endDayHour={
            24 || convertHourToFloat(workspace.opening_days[currentDate.getDay()].closing_hour)
          }
          showAllDayPanel={true}
          crossScrollingEnabled={true}
          cellDuration={60}
          appointmentComponent={Appointment}
          onAppointmentFormOpening={onOrderFormOpening}
          onAppointmentAdded={continueToPayment}
          onAppointmentUpdated={HandalingUpdateOrder}
          onAppointmentDeleted={HandalingDeleteOrder}
          onOptionChanged={optionChanged}
        >
          <Editing allowUpdating={true} allowAdding={true} />
          <Resource fieldExpr="asset_id" allowMultiple={false} dataSource={assets} label="Assets" />
        </Scheduler>
      </div>
    </div>
  );
};

export default Orders;
