import React from 'react';

const defaultSlots = [
  '09:00:00', '09:30:00', '10:00:00', '10:30:00',
  '11:00:00', '11:30:00', '14:00:00', '14:30:00',
  '15:00:00', '15:30:00', '16:00:00', '16:30:00'
];

const SlotPicker = ({ selectedTime, onSelectTime, bookedSlots = [] }) => {
  return (
    <div>
      <label style={{ fontWeight: 600, display: 'block', marginBottom: '0.5rem', fontSize: '0.9rem' }}>
        Select Available Time Slot:
      </label>
      <div className="slot-grid">
        {defaultSlots.map((slot) => {
          const isBooked = bookedSlots.includes(slot);
          const isSelected = selectedTime === slot;
          const formatDisplay = slot.substring(0, 5);

          return (
            <button
              key={slot}
              type="button"
              disabled={isBooked}
              className={`slot-btn ${isSelected ? 'selected' : ''}`}
              style={{
                opacity: isBooked ? 0.4 : 1,
                cursor: isBooked ? 'not-allowed' : 'pointer',
                textDecoration: isBooked ? 'line-through' : 'none'
              }}
              onClick={() => onSelectTime(slot)}
            >
              {formatDisplay}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default SlotPicker;
