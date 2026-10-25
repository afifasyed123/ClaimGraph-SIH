import React from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Sparkles,
  Users,
  Search,
  Sliders,
  TrendingUp,
  ShieldCheck,
  Building,
  UploadCloud
} from 'lucide-react';

export default function OverviewScreen({ 
  onSelectCase, 
  onNavigate, 
  campusData,
  onOpenUpload
}) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Executive Welcome Hero Card */}
      <div className="clay-box" style={{ padding: '2.2rem 2.5rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.35rem 0.95rem', borderRadius: '50px', fontSize: '0.8rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              <Sparkles size={14} />
              <span>AICTE Regulatory Compliance Portal</span>
            </div>
            <h1 style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Institutional Compliance & Scrutiny Dashboard
            </h1>
            <p style={{ fontSize: '0.98rem', color: 'var(--clay-text-secondary)', marginTop: '0.45rem', lineHeight: 1.55 }}>
              Continuous automated verification of faculty numbers, campus land deeds, and multi-college shared facilities across all registered institutions.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.85rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenUpload}
              className="clay-btn-pill clay-btn-blue"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.92rem' }}
            >
              <UploadCloud size={16} />
              <span>Upload Application / Add Documents</span>
            </button>
            <button
              onClick={() => onNavigate('scrutiny')}
              className="clay-btn-pill clay-btn-white"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.92rem' }}
            >
              <Search size={16} />
              <span>Start Review</span>
            </button>
            <button
              onClick={() => onNavigate('campus_reconciliation')}
              className="clay-btn-pill clay-btn-white"
              style={{ padding: '0.85rem 1.6rem', fontSize: '0.92rem' }}
            >
              <Building2 size={16} />
              <span>Campus Check</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 Stat & Visual Metric Cards (Inspired by User's Reference Image) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Card 1: 3D Circular Meter Gauge (75% in Reference Image) */}
        <div className="clay-box" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '1rem', width: '100%' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Overall Verification Score
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--clay-text-primary)', margin: '0.35rem 0' }}>
              94.2%
            </div>
            <div style={{ fontSize: '0.78rem', color: '#10b981', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
              <span>▲ 14 Mandatory AICTE Rules Met</span>
            </div>
          </div>

          {/* Clay Donut Gauge */}
          <div className="clay-meter-circle">
            <svg viewBox="0 0 36 36" style={{ width: '84px', height: '84px', transform: 'rotate(-90deg)' }}>
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="#e2e8f0"
                strokeWidth="3.8"
              />
              <path
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="url(#clayBlueGrad)"
                strokeWidth="3.8"
                strokeDasharray="94, 100"
              />
              <defs>
                <linearGradient id="clayBlueGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" stopColor="#2f69ff" />
                  <stop offset="100%" stopColor="#1545e6" />
                </linearGradient>
              </defs>
            </svg>
            <div style={{ position: 'absolute', fontSize: '1rem', fontWeight: 800, color: 'var(--clay-blue-primary)' }}>
              94%
            </div>
          </div>
        </div>

        {/* Card 2: Smooth Wave Chart (Matching the exact wave chart in Reference Image) */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <div>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                7-Day Scrutiny Volume
              </div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
                +1,280 Files
              </div>
            </div>
            <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#10b981', background: '#ecfdf5', padding: '0.2rem 0.6rem', borderRadius: '50px' }}>
              ▲ +22.1%
            </span>
          </div>

          {/* Smooth Blue Wave Line from Reference Image */}
          <div style={{ marginTop: '0.75rem' }}>
            <svg viewBox="0 0 180 40" style={{ width: '100%', height: '42px', overflow: 'visible' }}>
              <path
                d="M 5,28 Q 35,5 65,26 T 125,20 T 165,10"
                fill="none"
                stroke="#2563eb"
                strokeWidth="3.2"
                strokeLinecap="round"
              />
              <circle cx="165" cy="10" r="4.5" fill="#2563eb" stroke="#ffffff" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Card 3: Shared Campus Status */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Multi-College Campus
              </span>
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.65rem', borderRadius: '50px', background: '#fef2f2', color: '#ef4444' }}>
                {campusData?.conflicts_count ?? 2} Overlaps
              </span>
            </div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.35rem' }}>
              Vidya Vihar Campus
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
              3 Colleges sharing common facilities & faculty
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => onNavigate('campus_reconciliation')}
              className="clay-btn-pill clay-btn-white"
              style={{ width: '100%', padding: '0.55rem 1rem', fontSize: '0.82rem' }}
            >
              <span>Inspect Campus Overlaps</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 4: Verified Rules Engine */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', width: '100%' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Automated Rules Active
            </div>
            <div style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--clay-text-primary)', margin: '0.35rem 0' }}>
              9 Rules
            </div>
            <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)' }}>
              Faculty SFR 1:20 · Land Deeds · Fire NOC
            </div>
          </div>

          <div style={{ marginTop: '0.85rem' }}>
            <button
              onClick={() => onNavigate('simulator')}
              className="clay-btn-pill clay-btn-white"
              style={{ width: '100%', padding: '0.55rem 1rem', fontSize: '0.82rem' }}
            >
              <span>Launch Simulator</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Choose an Institution to Review Section (Full Width Cards) */}
      <div style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
              Registered Institutions Under Review
            </h2>
            <p style={{ fontSize: '0.88rem', color: 'var(--clay-text-secondary)' }}>
              Select any college below to inspect its application, view extracted proofs, or test adjustments.
            </p>
          </div>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
          gap: '1.5rem',
          width: '100%'
        }}>
          {/* College 1: Apex Institute (Compliant) */}
          <div 
            onClick={() => { onSelectCase('case_a'); onNavigate('scrutiny'); }}
            className="clay-box" 
            style={{ cursor: 'pointer', borderTop: '6px solid #10b981', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '50px', background: '#ecfdf5', color: '#059669' }}>
                  🟢 Fully Compliant
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>APP-CASE-A</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.4rem' }}>
                Apex Institute of Technology
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                Engineering college with 300 seats and 24 faculty members. Teacher-student ratio is 1:12.5. All statutory clearances are valid.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#10b981' }}>0 Discrepancies</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--clay-blue-primary)' }}>
                <span>Inspect Application</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>

          {/* College 2: Bharat College (Intake Over-claim) */}
          <div 
            onClick={() => { onSelectCase('case_b'); onNavigate('scrutiny'); }}
            className="clay-box" 
            style={{ cursor: 'pointer', borderTop: '6px solid #f59e0b', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '50px', background: '#fffbeb', color: '#d97706' }}>
                  🟡 Intake Exceeds Capacity
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>APP-CASE-B</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.4rem' }}>
                Bharat College of Engineering
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                Sanctioned student intake is 480, but available faculty is only 18 (SFR 1:26.7). Maximum permissible intake is 360 students.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#f59e0b' }}>Shortage of 6 Faculty</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--clay-blue-primary)' }}>
                <span>Inspect Application</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>

          {/* College 3: Chitkara Institute (Multi-College Campus Conflict) */}
          <div 
            onClick={() => { onSelectCase('case_c'); onNavigate('scrutiny'); }}
            className="clay-box" 
            style={{ cursor: 'pointer', borderTop: '6px solid #ef4444', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.25rem 0.75rem', borderRadius: '50px', background: '#fef2f2', color: '#ef4444' }}>
                  🔴 Multi-College Conflict
                </span>
                <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>APP-CASE-C</span>
              </div>

              <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.4rem' }}>
                Chitkara Institute of Technology
              </h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.45, marginBottom: '1.25rem' }}>
                Shares Vidya Vihar Campus with Pharmacy and Management colleges. Overlapping claims on Dr. Sharma and Building Block A.
              </p>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '0.85rem' }}>
              <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#ef4444' }}>2 Overlaps Identified</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', fontWeight: 700, color: 'var(--clay-blue-primary)' }}>
                <span>Inspect Application</span>
                <ArrowRight size={15} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
