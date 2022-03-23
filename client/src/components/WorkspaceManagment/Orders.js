import React, { useState, useEffect } from "react";
import axios from 'axios'

import Paper from '@mui/material/Paper';
import {
  Scheduler,
  DayView,
  Toolbar,
  DateNavigator,
  TodayButton,
  Appointments,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';
import { ViewState } from '@devexpress/dx-react-scheduler';

const convertHourToFloat = (dateString) => {
    let hour = parseInt(dateString.split(':')[0])
    let minutes = parseInt(dateString.split(':')[1])

    let minutesFloat = parseFloat(minutes) / 60

    let time = hour + minutesFloat

    return time
}

const Orders = ({workspace}) => {
    const [orders, setOrders] = useState([])

    // const getOrdersForWorkspace = async () => {
    //     await axios.get(`http://localhost:8000/availabilities:${workspace.id}?${date}`, {
    //     })
    //     .then((res) => {
    //         console.log("success")
    //         setOrders(res.data)
    //     })
    //     .catch(err =>{
    //         alert(err.response.data)
    //         setOrders({})
    //     })
    // }

    useEffect(() => {
        // getOrdersForWorkspace(workspaceId)
    }, [])

    return (
        <Paper>
            <Scheduler data={orders}>
            <ViewState
                defaultCurrentDate={new Date()}
            />
            <DayView
                startDayHour={convertHourToFloat(workspace.opening_hour)}
                endDayHour={convertHourToFloat(workspace.closing_hour)}
            />
            <Toolbar />
            <DateNavigator />
            <TodayButton />
            <Appointments />
            <AppointmentTooltip />
            </Scheduler>
        </Paper>
    )
}

export default Orders;