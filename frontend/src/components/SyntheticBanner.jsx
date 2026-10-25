import React from 'react';
import { AlertTriangle, ShieldAlert } from 'lucide-react';

export default function SyntheticBanner() {
  return (
    <div className="synthetic-banner">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <ShieldAlert size={16} />
        <span>SYNTHETIC DEMO DATA. NOT A REAL INSTITUTION.</span>
      </div>
      <span style={{ opacity: 0.8, fontWeight: 400 }}>
        All verification is simulated. Demonstration rules are not official AICTE requirements.
      </span>
      <span className="badge badge-amber" style={{ fontSize: '0.65rem', padding: '0.15rem 0.5rem' }}>
        SIH 2026 PS5
      </span>
    </div>
  );
}
