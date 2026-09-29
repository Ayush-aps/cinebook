import { useState, useEffect } from 'react';

const SeatGrid = ({ rows = 8, cols = 10, selectedSeats = [], onSeatSelect, seatStatus }) => {

  const [seats, setSeats] = useState([]);

  useEffect(() => {
    const generatedSeats = [];
    for (let row = 0; row < rows; row++) {
      const rowSeats = [];
      for (let col = 0; col < cols; col++) {
        const seatId = `${String.fromCharCode(65 + row)}${col + 1}`;
        const status = seatStatus[seatId] || 'available';
        rowSeats.push({
          id: seatId,
          row: String.fromCharCode(65 + row),
          number: col + 1,
          status: status
        });
      }
      generatedSeats.push(rowSeats);
    }
    setSeats(generatedSeats);
  }, [rows, cols, seatStatus]);

  const getSeatClass = (status, isSelected) => {
    if (isSelected) return 'selected';
    return status;
  };

  const handleSeatClick = (seat) => {
    if (seat.status === 'available' || seat.status === 'hold') {
      onSeatSelect(seat.id);
    }
  };

  return (
    <div className="fade-in">
      {/* Screen */}
      <div className="text-center mb-5">
        <div className="mx-auto bg-dark bg-gradient rounded-top" style={{ width: '80%', height: '20px' }}></div>
        <div className="text-muted fw-bold mt-2">SCREEN THIS WAY</div>
      </div>

      {/* Seat Grid */}
      <div className="mb-4">
        {seats.map((rowSeats, rowIndex) => (
          <div key={rowIndex} className="d-flex justify-content-center align-items-center mb-2 position-relative">
            <div className="fw-bold text-primary me-3" style={{ width: '30px' }}>
              {String.fromCharCode(65 + rowIndex)}
            </div>
            <div className="d-flex gap-2">
              {rowSeats.map((seat) => {
                const isSelected = selectedSeats.includes(seat.id);
                const seatLabel = seat.status && typeof seat.status === 'string' 
                  ? seat.status.charAt(0).toUpperCase() + seat.status.slice(1) 
                  : 'Unknown';
                return (
                  <button
                    key={seat.id}
                    onClick={() => handleSeatClick(seat)}
                    disabled={seat.status === 'booked'}
                    className={`seat ${getSeatClass(seat.status, isSelected)}`}
                    title={`${seat.id} - ${seatLabel}`}
                  >
                    {seat.number}
                    {isSelected && (
                      <i className="bi bi-check-circle-fill position-absolute" style={{ top: '-5px', right: '-5px', fontSize: '12px' }}></i>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="d-flex align-items-center">
            <div className="seat available me-2"></div>
            <small className="text-muted">Available</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="d-flex align-items-center">
            <div className="seat selected me-2"></div>
            <small className="text-muted">Selected</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="d-flex align-items-center">
            <div className="seat booked me-2"></div>
            <small className="text-muted">Booked</small>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="d-flex align-items-center">
            <div className="seat hold me-2"></div>
            <small className="text-muted">Hold (2 min)</small>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SeatGrid;
