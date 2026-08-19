import React from 'react';
import { Calendar, User, Award, Stethoscope, Clock } from 'lucide-react';

const DoctorCard = ({ doctor, onBook, onViewProfile }) => {
  // Safe fallback image system
  const defaultImage = `https://ui-avatars.com/api/?name=${encodeURIComponent(doctor.fullName)}&background=0284c7&color=fff&size=200`;

  return (
    <div className="doctor-card glass-card">
      <div className="doctor-card-header">
        <div className="doctor-image-wrapper">
          <img 
            src={doctor.imageUrl || defaultImage} 
            alt={`Dr. ${doctor.fullName}`}
            className="doctor-image"
            loading="lazy"
          />
        </div>
        <div className="doctor-info-basic">
          <h3 className="doctor-name">Dr. {doctor.fullName}</h3>
          <span className="badge badge-confirmed doctor-specialization">
            {doctor.specialization}
          </span>
        </div>
      </div>
      
      <div className="doctor-card-body">
        <div className="doctor-detail">
          <Award size={16} className="detail-icon" />
          <span>{doctor.qualification}</span>
        </div>
        <div className="doctor-detail">
          <Clock size={16} className="detail-icon" />
          <span>{doctor.experienceYears} Years Exp.</span>
        </div>
        <div className="doctor-detail fee-detail">
          <span className="fee-label">Consultation Fee</span>
          <span className="fee-amount">₹{doctor.consultationFee}</span>
        </div>
      </div>

      <div className="doctor-card-footer">
        <button onClick={() => onViewProfile(doctor)} className="btn btn-outline btn-sm">
          <User size={16} /> Profile
        </button>
        <button onClick={() => onBook(doctor)} className="btn btn-primary btn-sm">
          <Calendar size={16} /> Book
        </button>
      </div>
    </div>
  );
};

export default DoctorCard;
