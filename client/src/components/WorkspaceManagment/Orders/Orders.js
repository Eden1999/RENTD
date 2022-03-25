import React, { useState } from 'react';
import Scheduler, { Editing, Resource } from 'devextreme-react/scheduler';
import Query from 'devextreme/data/query';

import AppointmentTooltip from './AppointmentTooltip.js';
import { orders } from './data.js';
import Appointment from './Appointment.js';

import './styles.css'

const views = ['day', 'week'];
const groups = ['theatreId'];

const getOrderById = (id) => {
  return Query(orders).filter(['id', id]).toArray()[0];
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
  const [currentDate, setCurrentDate] = useState(new Date())
  const [capacity, setCapacity] = useState(workspace.capacity)

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
        dataField: 'id',
        editorOptions: {
          items: convertCapacityArrayToObject(workspace.capacity),
          displayExpr: 'number',
          valueExpr: 'id',
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

