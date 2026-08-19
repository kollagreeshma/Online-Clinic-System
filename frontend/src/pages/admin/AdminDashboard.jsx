import React, { useState, useEffect } from 'react';
import { adminService } from '../../services/adminService';
import { Users, UserPlus, Calendar, ShieldCheck, Check, X, RefreshCw, AlertCircle, Edit, Trash2, Power } from 'lucide-react';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalDoctors: 0, totalPatients: 0, totalAppointments: 0, pendingLeaves: 0 });
  const [doctors, setDoctors] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [leaves, setLeaves] = useState([]);
  const [activeTab, setActiveTab] = useState('doctors');
  const [showAddModal, setShowAddModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAlternateModal, setShowAlternateModal] = useState(false);
  const [selectedAppointmentId, setSelectedAppointmentId] = useState(null);
  const [alternateDoctors, setAlternateDoctors] = useState([]);
  
  const [newDoctor, setNewDoctor] = useState({
    fullName: '', email: '', password: 'Doctor123!', specialization: 'Cardiology',
    qualification: 'MBBS, MD', experienceYears: 5, consultationFee: 500, phone: ''
  });

  const [editDoctor, setEditDoctor] = useState(null);
  const [msg, setMsg] = useState('');
  const [addModalError, setAddModalError] = useState('');

  const fetchDashboardData = async () => {
    try {
      const statsRes = await adminService.getStats();
      setStats(statsRes);
      const docsRes = await adminService.getAllDoctors();
      setDoctors(docsRes);
      const appsRes = await adminService.getAllAppointments();
      setAppointments(appsRes);
      const leavesRes = await adminService.getAllLeaves();
      setLeaves(leavesRes);
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const extractErrorMessage = (err) => {
    if (!err.response) {
      return 'Unable to connect to backend server. Please verify Spring Boot is running.';
    }
    const data = err.response.data;
    if (typeof data === 'string') return data;
    if (data?.message) return data.message;
    if (typeof data === 'object') {
      const messages = Object.entries(data)
        .filter(([key]) => key !== 'success')
        .map(([field, msg]) => `${field}: ${msg}`)
        .join(', ');
      if (messages) return `Validation failed (${messages})`;
    }
    return 'Failed to add doctor. Please verify inputs.';
  };

  const handleOpenAddModal = () => {
    setAddModalError('');
    setNewDoctor({
      fullName: '', email: '', password: 'Doctor123!', specialization: 'Cardiology',
      qualification: 'MBBS, MD', experienceYears: 5, consultationFee: 500, phone: ''
    });
    setShowAddModal(true);
  };

  const handleAddDoctor = async (e) => {
    e.preventDefault();
    setAddModalError('');
    try {
      await adminService.addDoctor(newDoctor);
      setMsg('Doctor onboarded successfully!');
      setShowAddModal(false);
      fetchDashboardData();
    } catch (err) {
      const errorMsg = extractErrorMessage(err);
      setAddModalError(errorMsg);
      alert(errorMsg);
    }
  };

  const handleOpenEdit = (doc) => {
    setEditDoctor({ ...doc });
    setShowEditModal(true);
  };

  const handleUpdateDoctor = async (e) => {
    e.preventDefault();
    try {
      await adminService.updateDoctor(editDoctor.id, editDoctor);
      alert('Doctor updated successfully!');
      setShowEditModal(false);
      fetchDashboardData();
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to update doctor');
    }
  };

  const handleToggleDoctorStatus = async (doctor) => {
    try {
      const updated = { ...doctor, isAvailable: !doctor.isAvailable };
      await adminService.updateDoctor(doctor.id, updated);
      fetchDashboardData();
    } catch (err) {
      alert('Failed to update doctor availability');
    }
  };

  const handleLeaveAction = async (leaveId, status) => {
    try {
      await adminService.updateLeaveStatus(leaveId, status);
      fetchDashboardData();
    } catch (err) {
      alert('Error updating leave status');
    }
  };

  const handleOpenAlternateModal = async (appointmentId) => {
    setSelectedAppointmentId(appointmentId);
    try {
      const alternates = await adminService.getAlternateDoctors(appointmentId);
      setAlternateDoctors(alternates);
      setShowAlternateModal(true);
    } catch (err) {
      alert('Error fetching alternate doctors');
    }
  };

  const handleReassignDoctor = async (newDoctorId) => {
    try {
      await adminService.reassignDoctor(selectedAppointmentId, newDoctorId);
      setShowAlternateModal(false);
      fetchDashboardData();
      alert('Appointment reassigned to alternate doctor successfully!');
    } catch (err) {
      alert('Failed to reassign doctor');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1>Admin Control Panel</h1>
            <p style={{ color: 'var(--text-muted)' }}>Manage doctors, patient appointments, schedules, and leave requests</p>
          </div>
          <button onClick={handleOpenAddModal} className="btn btn-primary">
            <UserPlus size={18} /> Onboard New Doctor
          </button>
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--primary)' }}><Users size={24} /></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Doctors</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalDoctors}</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#ccfbf1', color: 'var(--secondary)' }}><Users size={24} /></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Patients</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalPatients}</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#e0e7ff', color: 'var(--accent)' }}><Calendar size={24} /></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Total Appointments</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.totalAppointments}</div>
            </div>
          </div>

          <div className="glass-card stat-card">
            <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><AlertCircle size={24} /></div>
            <div>
              <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 600 }}>Pending Leaves</div>
              <div style={{ fontSize: '1.6rem', fontWeight: 800 }}>{stats.pendingLeaves}</div>
            </div>
          </div>
        </div>

        {/* Tab Buttons */}
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', borderBottom: '2px solid #e2e8f0', pb: '0.5rem' }}>
          <button className={`btn ${activeTab === 'doctors' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('doctors')}>Doctors List</button>
          <button className={`btn ${activeTab === 'appointments' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('appointments')}>All Appointments</button>
          <button className={`btn ${activeTab === 'leaves' ? 'btn-primary' : 'btn-outline'}`} onClick={() => setActiveTab('leaves')}>Leave Applications ({stats.pendingLeaves})</button>
        </div>

        {/* Tab 1: Doctors */}
        {activeTab === 'doctors' && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2>Clinic Doctors Directory</h2>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Doctor Name</th>
                    <th>Specialization</th>
                    <th>Qualification</th>
                    <th>Experience</th>
                    <th>Consultation Fee</th>
                    <th>Phone</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {doctors.map(doc => (
                    <tr key={doc.id}>
                      <td style={{ fontWeight: 700 }}>Dr. {doc.fullName}</td>
                      <td>{doc.specialization}</td>
                      <td>{doc.qualification}</td>
                      <td>{doc.experienceYears} Years</td>
                      <td>₹{doc.consultationFee}</td>
                      <td>{doc.phone}</td>
                      <td>
                        <span className={`badge ${doc.isAvailable ? 'badge-confirmed' : 'badge-cancelled'}`}>
                          {doc.isAvailable ? 'AVAILABLE' : 'UNAVAILABLE'}
                        </span>
                      </td>
                      <td>
                        <div style={{ display: 'flex', gap: '0.4rem' }}>
                          <button onClick={() => handleOpenEdit(doc)} className="btn btn-outline btn-sm" title="Edit Doctor Profile">
                            <Edit size={14} /> Edit
                          </button>
                          <button onClick={() => handleToggleDoctorStatus(doc)} className={`btn btn-sm ${doc.isAvailable ? 'btn-danger' : 'btn-primary'}`} title="Toggle Availability">
                            <Power size={14} /> {doc.isAvailable ? 'Disable' : 'Enable'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 2: Appointments */}
        {activeTab === 'appointments' && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2>Master Appointments Queue</h2>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Appt ID</th>
                    <th>Patient</th>
                    <th>Doctor</th>
                    <th>Date & Time</th>
                    <th>Symptoms</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {appointments.map(app => (
                    <tr key={app.id}>
                      <td>#{app.id}</td>
                      <td><strong>{app.patientName}</strong><br/><small style={{color:'var(--text-muted)'}}>{app.patientPhone}</small></td>
                      <td>Dr. {app.doctorName}<br/><small style={{color:'var(--text-muted)'}}>{app.specialization}</small></td>
                      <td>{app.appointmentDate} @ {app.appointmentTime?.substring(0,5)}</td>
                      <td>{app.symptoms || 'N/A'}</td>
                      <td>
                        <span className={`badge badge-${app.status?.toLowerCase()}`}>{app.status}</span>
                      </td>
                      <td>
                        {app.status === 'CONFIRMED' && (
                          <button onClick={() => handleOpenAlternateModal(app.id)} className="btn btn-outline btn-sm">
                            <RefreshCw size={14} /> Alternate Doctor
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab 3: Leaves */}
        {activeTab === 'leaves' && (
          <div className="glass-panel" style={{ padding: '1.5rem' }}>
            <h2>Doctor Leave Management</h2>
            <div className="table-responsive">
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Doctor</th>
                    <th>Date Range</th>
                    <th>Reason</th>
                    <th>Status</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {leaves.map(l => (
                    <tr key={l.id}>
                      <td><strong>Dr. {l.doctorName}</strong></td>
                      <td>{l.startDate} to {l.endDate}</td>
                      <td>{l.reason}</td>
                      <td><span className={`badge badge-${l.status?.toLowerCase()}`}>{l.status}</span></td>
                      <td>
                        {l.status === 'PENDING' && (
                          <div style={{ display: 'flex', gap: '0.5rem' }}>
                            <button onClick={() => handleLeaveAction(l.id, 'APPROVED')} className="btn btn-primary btn-sm"><Check size={14}/> Approve</button>
                            <button onClick={() => handleLeaveAction(l.id, 'REJECTED')} className="btn btn-danger btn-sm"><X size={14}/> Reject</button>
                          </div>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Add Doctor Modal */}
        {showAddModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Onboard New Doctor</h3>
              {addModalError && (
                <div className="alert alert-danger" style={{ marginTop: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <AlertCircle size={18} /> {addModalError}
                </div>
              )}
              <form onSubmit={handleAddDoctor} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required className="form-control" placeholder="Sarah Jenkins" value={newDoctor.fullName} onChange={(e) => setNewDoctor({...newDoctor, fullName: e.target.value})} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Email *</label>
                    <input type="email" required className="form-control" placeholder="doctor@ocs.com" value={newDoctor.email} onChange={(e) => setNewDoctor({...newDoctor, email: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Default Password</label>
                    <input type="text" className="form-control" value={newDoctor.password} onChange={(e) => setNewDoctor({...newDoctor, password: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Specialization *</label>
                    <select className="form-control" value={newDoctor.specialization} onChange={(e) => setNewDoctor({...newDoctor, specialization: e.target.value})}>
                      {['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Qualification *</label>
                    <input type="text" required className="form-control" placeholder="MBBS, MD" value={newDoctor.qualification} onChange={(e) => setNewDoctor({...newDoctor, qualification: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Exp (Years)</label>
                    <input type="number" required className="form-control" value={newDoctor.experienceYears} onChange={(e) => setNewDoctor({...newDoctor, experienceYears: parseInt(e.target.value, 10)})} />
                  </div>
                  <div className="form-group">
                    <label>Fee (₹)</label>
                    <input type="number" required className="form-control" value={newDoctor.consultationFee} onChange={(e) => setNewDoctor({...newDoctor, consultationFee: parseFloat(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="text" required className="form-control" value={newDoctor.phone} onChange={(e) => setNewDoctor({...newDoctor, phone: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowAddModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Onboard Doctor</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Doctor Modal */}
        {showEditModal && editDoctor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Edit Doctor Profile</h3>
              <form onSubmit={handleUpdateDoctor} style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Full Name *</label>
                  <input type="text" required className="form-control" value={editDoctor.fullName || ''} onChange={(e) => setEditDoctor({...editDoctor, fullName: e.target.value})} />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Specialization *</label>
                    <select className="form-control" value={editDoctor.specialization || ''} onChange={(e) => setEditDoctor({...editDoctor, specialization: e.target.value})}>
                      {['Cardiology', 'Dermatology', 'Pediatrics', 'Orthopedics', 'Neurology', 'General Medicine'].map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Qualification *</label>
                    <input type="text" required className="form-control" value={editDoctor.qualification || ''} onChange={(e) => setEditDoctor({...editDoctor, qualification: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '0.75rem' }}>
                  <div className="form-group">
                    <label>Exp (Years)</label>
                    <input type="number" required className="form-control" value={editDoctor.experienceYears || 0} onChange={(e) => setEditDoctor({...editDoctor, experienceYears: parseInt(e.target.value, 10)})} />
                  </div>
                  <div className="form-group">
                    <label>Fee (₹)</label>
                    <input type="number" required className="form-control" value={editDoctor.consultationFee || 0} onChange={(e) => setEditDoctor({...editDoctor, consultationFee: parseFloat(e.target.value)})} />
                  </div>
                  <div className="form-group">
                    <label>Phone *</label>
                    <input type="text" required className="form-control" value={editDoctor.phone || ''} onChange={(e) => setEditDoctor({...editDoctor, phone: e.target.value})} />
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem', justifyContent: 'flex-end' }}>
                  <button type="button" onClick={() => setShowEditModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Save Changes</button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Suggest Alternate Doctor Modal */}
        {showAlternateModal && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Suggest & Reassign Alternate Doctor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1rem' }}>
                Select an available doctor in the same specialization to reassign Appointment #{selectedAppointmentId}:
              </p>
              {alternateDoctors.length === 0 ? (
                <p style={{ color: 'var(--danger)', fontWeight: 600 }}>No alternate doctors currently available for this specialization.</p>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {alternateDoctors.map(alt => (
                    <div key={alt.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem', border: '1px solid #e2e8f0', borderRadius: '8px' }}>
                      <div>
                        <strong>Dr. {alt.fullName}</strong>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{alt.qualification} | Fee: ₹{alt.consultationFee}</div>
                      </div>
                      <button onClick={() => handleReassignDoctor(alt.id)} className="btn btn-primary btn-sm">
                        Reassign
                      </button>
                    </div>
                  ))}
                </div>
              )}
              <div style={{ marginTop: '1.5rem', textAlign: 'right' }}>
                <button onClick={() => setShowAlternateModal(false)} className="btn btn-outline">Close</button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default AdminDashboard;
