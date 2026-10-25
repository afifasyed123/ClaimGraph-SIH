import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ChevronRight, 
  Filter, 
  FileSearch, 
  ArrowRight,
  ShieldAlert,
  Info
} from 'lucide-react';

export default function FindingsTable({ 
  findings, 
  onSelectFinding 
}) {
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filtered = findings.filter(f => {
    if (filterSeverity === 'ALL') return true;
    return f.severity.toLowerCase() === filterSeverity.toLowerCase();
  });

  return (
    <div className="glass-card col-12" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Validation Findings & Explainable Evidence (Screen 3)
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Every finding links directly to a source document, page, rule, and recommended next step.
          </div>
        </div>

        {/* Severity Filters */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Filter size={13} color="var(--text-muted)" />
          {['ALL', 'HIGH', 'MEDIUM'].map(sev => (
            <button
              key={sev}
              className={`btn btn-sm ${filterSeverity === sev ? 'btn-primary' : 'btn-outline'}`}
              style={{ fontSize: '0.7rem', padding: '0.2rem 0.6rem' }}
              onClick={() => setFilterSeverity(sev)}
            >
              {sev}
            </button>
          ))}
        </div>
      </div>

      {findings.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '3rem 1rem',
          background: 'rgba(16, 185, 129, 0.05)',
          borderRadius: '14px',
          border: '1px dashed rgba(16, 185, 129, 0.3)'
        }}>
          <CheckCircle2 size={42} color="#34d399" style={{ margin: '0 auto 0.75rem auto' }} />
          <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#34d399' }}>
            Zero Seeded Discrepancies Found
          </h3>
          <p style={{ fontSize: '0.82rem', color: 'var(--text-secondary)', maxWidth: '520px', margin: '0.35rem auto 0 auto' }}>
            All institutional claims match verified PDF evidence, statutory student-faculty ratios (1:15), valid regulatory dates, and historical records.
          </p>
        </div>
      ) : (
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'separate', borderSpacing: '0 0.5rem', fontSize: '0.82rem' }}>
            <thead>
              <tr style={{ color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                <th style={{ padding: '0.5rem 0.85rem' }}>Severity</th>
                <th style={{ padding: '0.5rem 0.85rem' }}>Finding Type</th>
                <th style={{ padding: '0.5rem 0.85rem' }}>Claim / Extracted</th>
                <th style={{ padding: '0.5rem 0.85rem' }}>Comparison Benchmark</th>
                <th style={{ padding: '0.5rem 0.85rem' }}>Source Document & Page</th>
                <th style={{ padding: '0.5rem 0.85rem' }}>Action Status</th>
                <th style={{ padding: '0.5rem 0.85rem', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(f => {
                const isHigh = f.severity.toLowerCase() === 'high';
                return (
                  <tr 
                    key={f.id}
                    onClick={() => onSelectFinding(f)}
                    style={{
                      background: 'rgba(30, 41, 59, 0.45)',
                      border: '1px solid var(--border-subtle)',
                      borderRadius: '10px',
                      cursor: 'pointer',
                      transition: 'all 0.15s ease'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(51, 65, 85, 0.6)'}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(30, 41, 59, 0.45)'}
                  >
                    <td style={{ padding: '0.75rem 0.85rem', borderTopLeftRadius: '10px', borderBottomLeftRadius: '10px' }}>
                      <span className={`badge ${isHigh ? 'badge-rose' : 'badge-amber'}`}>
                        {f.severity}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {f.type.replace('_', ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: '#fb7185', fontWeight: 600 }}>
                      {f.extracted_value || 'Missing'}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: '#38bdf8' }}>
                      {f.comparison_value || 'Regulatory Requirement'}
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', color: 'var(--text-secondary)' }}>
                      <div style={{ fontWeight: 500, color: 'var(--text-primary)' }}>{f.source_document}</div>
                      <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{f.page_or_field}</div>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem' }}>
                      <span className="badge badge-muted">
                        {f.status}
                      </span>
                    </td>
                    <td style={{ padding: '0.75rem 0.85rem', textAlign: 'right', borderTopRightRadius: '10px', borderBottomRightRadius: '10px' }}>
                      <button className="btn btn-outline btn-sm" style={{ padding: '0.25rem 0.6rem', fontSize: '0.72rem' }}>
                        Review <ChevronRight size={12} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
