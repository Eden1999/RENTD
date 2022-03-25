import React from 'react';
import Query from 'devextreme/data/query';
import './styles.css'

// import {formatDate} from 'devextreme/localization';
import { orders } from './data.js';

function getOrderById(id) {
  return Query(orders).filter(['id', id]).toArray()[0];
}

const Appointment = (model) => {
  const { targetedAppointmentData } = model.data;

  const orderData = getOrderById(targetedAppointmentData.id) || {};

  return (
    <div className="showtime-preview">
      <div> {orderData.text}</div>
      <div>
        capacity: <strong>{ targetedAppointmentData.capacity }</strong>
        userName
        user phone
      </div>
    </div>
  );
}

export default Appointment