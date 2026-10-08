import { useState } from 'react';

export const useToast = (duration = 3500) => {
    const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

    const showToast = (message, type = 'success') => {
        setToast({ show: true, message, type });
        setTimeout(() => {
            setToast((prev) => ({ ...prev, show: false }));
        }, duration);
    };

    const hideToast = () => {
        setToast((prev) => ({ ...prev, show: false }));
    };

    return { toast, showToast, hideToast };
};

export default useToast;
