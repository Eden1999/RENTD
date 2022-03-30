import React, { useContext } from 'react';
import './styles.css'
import { AppContext } from "../../../store/AppContext"

const Appointment = (model) => {
  const { targetedAppointmentData } = model.data;
  const [{ user }] = useContext(AppContext);

  return (
    <div className="showtime-preview">
      {/* <div> {orderData.text}</div> */}
      <div>
        capacity: <strong>{ targetedAppointmentData.capacity }</strong>
        <br/>
        userName: <strong>{ targetedAppointmentData.user.username }</strong>
        <br/>
        user phone: <strong>{ user.phone }</strong>
      </div>
    </div>
  );
}

export default Appointment