import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import CustomCalendar from '../common/CustomCalendar';

const AirportTransferForm = ({
  routes = [],
  onSubmit,
  formatDisplayDate
}) => {
  const navigate = useNavigate();

  const [pickupInput, setPickupInput] = useState('');
  const [dropoffInput, setDropoffInput] = useState('');
  const [travelDate, setTravelDate] = useState('');
  const [passengers, setPassengers] = useState('');

  // Dropdown States
  const [isPickupOpen, setIsPickupOpen] = useState(false);
  const [isDropoffOpen, setIsDropoffOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isPassengerOpen, setIsPassengerOpen] = useState(false);

  const pickupRef = useRef(null);
  const dropoffRef = useRef(null);
  const calendarRef = useRef(null);
  const passengerRef = useRef(null);

  // Penanganan klik di luar komponen untuk menutup dropdown
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

  const closeAllDropdowns = () => {
    setIsPickupOpen(false);
    setIsDropoffOpen(false);
    setIsCalendarOpen(false);
    setIsPassengerOpen(false);
  };

  // Memoized Unique Pickup Locations
  const uniquePickupLocations = useMemo(() => {
    if (!Array.isArray(routes)) return [];
    return Array.from(new Set(routes.map((r) => r?.pickup_location).filter(Boolean)));
  }, [routes]);

  // Memoized Available Dropoff Locations
  const availableDropoffLocations = useMemo(() => {
    if (!Array.isArray(routes)) return [];
    return Array.from(
      new Set(
        routes
          .filter((r) => !pickupInput || r?.pickup_location === pickupInput)
          .map((r) => r?.dropoff_location)
          .filter(Boolean)
      )
    );
  }, [routes, pickupInput]);

  const handleSelectPickup = (loc) => {
    setPickupInput(loc);
    setIsPickupOpen(false);

    const matchingRoutes = routes.filter((r) => r?.pickup_location === loc);
    const isCurrentDropValid = matchingRoutes.some((r) => r?.dropoff_location === dropoffInput);

    if (!isCurrentDropValid) {
      setDropoffInput(matchingRoutes.length > 0 ? matchingRoutes[0]?.dropoff_location || '' : '');
    }
  };

  const renderFormattedDate = (dateStr) => {
    if (!dateStr) return 'Pilih Tanggal';
    if (typeof formatDisplayDate === 'function') {
      try {
        return formatDisplayDate(dateStr);
      } catch (err) {
        console.error('Error pada formatDisplayDate:', err);
      }
    }
    if (dateStr instanceof Date) {
      return dateStr.toLocaleDateString('id-ID', { day: '2-digit', month: 'short', year: 'numeric' });
    }
    return String(dateStr);
  };

  const handleSelectDate = (date) => {
    setTravelDate(date);
    setIsCalendarOpen(false);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validasi Wajib Isi
    if (!pickupInput) {
      alert('Silakan pilih Lokasi Penjemputan terlebih dahulu!');
      return;
    }
    if (!dropoffInput) {
      alert('Silakan pilih Lokasi Tujuan terlebih dahulu!');
      return;
    }
    if (!travelDate) {
      alert('Silakan pilih Tanggal Perjalanan terlebih dahulu!');
      return;
    }
    if (!passengers) {
      alert('Silakan pilih Jumlah Penumpang terlebih dahulu!');
      return;
    }

    const formData = {
      pickup: pickupInput,
      dropoff: dropoffInput,
      pickupLoc: pickupInput,
      dropLoc: dropoffInput,
      travelDate,
      pickupDate: travelDate,
      passengers
    };

    // Panggil handler parent jika ada
    if (typeof onSubmit === 'function') {
      onSubmit(formData);
    }

    // Arahkan ke Halaman /tarif dengan query params dan state
    const query = new URLSearchParams();
    query.append('type', 'transfer');
    if (pickupInput) query.append('pickup', pickupInput);
    if (dropoffInput) query.append('dropoff', dropoffInput);
    if (travelDate) query.append('date', travelDate);
    if (passengers) query.append('passengers', passengers);

    navigate(`/tarif?${query.toString()}`, { state: formData });
  };

  return (
    <form className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-[1.5fr_1.5fr_1.2fr_1fr_auto] gap-3 items-center" onSubmit={handleSubmit}>
      {/* 1. LOKASI PENJEMPUTAN */}
      <div className="relative" ref={pickupRef}>
        <div
          onClick={() => {
            const nextState = !isPickupOpen;
            closeAllDropdowns();
            setIsPickupOpen(nextState);
          }}
          className={`border rounded-2xl p-3 bg-white flex flex-col justify-center cursor-pointer transition-all ${
            isPickupOpen ? 'border-[#00a2ff] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            LOKASI PENJEMPUTAN
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <svg className="w-5 h-5 text-[#00a2ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className={`text-xs sm:text-sm font-bold truncate ${pickupInput ? 'text-slate-800' : 'text-slate-400'}`}>
                {pickupInput || 'Pilih Penjemputan'}
              </span>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isPickupOpen ? 'rotate-180 text-[#00a2ff]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isPickupOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] max-h-56 overflow-y-auto py-1">
            {uniquePickupLocations.length > 0 ? (
              uniquePickupLocations.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => handleSelectPickup(loc)}
                  className={`px-3.5 py-2.5 text-xs font-bold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                    pickupInput === loc ? 'text-[#00a2ff] bg-sky-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{loc}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-400 text-center font-semibold">Tidak ada lokasi penjemputan</div>
            )}
          </div>
        )}
      </div>

      {/* 2. LOKASI TUJUAN */}
      <div className="relative" ref={dropoffRef}>
        <div
          onClick={() => {
            const nextState = !isDropoffOpen;
            closeAllDropdowns();
            setIsDropoffOpen(nextState);
          }}
          className={`border rounded-2xl p-3 bg-white flex flex-col justify-center cursor-pointer transition-all ${
            isDropoffOpen ? 'border-[#00a2ff] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            LOKASI TUJUAN
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <svg className="w-5 h-5 text-[#00a2ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9" />
              </svg>
              <span className={`text-xs sm:text-sm font-bold truncate ${dropoffInput ? 'text-slate-800' : 'text-slate-400'}`}>
                {dropoffInput || 'Pilih Tujuan'}
              </span>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isDropoffOpen ? 'rotate-180 text-[#00a2ff]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isDropoffOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] max-h-56 overflow-y-auto py-1">
            {availableDropoffLocations.length > 0 ? (
              availableDropoffLocations.map((loc, idx) => (
                <div
                  key={idx}
                  onClick={() => {
                    setDropoffInput(loc);
                    setIsDropoffOpen(false);
                  }}
                  className={`px-3.5 py-2.5 text-xs font-bold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                    dropoffInput === loc ? 'text-[#00a2ff] bg-sky-50/50' : 'text-slate-700'
                  }`}
                >
                  <span>{loc}</span>
                </div>
              ))
            ) : (
              <div className="px-3 py-3 text-xs text-slate-400 text-center font-semibold">Tidak ada tujuan tersedia</div>
            )}
          </div>
        )}
      </div>

      {/* 3. TANGGAL PERJALANAN */}
      <div className="relative" ref={calendarRef}>
        <div
          onClick={() => {
            const nextState = !isCalendarOpen;
            closeAllDropdowns();
            setIsCalendarOpen(nextState);
          }}
          className={`border rounded-2xl p-3 bg-white flex flex-col justify-center cursor-pointer transition-all ${
            isCalendarOpen ? 'border-[#00a2ff] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            TANGGAL PERJALANAN
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <svg className="w-5 h-5 text-[#00a2ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span className={`text-xs sm:text-sm font-bold truncate ${travelDate ? 'text-slate-800' : 'text-slate-400'}`}>
                {renderFormattedDate(travelDate)}
              </span>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isCalendarOpen ? 'rotate-180 text-[#00a2ff]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isCalendarOpen && (
          <CustomCalendar
            selectedDate={travelDate}
            onSelectDate={handleSelectDate}
            onClose={() => setIsCalendarOpen(false)}
          />
        )}
      </div>

      {/* 4. JUMLAH PENUMPANG */}
      <div className="relative" ref={passengerRef}>
        <div
          onClick={() => {
            const nextState = !isPassengerOpen;
            closeAllDropdowns();
            setIsPassengerOpen(nextState);
          }}
          className={`border rounded-2xl p-3 bg-white flex flex-col justify-center cursor-pointer transition-all ${
            isPassengerOpen ? 'border-[#00a2ff] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'
          }`}
        >
          <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">
            JUMLAH PENUMPANG
          </span>
          <div className="flex items-center justify-between gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <svg className="w-5 h-5 text-[#00a2ff] shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
              </svg>
              <span className={`text-xs sm:text-sm font-bold truncate ${passengers ? 'text-slate-800' : 'text-slate-400'}`}>
                {passengers ? `${passengers} Orang` : 'Pilih Penumpang'}
              </span>
            </div>
            <svg className={`w-4 h-4 text-slate-400 transition-transform duration-200 ${isPassengerOpen ? 'rotate-180 text-[#00a2ff]' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2">
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {isPassengerOpen && (
          <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] py-1">
            {['1', '2', '3', '4'].map((num) => (
              <div
                key={num}
                onClick={() => {
                  setPassengers(num);
                  setIsPassengerOpen(false);
                }}
                className={`px-3.5 py-2.5 text-xs font-bold cursor-pointer flex items-center justify-between hover:bg-sky-50 transition-colors ${
                  passengers === num ? 'text-[#00a2ff] bg-sky-50/50' : 'text-slate-700'
                }`}
              >
                <span>{num} Orang {num === '4' ? '(Maksimal)' : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* 5. TOMBOL CARI */}
      <button
        type="submit"
        className="w-full lg:w-auto h-full px-7 py-3.5 bg-[#00a2ff] hover:bg-blue-600 text-white font-bold text-sm rounded-2xl shadow-md transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0"
      >
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        <span>Cari</span>
      </button>
    </form>
  );
};

export default AirportTransferForm;
