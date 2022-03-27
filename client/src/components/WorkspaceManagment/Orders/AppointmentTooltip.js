import React, { useState } from 'react';
// import Query from 'devextreme/data/query';

import './styles.css'
import PropTypes from 'prop-types';

import Appointment from './Appointment.js';


// function getOrdersById(id) {
//   return Query(ordersData).filter(['id', id]).toArray()[0];
// }

const AppointmentTooltip = ({orderData}) => {
  const [order, setOrder] = useState({})

  return (
    <div className="movie-tooltip">
        <img src={order.image} />
        <div className="movie-info">
          <div className="movie-title">
            {order.text} ({order.year})
          </div>
          <div>
            Director: {order.director}
          </div>
          <div>
            Duration: {order.duration} minutes
          </div>
        </div>
      </div>
  )
}

AppointmentTooltip.propTypes = {
  orderData: PropTypes.object
};
export default AppointmentTooltip