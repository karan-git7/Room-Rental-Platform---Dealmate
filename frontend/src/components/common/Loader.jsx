import React from 'react';
import '../../styles/global.css';

/**
 * DealMate Premium Loader - 'The Orbital Pulse'
 * A classic, unique, and professional loading experience.
 */
const Loader = ({ text = 'Searching...', compact = false, overlay = false }) => {
  const inner = (
    <div className={`dm-loader${compact ? ' compact' : ''}`}>
      <div className="dm-loader-container">
        {/* Orbital Track */}
        <div className="dm-loader-circuit" />
        
        {/* Central Logo Aura */}
        <div className="dm-loader-icon">
          <svg viewBox="0 0 40 40" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <linearGradient id="dmPulseGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" style={{ stopColor: '#10b981' }} />
                <stop offset="100%" style={{ stopColor: '#059669' }} />
              </linearGradient>
            </defs>
            {/* Minimalist Cart Silhouette */}
            <path
              d="M4 6h5l1 3h21l-3 11H10L8 7H4z"
              fill="url(#dmPulseGrad)"
              stroke="none"
            />
            <path
              d="M2 4h3.5l1 3"
              fill="none"
              stroke="url(#dmPulseGrad)"
              strokeWidth="2.5"
              strokeLinecap="round"
            />
            {/* Static Wheels (Replaced spinning with solid premium design) */}
            <circle cx="12" cy="30" r="3.5" fill="#10b981" />
            <circle cx="26" cy="30" r="3.5" fill="#10b981" />
          </svg>
        </div>
      </div>
      
      {text && <div className="dm-loader-text">{text}</div>}
    </div>
  );

  if (overlay) {
    return (
      <div className="dm-loader-overlay">
        {inner}
      </div>
    );
  }

  return inner;
};

export default Loader;
