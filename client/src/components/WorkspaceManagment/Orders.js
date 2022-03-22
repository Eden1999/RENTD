import React, { useState, useEffect } from "react";
import axios from 'axios'

import Paper from '@mui/material/Paper';
import {
  Scheduler,
  DayView,
  Appointments,
  AppointmentTooltip,
} from '@devexpress/dx-react-scheduler-material-ui';

const Orders = ({date, workspace}) => {
    const [orders, setOrders] = useState([])

    const getOrdersForWorkspace = async () => {
        await axios.get(`http://localhost:8000/availabilities:${workspace.id}?${date}`, {
        })
        .then((res) => {
            console.log("success")
            setOrders(res.data)
        })
        .catch(err =>{
            alert(err.response.data)
            setOrders({})
        })
    }

    useEffect(() => {
        // getOrdersForWorkspace(workspaceId)
    }, [])

    return (
        <Paper>
        <Scheduler data={orders}>
        <DayView
            startDayHour={8}
            endDayHour={13}
        />
        <Appointments />
        <AppointmentTooltip />
        </Scheduler>
        </Paper>
    )
}

export default Orders;