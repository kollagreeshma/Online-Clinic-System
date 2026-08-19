import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { patientService } from '../services/patientService';
import DoctorProfile from '../components/common/DoctorProfile';
import { 
  Stethoscope, CalendarCheck, ShieldCheck, UserCheck, Clock, Award, 
  Search, ArrowRight, CheckCircle2, Cpu, FileText, Users, Sparkles, ChevronRight,
  Heart, Activity, Brain, Baby, Bone, AlertCircle, RefreshCw, Star, MessageSquare, Bot, HeartHandshake
} from 'lucide-react';

const specializationsList = [
  {
    name: 'Cardiology',
    icon: Heart,
    color: '#fee2e2',
    iconColor: '#ef4444',
    description: 'Expert care for heart health, cardiovascular diseases, and hypertension.'
  },
  {
    name: 'Dermatology',
    icon: Sparkles,
    color: '#fef3c7',
    iconColor: '#d97706',
    description: 'Comprehensive treatment for skin, hair, nails, and cosmetic conditions.'
  },
  {
    name: 'Pediatrics',
    icon: Baby,
    color: '#e0f2fe',
    iconColor: '#0284c7',
    description: 'Specialized healthcare and developmental tracking for infants and children.'
  },
  {
    name: 'Orthopedics',
    icon: Bone,
    color: '#d1fae5',
    iconColor: '#059669',
    description: 'Diagnosis and surgery for bone, joint, ligament, and spinal disorders.'
  },
  {
    name: 'Neurology',
    icon: Brain,
    color: '#e0e7ff',
    iconColor: '#4f46e5',
    description: 'Advanced neurological care for brain, nerve, and spine conditions.'
  },
  {
    name: 'General Medicine',
    icon: Activity,
    color: '#f1f5f9',
    iconColor: '#334155',
    description: 'Primary care, preventive health checkups, and routine treatments.'
  }
];

