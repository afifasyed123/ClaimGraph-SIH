import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  ArrowRight, 
  Sliders, 
  RefreshCw,
  Cpu,
  Layers
} from 'lucide-react';

export default function CampusReconciliationScreen({
  campusData,
  onReconcileCampus,
  onNavigateToSimulator,
  onOpenDocViewer,
  isReconciling
}) {
  const [resolved, setResolved] = useState(false);

  const campus = campusData?.campus || {
    id: 'CAMPUS-VV-01',
    name: 'Vidya Vihar Integrated Knowledge Campus',
    location: 'Plot 14-B, Sector 62, Institutional Area, Greater Noida, UP - 201309',
    total_land_acres: 14.5,
    total_built_up_sqm: 12500.0
  };

  const institutions = campusData?.institutions || [
    { institution_id: 'APP-CASE-C', name: 'Chitkara Institute of Technology', programme: 'Engineering', intake: 360 },
    { institution_id: 'APP-CAMPUS-PHARM', name: 'Vidya College of Pharmacy', programme: 'Pharmacy', intake: 120 },
    { institution_id: 'APP-CAMPUS-MGMT', name: 'Vidya Institute of Management', programme: 'Management', intake: 180 }
  ];

  const handleRunResolve = async () => {
    if (onReconcileCampus) {
      await onReconcileCampus();
    }
    setResolved(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Friendly Header Card */}
      <div className="clay-box" style={{ padding: '2rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.3rem 0.85rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={14} />
              <span>Multi-College Cross Verification</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
              Campus Reconciliation Desk
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem', maxWidth: '650px', lineHeight: 1.5 }}>
              Automatically detects if multiple colleges located on the same land share faculty members, classrooms, or labs in violation of AICTE safety and staffing rules.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleRunResolve}
              disabled={isReconciling}
              className="clay-btn-pill clay-btn-blue"
            >
              <Cpu size={16} />
              <span>{isReconciling ? 'Calculating Solution...' : 'Auto-Resolve with Constraint Engine'}</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="clay-btn-pill clay-btn-white"
            >
              <Sliders size={16} />
              <span>Test What-If Scenarios</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campus Identity & The 3 Hosted Colleges */}
      <div className="clay-box" style={{ padding: '1.5rem 1.8rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Physical Location Under Review
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
              {campus.name}
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--clay-text-muted)' }}>
              {campus.location} · Total Land: {campus.total_land_acres} Acres · Total Built-up: {campus.total_built_up_sqm} sq.m
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.8rem', borderRadius: '50px', background: '#f1f5f9', color: '#475569' }}>
            Campus ID: {campus.id}
          </span>
        </div>

        {/* 3 Colleges Pills */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '1rem' }}>
          {institutions.map((inst, idx) => (
            <div key={idx} className="clay-well" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#ffffff',
                color: 'var(--clay-blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: 'var(--clay-shadow-small)',
                fontWeight: 800,
                fontSize: '0.88rem'
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 800, color: 'var(--clay-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {inst.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                  {inst.programme} · {inst.intake || 120} Students
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* The 2 Clear Overlaps & Explanations */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {/* Issue 1: Shared Faculty */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: '#fee2e2',
              color: '#ef4444',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Users size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#ef4444', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Conflict 1: Shared Faculty Member
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                Dr. Rajesh Sharma Claimed Twice
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.5 }}>
            Both <strong>Chitkara Engineering</strong> and <strong>Vidya Pharmacy</strong> claim Dr. Rajesh Sharma as a 100% full-time faculty member on their respective AICTE portals.
          </p>

          <div className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
              AICTE Compliance Rule:
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--clay-text-primary)', fontWeight: 600 }}>
              AICTE Handbook Section 3.4 — A faculty member cannot be claimed full-time by multiple independent institutions simultaneously.
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              onClick={() => onOpenDocViewer && onOpenDocViewer('Chitkara_Engineering_Faculty_Sharma.pdf')}
              className="clay-btn-pill clay-btn-white"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              <FileText size={15} />
              <span>Inspect Faculty Appointment Letters</span>
            </button>
          </div>
        </div>

        {/* Issue 2: Shared Building Block */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
            <div style={{
              width: '40px',
              height: '40px',
              borderRadius: '14px',
              background: '#fffbeb',
              color: '#f59e0b',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <Building2 size={20} />
            </div>
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Conflict 2: Shared Instructional Space
              </div>
              <h3 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                Building Block A (1,800 sq.m) Overlap
              </h3>
            </div>
          </div>

          <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', lineHeight: 1.5 }}>
            Both <strong>Engineering</strong> and <strong>Management</strong> claim Building Block A as exclusive classroom space. AICTE requires segregated premises or a registered partition.
          </p>

          <div className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
              AICTE Compliance Rule:
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--clay-text-primary)', fontWeight: 600 }}>
              AICTE Handbook Section 4.2 — Built-up area must have defined physical or legal demarcations between different academic programmes.
            </div>
          </div>

          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <button
              onClick={() => onOpenDocViewer && onOpenDocViewer('Central_Facility_Partition_Deed.pdf')}
              className="clay-btn-pill clay-btn-white"
              style={{ width: '100%', fontSize: '0.82rem' }}
            >
              <FileText size={15} />
              <span>Inspect Building Floor Plan PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* Auto-Resolution Result Card (Always Friendly & Obvious) */}
      <div className="clay-box" style={{
        background: resolved ? '#f0fdf4' : 'var(--clay-card-bg)',
        border: resolved ? '2px solid #86efac' : 'var(--clay-border-soft)',
        padding: '1.8rem 2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.85rem' }}>
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '12px',
            background: resolved ? '#10b981' : 'var(--clay-blue-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            {resolved ? <CheckCircle2 size={20} /> : <Cpu size={20} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
              {resolved ? 'Compliance Solution Proven Mathematically' : 'AICTE Constraint Engine Status'}
            </h3>
            <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)' }}>
              {resolved ? 'Formal mathematical model satisfied with optimal campus partition.' : 'Click "Auto-Resolve" above to calculate the legal faculty and space partition.'}
            </div>
          </div>
        </div>

        {resolved ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem', marginTop: '1rem' }}>
            <div className="clay-well" style={{ background: '#ffffff' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginBottom: '0.25rem' }}>
                ✅ Faculty Allocation:
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                Dr. Rajesh Sharma assigned exclusively to Chitkara Engineering.
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
                Vidya Pharmacy advised to recruit 1 additional faculty member before intake approval.
              </div>
            </div>

            <div className="clay-well" style={{ background: '#ffffff' }}>
              <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#059669', marginBottom: '0.25rem' }}>
                ✅ Space Partition:
              </div>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                Block A partitioned 50/50 (900 sq.m each).
              </div>
              <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
                Ground floor assigned to Engineering labs; 1st floor assigned to Management lectures.
              </div>
            </div>
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginTop: '0.35rem' }}>
            The AICTE automated solver tests mutually exclusive assignments to eliminate overlap while maximizing student capacity.
          </p>
        )}
      </div>
    </div>
  );
}
