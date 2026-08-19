import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Stethoscope, User, LogOut, LayoutDashboard, Calendar, Search, 
  Bot, Menu, X, Home as HomeIcon, Info, PhoneCall
} from 'lucide-react';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const openChatbot = () => {
    window.dispatchEvent(new Event('open-ocs-chatbot'));
    setMobileMenuOpen(false);
  };

  const getDashboardPath = () => {
    if (!user) return '/';
    if (user.role === 'ROLE_ADMIN') return '/admin';
    if (user.role === 'ROLE_DOCTOR') return '/doctor';
    return '/patient';
  };

  const scrollToSection = (id) => {
    setMobileMenuOpen(false);
    if (location.pathname !== '/') {
      navigate('/');
      setTimeout(() => {
        const el = document.getElementById(id);
        if (el) el.scrollIntoView({ behavior: 'smooth' });
      }, 100);
    } else {
      const el = document.getElementById(id);
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <header 
      style={{
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        background: scrolled ? 'rgba(255, 255, 255, 0.95)' : 'rgba(255, 255, 255, 0.85)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(226, 232, 240, 0.8)',
        boxShadow: scrolled ? '0 4px 20px rgba(0, 0, 0, 0.05)' : 'none',
        transition: 'all 0.3s ease'
      }}
    >
      <div className="container" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: '72px' }}>
        
        {/* Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', textDecoration: 'none' }}>
          <div style={{ background: 'linear-gradient(135deg, var(--primary) 0%, #0284c7 100%)', color: '#fff', padding: '0.5rem', borderRadius: '12px', display: 'flex', boxShadow: '0 4px 10px rgba(2, 132, 199, 0.3)' }}>
            <Stethoscope size={22} />
          </div>
          <span style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--dark)', letterSpacing: '-0.02em' }}>
            Online<span className="gradient-text">Clinic</span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '1.5rem' }} className="desktop-nav">
          <Link to="/" style={{ color: location.pathname === '/' ? 'var(--primary)' : 'var(--dark)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
            Home
          </Link>
          
          <Link to={user && user.role === 'ROLE_PATIENT' ? '/patient/search' : '/login'} style={{ color: location.pathname.includes('/search') ? 'var(--primary)' : 'var(--dark)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
            Doctors
          </Link>

          <Link to={user ? (user.role === 'ROLE_PATIENT' ? '/patient/appointments' : getDashboardPath()) : '/login'} style={{ color: location.pathname.includes('/appointments') ? 'var(--primary)' : 'var(--dark)', fontWeight: 600, textDecoration: 'none', fontSize: '0.95rem', transition: 'color 0.2s' }}>
            Appointments
          </Link>

          <button onClick={() => scrollToSection('why-choose-ocs')} style={{ background: 'none', border: 'none', color: 'var(--dark)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}>
            About
          </button>

          <button onClick={() => scrollToSection('contact-footer')} style={{ background: 'none', border: 'none', color: 'var(--dark)', fontWeight: 600, fontSize: '0.95rem', cursor: 'pointer', transition: 'color 0.2s' }}>
            Contact
          </button>

          <button onClick={openChatbot} style={{ background: 'var(--primary-light)', border: '1px solid rgba(2, 132, 199, 0.2)', color: 'var(--primary)', fontWeight: 600, padding: '0.4rem 0.85rem', borderRadius: '20px', fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.4rem', transition: 'all 0.2s' }}>
            <Bot size={16} /> AI Assistant
          </button>
        </nav>

        {/* User Status / Actions */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }} className="desktop-nav-auth">
          {user ? (
            <>
              <Link to={getDashboardPath()} className="btn btn-outline btn-sm">
                <LayoutDashboard size={16} /> Dashboard
              </Link>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f1f5f9', padding: '0.35rem 0.85rem', borderRadius: '20px', border: '1px solid #e2e8f0' }}>
                <User size={15} color="var(--primary)" />
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--dark)', maxWidth: '120px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{user.fullName}</span>
                <span className="badge badge-confirmed" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>{user.role ? user.role.replace('ROLE_', '') : 'USER'}</span>
              </div>

              <button onClick={handleLogout} className="btn btn-danger btn-sm" title="Logout">
                <LogOut size={16} />
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="btn btn-outline btn-sm" style={{ padding: '0.55rem 1.1rem' }}>Login</Link>
              <Link to="/register" className="btn btn-primary btn-sm" style={{ padding: '0.55rem 1.1rem' }}>Register Patient</Link>
            </>
          )}
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
          style={{
            display: 'none',
            background: 'none',
            border: 'none',
            color: 'var(--dark)',
            padding: '0.5rem',
            cursor: 'pointer'
          }}
        >
          {mobileMenuOpen ? <X size={26} /> : <Menu size={26} />}
        </button>

      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div 
          className="mobile-menu-dropdown"
          style={{
            background: '#ffffff',
            borderBottom: '1px solid #e2e8f0',
            padding: '1.25rem 1.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '1rem',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.1)'
          }}
        >
          <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--dark)', fontWeight: 600 }}>
            <HomeIcon size={18} color="var(--primary)" /> Home
          </Link>

          <Link to={user && user.role === 'ROLE_PATIENT' ? '/patient/search' : '/login'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--dark)', fontWeight: 600 }}>
            <Search size={18} color="var(--primary)" /> Doctors Directory
          </Link>

          <Link to={user ? (user.role === 'ROLE_PATIENT' ? '/patient/appointments' : getDashboardPath()) : '/login'} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none', color: 'var(--dark)', fontWeight: 600 }}>
            <Calendar size={18} color="var(--primary)" /> Appointments
          </Link>

          <button onClick={() => scrollToSection('why-choose-ocs')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', textDecoration: 'none', color: 'var(--dark)', fontWeight: 600, padding: 0, textAlign: 'left', cursor: 'pointer' }}>
            <Info size={18} color="var(--primary)" /> About OCS
          </button>

          <button onClick={() => scrollToSection('contact-footer')} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', background: 'none', border: 'none', textDecoration: 'none', color: 'var(--dark)', fontWeight: 600, padding: 0, textAlign: 'left', cursor: 'pointer' }}>
            <PhoneCall size={18} color="var(--primary)" /> Contact
          </button>

          <button onClick={openChatbot} className="btn btn-outline btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
            <Bot size={18} /> Ask AI Assistant
          </button>

          <hr style={{ border: 'none', borderTop: '1px solid #f1f5f9', margin: '0.5rem 0' }} />

          {user ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={{ fontWeight: 700, color: 'var(--dark)' }}>{user.fullName}</span>
                <span className="badge badge-confirmed">{user.role ? user.role.replace('ROLE_', '') : 'USER'}</span>
              </div>
              <Link to={getDashboardPath()} className="btn btn-primary btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <LayoutDashboard size={16} /> Go to Dashboard
              </Link>
              <button onClick={handleLogout} className="btn btn-danger btn-sm" style={{ width: '100%', justifyContent: 'center' }}>
                <LogOut size={16} /> Logout
              </button>
            </div>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <Link to="/login" className="btn btn-outline" style={{ justifyContent: 'center' }}>Login</Link>
              <Link to="/register" className="btn btn-primary" style={{ justifyContent: 'center' }}>Register</Link>
            </div>
          )}
        </div>
      )}
    </header>
  );
};

export default Navbar;
