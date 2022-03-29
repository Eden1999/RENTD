import React, { useState, useCallback, useContext, useEffect } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';
import axios from 'axios'

import { AppContext } from "../../../store/AppContext"
import Appointment from './Appointment.js';

import './styles.css'

const views = ['day', 'week'];
const groups = ['theatreId'];

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
  const [orders, setOrders] = useState([])
  const [currentDate, setCurrentDate] = useState(new Date())
  const [capacity, setCapacity] = useState(convertCapacityArrayToObject(workspace.capacity))
  const [{ user }] = useContext(AppContext);

  const getOrders = async (workspace_id) => {
    await axios.get(`http://localhost:8000/orders/${workspace_id}`)
    .then((res) => {
      console.log("get all orders successfully")
        setOrders(res.data)
    })
    .catch(err =>{
      alert(err.response.data)
      setOrders([])
    })
  }

  useEffect(() => {
    getOrders(workspace.id)
  }, [])

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
      console.log(res)
      let newArray = orders
      newArray[newArray.length - 1].id = res.data.id
      setOrders(newArray)
      // res.data.id
        // TODO: SOME COGO TOAST?
    })
    .catch(err =>{
      //TODO: DO NOT SAVE
        alert(err.response.data)
    })
  })

  const HandalingUpdateOrder = useCallback(async (e) => {
    let newOrder = {
      startdate: e.appointmentData.startDate,
      enddate: e.appointmentData.endDate,
      capacity: e.appointmentData.capacity,
      user_id: user.id,
      workspace_id: workspace.id,
      id: e.appointmentData.id
    }
    
    console.log(newOrder)

    const query = newOrder

    axios.put(`http://localhost:8000/orders/${newOrder.id}`, query)
    .then((res) => {
        console.log('successfully updates')
    })
    .catch(err =>{
        alert(err.response.data)
    })
  })

  const HandalingDeleteOrder = useCallback(async (e) => {
    let id = e.appointmentData.id
    
    console.log(`try delete id ${id}`)

    axios.delete(`http://localhost:8000/orders/${id}`)
    .then((res) => {
        console.log('successfully deleted')
    })
    .catch(err =>{
        alert(err.response.data)
    })
  })

  const onOrderFormOpening = (e) => {
    const { form } = e;
    let { startDate, endDate, userName } = e.appointmentData;

    form.option('items', [
      {
        label: {
          text: 'User Name',
        },
        name: 'userName',
        editorType: 'dxTextBox',
        editorOptions: {
          value: user.username || 'shirel',
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
          value: 1,
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

