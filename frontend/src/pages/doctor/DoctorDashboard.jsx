import React, { useState, useEffect } from 'react';
import { doctorService } from '../../services/doctorService';
import { Calendar, ToggleLeft, ToggleRight, Clock, PlusCircle, CheckCircle } from 'lucide-react';

const DoctorDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveData, setLeaveData] = useState({ startDate: '', endDate: '', reason: '' });
  const [msg, setMsg] = useState('');

  useEffect(() => {
    fetchDoctorData();
  }, []);

  const fetchDoctorData = async () => {
    try {
      const prof = await doctorService.getProfile();
      setProfile(prof);
      const apps = await doctorService.getAppointments();
      setAppointments(apps);
      const lvs = await doctorService.getLeaves();
      setLeaves(lvs);
    } catch (err) {
      console.error('Error loading doctor data:', err);
    }
  };

  const handleToggleAvailability = async () => {
    try {
      const res = await doctorService.toggleAvailability();
      setMsg(res.message);
      fetchDoctorData();
    } catch (err) {
      alert('Error updating status');
    }
  };

  const handleRequestLeave = async (e) => {
    e.preventDefault();
    try {
      await doctorService.requestLeave(leaveData);
      setShowLeaveModal(false);
      fetchDoctorData();
      alert('Leave request submitted to Admin!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to submit leave request');
    }
  };

  if (!profile) return <div className="page-wrapper container">Loading Doctor Portal...</div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Doctor Header Banner */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Welcome, Dr. {profile.fullName}</h1>
            <p style={{ color: 'var(--text-muted)' }}>{profile.specialization} ({profile.qualification}) • {profile.experienceYears} Years Exp • Fee: ₹{profile.consultationFee}</p>
          </div>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <button onClick={handleToggleAvailability} className={`btn ${profile.isAvailable ? 'btn-primary' : 'btn-outline'}`}>
              {profile.isAvailable ? <ToggleRight size={20} /> : <ToggleLeft size={20} />}
              Status: {profile.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
            </button>

            <button onClick={() => setShowLeaveModal(true)} className="btn btn-outline">
              <PlusCircle size={18} /> Apply for Leave
            </button>
          </div>
        </div>

        {msg && <div className="alert alert-success">{msg}</div>}

        {/* Appointments Queue */}
        <div className="glass-panel" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          <h2 style={{ marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar color="var(--primary)" /> Assigned Patient Queue ({appointments.length})
          </h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Patient Name</th>
                  <th>Contact Phone</th>
                  <th>Date & Time</th>
                  <th>Symptoms / Notes</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No appointments booked yet.</td></tr>
                ) : (
                  appointments.map(app => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td><strong>{app.patientName}</strong></td>
                      <td>{app.patientPhone}</td>
                      <td>{app.appointmentDate} @ {app.appointmentTime?.substring(0,5)}</td>
                      <td>{app.symptoms || 'General Consultation'}</td>
                      <td><span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Requests Log */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2>My Leave Requests History</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Reason</th>
                  <th>Approval Status</th>
                </tr>
              </thead>
              <tbody>
                {leaves.length === 0 ? (
                  <tr><td colSpan="4" style={{ textAlign: 'center', padding: '1.5rem' }}>No leave requests submitted.</td></tr>
                ) : (
                  leaves.map(l => (
                    <tr key={l.id}>
                      <td>{l.startDate}</td>
                      <td>{l.endDate}</td>
                      <td>{l.reason}</td>
                      <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Leave Modal */}
        {showLeaveModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Submit Leave Request</h3>
              <form onSubmit={handleRequestLeave} style={{ marginTop: '1rem' }}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Start Date *</label>
                    <input type="date" required className="form-control" value={leaveData.startDate} onChange={(e) => setLeaveData({...leaveData, startDate: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>End Date *</label>
                    <input type="date" required className="form-control" value={leaveData.endDate} onChange={(e) => setLeaveData({...leaveData, endDate: e.target.value})} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Reason for Leave *</label>
                  <textarea required rows="3" className="form-control" placeholder="Specify medical, personal, or conference leave..." value={leaveData.reason} onChange={(e) => setLeaveData({...leaveData, reason: e.target.value})}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowLeaveModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Submit Request</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default DoctorDashboard;
