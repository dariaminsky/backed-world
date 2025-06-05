import React from 'react';
import { C3_LOGO_HIGHLIGHT, C3_LOGO_MID, C3_LOGO_BASE } from '../../constants/styles';;

// --- Logo Component ---
export const GradientSphereLogo = ({ size = 28 }) => (
  <div
    style={{
      width: size, height: size, borderRadius: '50%',
      background: `radial-gradient(circle at 30% 25%, ${C3_LOGO_HIGHLIGHT} 0%, ${C3_LOGO_MID} 35%, ${C3_LOGO_BASE} 80%)`,
      boxShadow: '0 2px 4px rgba(0,0,0,0.06), inset 0 1px 1px rgba(255,255,255,0.15)',
    }}
    className="mr-2"
  />
);
