import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { getVehicles, createBooking } from '@/services/api';

const FormSewaMobil = () => {
  const location = useLocation();
  const navigate = useNavigate();

  const formatDateToISO = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayObj = new Date();
  const [vehicles, setVehicles] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [pricePerDay, setPricePerDay] = useState(0);

  const initialForm = {
    custName: '',
    custWa: '',
    jenisLayanan: 'Sewa Mobil',
    vehicleId: null,
    armada: '',
    pickupDate: '',
    pickupTime: '08:00',
    pickupLoc: '',
    duration: '1 Hari',
    price: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const [isArmadaOpen, setIsArmadaOpen] = useState(false);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    new Date(todayObj.getFullYear(), todayObj.getMonth(), 1)
  );

  const armadaRef = useRef(null);
  const calendarRef = useRef(null);
  const timePickerRef = useRef(null);

  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutesList = ['00', '15', '30', '45'];

  // Pilihan Durasi Rental
  const durationOptions = Array.from({ length: 7 }, (_, i) => `${i + 1} Hari`);

  // Memuat daftar armada dari API
  useEffect(() => {
    getVehicles()
      .then((res) => {
        if (res.data?.success && Array.isArray(res.data.data)) {
          setVehicles(res.data.data);
        } else if (Array.isArray(res.data)) {
          setVehicles(res.data);
        }
      })
      .catch((err) => console.error('Gagal memuat data armada:', err));
  }, []);

  // Menerima data dari lokasi/halaman daftar mobil
  useEffect(() => {
    if (location.state && Object.keys(location.state).length > 0) {
      const stateData = location.state;
      const isRentalData = stateData.jenisLayanan === 'Sewa Mobil' || !!stateData.carType || !!stateData.namaArmada || !!stateData.vehicle_id || !!stateData.id;

      if (!isRentalData) return;

      const matchedName = stateData.carType || stateData.namaArmada || stateData.name || stateData.model || '';
      const unitPrice = Number(stateData.price || stateData.price_per_day || stateData.harga || 0);
      const rawDuration = stateData.duration ? (typeof stateData.duration === 'number' ? `${stateData.duration} Hari` : stateData.duration) : '1 Hari';
      const durNum = parseInt(rawDuration) || 1;

      if (unitPrice > 0) {
        setPricePerDay(unitPrice);
      }

      setFormData((prev) => ({
        ...prev,
        jenisLayanan: 'Sewa Mobil',
        vehicleId: stateData.vehicle_id || stateData.vehicleId || stateData.id || prev.vehicleId,
        armada: matchedName || prev.armada,
        duration: rawDuration,
        price: stateData.totalPrice || (unitPrice > 0 ? unitPrice * durNum : prev.price),
        pickupDate: stateData.date || stateData.startDate || prev.pickupDate,
        pickupLoc: stateData.pickup || stateData.location || prev.pickupLoc
      }));
    }
  }, [location.state]);

  useEffect(() => {
    if (formData.pickupTime) {
      const [h, m] = formData.pickupTime.split(':');
      if (h) setSelectedHour(h);
      if (m) setSelectedMinute(m);
    }
  }, [formData.pickupTime]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (armadaRef.current && !armadaRef.current.contains(e.target)) setIsArmadaOpen(false);
      if (calendarRef.current && !calendarRef.current.contains(e.target)) setIsCalendarOpen(false);
      if (timePickerRef.current && !timePickerRef.current.contains(e.target)) setIsTimePickerOpen(false);
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleResetForm = () => {
    setFormData(initialForm);
    setSelectedHour('08');
    setSelectedMinute('00');
    setPricePerDay(0);
    navigate(location.pathname, { replace: true, state: {} });
  };

  const handleSelectArmada = (veh) => {
    const vehName = veh.name || veh.model || veh.carType || 'Armada Mobil';
    const unitPrice = Number(veh.price_per_day || veh.price || veh.harga || 0);
    const durNum = parseInt(formData.duration) || 1;

    setPricePerDay(unitPrice);
    setFormData((prev) => ({
      ...prev,
      vehicleId: veh.id,
      armada: vehName,
      price: unitPrice > 0 ? unitPrice * durNum : prev.price
    }));
    setIsArmadaOpen(false);
  };

  const handleDurationChange = (e) => {
    const newDuration = e.target.value;
    const durNum = parseInt(newDuration) || 1;

    setFormData((prev) => ({
      ...prev,
      duration: newDuration,
      price: pricePerDay > 0 ? pricePerDay * durNum : prev.price
    }));
  };

  const generateCalendarDays = () => {
    const year = currentCalendarMonth.getFullYear();
    const month = currentCalendarMonth.getMonth();
    const firstDayOfMonth = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const days = [];
    for (let i = 0; i < firstDayOfMonth; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(new Date(year, month, d));
    return days;
  };

  const calendarDays = generateCalendarDays();

  const formatDisplayDate = (dateStr) => {
    if (!dateStr) return '';
    const [y, m, d] = dateStr.split('-');
    if (!y || !m || !d) return dateStr;
    return new Date(Number(y), Number(m) - 1, Number(d)).toLocaleDateString('id-ID', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleClear = (field) => {
    setFormData((prev) => ({ ...prev, [field]: '' }));
  };

  const handleApplyTime = () => {
    setFormData((prev) => ({ ...prev, pickupTime: `${selectedHour}:${selectedMinute}` }));
    setIsTimePickerOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const token = localStorage.getItem('token') || localStorage.getItem('clientToken');
    if (!token) {
      alert('Silakan login terlebih dahulu untuk melakukan pemesanan!');
      navigate('/login');
      return;
    }

    if (!formData.pickupLoc) return alert('Silakan isi lokasi penjemputan / hotel!');
    if (!formData.armada) return alert('Silakan pilih armada / mobil!');
    if (!formData.pickupDate) return alert('Silakan pilih tanggal!');
    if (!formData.pickupTime) return alert('Silakan pilih waktu!');

    setIsLoading(true);

    const selectedVeh = vehicles.find(
      (v) => (v.name || v.model || '').toLowerCase().trim() === (formData.armada || '').toLowerCase().trim()
    );

    const newBookingPayload = {
      service_type: 'Sewa_Mobil',
      serviceType: 'Sewa_Mobil',

      vehicle_id: formData.vehicleId || selectedVeh?.id ? Number(formData.vehicleId || selectedVeh?.id) : null,
      vehicleId: formData.vehicleId || selectedVeh?.id ? Number(formData.vehicleId || selectedVeh?.id) : null,

      customer_name: formData.custName || 'Pelanggan',
      customerName: formData.custName || 'Pelanggan',
      customer_phone: formData.custWa || '-',
      customerPhone: formData.custWa || '-',

      pickup_address: formData.pickupLoc,
      pickupAddress: formData.pickupLoc,
      pickup_location: formData.pickupLoc,

      pickup_date: formData.pickupDate,
      pickupDate: formData.pickupDate,
      pickup_time: formData.pickupTime,
      pickupTime: formData.pickupTime,

      total_price: Number(formData.price || 0),
      totalPrice: Number(formData.price || 0),

      notes: `Durasi: ${formData.duration || '1 Hari'}`,
      status: 'pending'
    };

    try {
      await createBooking(newBookingPayload);
    } catch (error) {
      console.warn('API error/offline, data disimpan ke LocalStorage.', error);
    } finally {
      const existingTemp = JSON.parse(localStorage.getItem('temp_bookings') || '[]');
      localStorage.setItem('temp_bookings', JSON.stringify([newBookingPayload, ...existingTemp]));

      setIsLoading(false);
      navigate('/pesanan-saya', { state: { newBooking: newBookingPayload } });
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
          Isi formulir pemesanan untuk <strong>Sewa Mobil</strong>. Pastikan nomor WhatsApp aktif.
        </p>
        <button
          type="button"
          onClick={handleResetForm}
          className="flex items-center gap-1 text-[11px] font-bold text-red-500 hover:text-red-600 hover:bg-red-50 px-2.5 py-1 rounded-lg transition-colors cursor-pointer shrink-0"
        >
          <i className="fa-solid fa-rotate-left text-[10px]"></i>
          <span>Reset Form</span>
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3 sm:space-y-4">
        {/* INPUT TAMPILAN JENIS LAYANAN */}
        <div className="flex flex-col gap-1">
          <label className="text-[11px] sm:text-xs font-bold text-slate-700">Jenis Layanan *</label>
          <div className="relative flex items-center">
            <input
              type="text"
              name="jenisLayanan"
              value={formData.jenisLayanan}
              readOnly
              className="w-full h-10 px-3 bg-slate-100/80 rounded-xl border border-slate-200 text-xs sm:text-sm font-bold text-[#0194F3] outline-none cursor-not-allowed"
            />
            <i className="fa-solid fa-lock absolute right-3 text-slate-400 text-xs"></i>
          </div>
        </div>

        {/* BARIS 1: NAMA & WA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Nama Lengkap Pemesan *</label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="custName"
                required
                placeholder="Contoh: Dafatih Alamsyah"
                value={formData.custName}
                onChange={handleChange}
                className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3]"
              />
              {formData.custName && (
                <button type="button" className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer" onClick={() => handleClear('custName')}>&times;</button>
              )}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Nomor WhatsApp / HP *</label>
            <div className="relative flex items-center">
              <input
                type="tel"
                name="custWa"
                required
                placeholder="Contoh: 0812xxxxxxxx"
                value={formData.custWa}
                onChange={handleChange}
                className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3]"
              />
              {formData.custWa && (
                <button type="button" className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer" onClick={() => handleClear('custWa')}>&times;</button>
              )}
            </div>
          </div>
        </div>

        {/* BARIS 2: LOKASI & ARMADA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* LOKASI JEMPUT */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Lokasi Penjemputan / Hotel *</label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="pickupLoc"
                required
                placeholder="Contoh: Bandara LOP / Hotel Senggigi"
                value={formData.pickupLoc}
                onChange={handleChange}
                className="w-full h-10 px-3 pr-8 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white"
              />
              {formData.pickupLoc && (
                <button type="button" className="absolute right-2.5 text-slate-400 hover:text-slate-600 p-1 cursor-pointer" onClick={() => handleClear('pickupLoc')}>&times;</button>
              )}
            </div>
          </div>

          {/* PILIH ARMADA MOBIL */}
          <div className="relative" ref={armadaRef}>
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 mb-1 block">Armada / Mobil *</label>
            <div
              onClick={() => { setIsArmadaOpen(!isArmadaOpen); setIsCalendarOpen(false); setIsTimePickerOpen(false); }}
              className={`border rounded-xl p-2.5 bg-white flex items-center justify-between cursor-pointer transition-all ${isArmadaOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <i className="fa-solid fa-car text-[#0194F3] text-sm shrink-0"></i>
                <span className={`text-xs sm:text-sm font-semibold truncate ${formData.armada ? 'text-slate-900' : 'text-slate-400'}`}>
                  {formData.armada || 'Pilih Armada Mobil'}
                </span>
              </div>
              <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isArmadaOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
            </div>

            {isArmadaOpen && (
              <div className="absolute left-0 right-0 top-full mt-2 bg-white rounded-xl shadow-xl border border-slate-200 z-[60] overflow-hidden">
                <div className="max-h-56 overflow-y-auto py-1">
                  {vehicles.length > 0 ? (
                    vehicles.map((v, idx) => {
                      const vName = v.name || v.model || v.carType || 'Mobil';
                      const isSelected = formData.armada === vName;
                      return (
                        <div
                          key={v.id || idx}
                          onClick={() => handleSelectArmada(v)}
                          className={`px-3 py-2.5 text-xs font-semibold cursor-pointer flex items-center justify-between hover:bg-sky-50 ${isSelected ? 'text-[#0194F3] bg-sky-50/50 font-bold' : 'text-slate-700'}`}
                        >
                          <div className="flex flex-col">
                            <span>{vName}</span>
                            <span className="text-[10px] text-slate-400 font-normal">
                              {v.price || v.price_per_day ? `Rp ${new Intl.NumberFormat('id-ID').format(v.price || v.price_per_day)} / hari` : 'Harga menyesuaikan'}
                            </span>
                          </div>
                          {isSelected && <i className="fa-solid fa-check text-xs"></i>}
                        </div>
                      );
                    })
                  ) : (
                    <div className="px-3 py-3 text-xs text-slate-400 text-center">Tidak ada data armada</div>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* BARIS 3: TANGGAL, WAKTU & DURASI RENTAL */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5 sm:gap-3">
          {/* KALENDER */}
          <div className="relative" ref={calendarRef}>
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 mb-1 block">Tanggal Mulai Rental *</label>
            <div
              onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsArmadaOpen(false); setIsTimePickerOpen(false); }}
              className={`border rounded-xl p-2.5 bg-white flex items-center justify-between cursor-pointer transition-all ${isCalendarOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <i className="fa-solid fa-calendar-days text-[#0194F3] text-sm shrink-0"></i>
                <span className={`text-xs sm:text-sm font-semibold truncate ${formData.pickupDate ? 'text-slate-900' : 'text-slate-400'}`}>
                  {formData.pickupDate ? formatDisplayDate(formData.pickupDate) : 'Pilih Tanggal'}
                </span>
              </div>
              <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isCalendarOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
            </div>

            {isCalendarOpen && (
              <div className="absolute left-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1)); }} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                  <span className="text-xs font-bold text-slate-800">{currentCalendarMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                  <button type="button" onClick={(e) => { e.stopPropagation(); setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1)); }} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"><i className="fa-solid fa-chevron-right text-xs"></i></button>
                </div>
                <div className="grid grid-cols-7 text-center mb-1">
                  {['Min', 'Sen', 'Sel', 'Rab', 'Kam', 'Jum', 'Sab'].map((dayName, idx) => (
                    <span key={idx} className="text-[10px] font-bold text-slate-400">{dayName}</span>
                  ))}
                </div>
                <div className="grid grid-cols-7 gap-1 text-center">
                  {calendarDays.map((dateObj, idx) => {
                    if (!dateObj) return <div key={idx} className="h-8" />;
                    const isoStr = formatDateToISO(dateObj);
                    const isSelected = isoStr === formData.pickupDate;
                    const isPast = dateObj < new Date(todayObj.getFullYear(), todayObj.getMonth(), todayObj.getDate());
                    return (
                      <button key={idx} type="button" disabled={isPast} onClick={() => { setFormData((prev) => ({ ...prev, pickupDate: isoStr })); setIsCalendarOpen(false); }} className={`h-8 rounded-lg text-xs font-bold flex items-center justify-center cursor-pointer ${isSelected ? 'bg-[#0194F3] text-white' : isPast ? 'text-slate-300 cursor-not-allowed' : 'text-slate-700 hover:bg-sky-50 hover:text-[#0194F3]'}`}>
                        {dateObj.getDate()}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* WAKTU */}
          <div className="relative" ref={timePickerRef}>
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 mb-1 block">Waktu Penjemputan *</label>
            <div
              onClick={() => { setIsTimePickerOpen(!isTimePickerOpen); setIsArmadaOpen(false); setIsCalendarOpen(false); }}
              className={`border rounded-xl p-2.5 bg-white flex items-center justify-between cursor-pointer transition-all ${isTimePickerOpen ? 'border-[#0194F3] ring-2 ring-sky-100' : 'border-slate-300 hover:border-slate-400'}`}
            >
              <div className="flex items-center gap-2 min-w-0">
                <i className="fa-regular fa-clock text-[#0194F3] text-sm shrink-0"></i>
                <span className={`text-xs sm:text-sm font-semibold truncate ${formData.pickupTime ? 'text-slate-900' : 'text-slate-400'}`}>
                  {formData.pickupTime || 'Pilih Waktu'}
                </span>
              </div>
              <i className={`fa-solid fa-chevron-down text-slate-400 text-xs transition-transform duration-200 ${isTimePickerOpen ? 'rotate-180 text-[#0194F3]' : ''}`}></i>
            </div>

            {isTimePickerOpen && (
              <div className="absolute right-0 sm:left-0 top-full mt-2 w-64 bg-white rounded-2xl shadow-2xl border border-slate-200 z-[60] p-4">
                <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-100">
                  <span className="text-xs font-extrabold text-slate-800 flex items-center gap-1.5"><i className="fa-regular fa-clock text-[#0194F3]"></i> Pilih Jam</span>
                  <span className="text-[11px] font-bold text-[#0194F3] bg-sky-50 px-2 py-0.5 rounded-md">{selectedHour}:{selectedMinute}</span>
                </div>
                <div className="grid grid-cols-2 gap-3 mb-4">
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 text-center uppercase">Jam</span>
                    <div className="h-36 overflow-y-auto border border-slate-200 rounded-xl p-1 bg-slate-50/50 space-y-1">
                      {hoursList.map((h) => (
                        <button key={h} type="button" onClick={() => setSelectedHour(h)} className={`w-full py-1 rounded-lg text-xs font-bold text-center ${selectedHour === h ? 'bg-[#0194F3] text-white' : 'text-slate-700 hover:bg-sky-100'}`}>{h}</button>
                      ))}
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <span className="text-[10px] font-bold text-slate-400 text-center uppercase">Menit</span>
                    <div className="h-36 border border-slate-200 rounded-xl p-1 bg-slate-50/50 space-y-1">
                      {minutesList.map((m) => (
                        <button key={m} type="button" onClick={() => setSelectedMinute(m)} className={`w-full py-1.5 rounded-lg text-xs font-bold text-center ${selectedMinute === m ? 'bg-[#0194F3] text-white' : 'text-slate-700 hover:bg-sky-100'}`}>{m}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                  <button type="button" onClick={() => setIsTimePickerOpen(false)} className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-500 hover:bg-slate-100">Batal</button>
                  <button type="button" onClick={handleApplyTime} className="px-3 py-1.5 rounded-lg text-xs font-bold bg-[#0194F3] text-white hover:bg-sky-600">Pilih</button>
                </div>
              </div>
            )}
          </div>

          {/* DURASI RENTAL */}
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Durasi Rental *</label>
            <div className="relative flex items-center">
              <i className="fa-solid fa-clock-rotate-left absolute left-3 text-[#0194F3] text-sm pointer-events-none"></i>
              <select
                name="duration"
                value={formData.duration}
                onChange={handleDurationChange}
                className="w-full h-10 pl-9 pr-8 bg-white rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] cursor-pointer appearance-none"
              >
                {durationOptions.map((opt) => (
                  <option key={opt} value={opt}>
                    {opt}
                  </option>
                ))}
              </select>
              <i className="fa-solid fa-chevron-down absolute right-3 text-slate-400 text-xs pointer-events-none"></i>
            </div>
          </div>
        </div>

        {/* BOTTOM ACTION */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-left bg-sky-50/60 p-2.5 sm:p-0 rounded-xl sm:bg-transparent">
            <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium">Estimasi Tarif Terpilih:</span>
            <strong className="text-base sm:text-lg font-extrabold text-[#0194F3]">
              {formData.price > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}` : 'Pilih Mobil dari Daftar'}
            </strong>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            {!formData.armada && (
              <button type="button" onClick={() => navigate('/mobil')} className="w-full sm:w-auto px-4 py-2.5 rounded-xl border border-[#0194F3] text-[#0194F3] hover:bg-sky-50 font-bold text-xs text-center cursor-pointer">
                Pilih Mobil
              </button>
            )}
            <button
              type="submit"
              disabled={isLoading}
              className="w-full sm:w-auto px-5 py-2.5 bg-[#0194F3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2"
            >
              {isLoading ? (
                <>
                  <i className="fa-solid fa-spinner fa-spin text-xs"></i>
                  <span>Memproses...</span>
                </>
              ) : (
                <>
                  <span>Lanjutkan Pemesanan</span>
                  <i className="fa-solid fa-arrow-right text-xs"></i>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormSewaMobil;
