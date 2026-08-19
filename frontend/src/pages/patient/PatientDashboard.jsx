import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { patientService } from '../../services/patientService';
import { Calendar, Search, User, Clock, CheckCircle, XCircle, Edit3 } from 'lucide-react';

const PatientDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editForm, setEditForm] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const prof = await patientService.getProfile();
      setProfile(prof);
      const apps = await patientService.getAppointments();
      setAppointments(apps);
    } catch (err) {
      console.error('Error fetching patient portal data:', err);
    }
  };

  const handleOpenEdit = () => {
    setEditForm({ ...profile });
    setShowEditProfile(true);
  };

  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await patientService.updateProfile(editForm);
      setShowEditProfile(false);
      fetchData();
      alert('Profile updated successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update profile');
    }
  };

  const handleCancel = async (id) => {
    if (window.confirm('Are you sure you want to cancel this appointment?')) {
      try {
        await patientService.cancelAppointment(id);
        fetchData();
      } catch (err) {
        alert('Failed to cancel appointment');
      }
    }
  };

  if (!profile) return <div className="page-wrapper container">Loading Patient Portal...</div>;

  return (
    <div className="page-wrapper">
      <div className="container">
        {/* Banner */}
        <div className="glass-panel" style={{ padding: '2rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1>Welcome, {profile.fullName}</h1>
            <p style={{ color: 'var(--text-muted)' }}>Age: {profile.age} | Gender: {profile.gender} | Blood: {profile.bloodGroup || 'N/A'} | Phone: {profile.phone}</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={handleOpenEdit} className="btn btn-outline">
              <Edit3 size={18} /> Edit Profile
            </button>
            <Link to="/patient/search" className="btn btn-primary">
              <Search size={18} /> Search & Book Doctor
            </Link>
          </div>
        </div>

        {/* Shortcut Action Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem', marginBottom: '2.5rem' }}>
          <Link to="/patient/search" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#e0f2fe', color: 'var(--primary)', padding: '1rem', borderRadius: '12px' }}><Search size={28} /></div>
              <div>
                <h3 style={{ color: 'var(--dark)' }}>Find Specialists</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Search by specialty and select slot</p>
              </div>
            </div>
          </Link>

          <Link to="/patient/appointments" style={{ textDecoration: 'none' }}>
            <div className="glass-card" style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <div style={{ background: '#ccfbf1', color: 'var(--secondary)', padding: '1rem', borderRadius: '12px' }}><Calendar size={28} /></div>
              <div>
                <h3 style={{ color: 'var(--dark)' }}>Appointment History</h3>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>View past and active consultations</p>
              </div>
            </div>
          </Link>
        </div>

        {/* Active Appointments Table */}
        <div className="glass-panel" style={{ padding: '1.5rem' }}>
          <h2>My Active Consultations</h2>
          <div className="table-responsive">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Appt ID</th>
                  <th>Doctor</th>
                  <th>Specialization</th>
                  <th>Date & Time</th>
                  <th>Consultation Fee</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {appointments.length === 0 ? (
                  <tr><td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No appointment bookings found. Click "Search & Book Doctor" to get started.</td></tr>
                ) : (
                  appointments.map(app => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td><strong>Dr. {app.doctorName}</strong></td>
                      <td>{app.specialization}</td>
                      <td>{app.appointmentDate} @ {app.appointmentTime?.substring(0,5)}</td>
                      <td>₹{app.consultationFee}</td>
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

        {/* Edit Profile Modal */}
        {showEditProfile && editForm && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Patient Profile</h3>
              <form onSubmit={handleSaveProfile} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required className="form-control" value={editForm.fullName || ''} onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Age *</label>
                    <input type="number" required min="1" className="form-control" value={editForm.age || ''} onChange={(e) => setEditForm({ ...editForm, age: parseInt(e.target.value, 10) })} />
                  </div>
                  <div className="form-group">
                    <label>Gender *</label>
                    <select className="form-control" value={editForm.gender || 'MALE'} onChange={(e) => setEditForm({ ...editForm, gender: e.target.value })}>
                      <option value="MALE">Male</option>
                      <option value="FEMALE">Female</option>
                      <option value="OTHER">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Blood Group</label>
                    <select className="form-control" value={editForm.bloodGroup || 'O+'} onChange={(e) => setEditForm({ ...editForm, bloodGroup: e.target.value })}>
                      {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => <option key={bg} value={bg}>{bg}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Phone Number *</label>
                  <input type="text" required className="form-control" value={editForm.phone || ''} onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })} />
                </div>

                <div className="form-group">
                  <label>Address</label>
                  <textarea rows="2" className="form-control" value={editForm.address || ''} onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowEditProfile(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Profile</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default PatientDashboard;
