import Swal from 'sweetalert2';

/**
 * Notifikasi Toast Melayang (Mengikuti Tema Brand Dafatih Transport)
 */
export const showAlert = (message, icon = 'warning', customConfig = {}) => {
  Swal.fire({
    toast: true,
    position: 'top',
    icon: icon,
    title: message,
    showConfirmButton: false,
    timer: 2800,
    timerProgressBar: true,
    background: '#ffffff',
    color: '#0f172a',
    iconColor: icon === 'warning' ? '#f59e0b' : '#00a2ff',
    customClass: {
      popup: 'rounded-2xl shadow-xl border border-sky-100/80 px-4 py-3 font-sans text-xs font-bold text-slate-800',
      timerProgressBar: 'bg-[#00a2ff]'
    },
    ...customConfig
  });
};

/**
 * Alternative: Modal Pop-up Compact khas Dafatih Transport
 */
export const showModalAlert = (message, title = 'Peringatan') => {
  Swal.fire({
    title: title,
    text: message,
    width: '300px',
    padding: '1.25rem',
    confirmButtonColor: '#00a2ff',
    confirmButtonText: 'Mengerti',
    buttonsStyling: true,
    customClass: {
      popup: 'rounded-2xl shadow-2xl border border-slate-100/90 bg-white',
      title: 'text-sm font-extrabold text-slate-800 m-0 mb-2',
      htmlContainer: 'text-xs font-semibold text-slate-600 m-0 mb-4 leading-relaxed',
      confirmButton: 'text-xs rounded-xl font-bold px-5 py-2.5 bg-[#00a2ff] hover:bg-sky-600 text-white shadow-md transition-all'
    }
  });
};
