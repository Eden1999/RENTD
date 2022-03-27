import React, { useState, useCallback, useContext } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';
import Query from 'devextreme/data/query';
import axios from 'axios'

import { AppContext } from "../../../store/AppContext"
import AppointmentTooltip from './AppointmentTooltip.js';
import { ordersData } from './data.js';
import Appointment from './Appointment.js';

import './styles.css'

const views = ['day', 'week'];
const groups = ['theatreId'];

const getOrderById = (id) => {
  return Query(ordersData).filter(['id', id]).toArray()[0];
}

const convertHourToFloat = (dateString) => {
  let hour = parseInt(dateString.split(':')[0])
  let minutes = parseInt(dateString.split(':')[1])

  let minutesFloat = parseFloat(minutes) / 60

  let time = hour + minutesFloat

  return time
}

const convertCapacityArrayToObject = (capacity) => {
  let capacityArr = []
  for (let index = 1; index <= capacity; index++) {

    capacityArr.push({number: index})
  }
  return capacityArr
}

const Orders = ({workspace}) => {
  const [orders, setOrders] = useState(ordersData)
  const [currentDate, setCurrentDate] = useState(new Date())
  const [capacity, setCapacity] = useState(convertCapacityArrayToObject(workspace.capacity))
  const [{ user }] = useContext(AppContext);

  const HandalingAddOrder = useCallback(async (e) => {
    let newOrder = {
      startdate: e.appointmentData.startDate,
      enddate: e.appointmentData.endDate,
      capacity: e.appointmentData.capacity,
      user_id: user.id,
      workspace_id: workspace.id
    }
    
    console.log(newOrder)

    const query = newOrder

    axios.post('http://localhost:8000/orders/create', query)
    .then((res) => {
        // if(res.data.token) {
        //     setToken(res.data.token)
        // }

        // dispatch({
        //     type: "SET_GENERAL_STATE",
        //     payload: {
        //       user : res.data.user
        //     },
        // })

        // sessionStorage.setItem('user', JSON.stringify(res.data.user));
        // navigate(res.data.user.is_host ? '/hostHome' : '/guestHome')
    })
    .catch(err =>{
        alert(err.response.data)
    })
  })

  const HandalingUpdateOrder = (e) => {
    // add order
  }

  const HandalingDeleteOrder = (e) => {
    // add order
  }

  const onOrderFormOpening = (e) => {
    const { form } = e;
    let orderInfo = getOrderById(e.appointmentData.id) || {};
    let { startDate, endDate, userName } = e.appointmentData;

    form.option('items', [
      {
        label: {
          text: 'User Name',
        },
        name: 'userName',
        editorType: 'dxTextBox',
        editorOptions: {
          value: orderInfo.userName || 'shirel',
          readOnly: true
      },
      }, {
        dataField: 'startDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'datetime',
          onValueChanged(args) {
            startDate = args.value;
          },
        },
      },{
        dataField: 'endDate',
        editorType: 'dxDateBox',
        editorOptions: {
          width: '100%',
          type: 'datetime',
          onValueChanged(args) {
            endDate = args.value;
          },
        },
      }, 
      {
        label: {
          text: 'capacity',
        },
        editorType: 'dxSelectBox',
        dataField: 'capacity',
        editorOptions: {
          items: convertCapacityArrayToObject(workspace.capacity),
          displayExpr: 'number',
          valueExpr: 'number',
          onValueChanged(args) {
            capacity = args.value
          },
        },
      },
      ]);
  }

    return (
      <div className="demo-container">
        <div className="long-title"><h3>Renting Timeline</h3></div>
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
            startDayHour={convertHourToFloat(workspace.opening_hour)}
            endDayHour={convertHourToFloat(workspace.closing_hour)}
            showAllDayPanel={true}
            crossScrollingEnabled={true}
            cellDuration={30}
            appointmentComponent={Appointment}
            // appointmentTooltipComponent={AppointmentTooltip}
            onAppointmentFormOpening={onOrderFormOpening}
            onAppointmentAdded={HandalingAddOrder}
            onAppointmentUpdated={HandalingUpdateOrder}
            onAppointmentDeleted={HandalingDeleteOrder}
          >
            <Editing allowAdding={true} />
            <Resource
              dataSource={orders}
              fieldExpr="id"
              useColorAsDefault={true}
            />
          </Scheduler>
        </div>
      </div>
    )
}



export default Orders;

