import React, { useState, useRef, useEffect } from 'react';
import CustomCalendar from '../common/CustomCalendar';

const AirportTransferForm = ({ routes, onSubmit, formatDisplayDate }) => {
  const [pickupInput, setPickupInput] = useState('');
  const [dropoffInput, setDropoffInput] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState('');

  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isDropoffOpen, setIsDropoffOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const calendarRef = useRef(null);
  const passengerRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (pickupRef.current && !pickupRef.current.contains(e.target)) setIsPickupOpen(false);
      if (dropoffRef.current && !dropoffRef.current.contains(e.target)) setIsDropoffOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setIsCalendarOpen(false);
      if (passengerRef.current && !passengerRef.current.contains(e.target)) setIsPassengerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniquePickupLocations = Array.from(new Set(routes.map((r) => r.pickup_location).filter(Boolean)));
  const availableDropoffLocations = Array.from(
    new Set(routes.filter((r) => !pickupInput || r.pickup_location === pickupInput).map((r) => r.dropoff_location).filter(Boolean))
  );

  const handleSelectPickup = (loc) => {
    setPickupInput(loc);
    setIsPickupOpen(false);
    const matching = routes.filter((r) => r.pickup_location === loc);
    setDropoffInput(matching.length > 0 ? matching[0].dropoff_location || '' : '');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ pickup: pickupInput, dropoff: dropoffInput, travelDate, passengers });
  };

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.2fr_1fr_auto] gap-3 items-center" onSubmit={handleSubmit}>
      {/* Pickup */}
      <div className="relative" ref={pickupRef}>
        <div onClick={() => setIsPickupOpen(!isPickupOpen)} className="border rounded-xl p-2.5 bg-white cursor-pointer border-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Lokasi Penjemputan</span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold truncate">{pickupInput || 'Pilih Penjemputan'}</span>
            <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
          </div>
        </div>
        {isPickupOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] max-h-56 overflow-y-auto">
            {uniquePickupLocations.map((loc, idx) => (
              <div key={idx} onClick={() => handleSelectPickup(loc)} className="px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-sky-50">
                {loc}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Dropoff */}
      <div className="relative" ref={dropoffRef}>
        <div onClick={() => setIsDropoffOpen(!isDropoffOpen)} className="border rounded-xl p-2.5 bg-white cursor-pointer border-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Lokasi Tujuan</span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold truncate">{dropoffInput || 'Pilih Tujuan'}</span>
            <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
          </div>
        </div>
        {isDropoffOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] max-h-56 overflow-y-auto">
            {availableDropoffLocations.map((loc, idx) => (
              <div key={idx} onClick={() => { setDropoffInput(loc); setIsDropoffOpen(false); }} className="px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-sky-50">
                {loc}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Tanggal */}
      <div className="relative" ref={calendarRef}>
        <div onClick={() => setIsCalendarOpen(!isCalendarOpen)} className="border rounded-xl p-2.5 bg-white cursor-pointer border-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Tanggal Perjalanan</span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold truncate">{travelDate ? formatDisplayDate(travelDate) : 'Pilih Tanggal'}</span>
            <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
          </div>
        </div>
        {isCalendarOpen && (
          <CustomCalendar selectedDate={travelDate} onSelectDate={setTravelDate} onClose={() => setIsCalendarOpen(false)} />
        )}
      </div>

      {/* Penumpang */}
      <div className="relative" ref={passengerRef}>
        <div onClick={() => setIsPassengerOpen(!isPassengerOpen)} className="border rounded-xl p-2.5 bg-white cursor-pointer border-slate-300">
          <span className="text-[10px] font-bold text-slate-500 uppercase">Jumlah Penumpang</span>
          <div className="flex items-center justify-between gap-2">
            <span className="text-xs sm:text-sm font-semibold truncate">{passengers ? `${passengers} Orang` : 'Pilih Penumpang'}</span>
            <i className="fa-solid fa-chevron-down text-slate-400 text-xs"></i>
          </div>
        </div>
        {isPassengerOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] py-1">
            {['1', '2', '3', '4'].map((num) => (
              <div key={num} onClick={() => { setPassengers(num); setIsPassengerOpen(false); }} className="px-3 py-2 text-xs font-semibold cursor-pointer hover:bg-sky-50">
                {num} Orang {num === '4' ? '(Maksimal)' : ''}
              </div>
            ))}
          </div>
        )}
      </div>

      <button type="submit" className="w-full lg:w-auto px-6 py-3 bg-[#0194F3] text-white font-bold text-sm rounded-xl hover:bg-blue-600">
        <i className="fa-solid fa-magnifying-glass mr-2"></i>Cari
      </button>
    </form>
  );
};

export default AirportTransferForm;
