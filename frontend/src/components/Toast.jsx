import React from 'react';

const Toast = ({ show, message, type = 'success', onClose }) => {
    if (!show) return null;

    return (
        <div
            className={`fixed top-5 right-5 z-[100] flex items-center gap-3 px-5 py-3.5 rounded-2xl shadow-2xl border text-xs sm:text-sm font-bold transition-all animate-in fade-in slide-in-from-top-4 duration-300 ${
                type === 'success'
                    ? 'bg-slate-900/90 backdrop-blur-md text-emerald-400 border-emerald-500/30'
                    : 'bg-slate-900/90 backdrop-blur-md text-rose-400 border-rose-500/30'
            }`}
        >
            <div
                className={`w-7 h-7 rounded-xl flex items-center justify-center shrink-0 ${
                    type === 'success' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                }`}
            >
                <i
                    className={`fa-solid ${
                        type === 'success' ? 'fa-check' : 'fa-xmark'
                    } text-xs`}
                ></i>
            </div>

            <span className="text-white font-semibold">{message}</span>

            {onClose && (
                <button
                    type="button"
                    onClick={onClose}
                    className="ml-3 text-slate-400 hover:text-white transition-colors p-1 cursor-pointer"
                >
                    <i className="fa-solid fa-xmark text-xs"></i>
                </button>
            )}
        </div>
    );
};

export default Toast;
