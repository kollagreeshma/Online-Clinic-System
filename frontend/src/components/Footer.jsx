import React from 'react';
import { Link } from 'react-router-dom';
import { Stethoscope, Heart, Mail, Phone, MapPin, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer id="contact-footer" style={{ background: '#0f172a', color: '#94a3b8', paddingTop: '3.5rem', paddingBottom: '2rem', marginTop: 'auto', borderTop: '1px solid #1e293b' }}>
      <div className="container">
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '2.5rem', marginBottom: '3rem' }}>
          
          {/* Brand Info */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '1rem' }}>
              <div style={{ background: 'var(--primary)', color: '#fff', padding: '0.45rem', borderRadius: '10px', display: 'flex' }}>
                <Stethoscope size={22} />
              </div>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff' }}>
                Online<span className="gradient-text">Clinic</span>
              </span>
            </div>
            <p style={{ fontSize: '0.88rem', lineHeight: '1.6', color: '#94a3b8', marginBottom: '1rem' }}>
              Enterprise Outpatient Healthcare & Instant Appointment Scheduling Portal. Connecting patients with verified medical specialists.
            </p>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8rem', color: 'var(--primary-light)' }}>
              <ShieldCheck size={16} color="var(--primary)" /> Enterprise JWT Security & Encryption
            </div>
          </div>

          {/* Quick Navigation */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.1rem' }}>Quick Navigation</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem' }}>
              <li><Link to="/" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Home</Link></li>
              <li><Link to="/login" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Portal Login</Link></li>
              <li><Link to="/register" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Patient Registration</Link></li>
              <li><Link to="/patient/search" style={{ color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}>Find Doctors</Link></li>
            </ul>
          </div>

          {/* Medical Specialties */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.1rem' }}>Medical Departments</h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.9rem', color: '#94a3b8' }}>
              <li>Cardiology & Vascular</li>
              <li>Dermatology & Skin Care</li>
              <li>Pediatrics & Child Care</li>
              <li>Orthopedics & Joint Health</li>
              <li>Neurology & General Medicine</li>
            </ul>
          </div>

          {/* Contact & Hours */}
          <div>
            <h4 style={{ color: '#ffffff', fontSize: '1.05rem', marginBottom: '1.1rem' }}>Clinic Contact</h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.88rem', color: '#94a3b8' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MapPin size={16} color="var(--primary)" /> 100 Medical Boulevard, Healthcare City
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Phone size={16} color="var(--primary)" /> +1 (800) 555-CLINIC
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Mail size={16} color="var(--primary)" /> support@ocs-healthcare.com
              </div>
            </div>
          </div>

        </div>

        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '1.5rem', display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', fontSize: '0.85rem' }}>
          <div>
            © {new Date().getFullYear()} Online Clinic System (OCS). All rights reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
            Built with <Heart size={14} color="#ef4444" fill="#ef4444" /> using Java Spring Boot & React.js
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
