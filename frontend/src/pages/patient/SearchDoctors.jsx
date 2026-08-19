import React, { useState, useEffect } from 'react';
import { patientService } from '../../services/patientService';
import SlotPicker from '../../components/SlotPicker';
import { Search, Calendar, Stethoscope, Award, CheckCircle2, AlertCircle } from 'lucide-react';
import DoctorCard from '../../components/common/DoctorCard';
import DoctorProfile from '../../components/common/DoctorProfile';

const SearchDoctors = () => {
  const [doctors, setDoctors] = useState([]);
  const [specialization, setSpecialization] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedDoctor, setSelectedDoctor] = useState(null);
  const [viewDoctor, setViewDoctor] = useState(null);
  const [bookingDate, setBookingDate] = useState(new Date().toISOString().split('T')[0]);
  const [selectedTime, setSelectedTime] = useState('');
  const [symptoms, setSymptoms] = useState('');
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [bookedSlots, setBookedSlots] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    handleSearch();
  }, [specialization]);

  useEffect(() => {
    if (selectedDoctor && bookingDate) {
      fetchBookedSlots();
    }
  }, [selectedDoctor, bookingDate]);

  const fetchBookedSlots = async () => {
    try {
      const slots = await patientService.getBookedSlots(selectedDoctor.id, bookingDate);
      setBookedSlots(slots || []);
    } catch (err) {
      console.error('Error fetching booked slots:', err);
    }
  };

  const handleSearch = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await patientService.searchDoctors(specialization);
      setDoctors(data);
    } catch (err) {
      console.error('Error searching doctors:', err);
      setError('Unable to fetch doctors. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const filteredDoctors = doctors.filter(doc => 
    doc.fullName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleOpenBooking = (doctor) => {
    setSelectedDoctor(doctor);
    setSelectedTime('');
    setSymptoms('');
    setShowBookingModal(true);
  };

  const handleConfirmBooking = async (e) => {
    e.preventDefault();
    if (!selectedTime) {
      alert('Please select a time slot!');
      return;
    }
    try {
      await patientService.bookAppointment({
        doctorId: selectedDoctor.id,
        appointmentDate: bookingDate,
        appointmentTime: selectedTime,
        symptoms: symptoms
      });
      setShowBookingModal(false);
      alert('Appointment booked successfully!');
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to book appointment');
    }
  };

  return (
    <div className="page-wrapper">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1>Find Specialist Doctors</h1>
          <p style={{ color: 'var(--text-muted)' }}>Browse certified doctors by specialization and pick an instant time slot</p>
          
          {/* Search and Filters */}
          <div style={{ maxWidth: '800px', margin: '1.5rem auto 2.5rem', display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ flex: '1 1 300px', position: 'relative' }}>
              <Search style={{ position: 'absolute', left: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} size={20} />
              <input 
                type="text" 
                className="form-control" 
                placeholder="Search doctors by name..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ paddingLeft: '3rem' }}
              />
            </div>
            <select
              className="form-control"
              value={specialization}
              onChange={(e) => setSpecialization(e.target.value)}
              style={{ flex: '1 1 200px' }}
            >
              <option value="">All Specializations</option>
              <option value="Cardiology">Cardiology</option>
              <option value="Dermatology">Dermatology</option>
              <option value="Pediatrics">Pediatrics</option>
              <option value="Orthopedics">Orthopedics</option>
              <option value="Neurology">Neurology</option>
              <option value="General Medicine">General Medicine</option>
            </select>
          </div>
        </div>

        {/* Status States */}
        {loading && (
          <div style={{ textAlign: 'center', padding: '4rem' }}>
            <div className="spinner" style={{ margin: '0 auto', width: '40px', height: '40px', border: '4px solid #e2e8f0', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
            <p style={{ marginTop: '1rem', color: 'var(--text-muted)' }}>Loading doctors...</p>
          </div>
        )}

        {error && !loading && (
          <div className="glass-panel" style={{ textAlign: 'center', padding: '3rem', color: 'var(--danger)' }}>
            <AlertCircle size={40} style={{ margin: '0 auto' }} />
            <h3 style={{ marginTop: '1rem' }}>Oops!</h3>
            <p>{error}</p>
            <button className="btn btn-outline" onClick={handleSearch} style={{ marginTop: '1rem' }}>Try Again</button>
          </div>
        )}

        {/* Doctor Cards Grid */}
        {!loading && !error && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {filteredDoctors.length === 0 ? (
              <div className="glass-panel" style={{ gridColumn: '1 / -1', padding: '4rem', textAlign: 'center' }}>
                <Stethoscope size={48} color="#cbd5e1" style={{ margin: '0 auto' }} />
                <h3 style={{ marginTop: '1.5rem', color: 'var(--dark)' }}>No Doctors Found</h3>
                <p style={{ color: 'var(--text-muted)' }}>We couldn't find any doctors matching your criteria.</p>
                <button className="btn btn-primary" onClick={() => { setSearchTerm(''); setSpecialization(''); }} style={{ marginTop: '1rem' }}>Clear Filters</button>
              </div>
            ) : (
              filteredDoctors.map((doc) => (
                <DoctorCard 
                  key={doc.id} 
                  doctor={doc} 
                  onBook={handleOpenBooking} 
                  onViewProfile={setViewDoctor} 
                />
              ))
            )}
          </div>
        )}

        {/* Profile Modal */}
        <DoctorProfile 
          doctor={viewDoctor} 
          onClose={() => setViewDoctor(null)} 
          onBook={handleOpenBooking} 
        />

        {/* Booking Slot Modal */}
        {showBookingModal && selectedDoctor && (
          <div className="modal-overlay">
            <div className="modal-content">
              <h3>Book Appointment with Dr. {selectedDoctor.fullName}</h3>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '1.25rem' }}>
                Specialization: {selectedDoctor.specialization} | Fee: ₹{selectedDoctor.consultationFee}
              </p>

              <form onSubmit={handleConfirmBooking}>
                <div className="form-group">
                  <label>Select Date *</label>
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    className="form-control"
                    value={bookingDate}
                    onChange={(e) => setBookingDate(e.target.value)}
                  />
                </div>

                <div className="form-group">
                  <SlotPicker selectedTime={selectedTime} onSelectTime={setSelectedTime} bookedSlots={bookedSlots} />
                </div>

                <div className="form-group">
                  <label>Describe Symptoms / Reason for Visit</label>
                  <textarea
                    rows="3"
                    className="form-control"
                    placeholder="e.g. Mild headache and fever since 2 days..."
                    value={symptoms}
                    onChange={(e) => setSymptoms(e.target.value)}
                  ></textarea>
                </div>

                <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end', marginTop: '1.5rem' }}>
                  <button type="button" onClick={() => setShowBookingModal(false)} className="btn btn-outline">Cancel</button>
                  <button type="submit" className="btn btn-primary">Confirm Booking</button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
};

export default SearchDoctors;
