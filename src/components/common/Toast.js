import React from 'react';
import { useApp } from '../../hooks/useApp';;
import { C3_SUCCESS_GREEN, C3_ERROR_RED } from '../../constants/styles';;

// --- Toast Component ---
export const Toast = () => {
  const { toast } = useApp();

  if (!toast) return null;

  const toastStyles = {
    info: { bg: '#EFF6FF', border: '#3B82F6', text: '#1E40AF' },
    success: { bg: '#F0FDF4', border: C3_SUCCESS_GREEN, text: '#15803D' },
    error: { bg: '#FEF2F2', border: C3_ERROR_RED, text: '#DC2626' }
  };

  const style = toastStyles[toast.type] || toastStyles.info;

  return (
    <div
      style={{
        position: 'fixed', top: '20px', right: '20px', zIndex: 1000,
        backgroundColor: style.bg, border: `1px solid ${style.border}`,
        color: style.text, padding: '12px 16px', borderRadius: '8px',
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        maxWidth: '300px', fontSize: '14px'
      }}
    >
      {toast.message}
    </div>
  );
};