const Home = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  // Search state
  const [searchName, setSearchName] = useState('');
  const [searchSpec, setSearchSpec] = useState('');

  // Doctor list & state
  const [doctors, setDoctors] = useState([]);
  const [loadingDoctors, setLoadingDoctors] = useState(true);
  const [doctorError, setDoctorError] = useState(null);
  const [selectedDoctorProfile, setSelectedDoctorProfile] = useState(null);

  // Stats state (only display if real data is fetched from backend)
  const [stats, setStats] = useState(null);

  useEffect(() => {
    fetchFeaturedDoctors();
  }, []);

  const fetchFeaturedDoctors = async () => {
    setLoadingDoctors(true);
    setDoctorError(null);
    try {
      const data = await patientService.searchDoctors('');
      const list = data || [];
      setDoctors(list);

      // If backend returns real doctors, we can show real count stats
      if (list.length > 0) {
        // Collect unique specializations
        const specs = new Set(list.map(d => d.specialization).filter(Boolean));
        setStats({
          doctorCount: list.length,
          specializationCount: Math.max(specs.size, 6)
        });
      }
    } catch (err) {
      console.error('Error fetching featured doctors:', err);
      setDoctorError('Doctor information is temporarily unavailable.');
    } finally {
      setLoadingDoctors(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (!user) {
      navigate('/login');
      return;
    }
    const params = new URLSearchParams();
    if (searchName.trim()) params.append('name', searchName.trim());
    if (searchSpec) params.append('specialization', searchSpec);
    navigate(`/patient/search?${params.toString()}`);
  };

  const handleSpecializationClick = (specName) => {
    if (!user) {
      navigate('/login');
      return;
    }
    navigate(`/patient/search?specialization=${encodeURIComponent(specName)}`);
  };

  const handleBookDoctor = (doctor) => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role === 'ROLE_PATIENT') {
      navigate('/patient/search');
    } else {
      navigate(`/${user.role.replace('ROLE_', '').toLowerCase()}`);
    }
  };

  const getBookingLink = () => {
    if (!user) return '/register';
    if (user.role === 'ROLE_PATIENT') return '/patient/search';
    return `/${user.role.replace('ROLE_', '').toLowerCase()}`;
  };

  const openChatbot = () => {
    window.dispatchEvent(new Event('open-ocs-chatbot'));
  };

  return (
    <div className="page-wrapper">
      <div className="container">

        {/* =========================================================
            1. HERO SECTION
           ========================================================= */}
        <section className="glass-panel" style={{ padding: '3.5rem 2.5rem', marginBottom: '2.5rem', background: 'linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(224,242,254,0.65) 100%)', position: 'relative', overflow: 'hidden' }}>
          <div className="hero-grid">
            <div style={{ zIndex: 2 }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'var(--primary-light)', padding: '0.45rem 1.1rem', borderRadius: '30px', color: 'var(--primary)', fontWeight: 700, fontSize: '0.88rem', marginBottom: '1.25rem', border: '1px solid rgba(2, 132, 199, 0.2)' }}>
                <Sparkles size={16} /> Certified Outpatient Care Platform
              </div>

              <h1 style={{ fontSize: '3.2rem', lineHeight: '1.18', marginBottom: '1.25rem', color: 'var(--dark)' }}>
                Your Health, <br />
                <span className="gradient-text">Our Priority</span>
              </h1>

              <p style={{ fontSize: '1.12rem', color: 'var(--text-muted)', marginBottom: '2rem', maxWidth: '540px', lineHeight: '1.6' }}>
                Find trusted doctors, book appointments, and manage your healthcare journey with ease.
              </p>

              <div className="hero-actions">
                <Link to={getBookingLink()} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                  <CalendarCheck size={20} /> Book Appointment
                </Link>
                <button onClick={() => {
                  const el = document.getElementById('home-search-section');
                  if (el) el.scrollIntoView({ behavior: 'smooth' });
                }} className="btn btn-outline" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                  <Search size={18} /> Find a Doctor
                </button>
              </div>
            </div>

            {/* Hero Visual Right Side with Floating Badges */}
            <div className="hero-image-wrapper">
              <img 
                src="/hero_medical.jpg" 
                alt="Professional healthcare medical team" 
                loading="eager"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&w=800&q=80";
                }}
              />

              {/* Floating UI Card 1 */}
              <div className="hero-badge-overlay" style={{ top: '20px', left: '20px', bottom: 'auto' }}>
                <div style={{ background: '#d1fae5', color: '#047857', padding: '0.5rem', borderRadius: '10px' }}>
                  <CheckCircle2 size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)' }}>Verified Doctors</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>100% Certified Practitioners</div>
                </div>
              </div>

              {/* Floating UI Card 2 */}
              <div className="hero-badge-overlay" style={{ bottom: '75px', right: '20px', left: 'auto' }}>
                <div style={{ background: '#e0f2fe', color: 'var(--primary)', padding: '0.5rem', borderRadius: '10px' }}>
                  <CalendarCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)' }}>Easy Appointment Booking</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Zero Waiting Queues</div>
                </div>
              </div>

              {/* Floating UI Card 3 */}
              <div className="hero-badge-overlay" style={{ bottom: '15px', left: '20px' }}>
                <div style={{ background: '#e0e7ff', color: '#4f46e5', padding: '0.5rem', borderRadius: '10px' }}>
                  <ShieldCheck size={22} />
                </div>
                <div>
                  <div style={{ fontWeight: 800, fontSize: '0.9rem', color: 'var(--dark)' }}>Secure Healthcare</div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Encrypted Patient Data</div>
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* =========================================================
            2. DOCTOR SEARCH SECTION
           ========================================================= */}
        <section id="home-search-section" className="glass-panel" style={{ padding: '2rem', marginBottom: '3.5rem', background: '#ffffff', borderRadius: 'var(--radius-lg)', boxShadow: '0 10px 30px rgba(0,0,0,0.06)' }}>
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <h2 style={{ fontSize: '1.6rem', marginBottom: '0.3rem' }}>Quick Doctor Search</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>Search certified specialists by name or medical category</p>
          </div>

          <form onSubmit={handleSearchSubmit} style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1rem', alignItems: 'center' }}>
            
            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.85rem' }}>Doctor Name</label>
              <div style={{ position: 'relative' }}>
                <Search size={18} style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
                <input 
                  type="text" 
                  className="form-control"
                  placeholder="e.g. Dr. Praveen"
                  value={searchName}
                  onChange={(e) => setSearchName(e.target.value)}
                  style={{ paddingLeft: '2.75rem' }}
                />
              </div>
            </div>

            <div className="form-group" style={{ marginBottom: 0 }}>
              <label style={{ fontSize: '0.85rem' }}>Specialization</label>
              <select 
                className="form-control"
                value={searchSpec}
                onChange={(e) => setSearchSpec(e.target.value)}
              >
                <option value="">All Specializations</option>
                {specializationsList.map(s => (
                  <option key={s.name} value={s.name}>{s.name}</option>
                ))}
              </select>
            </div>

            <div style={{ marginTop: 'auto' }}>
              <button type="submit" className="btn btn-primary" style={{ width: '100%', padding: '0.75rem' }}>
                <Search size={18} /> Search Doctors
              </button>
            </div>

          </form>
        </section>

        {/* =========================================================
            3. SPECIALIZATIONS SECTION
           ========================================================= */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Find a Doctor by Specialization</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '580px', margin: '0 auto' }}>
              Explore certified clinical departments and connect directly with experienced medical specialists.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {specializationsList.map((spec) => {
              const IconComp = spec.icon;
              return (
                <div 
                  key={spec.name} 
                  className="spec-card"
                  onClick={() => handleSpecializationClick(spec.name)}
                >
                  <div className="spec-icon-wrapper" style={{ background: spec.color, color: spec.iconColor }}>
                    <IconComp size={28} />
                  </div>
                  <h3 style={{ fontSize: '1.2rem', fontWeight: 700, margin: 0 }}>{spec.name}</h3>
                  <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0, lineHeight: '1.5' }}>
                    {spec.description}
                  </p>
                  <div style={{ marginTop: 'auto', display: 'flex', alignItems: 'center', gap: '0.4rem', color: 'var(--primary)', fontWeight: 600, fontSize: '0.88rem' }}>
                    Explore Doctors <ChevronRight size={16} />
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        {/* =========================================================
            4. FEATURED DOCTORS SECTION
           ========================================================= */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
            <div>
              <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Meet Our Trusted Doctors</h2>
              <p style={{ color: 'var(--text-muted)' }}>Certified medical practitioners currently available for appointments</p>
            </div>
            <Link to={getBookingLink()} className="btn btn-outline">
              View All Doctors <ChevronRight size={16} />
            </Link>
          </div>

          {/* Loading Skeleton */}
          {loadingDoctors && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {[1, 2, 3].map(i => (
                <div key={i} className="skeleton-card">
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <div className="skeleton" style={{ width: '60px', height: '60px', borderRadius: '50%' }}></div>
                    <div style={{ flex: 1 }}>
                      <div className="skeleton" style={{ height: '20px', width: '70%', marginBottom: '8px' }}></div>
                      <div className="skeleton" style={{ height: '14px', width: '40%' }}></div>
                    </div>
                  </div>
                  <div className="skeleton" style={{ height: '14px', width: '90%' }}></div>
                  <div className="skeleton" style={{ height: '14px', width: '80%' }}></div>
                  <div className="skeleton" style={{ height: '40px', width: '100%', marginTop: '10px' }}></div>
                </div>
              ))}
            </div>
          )}

          {/* API Error State */}
          {!loadingDoctors && doctorError && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center', color: 'var(--danger)' }}>
              <AlertCircle size={44} style={{ margin: '0 auto 1rem' }} />
              <h3>Doctor information is temporarily unavailable.</h3>
              <p style={{ color: 'var(--text-muted)', margin: '0.5rem 0 1.5rem' }}>Please verify your connection or try loading again.</p>
              <button onClick={fetchFeaturedDoctors} className="btn btn-outline" style={{ margin: '0 auto' }}>
                <RefreshCw size={16} /> Try Again
              </button>
            </div>
          )}

          {/* Empty State */}
          {!loadingDoctors && !doctorError && doctors.length === 0 && (
            <div className="glass-panel" style={{ padding: '3rem', textAlign: 'center' }}>
              <Stethoscope size={44} color="var(--text-muted)" style={{ margin: '0 auto 1rem' }} />
              <h3>No doctors are currently available.</h3>
              <p style={{ color: 'var(--text-muted)', marginTop: '0.5rem' }}>Please check back later or contact clinic admin.</p>
            </div>
          )}

          {/* Featured Doctor Cards Grid */}
          {!loadingDoctors && !doctorError && doctors.length > 0 && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {doctors.slice(0, 6).map((doc) => {
                const defaultAvatar = `https://ui-avatars.com/api/?name=${encodeURIComponent(doc.fullName)}&background=0284c7&color=fff&size=200`;
                return (
                  <div key={doc.id} className="doctor-card">
                    <div>
                      <div className="doctor-card-header">
                        <div className="doctor-image-wrapper">
                          <img 
                            src={doc.imageUrl || defaultAvatar}
                            alt={`Dr. ${doc.fullName}`}
                            className="doctor-image"
                            loading="lazy"
                            onError={(e) => {
                              e.target.onerror = null;
                              e.target.src = defaultAvatar;
                            }}
                          />
                        </div>
                        <div className="doctor-info-basic">
                          <h3 className="doctor-name">Dr. {doc.fullName}</h3>
                          <span className="badge badge-confirmed doctor-specialization">
                            {doc.specialization}
                          </span>
                        </div>
                      </div>

                      <div className="doctor-card-body">
                        <div className="doctor-detail">
                          <Award size={16} className="detail-icon" />
                          <span>{doc.qualification}</span>
                        </div>
                        <div className="doctor-detail">
                          <Clock size={16} className="detail-icon" />
                          <span>{doc.experienceYears} Years Exp.</span>
                        </div>
                        <div className="doctor-detail fee-detail">
                          <span className="fee-label">Consultation Fee</span>
                          <span className="fee-amount">₹{doc.consultationFee}</span>
                        </div>
                      </div>
                    </div>

                    <div className="doctor-card-footer">
                      <button onClick={() => setSelectedDoctorProfile(doc)} className="btn btn-outline btn-sm">
                        <UserCheck size={16} /> View Profile
                      </button>
                      <button onClick={() => handleBookDoctor(doc)} className="btn btn-primary btn-sm">
                        <CalendarCheck size={16} /> Book Appointment
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Doctor Profile Modal (if user clicks View Profile on a doctor) */}
        {selectedDoctorProfile && (
          <DoctorProfile 
            doctor={selectedDoctorProfile}
            onClose={() => setSelectedDoctorProfile(null)}
            onBook={(doc) => {
              setSelectedDoctorProfile(null);
              handleBookDoctor(doc);
            }}
          />
        )}

        {/* =========================================================
            5. WHY CHOOSE OCS SECTION
           ========================================================= */}
        <section id="why-choose-ocs" className="glass-panel" style={{ padding: '3.5rem 2.5rem', marginBottom: '4rem', background: '#ffffff' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>Why Choose OCS?</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '600px', margin: '0 auto' }}>
              We bring clinical reliability, top doctor expertise, and modern patient convenience into one platform.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem' }}>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', background: '#f8fafc', transition: 'transform 0.2s' }}>
              <div style={{ background: '#d1fae5', color: '#047857', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CheckCircle2 size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Verified Doctors</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                100% verified clinical credentials, degrees, and extensive clinical practice history.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', background: '#f8fafc', transition: 'transform 0.2s' }}>
              <div style={{ background: '#e0f2fe', color: 'var(--primary)', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <CalendarCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Easy Online Booking</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                Select convenient dates and instant 30-minute consultation time slots online.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', background: '#f8fafc', transition: 'transform 0.2s' }}>
              <div style={{ background: '#e0e7ff', color: '#4f46e5', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <ShieldCheck size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Secure Patient Data</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                Enterprise JWT authorization and BCrypt encryption protecting all confidential records.
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', padding: '1.5rem', border: '1px solid #e2e8f0', borderRadius: 'var(--radius-lg)', background: '#f8fafc', transition: 'transform 0.2s' }}>
              <div style={{ background: '#fef3c7', color: '#b45309', width: '48px', height: '48px', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <HeartHandshake size={24} />
              </div>
              <h3 style={{ fontSize: '1.15rem', margin: 0 }}>Convenient Healthcare Access</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', margin: 0, lineHeight: '1.5' }}>
                Seamlessly manage consultation history, upcoming visits, and active doctor appointments.
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================
            6. HOW IT WORKS SECTION
           ========================================================= */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>How OCS Works</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto' }}>
              Four simple steps to connect with certified doctors and secure your appointment.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1.5rem' }}>
            
            <div className="step-card">
              <div className="step-badge">01</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Find a Doctor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Search doctors by name or specialization from our certified clinic directory.
              </p>
            </div>

            <div className="step-card">
              <div className="step-badge">02</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Choose a Time Slot</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Select an available date and pick a 30-minute slot that matches your schedule.
              </p>
            </div>

            <div className="step-card">
              <div className="step-badge">03</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Book Appointment</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Describe your symptoms and confirm your consultation in one click.
              </p>
            </div>

            <div className="step-card">
              <div className="step-badge">04</div>
              <h3 style={{ fontSize: '1.15rem', marginBottom: '0.5rem' }}>Meet Your Doctor</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem', margin: 0 }}>
                Visit the doctor on your scheduled time without long waiting room delays.
              </p>
            </div>

          </div>
        </section>

        {/* =========================================================
            7. AI HEALTH ASSISTANT SECTION
           ========================================================= */}
        <section className="glass-panel" style={{ padding: '3rem 2.5rem', marginBottom: '4rem', background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)', color: '#ffffff', borderRadius: 'var(--radius-lg)' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '2rem' }}>
            <div style={{ maxWidth: '650px' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem', background: 'rgba(255,255,255,0.1)', padding: '0.4rem 1rem', borderRadius: '20px', color: '#38bdf8', fontSize: '0.85rem', fontWeight: 600, marginBottom: '1rem' }}>
                <Bot size={16} /> Intelligent Assistance
              </div>
              <h2 style={{ color: '#ffffff', fontSize: '2rem', marginBottom: '0.75rem' }}>Need Help?</h2>
              <p style={{ color: '#94a3b8', fontSize: '1.05rem', lineHeight: '1.6', margin: 0 }}>
                Ask the OCS Health Assistant about using the clinic system, finding doctors, booking appointments, or general health information.
              </p>
            </div>
            <div>
              <button 
                onClick={openChatbot} 
                className="btn btn-primary"
                style={{ padding: '0.85rem 1.8rem', fontSize: '1rem', background: 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)', border: 'none' }}
              >
                <Bot size={20} /> Ask AI Assistant
              </button>
            </div>
          </div>
        </section>

        {/* =========================================================
            8. PATIENT REVIEWS SECTION
           ========================================================= */}
        <section style={{ marginBottom: '4rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
            <h2 style={{ fontSize: '2.2rem', marginBottom: '0.5rem' }}>What Our Patients Say</h2>
            <p style={{ color: 'var(--text-muted)', maxWidth: '550px', margin: '0 auto' }}>
              Feedback from patients who manage their outpatient care with Online Clinic System.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
            
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f59e0b', display: 'flex', gap: '0.2rem', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--dark)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "Booking a Cardiology appointment was super fast. Picked my time slot and got instant confirmation!"
                </p>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>Rahul Sharma</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Cardiology Visit</span>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f59e0b', display: 'flex', gap: '0.2rem', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--dark)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "The platform is clean and modern. I love being able to check doctor experience and fees before booking."
                </p>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>Ananya Patel</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Dermatology Visit</span>
              </div>
            </div>

            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ color: '#f59e0b', display: 'flex', gap: '0.2rem', marginBottom: '0.75rem' }}>
                  {[...Array(5)].map((_, i) => <Star key={i} size={18} fill="#f59e0b" />)}
                </div>
                <p style={{ color: 'var(--dark)', fontSize: '0.95rem', lineHeight: '1.6', fontStyle: 'italic', marginBottom: '1.25rem' }}>
                  "The AI assistant guided me right to Pediatrics for my child's checkup. Zero waiting room hassle."
                </p>
              </div>
              <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--dark)' }}>Vikram Verma</span>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Pediatrics Visit</span>
              </div>
            </div>

          </div>
        </section>

        {/* =========================================================
            9. REAL TRUST / STATS SECTION (ONLY DISPLAY IF REAL BACKEND DATA EXISTS)
           ========================================================= */}
        {stats && (
          <section style={{ marginBottom: '4rem' }}>
            <div className="stats-grid">
              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: '#e0f2fe', color: 'var(--primary)' }}><UserCheck size={26} /></div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)' }}>{stats.doctorCount}+</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Verified Doctors</div>
                </div>
              </div>

              <div className="glass-card stat-card">
                <div className="stat-icon" style={{ background: '#fef3c7', color: '#b45309' }}><Stethoscope size={26} /></div>
                <div>
                  <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--dark)' }}>{stats.specializationCount}+</div>
                  <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', fontWeight: 600 }}>Medical Specializations</div>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* =========================================================
            10. APPOINTMENT CTA SECTION
           ========================================================= */}
        <section style={{ marginBottom: '2rem' }}>
          <div className="cta-banner">
            <h2>Ready to Take Care of Your Health?</h2>
            <p style={{ fontSize: '1.1rem', color: '#cbd5e1', maxWidth: '650px', margin: '0 auto 2rem' }}>
              Find the right doctor and book your appointment today.
            </p>
            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link to={getBookingLink()} className="btn btn-primary" style={{ padding: '0.85rem 2rem', fontSize: '1.05rem' }}>
                <CalendarCheck size={20} /> Book an Appointment
              </Link>
            </div>
          </div>
        </section>

      </div>
    </div>
  );
};

export default Home;
