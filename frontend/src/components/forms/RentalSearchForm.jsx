import React, { useState, useRef, useEffect } from 'react';
import CustomCalendar from '../common/CustomCalendar';

const CarRentalForm = ({ routes = [], onSubmit, formatDisplayDate }) => {
  const [rentalLocation, setRentalLocation] = useState('');
  const [rentalStartDate, setRentalStartDate] = useState('');
  const [rentalDuration, setRentalDuration] = useState('');

  const [isRentalLocOpen, setIsRentalLocOpen] = useState(false);
  const [isRentalCalOpen, setIsRentalCalOpen] = useState(false);
  const [isRentalDurOpen, setIsRentalDurOpen] = useState(false);

  const rentalLocRef = useRef(null);
  const rentalCalRef = useRef(null);
  const rentalDurRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (rentalLocRef.current && !rentalLocRef.current.contains(e.target)) setIsRentalLocOpen(false);
      if (rentalCalRef.current && !rentalCalRef.current.contains(e.target)) setIsRentalCalOpen(false);
      if (rentalDurRef.current && !rentalDurRef.current.contains(e.target)) setIsRentalDurOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const uniqueLocations = Array.from(
    new Set(routes.map((r) => r.pickup_location).filter(Boolean))
  );

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit({ location: rentalLocation, startDate: rentalStartDate, duration: rentalDuration });
  };

  return (
    <form className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-[2fr_1.5fr_1.5fr_auto] gap-3 items-center" onSubmit={handleSubmit}>
      {/* Lokasi Rental Dropdown */}
      <div className="relative" ref={rentalLocRef}>
        <div
          onClick={() => {
            setIsRentalLocOpen(!isRentalLocOpen);
            setIsRentalCalOpen(false);
            setIsRentalDurOpen(false);
          }}
          className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
            isRentalLocOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Lokasi Rental
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <i className="fa-solid fa-location-dot text-[#0194F3] text-sm shrink-0"></i>
              <span className={`text-xs sm:text-sm font-semibold truncate ${rentalLocation ? 'text-slate-900' : 'text-slate-400'}`}>
                {rentalLocation || 'Pilih Lokasi Rental'}
              </span>
            </div>
            <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isRentalLocOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
          </div>
        </div>

        {isRentalLocOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden animate-in fade-in duration-150">
            <div className="max-h-56 overflow-y-auto py-1">
              {uniqueLocations.length > 0 ? (
                uniqueLocations.map((loc, idx) => (
                  <div
                    key={idx}
                    onClick={() => { setRentalLocation(loc); setIsRentalLocOpen(false); }}
                    className={`px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                      rentalLocation === loc ? 'text-[#0194F3] bg-sky-50/50 font-bold' : 'text-slate-700'
                    }`}
                  >
                    <span>{loc}</span>
                    {rentalLocation === loc && <i className="fa-solid fa-check text-xs"></i>}
                  </div>
                ))
              ) : (
                <div className="px-3 py-3 text-xs text-slate-400 text-center">Tidak ada lokasi tersedia</div>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Tanggal Rental Dropdown */}
      <div className="relative" ref={rentalCalRef}>
        <div
          onClick={() => {
            setIsRentalCalOpen(!isRentalCalOpen);
            setIsRentalLocOpen(false);
            setIsRentalDurOpen(false);
          }}
          className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
            isRentalCalOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Tanggal Mulai Rental
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <i className="fa-solid fa-calendar-days text-[#0194F3] text-sm shrink-0"></i>
              <span className={`text-xs sm:text-sm font-semibold truncate ${rentalStartDate ? 'text-slate-900' : 'text-slate-400'}`}>
                {rentalStartDate ? formatDisplayDate(rentalStartDate) : 'Pilih Tanggal'}
              </span>
            </div>
            <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isRentalCalOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
          </div>
        </div>

        {isRentalCalOpen && (
          <CustomCalendar
            selectedDate={rentalStartDate}
            onSelectDate={setRentalStartDate}
            onClose={() => setIsRentalCalOpen(false)}
          />
        )}
      </div>

      {/* Durasi Dropdown */}
      <div className="relative" ref={rentalDurRef}>
        <div
          onClick={() => {
            setIsRentalDurOpen(!isRentalDurOpen);
            setIsRentalLocOpen(false);
            setIsRentalCalOpen(false);
          }}
          className={`border rounded-xl p-2.5 bg-white flex flex-col cursor-pointer transition-all ${
            isRentalDurOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            Durasi Rental
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2 min-w-0">
              <i className="fa-solid fa-clock text-[#0194F3] text-sm shrink-0"></i>
              <span className={`text-xs sm:text-sm font-semibold truncate ${rentalDuration ? 'text-slate-900' : 'text-slate-400'}`}>
                {rentalDuration ? `${rentalDuration} Hari` : 'Pilih Durasi'}
              </span>
            </div>
            <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isRentalDurOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
          </div>
        </div>

        {isRentalDurOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden py-1 animate-in fade-in duration-150">
            {['1', '2', '3', '4', '5', '6', '7'].map((day) => (
              <div
                key={day}
                onClick={() => { setRentalDuration(day); setIsRentalDurOpen(false); }}
                className={`px-3 py-2 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                  rentalDuration === day ? 'text-[#0194F3] bg-sky-50/50 font-bold' : 'text-slate-700'
                }`}
              >
                <span>{day} Hari</span>
                {rentalDuration === day && <i className="fa-solid fa-check text-xs"></i>}
              </div>
            ))}
          </div>
        )}
      </div>

      <button
        type="submit"
        className="w-full lg:w-auto h-full px-6 py-3 bg-[#0194F3] hover:bg-blue-600 text-white font-bold text-sm rounded-xl shadow-md transition-colors flex items-center justify-center gap-2 cursor-pointer"
      >
        <i className="fa-solid fa-magnifying-glass"></i>
        <span>Cari</span>
      </button>
    </form>
  );
};

export default CarRentalForm;
