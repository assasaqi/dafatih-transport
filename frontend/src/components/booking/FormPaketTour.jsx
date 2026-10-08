import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import countriesData from '@/data/countries.json';

const FormPaketTour = ({ onOpenModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const formatDateToISO = (dateObj) => {
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };

  const todayObj = new Date();

  const initialForm = {
    custName: '',
    countryCode: '62',
    custWa: '',
    jenisLayanan: 'Paket Tour Lombok',
    packageTour: '',
    pickupDate: '',
    pickupTime: '',
    pickupLoc: '',
    passengers: '',
    duration: '',
    price: 0
  };

  const [formData, setFormData] = useState(initialForm);

  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [isTimePickerOpen, setIsTimePickerOpen] = useState(false);

  const [selectedHour, setSelectedHour] = useState('08');
  const [selectedMinute, setSelectedMinute] = useState('00');

  const [currentCalendarMonth, setCurrentCalendarMonth] = useState(
    new Date(todayObj.getFullYear(), todayObj.getMonth(), 1)
  );

  const calendarRef = useRef(null);
  const timePickerRef = useRef(null);

  const hoursList = Array.from({ length: 24 }, (_, i) => String(i).padStart(2, '0'));
  const minutesList = ['00', '15', '30', '45'];

  // HANYA MENERIMA DATA DARI PAKET TOUR
  useEffect(() => {
    if (location.state) {
      const stateData = location.state;

      const isTourData = stateData.jenisLayanan === 'Paket Tour' || !!stateData.packageTour || !!stateData.packageName;

      if (!isTourData) {
        return; // ABAIKAN JIKA BUKAN PAKET TOUR
      }

      setFormData((prev) => ({
        ...prev,
        jenisLayanan: 'Paket Tour Lombok',
        packageTour: stateData.packageTour || stateData.packageName || prev.packageTour,
        price: Number(stateData.price || stateData.harga || prev.price || 0),
        pickupDate: stateData.date || stateData.travelDate || prev.pickupDate,
        pickupLoc: stateData.pickup || stateData.pickupLoc || prev.pickupLoc,
        passengers: stateData.passengers || prev.passengers,
        duration: stateData.duration || prev.duration
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
  // HAPUS ATAU HILANGKAN BARIS INI:
  // navigate(location.pathname, { replace: true, state: {} });
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

  const handlePrevMonth = (e) => {
    e.stopPropagation();
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() - 1, 1));
  };

  const handleNextMonth = (e) => {
    e.stopPropagation();
    setCurrentCalendarMonth(new Date(currentCalendarMonth.getFullYear(), currentCalendarMonth.getMonth() + 1, 1));
  };

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

  const handleSubmit = (e) => {
    e.preventDefault();
    let waNumber = formData.custWa.trim();
    if (waNumber.startsWith('0')) waNumber = waNumber.substring(1);

    if (!formData.pickupLoc) return alert('Silakan isi lokasi penjemputan / hotel!');
    if (!formData.packageTour) return alert('Silakan isi nama Paket Tour yang dipilih!');
    if (!formData.pickupDate) return alert('Silakan pilih tanggal!');
    if (!formData.pickupTime) return alert('Silakan pilih waktu!');

    const finalData = { ...formData, custWa: waNumber };
    setFormData(finalData);
    onOpenModal(finalData);
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 p-3.5 sm:p-6 shadow-xs">
      <div className="flex items-center justify-between border-b border-slate-100 pb-2.5 mb-3.5">
        <p className="text-[11px] sm:text-xs text-slate-500 font-medium">
          Isi formulir pemesanan untuk <strong>Paket Tour Lombok</strong>. Pastikan nomor WhatsApp aktif.
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
        {/* BARIS 1: NAMA & WA */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Nama Lengkap Pemesan *</label>
            <div className="relative flex items-center">
              <input
                type="text"
                name="custName"
                required
                placeholder="Contoh: Budi Santoso"
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
            <div className="flex items-center border border-slate-300 rounded-xl overflow-hidden h-10 focus-within:border-[#0194F3] bg-white">
              <select name="countryCode" value={formData.countryCode} onChange={handleChange} className="h-full bg-slate-50 border-r border-slate-300 px-2 text-xs font-bold text-slate-700 outline-none cursor-pointer shrink-0">
                {countriesData.countries?.map((c, i) => (
                  <option key={i} value={c.code}>{c.flag} +{c.code}</option>
                ))}
              </select>
              <div className="relative flex-1 flex items-center h-full">
                <input type="tel" name="custWa" required placeholder="8123456789" value={formData.custWa} onChange={handleChange} className="w-full h-full px-3 text-xs sm:text-sm font-semibold text-slate-900 outline-none bg-transparent" />
                {formData.custWa && (
                  <button type="button" className="absolute right-2 text-slate-400 hover:text-slate-600 p-1 cursor-pointer" onClick={() => handleClear('custWa')}>&times;</button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* BARIS 2: LOKASI & NAMA PAKET TOUR */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Lokasi Penjemputan / Hotel *</label>
            <input
              type="text"
              name="pickupLoc"
              required
              placeholder="Contoh: Bandara LOP / Hotel Senggigi"
              value={formData.pickupLoc}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-[11px] sm:text-xs font-bold text-slate-700">Nama Paket Tour Lombok *</label>
            <input
              type="text"
              name="packageTour"
              required
              placeholder="Contoh: Tour Sasak & Kuta / Tour Gili Trawangan"
              value={formData.packageTour}
              onChange={handleChange}
              className="w-full h-10 px-3 rounded-xl border border-slate-300 text-xs sm:text-sm font-semibold text-slate-900 outline-none focus:border-[#0194F3] bg-white"
            />
          </div>
        </div>

        {/* BARIS 3: TANGGAL & WAKTU */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3">
          {/* KALENDER */}
          <div className="relative" ref={calendarRef}>
            <label className="text-[11px] sm:text-xs font-bold text-slate-700 mb-1 block">Tanggal Tour *</label>
            <div
              onClick={() => { setIsCalendarOpen(!isCalendarOpen); setIsTimePickerOpen(false); }}
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
                  <button type="button" onClick={handlePrevMonth} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"><i className="fa-solid fa-chevron-left text-xs"></i></button>
                  <span className="text-xs font-bold text-slate-800">{currentCalendarMonth.toLocaleDateString('id-ID', { month: 'long', year: 'numeric' })}</span>
                  <button type="button" onClick={handleNextMonth} className="w-7 h-7 rounded-lg hover:bg-slate-100 flex items-center justify-center text-slate-600"><i className="fa-solid fa-chevron-right text-xs"></i></button>
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
              onClick={() => { setIsTimePickerOpen(!isTimePickerOpen); setIsCalendarOpen(false); }}
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
        </div>

        {/* BOTTOM ACTION */}
        <div className="pt-3 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 border-t border-slate-100">
          <div className="text-left bg-sky-50/60 p-2.5 sm:p-0 rounded-xl sm:bg-transparent">
            <span className="block text-[10px] sm:text-[11px] text-slate-500 font-medium">Estimasi Tarif Terpilih:</span>
            <strong className="text-base sm:text-lg font-extrabold text-[#0194F3]">
              {formData.price > 0 ? `Rp ${new Intl.NumberFormat('id-ID').format(formData.price)}` : 'Pilih Paket Tour'}
            </strong>
          </div>

          <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
            <button type="submit" className="w-full sm:w-auto px-5 py-2.5 bg-[#0194F3] hover:bg-sky-600 text-white rounded-xl text-xs font-bold shadow-md cursor-pointer flex items-center justify-center gap-2">
              <span>Lanjutkan Pemesanan</span>
              <i className="fa-solid fa-arrow-right text-xs"></i>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default FormPaketTour;
