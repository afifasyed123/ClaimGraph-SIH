import React, { useState } from 'react';
import { BookOpenCheck, ShieldAlert, Sparkles, CheckCircle2, Sliders, ToggleLeft, ToggleRight, Info } from 'lucide-react';

export default function RuleRegistryScreen({ rules, onToggleRule }) {
  const [activeRules, setActiveRules] = useState(
    (rules || []).reduce((acc, r) => ({ ...acc, [r.id]: r.is_active ?? true }), {})
  );

  const handleToggle = async (ruleId) => {
    const newState = !activeRules[ruleId];
    setActiveRules(prev => ({ ...prev, [ruleId]: newState }));
    try {
      if (onToggleRule) {
        await onToggleRule(ruleId, newState);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="clay-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="clay-badge badge-neutral">
            <BookOpenCheck size={12} /> Configurable Rule Base
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--clay-secondary)', fontWeight: 600 }}>
            Regulatory Engine Provenance & Thresholds
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clay-text-dark)', letterSpacing: '-0.02em' }}>
          Regulatory Rule Registry
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--clay-secondary)', marginTop: '0.2rem', maxWidth: '850px' }}>
          Deterministic validation rules applied across institutional applications, documentary evidence cross-checks, and campus-level Z3 constraints.
        </p>

        {/* Mandatory Illustrative Label Banner */}
        <div style={{ background: '#fffbeb', border: '1px solid #fde68a', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.85rem', fontSize: '0.72rem', color: '#92400e', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={14} color="#b45309" />
          <span>
            <strong>Illustrative Configurable Demo Rules — Not Official AICTE Requirements.</strong> Ratios, building area limits, and checklist definitions are parameterized for demonstration workflows.
          </span>
        </div>
      </div>

      {/* Rules Table */}
      <div className="clay-card" style={{ padding: '0.5rem', overflowX: 'auto' }}>
        <table className="clay-table">
          <thead>
            <tr>
              <th>Rule ID</th>
              <th>Rule Name & Description</th>
              <th>Category</th>
              <th>Severity</th>
              <th>Required Inputs</th>
              <th>Provenance / Source</th>
              <th>Version & Date</th>
              <th style={{ textAlign: 'right' }}>Active State</th>
            </tr>
          </thead>
          <tbody>
            {(rules || []).map((r) => {
              const isActive = activeRules[r.id] ?? true;
              const isHigh = r.severity?.toLowerCase() === 'high';

              return (
                <tr key={r.id}>
                  <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 700, fontSize: '0.75rem', color: '#1e3a8a' }}>
                    {r.id}
                  </td>
                  <td>
                    <div style={{ fontWeight: 700, color: 'var(--clay-text-dark)' }}>{r.name}</div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--clay-secondary)', marginTop: '0.15rem', maxWidth: '300px' }}>
                      {r.description}
                    </div>
                  </td>
                  <td>
                    <span className="clay-badge badge-neutral" style={{ fontSize: '0.62rem', textTransform: 'none' }}>
                      {r.type}
                    </span>
                  </td>
                  <td>
                    <span className={`clay-badge ${isHigh ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.62rem' }}>
                      {r.severity}
                    </span>
                  </td>
                  <td style={{ fontSize: '0.7rem', fontFamily: 'var(--font-mono)', color: 'var(--clay-secondary)' }}>
                    {Array.isArray(r.inputs) ? r.inputs.join(', ') : r.inputs}
                  </td>
                  <td style={{ fontSize: '0.68rem', color: '#64748b' }}>
                    {r.source}
                  </td>
                  <td style={{ fontSize: '0.7rem', color: 'var(--clay-secondary)', whiteSpace: 'nowrap' }}>
                    <div>v{r.version || '2026.1'}</div>
                    <div style={{ fontSize: '0.65rem', color: 'var(--clay-text-muted)' }}>{r.effective_date || '2026-04-01'}</div>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <button
                      onClick={() => handleToggle(r.id)}
                      className={`clay-btn clay-btn-sm ${isActive ? 'clay-btn-success' : ''}`}
                      style={{ padding: '0.25rem 0.65rem' }}
                    >
                      {isActive ? 'Active' : 'Disabled'}
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
