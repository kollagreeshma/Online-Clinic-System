import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { UserPlus, ShieldAlert, CheckCircle } from 'lucide-react';

const Register = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    age: '',
    gender: 'MALE',
    bloodGroup: 'O+',
    phone: '',
    address: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const { registerPatient, loading } = useAuth();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const extractErrorMessage = (err) => {
    if (err.response?.data) {
      if (typeof err.response.data === 'string') return err.response.data;
      if (err.response.data.message) return err.response.data.message;
      if (err.response.data.errors && typeof err.response.data.errors === 'object') {
        return Object.values(err.response.data.errors).join(', ');
      }
    }
    return err.message || 'Registration failed. Please check your inputs.';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match. Please re-enter your password.');
      return;
    }

    const parsedAge = parseInt(formData.age, 10);
    if (isNaN(parsedAge) || parsedAge < 1) {
      setError('Please enter a valid age greater than 0.');
      return;
    }

    try {
      const payload = {
        fullName: formData.fullName.trim(),
        email: formData.email.trim().toLowerCase(),
        password: formData.password,
        age: parsedAge,
        gender: formData.gender,
        bloodGroup: formData.bloodGroup || null,
        phone: formData.phone.trim(),
        address: formData.address ? formData.address.trim() : null
      };

      const res = await registerPatient(payload);
      setSuccess(res.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) {
      setError(extractErrorMessage(err));
    }
  };

  return (
    <div className="page-wrapper" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div className="glass-panel" style={{ width: '100%', maxWidth: '540px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
          <div style={{ background: 'var(--primary-light)', color: 'var(--primary)', width: '56px', height: '56px', borderRadius: '16px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
            <UserPlus size={28} />
          </div>
          <h2>Patient Self-Registration</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>Create an account to search doctors and book appointments</p>
        </div>

        {error && <div className="alert alert-danger" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><ShieldAlert size={18} /> {error}</div>}
        {success && <div className="alert alert-success" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><CheckCircle size={18} /> {success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Full Name *</label>
            <input type="text" name="fullName" required className="form-control" placeholder="John Doe" value={formData.fullName} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Email Address *</label>
            <input type="email" name="email" required className="form-control" placeholder="john@gmail.com" value={formData.email} onChange={handleChange} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Password *</label>
              <input type="password" name="password" required minLength="6" className="form-control" placeholder="••••••••" value={formData.password} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Confirm Password *</label>
              <input type="password" name="confirmPassword" required minLength="6" className="form-control" placeholder="••••••••" value={formData.confirmPassword} onChange={handleChange} />
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem' }}>
            <div className="form-group">
              <label>Age *</label>
              <input type="number" name="age" required min="1" className="form-control" placeholder="30" value={formData.age} onChange={handleChange} />
            </div>

            <div className="form-group">
              <label>Gender *</label>
              <select name="gender" className="form-control" value={formData.gender} onChange={handleChange}>
                <option value="MALE">Male</option>
                <option value="FEMALE">Female</option>
                <option value="OTHER">Other</option>
              </select>
            </div>

            <div className="form-group">
              <label>Blood Group</label>
              <select name="bloodGroup" className="form-control" value={formData.bloodGroup} onChange={handleChange}>
                {['O+', 'O-', 'A+', 'A-', 'B+', 'B-', 'AB+', 'AB-'].map(bg => (
                  <option key={bg} value={bg}>{bg}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="form-group">
            <label>Phone Number *</label>
            <input type="text" name="phone" required className="form-control" placeholder="9876543210" value={formData.phone} onChange={handleChange} />
          </div>

          <div className="form-group">
            <label>Address</label>
            <textarea name="address" rows="2" className="form-control" placeholder="Residential address..." value={formData.address} onChange={handleChange}></textarea>
          </div>

          <button type="submit" disabled={loading} className="btn btn-primary" style={{ width: '100%', padding: '0.8rem', marginTop: '1rem' }}>
            {loading ? 'Creating Account...' : 'Complete Registration'}
          </button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.9rem', color: 'var(--text-muted)' }}>
          Already have an account? <Link to="/login" style={{ color: 'var(--primary)', fontWeight: 600 }}>Sign In</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
