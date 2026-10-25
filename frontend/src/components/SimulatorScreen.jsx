import React, { useState } from 'react';
import { 
  Sliders, 
  Sparkles, 
  RotateCcw, 
  CheckCircle2, 
  AlertTriangle, 
  Users, 
  Building2,
  TrendingUp,
  Cpu
} from 'lucide-react';

export default function SimulatorScreen({
  activeApplication,
  onRunCampusSimulation,
  onRunAppSimulation,
  isSimulating
}) {
  // Sliders state (Matching reference image slider)
  const [intake, setIntake] = useState(360);
  const [faculty, setFaculty] = useState(24);
  const [shareFacility, setShareFacility] = useState(true);

  // Compute metrics in real-time
  const requiredFaculty = Math.ceil(intake / 20); // 1:20 SFR AICTE norm
  const currentSFR = faculty > 0 ? (intake / faculty).toFixed(1) : 0;
  const isCompliant = parseFloat(currentSFR) <= 20.0 && (!shareFacility || faculty >= 18);
  const maxAllowedIntake = faculty * 20;

  const handleReset = () => {
    setIntake(360);
    setFaculty(24);
    setShareFacility(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header Card */}
      <div className="clay-box" style={{ padding: '2rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.3rem 0.85rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={14} />
              <span>Interactive What-If Testing</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
              Compliance & Intake Simulator
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem', maxWidth: '650px', lineHeight: 1.5 }}>
              Drag the sliders below to test how changing student intake or faculty numbers impacts AICTE regulatory compliance in real time.
            </p>
          </div>

          <button
            onClick={handleReset}
            className="clay-btn-pill clay-btn-white"
          >
            <RotateCcw size={16} />
            <span>Reset to Standard Norms</span>
          </button>
        </div>
      </div>

      {/* Main Interactive Grid */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Left Card: Sliders & Controls (Matching Reference Image) */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '38px',
              height: '38px',
              borderRadius: '12px',
              background: 'var(--clay-blue-gradient)',
              color: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 4px 12px rgba(37, 99, 235, 0.3)'
            }}>
              <Sliders size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                Parameter Adjustment Controls
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)' }}>
                Slide to test hypothetical capacity changes
              </div>
            </div>
          </div>

          {/* Slider 1: Student Intake */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                Proposed Student Intake
              </span>
              <span style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                color: 'var(--clay-blue-primary)',
                background: '#eff6ff',
                padding: '0.2rem 0.65rem',
                borderRadius: '50px'
              }}>
                {intake} Students
              </span>
            </div>

            {/* Clay Slider Bar (Matching Reference Image) */}
            <div className="clay-slider-container">
              <input
                type="range"
                min="120"
                max="600"
                step="60"
                value={intake}
                onChange={(e) => setIntake(parseInt(e.target.value))}
                className="clay-slider"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
              <span>120 Intake</span>
              <span>360 (Standard)</span>
              <span>600 (Max Capacity)</span>
            </div>
          </div>

          {/* Slider 2: Full-Time Faculty */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                Available Full-Time Faculty
              </span>
              <span style={{
                fontSize: '0.88rem',
                fontWeight: 800,
                color: '#10b981',
                background: '#ecfdf5',
                padding: '0.2rem 0.65rem',
                borderRadius: '50px'
              }}>
                {faculty} Teachers
              </span>
            </div>

            {/* Clay Slider Bar */}
            <div className="clay-slider-container">
              <input
                type="range"
                min="10"
                max="40"
                step="1"
                value={faculty}
                onChange={(e) => setFaculty(parseInt(e.target.value))}
                className="clay-slider"
              />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
              <span>10 Faculty</span>
              <span>24 Faculty</span>
              <span>40 Faculty</span>
            </div>
          </div>

          {/* Toggle Switch: Facility Sharing (Matching "ON" Toggle in Reference Image) */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '1rem',
            background: 'var(--clay-inset-bg)',
            borderRadius: '20px',
            boxShadow: 'var(--clay-shadow-inset-sm)'
          }}>
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                Independent Building Partition
              </div>
              <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', marginTop: '0.15rem' }}>
                Require separate entrance & fire exit for shared campus block
              </div>
            </div>

            {/* Clay Pill Toggle */}
            <div 
              onClick={() => setShareFacility(!shareFacility)}
              className={`clay-toggle ${shareFacility ? 'on' : ''}`}
            >
              <div className="clay-toggle-thumb">
                {shareFacility ? 'ON' : 'OFF'}
              </div>
            </div>
          </div>
        </div>

        {/* Right Card: Real-time Compliance Outcome (Matching Big Center Card in Reference Image) */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', gap: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              SIMULATED COMPLIANCE VERIFICATION
            </div>

            <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.75rem', marginTop: '0.5rem' }}>
              <span style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.03em' }}>
                {currentSFR} : 1
              </span>
              <span style={{
                fontSize: '0.85rem',
                fontWeight: 800,
                color: isCompliant ? '#10b981' : '#ef4444',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.25rem'
              }}>
                {isCompliant ? '▲ Pass (AICTE Norm ≤ 20:1)' : '▼ Fail (Norm Exceeded)'}
              </span>
            </div>
            <div style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
              Calculated Student-to-Faculty Ratio (SFR)
            </div>
          </div>

          {/* Visual Outcome Well */}
          <div className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', background: isCompliant ? '#f0fdf4' : '#fef2f2' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              {isCompliant ? (
                <CheckCircle2 size={24} color="#10b981" />
              ) : (
                <AlertTriangle size={24} color="#ef4444" />
              )}
              <div style={{ fontSize: '1rem', fontWeight: 800, color: isCompliant ? '#065f46' : '#991b1b' }}>
                {isCompliant ? 'Compliant with AICTE 2026-27 Norms' : 'Deficiency Detected — Action Needed'}
              </div>
            </div>

            <div style={{ fontSize: '0.82rem', color: isCompliant ? '#047857' : '#b91c1c', lineHeight: 1.5 }}>
              {isCompliant ? (
                `Your ${faculty} faculty members comfortably support up to ${maxAllowedIntake} students. The requested intake of ${intake} is fully approved.`
              ) : (
                `For ${intake} students, AICTE requires at least ${requiredFaculty} faculty members. You have a shortage of ${requiredFaculty - faculty} teachers.`
              )}
            </div>
          </div>

          {/* 2 Quick Metric Wells */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
            <div className="clay-well">
              <div style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>Max Safe Intake</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-blue-primary)', marginTop: '0.15rem' }}>
                {maxAllowedIntake} Students
              </div>
            </div>

            <div className="clay-well">
              <div style={{ fontSize: '0.72rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>Required Faculty</div>
              <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.15rem' }}>
                {requiredFaculty} Teachers
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
