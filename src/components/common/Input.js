import React from 'react';
import { C3_TEXT_PRIMARY_LIGHT, C3_ERROR_RED, C3_BORDER_LIGHT, C3_CARD_BG_LIGHT } from '../../constants/styles';;

// --- Input Component ---
export const Input = ({ label, value, onChange, placeholder = '', type = 'text', required = false, className = '', style = {} }) => (
  <div className={className} style={style}>
    {label && (
      <label style={{ display: 'block', marginBottom: '6px', fontSize: '14px', fontWeight: '500', color: C3_TEXT_PRIMARY_LIGHT }}>
        {label} {required && <span style={{ color: C3_ERROR_RED }}>*</span>}
      </label>
    )}
    <input
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      required={required}
      style={{
        width: '100%', padding: '10px 12px', border: `1px solid ${C3_BORDER_LIGHT}`,
        borderRadius: '6px', fontSize: '16px', backgroundColor: C3_CARD_BG_LIGHT,
        color: C3_TEXT_PRIMARY_LIGHT
      }}
    />
  </div>
);
