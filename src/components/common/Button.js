import React from 'react';
import { C3_ACCENT_COLOR, C3_CARD_BG_LIGHT, C3_TEXT_PRIMARY_LIGHT, C3_BORDER_LIGHT } from '../../constants/styles';;

// --- Button Component ---
export const Button = ({ children, onClick, variant = 'primary', size = 'md', disabled = false, className = '', style = {} }) => {
  const baseStyle = {
    border: 'none', borderRadius: '8px', cursor: disabled ? 'not-allowed' : 'pointer',
    fontWeight: '500', transition: 'all 0.2s ease', display: 'inline-flex',
    alignItems: 'center', justifyContent: 'center', gap: '6px'
  };

  const sizeStyles = {
    sm: { padding: '6px 12px', fontSize: '14px' },
    md: { padding: '10px 16px', fontSize: '16px' },
    lg: { padding: '12px 20px', fontSize: '18px' }
  };

  const variantStyles = {
    primary: {
      backgroundColor: disabled ? '#9CA3AF' : C3_ACCENT_COLOR, color: 'white',
      boxShadow: disabled ? 'none' : '0 1px 3px rgba(0, 0, 0, 0.1)'
    },
    secondary: {
      backgroundColor: disabled ? '#F3F4F6' : C3_CARD_BG_LIGHT,
      color: disabled ? '#9CA3AF' : C3_TEXT_PRIMARY_LIGHT,
      border: `1px solid ${disabled ? '#D1D5DB' : C3_BORDER_LIGHT}`
    },
    outline: {
      backgroundColor: 'transparent', color: disabled ? '#9CA3AF' : C3_ACCENT_COLOR,
      border: `1px solid ${disabled ? '#D1D5DB' : C3_ACCENT_COLOR}`
    }
  };

  return (
    <button
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      className={className}
      style={{ ...baseStyle, ...sizeStyles[size], ...variantStyles[variant], ...style }}
    >
      {children}
    </button>
  );
};
