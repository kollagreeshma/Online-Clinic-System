import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import { Calendar, XCircle, Clock, Stethoscope } from 'lucide-react';

const AppointmentHistory = () => {
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    fetchAppointments();
  }, []);

  const fetchAppointments = async () => {
    try {
      const data = await patientService.getAppointments();
      setAppointments(data);
    } catch (err) {
      console.error('Error loading appointments:', err);
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Cancel this appointment?')) {
      try {
        await patientService.cancelAppointment(id);
        fetchAppointments();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <h1 style={{ marginBottom: '0.5rem' }}>My Consultation History</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>Track all your booked appointments, active statuses, and cancellation logs</p>

        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Booking ID</th>
                  <th>Doctor Name</th>
                  <th>Specialization</th>
                  <th>Date & Time</th>
                  <th>Consultation Fee</th>
                  <th>Symptoms</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="8" style={{ textAlign: 'center', padding: '2rem' }}>No appointment history available.</td></tr>
                ) : (
                  appointments.map(app => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td><strong>Dr. {app.doctorName}</strong></td>
                      <td>{app.specialization}</td>
                      <td>{app.appointmentDate} @ {app.appointmentTime?.substring(0,5)}</td>
                      <td>₹{app.consultationFee}</td>
                      <td>{app.symptoms || 'General Checkup'}</td>
                      <td><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                      <td>
                        {app.status === 'CONFIRMED' && (
                          <button onClick={() => handleCancel(app.id)} className="btn btn-danger btn-sm">
                            <XCircle size={14} /> Cancel
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
};

export default AppointmentHistory;
