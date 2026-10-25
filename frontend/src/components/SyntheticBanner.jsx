import React from 'react';
import { Info } from 'lucide-react';

export default function SyntheticBanner() {
  return (
    <div className="subtle-top-bar">
      <div className="subtle-pill">
        <Info size={14} color="#3b82f6" />
        <span>Regulatory Compliance & Scrutiny Verification Environment</span>
      </div>
    </div>
  );
}
