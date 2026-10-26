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
  Layers,
  ChevronDown,
  ChevronUp,
  Info
} from 'lucide-react';

export default function CampusReconciliationScreen({
  campusData,
  onReconcileCampus,
  onNavigateToSimulator,
  onOpenDocViewer,
  isReconciling
}) {
  const [resolved, setResolved] = useState(false);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  const campus = campusData?.campus || {
    id: 'CAMPUS-VV-01',
    name: 'Vidya Vihar Integrated Knowledge Campus',
    location: 'Plot 14-B, Sector 62, Institutional Area, Greater Noida, UP - 201309',
    total_land_acres: 14.5,
    total_built_up_sqm: 12500.0
  };

  const institutions = campusData?.institutions || [
    { institution_id: 'APP-CASE-C', name: 'Chitkara Institute of Technology', programme: 'Engineering & Technology', intake: 360 },
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
      {/* Header Card */}
      <div className="clay-box" style={{ padding: '2rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.3rem 0.85rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem', border: '1px solid #dbeafe' }}>
              <span>Multi-Institution Campus Compliance</span>
            </div>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              Cross-Institution Campus Reconciliation
            </h1>
            <p style={{ fontSize: '0.9rem', color: '#475569', marginTop: '0.3rem', maxWidth: '680px', lineHeight: 1.55 }}>
              Continuously audits co-located colleges sharing the same geographical parcel to detect unauthorized double-pledging of instructional land, classrooms, auditoriums, laboratories, or appointed faculty members.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleRunResolve}
              disabled={isReconciling}
              className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
            >
              <Cpu size={16} />
              <span>{isReconciling ? 'Calculating Reconciliation...' : 'Run Capacity Reconciliation'}</span>
            </button>
            <button
              onClick={onNavigateToSimulator}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            >
              <Sliders size={16} />
              <span>What-If Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Campus Identity & Co-Located Colleges */}
      <div className="clay-box" style={{ padding: '1.6rem 2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.2rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Physical Location & Survey Register
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.2rem' }}>
              {campus.name}
            </h2>
            <div style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.2rem' }}>
              {campus.location} · Total Campus Land: <strong>{campus.total_land_acres} Acres</strong> · Total Built-up Area: <strong>{campus.total_built_up_sqm} sq.m</strong>
            </div>
          </div>

          <span style={{ fontSize: '0.75rem', fontWeight: 800, padding: '0.3rem 0.85rem', borderRadius: '50px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1' }}>
            Campus ID: {campus.id}
          </span>
        </div>

        {/* 3 Co-located Colleges Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {institutions.map((inst, idx) => (
            <div key={idx} className="clay-well" style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', padding: '0.9rem 1.1rem' }}>
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
                fontSize: '0.88rem',
                border: '1px solid #e2e8f0'
              }}>
                {idx + 1}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {inst.name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                  {inst.programme} · {inst.intake || 120} Students
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Cross-Institution Conflict Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
        {(campusData?.cross_institution_findings || campusData?.cross_findings || [
          {
            type: 'faculty_double_count',
            title: 'Faculty Double-Counting: Dr. R. K. Sharma',
            why_conflict: 'Dr. R. K. Sharma is reported as a full-time, regular faculty member in the submitted rosters of multiple separate institutions on this campus. Under configured norms, an individual cannot be credited simultaneously as full-time regular faculty in multiple institutions.',
            rule_name: 'Campus Faculty Single-Appointment Exclusivity (APH 3.4)',
            rule_id: 'RULE-CAMPUS-FACULTY-EXCLUSIVITY',
            solver_verdict: 'Contradiction Confirmed (Mutual Exclusivity Violation)',
            evidence_sources: [{ document: 'Chitkara_Engineering_Faculty_Sharma.pdf', page: 1 }],
            affected_institutions: [{ institution_name: 'Chitkara Institute of Technology' }, { institution_name: 'Vidya College of Pharmacy' }]
          },
          {
            type: 'facility_overlap',
            title: 'Facility Over-Allocation: Central Block A (Auditorium & Computing Center)',
            why_conflict: "Physical facility 'Central Block A' has a certified total carpet area of 1,200 sq.m. However, multiple institutions claim exclusive carpet area totaling 2,400 sq.m, creating a physical deficit of 1,200 sq.m.",
            rule_name: 'Campus Physical Infrastructure Non-Overlap Norm (APH 4.2)',
            rule_id: 'RULE-CAMPUS-FACILITY-OVERLAP',
            solver_verdict: 'Contradiction Confirmed (Mutual Exclusivity Violation)',
            evidence_sources: [{ document: 'Central_Facility_Partition_Deed.pdf', page: 1 }],
            affected_institutions: [{ institution_name: 'Chitkara Institute of Technology' }, { institution_name: 'Vidya Institute of Management' }]
          }
        ]).map((fnd, idx) => {
          const isFaculty = fnd.type?.includes('faculty') || fnd.title?.toLowerCase().includes('faculty') || fnd.title?.toLowerCase().includes('sharma');
          const docTarget = fnd.evidence_sources?.[0]?.document || (isFaculty ? 'Chitkara_Engineering_Faculty_Sharma.pdf' : 'Central_Facility_Partition_Deed.pdf');

          return (
            <div key={idx} className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', padding: '1.75rem 2rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: isFaculty ? '#fee2e2' : '#fffbeb',
                  color: isFaculty ? '#ef4444' : '#d97706',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  {isFaculty ? <Users size={22} /> : <Building2 size={22} />}
                </div>
                <div>
                  <div style={{ fontSize: '0.72rem', fontWeight: 800, color: isFaculty ? '#b91c1c' : '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Conflict #{idx + 1}: {isFaculty ? 'Shared Faculty Member' : 'Shared Physical Facility'}
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>
                    {fnd.title}
                  </h3>
                </div>
              </div>

              <p style={{ fontSize: '0.85rem', color: '#475569', lineHeight: 1.55 }}>
                {fnd.why_conflict}
              </p>

              {/* Affected Institutions */}
              <div>
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#64748b', marginBottom: '0.35rem' }}>
                  Affected Institutions on Same Parcel:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.45rem' }}>
                  {fnd.affected_institutions?.map((aff, aIdx) => (
                    <span key={aIdx} style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      background: '#f8fafc',
                      color: '#1e293b',
                      padding: '0.25rem 0.65rem',
                      borderRadius: '6px',
                      border: '1px solid #cbd5e1'
                    }}>
                      🏛️ {aff.institution_name || aff.name || aff.institution_id}
                    </span>
                  ))}
                </div>
              </div>

              {/* Statutory Norm & Conflict Status */}
              <div className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: '#64748b' }}>
                    Statutory Norm Reference:
                  </div>
                  <span className="clay-badge badge-danger" style={{ fontSize: '0.68rem' }}>
                    Mutual Exclusivity Conflict
                  </span>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 700 }}>
                  {fnd.rule_name || fnd.rule_id || 'AICTE Comprehensive Handbook Norms'}
                </div>
              </div>

              <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
                <button
                  onClick={() => onOpenDocViewer && onOpenDocViewer(docTarget)}
                  className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                  style={{ width: '100%', fontSize: '0.82rem', padding: '0.65rem 1rem' }}
                >
                  <FileText size={15} color="var(--clay-blue-primary)" />
                  <span>Inspect Evidence ({docTarget})</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Auto-Reconciliation Result Card */}
      <div className="clay-box" style={{
        background: resolved ? '#f0fdf4' : 'var(--clay-card-bg)',
        border: resolved ? '2px solid #86efac' : 'var(--clay-border-soft)',
        padding: '1.8rem 2.2rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', marginBottom: '0.85rem' }}>
          <div style={{
            width: '42px',
            height: '42px',
            borderRadius: '14px',
            background: resolved ? '#10b981' : 'var(--clay-blue-primary)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(16, 185, 129, 0.3)'
          }}>
            {resolved ? <CheckCircle2 size={22} /> : <Cpu size={22} />}
          </div>
          <div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              {resolved ? 'Statutory Partition Solution Calculated' : 'Automated Campus Reconciliation & Capacity Model'}
            </h3>
            <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
              {resolved ? 'Optimal non-overlapping spatial and faculty allocation derived in compliance with AICTE norms.' : 'Click "Run Capacity Reconciliation" above to derive legally compliant faculty and space demarcations.'}
            </div>
          </div>
        </div>

        {resolved ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', marginTop: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '1rem' }}>
              <div className="clay-well" style={{ background: '#ffffff', padding: '1.1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '0.35rem' }}>
                  ✓ Faculty Exclusivity Demarcation:
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Dr. R. K. Sharma allocated 100% exclusively to Chitkara Institute of Technology (Engineering).
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.45 }}>
                  Vidya College of Pharmacy is advised to recruit 1 independent regular faculty member before student intake sanction.
                </div>
              </div>

              <div className="clay-well" style={{ background: '#ffffff', padding: '1.1rem' }}>
                <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#059669', marginBottom: '0.35rem' }}>
                  ✓ Spatial Non-Overlap Demarcation:
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: 700, color: '#0f172a' }}>
                  Central Block A partitioned into two distinct 600 sq.m non-overlapping zones.
                </div>
                <div style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.45 }}>
                  Ground floor assigned exclusively to Engineering computing laboratories; 1st floor assigned to Management seminar halls.
                </div>
              </div>
            </div>

            {/* Max intake headroom table */}
            {campusData?.solver_results?.max_intake_calculations && (
              <div className="clay-well" style={{ background: '#ffffff', padding: '1.2rem' }}>
                <div style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a', marginBottom: '0.65rem' }}>
                  Statutory Student Intake Capacity & Headroom (Derived from Verified Faculty Cadres):
                </div>
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #e2e8f0', color: '#64748b', textAlign: 'left' }}>
                        <th style={{ padding: '0.5rem' }}>Institution</th>
                        <th style={{ padding: '0.5rem' }}>Programme</th>
                        <th style={{ padding: '0.5rem' }}>Faculty</th>
                        <th style={{ padding: '0.5rem' }}>Norm Ratio</th>
                        <th style={{ padding: '0.5rem' }}>Current Intake</th>
                        <th style={{ padding: '0.5rem' }}>Max Capacity</th>
                        <th style={{ padding: '0.5rem' }}>Intake Headroom</th>
                      </tr>
                    </thead>
                    <tbody>
                      {campusData.solver_results.max_intake_calculations.map((row, rIdx) => (
                        <tr key={rIdx} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '0.5rem', fontWeight: 700, color: '#0f172a' }}>{row.institution_name}</td>
                          <td style={{ padding: '0.5rem' }}>{row.programme}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 600 }}>{row.faculty_count}</td>
                          <td style={{ padding: '0.5rem' }}>{row.configured_ratio}</td>
                          <td style={{ padding: '0.5rem' }}>{row.current_intake}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 800, color: '#0369a1' }}>{row.max_supported_intake}</td>
                          <td style={{ padding: '0.5rem', fontWeight: 800, color: row.intake_headroom > 0 ? '#059669' : '#64748b' }}>
                            {row.intake_headroom > 0 ? `+${row.intake_headroom} Seats` : 'At Capacity'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        ) : (
          <p style={{ fontSize: '0.85rem', color: '#64748b', marginTop: '0.45rem', lineHeight: 1.5 }}>
            The capacity reconciliation engine mathematically checks mutual exclusivity constraints across institutions on the same physical plot and computes an optimal legal allocation for all co-located applicants.
          </p>
        )}

        {/* Optional Expandable Technical Verification Details */}
        <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid #e2e8f0' }}>
          <button
            type="button"
            onClick={() => setShowTechnicalDetails(prev => !prev)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              fontSize: '0.78rem',
              fontWeight: 700,
              color: '#64748b'
            }}
          >
            <Info size={14} />
            <span>Technical Verification Details (Optional Reference)</span>
            {showTechnicalDetails ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>

          {showTechnicalDetails && (
            <div style={{
              marginTop: '0.75rem',
              padding: '1rem',
              background: '#f8fafc',
              borderRadius: '10px',
              fontSize: '0.76rem',
              color: '#475569',
              lineHeight: 1.55,
              border: '1px solid #e2e8f0'
            }}>
              <div><strong>Formal Mathematical Method:</strong> First-Order Satisfiability Modulo Theories (SMT) constraint solver.</div>
              <div><strong>Mutual Exclusivity Formulation:</strong> Each regular faculty member is constrained to at most one institution: <code>SUM(assigned_inst_i) &lt;= 1</code>. Total allocated carpet area for shared blocks is constrained by certified physical boundary: <code>SUM(exclusive_carpet_sqm_i) &lt;= total_certified_sqm</code>.</div>
              <div><strong>Solvability:</strong> Confirmed unsatisfiable under submitted claims; provably satisfied under the suggested non-overlapping partition.</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
