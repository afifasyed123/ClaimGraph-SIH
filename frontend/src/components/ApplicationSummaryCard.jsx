import React from 'react';
import { Building2, FileText, Users, School, Maximize, AlertCircle, CheckCircle2 } from 'lucide-react';

export default function ApplicationSummaryCard({ application, findingsSummary }) {
  if (!application) return null;

  const intake = application.proposed_intake || 0;
  const faculty = application.faculty_count || 0;
  const ratio = faculty > 0 ? (intake / faculty).toFixed(1) : 'N/A';
  const isRatioViolated = faculty > 0 && (intake / faculty) > 15;

  const totalFindings = findingsSummary?.total || 0;
  const highCount = findingsSummary?.by_severity?.high || 0;
  const medCount = findingsSummary?.by_severity?.medium || 0;

  return (
    <div className="glass-card col-8" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-blue">
              <School size={12} /> {application.category}
            </span>
            <span className="badge badge-muted">
              {application.type}
            </span>
            {totalFindings === 0 ? (
              <span className="badge badge-emerald">
                <CheckCircle2 size={12} /> Zero Discrepancies
              </span>
            ) : (
              <span className="badge badge-rose">
                <AlertCircle size={12} /> {totalFindings} Discrepancy(s) Found
              </span>
            )}
          </div>
          <h1 style={{ fontSize: '1.35rem', fontWeight: 700, letterSpacing: '-0.02em', color: 'var(--text-primary)' }}>
            {application.name}
          </h1>
          <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
            Reference: {application.reference} • Institution ID: {application.institution_id}
          </div>
        </div>

        {/* Severity counters */}
        <div style={{ display: 'flex', gap: '0.6rem' }}>
          <div style={{
            background: 'rgba(244, 63, 94, 0.1)',
            border: '1px solid rgba(244, 63, 94, 0.25)',
            borderRadius: '12px',
            padding: '0.5rem 0.85rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fb7185' }}>{highCount}</div>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>High Discrepancies</div>
          </div>
          <div style={{
            background: 'rgba(245, 158, 11, 0.1)',
            border: '1px solid rgba(245, 158, 11, 0.25)',
            borderRadius: '12px',
            padding: '0.5rem 0.85rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#fbbf24' }}>{medCount}</div>
            <div style={{ fontSize: '0.68rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 600 }}>Medium Gaps</div>
          </div>
        </div>
      </div>

      {/* Grid of Stated Claims */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
        gap: '0.85rem',
        marginTop: '0.75rem'
      }}>
        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.85rem'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Users size={13} color="#60a5fa" /> Proposed Intake
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {intake || <span style={{ color: '#fb7185' }}>Blank</span>} <span style={{ fontSize: '0.8rem', fontWeight: 400, color: 'var(--text-muted)' }}>seats</span>
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.85rem'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Building2 size={13} color="#a855f7" /> Appointed Faculty
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: faculty ? 'var(--text-primary)' : '#fb7185', marginTop: '0.25rem' }}>
            {faculty !== null && faculty !== undefined ? faculty : 'Not Provided'}
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.85rem'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            Ratio (Norm 1:15)
          </div>
          <div style={{ 
            fontSize: '1.25rem', 
            fontWeight: 700, 
            color: isRatioViolated ? '#fb7185' : '#34d399', 
            marginTop: '0.25rem' 
          }}>
            1:{ratio} {isRatioViolated && <span style={{ fontSize: '0.7rem', color: '#fb7185' }}>(Deficit)</span>}
          </div>
        </div>

        <div style={{
          background: 'rgba(15, 23, 42, 0.6)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '12px',
          padding: '0.85rem'
        }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Maximize size={13} color="#06b6d4" /> Carpet Area
          </div>
          <div style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.25rem' }}>
            {application.carpet_area_sqm ? `${application.carpet_area_sqm} m²` : 'N/A'}
          </div>
        </div>
      </div>
    </div>
  );
}
