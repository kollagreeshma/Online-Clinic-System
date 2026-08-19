import React from 'react';
import { X, Award, Clock, MapPin, Phone, Mail, CheckCircle2 } from 'lucide-react';

const DoctorProfile = ({ doctor, onClose, onBook }) => {
  if (!doctor) return null;

  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=0284c7&color=fff&size=200`;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '600px', padding: 0, overflow: 'hidden' }}>
        
        {/* Header Background */}
        <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)', height: '120px', position: 'relative' }}>
          <button 
            onClick={onClose}
            style={{ position: 'absolute', top: '15px', right: '15px', background: 'rgba(255,255,255,0.2)', border: 'none', color: 'white', borderRadius: '50%', padding: '5px', cursor: 'pointer' }}
          >
            <X size={20} />
          </button>
        </div>

        {/* Profile Content */}
        <div style={{ padding: '0 2rem 2rem 2rem', position: 'relative' }}>
          
          {/* Avatar floating over header */}
          <div style={{ marginTop: '-60px', marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end' }}>
            <div style={{ width: '120px', height: '120px', borderRadius: '50%', border: '4px solid white', overflow: 'hidden', background: 'white', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}>
              <img src={doctor.imageUrl || defaultImage} alt={doctor.fullName} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            </div>
            {doctor.isAvailable && (
              <span className="badge badge-confirmed" style={{ marginBottom: '10px' }}>
                <CheckCircle2 size={12} style={{ display: 'inline', marginRight: '4px', verticalAlign: 'text-bottom' }} />
                Available Today
              </span>
            )}
          </div>

          <h2 style={{ margin: '0 0 5px 0' }}>Dr. {doctor.fullName}</h2>
          <p style={{ color: 'var(--primary)', fontWeight: 600, margin: '0 0 1.5rem 0' }}>{doctor.specialization}</p>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', marginBottom: '1.5rem', background: '#f8fafc', padding: '1.5rem', borderRadius: 'var(--radius-md)' }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Award size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Qualification</div>
                <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{doctor.qualification}</div>
              </div>
            </div>
            
            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Clock size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Experience</div>
                <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{doctor.experienceYears} Years</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <Phone size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Contact</div>
                <div style={{ fontWeight: 600, color: 'var(--dark)' }}>{doctor.phone || 'N/A'}</div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
              <MapPin size={18} color="var(--primary)" style={{ marginTop: '2px' }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>Consultation Fee</div>
                <div style={{ fontWeight: 800, color: 'var(--primary)', fontSize: '1.1rem' }}>₹{doctor.consultationFee}</div>
              </div>
            </div>
          </div>

          <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '1.5rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
            <button onClick={onClose} className="btn btn-outline">Close</button>
            <button 
              onClick={() => {
                onClose();
                onBook(doctor);
              }} 
              className="btn btn-primary"
              disabled={!doctor.isAvailable}
            >
              Book Appointment
            </button>
          </div>

        </div>
      </div>
    </div>
  );
};

export default DoctorProfile;
