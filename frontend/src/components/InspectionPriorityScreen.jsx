import React, { useState } from 'react';
import { Flame, ShieldAlert, CheckCircle2, ChevronRight, Eye, Building, Sparkles, Info } from 'lucide-react';

export default function InspectionPriorityScreen({ priorityData, onSelectTarget }) {
  const [selectedEntityId, setSelectedEntityId] = useState(
    priorityData?.ranked_targets?.[0]?.entity_id || 'CAMPUS-VV-01'
  );

  const targets = priorityData?.ranked_targets || [];
  const selectedEntity = targets.find(t => t.entity_id === selectedEntityId) || targets[0];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      {/* Header */}
      <div className="clay-card" style={{ padding: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
          <span className="clay-badge badge-warning">
            <Flame size={12} /> Priority Scheduling Intelligence
          </span>
          <span style={{ fontSize: '0.72rem', color: 'var(--clay-secondary)', fontWeight: 600 }}>
            Transparent Multi-Factor Risk Heuristics
          </span>
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clay-text-dark)', letterSpacing: '-0.02em' }}>
          Physical Inspection Prioritization
        </h1>
        <p style={{ fontSize: '0.82rem', color: 'var(--clay-secondary)', marginTop: '0.2rem', maxWidth: '850px' }}>
          Ranks institutions and shared campuses for on-site expert committee scrutiny based on verifiable discrepancy severity and multi-college collisions.
        </p>

        {/* Responsible AI Disclaimer */}
        <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', padding: '0.65rem 0.85rem', marginTop: '0.85rem', fontSize: '0.72rem', color: 'var(--clay-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Info size={14} color="#0284c7" />
          <span>
            <strong>Explainability Policy:</strong> Scores reflect transparent additive rule weights (+45 Cross-College Collision, +25 High Severity Finding). Not calibrated fraud probabilities.
          </span>
        </div>
      </div>

      {/* Main Grid: Ranked Target Table + Factor Decomposition Card */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'minmax(380px, 1.3fr) minmax(320px, 1fr)',
        gap: '1.5rem',
        alignItems: 'start'
      }}>
        {/* Ranked Targets Table */}
        <div className="clay-card" style={{ padding: '0.5rem', overflowX: 'auto' }}>
          <div style={{ padding: '0.75rem 1rem 0.5rem', fontWeight: 800, fontSize: '0.85rem', color: 'var(--clay-text-dark)', textTransform: 'uppercase' }}>
            Inspection Priority Queue ({targets.length})
          </div>

          <table className="clay-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Target Campus / College</th>
                <th>Type</th>
                <th>Priority Score</th>
                <th>Tier</th>
                <th style={{ textAlign: 'right' }}>Inspect</th>
              </tr>
            </thead>
            <tbody>
              {targets.map((tgt, idx) => {
                const isSelected = selectedEntity?.entity_id === tgt.entity_id;
                const isHigh = tgt.priority_level === 'High Priority';

                return (
                  <tr 
                    key={tgt.entity_id}
                    onClick={() => setSelectedEntityId(tgt.entity_id)}
                    style={{ 
                      cursor: 'pointer',
                      background: isSelected ? 'var(--clay-primary-light)' : 'transparent'
                    }}
                  >
                    <td style={{ fontWeight: 800, color: 'var(--clay-text-dark)', fontSize: '0.85rem' }}>
                      #{idx + 1}
                    </td>
                    <td>
                      <div style={{ fontWeight: 700, color: 'var(--clay-text-dark)' }}>{tgt.name}</div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--clay-text-muted)', fontFamily: 'var(--font-mono)' }}>{tgt.entity_id}</div>
                    </td>
                    <td>
                      <span className="clay-badge badge-neutral" style={{ fontSize: '0.62rem', textTransform: 'none' }}>
                        {tgt.entity_type}
                      </span>
                    </td>
                    <td>
                      <div style={{ fontSize: '1.05rem', fontWeight: 800, color: isHigh ? '#b91c1c' : '#b45309' }}>
                        {tgt.priority_score} <span style={{ fontSize: '0.65rem', fontWeight: 500, color: 'var(--clay-text-muted)' }}>pts</span>
                      </div>
                    </td>
                    <td>
                      <span className={`clay-badge ${isHigh ? 'badge-danger' : 'badge-warning'}`} style={{ fontSize: '0.62rem' }}>
                        {tgt.priority_level}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="clay-btn clay-btn-sm" style={{ padding: '0.2rem 0.45rem' }}>
                        <ChevronRight size={14} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Factor Decomposition Details Card */}
        {selectedEntity ? (
          <div className="clay-card" style={{ padding: '1.35rem' }}>
            <div style={{ borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1rem' }}>
              <span className={`clay-badge ${selectedEntity.priority_level === 'High Priority' ? 'badge-danger' : 'badge-warning'}`}>
                {selectedEntity.priority_level} ({selectedEntity.priority_score} Points)
              </span>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--clay-text-dark)', marginTop: '0.4rem' }}>
                {selectedEntity.name}
              </h3>
              <div style={{ fontSize: '0.72rem', color: 'var(--clay-secondary)', fontFamily: 'var(--font-mono)' }}>
                Target Ref: {selectedEntity.entity_id}
              </div>
            </div>

            {/* Factor Weight Breakdown */}
            <div style={{ marginBottom: '1.25rem' }}>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--clay-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Transparent Contributing Factors:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                {selectedEntity.factors?.map((f, idx) => (
                  <div key={idx} className="clay-inset" style={{ background: '#f8fafc', padding: '0.65rem 0.85rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                      <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-dark)' }}>
                        {f.factor}
                      </span>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c' }}>
                        +{f.weight} pts
                      </span>
                    </div>
                    <div style={{ fontSize: '0.7rem', color: 'var(--clay-secondary)', lineHeight: 1.4 }}>
                      {f.evidence}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recommended Inspection Focus Areas */}
            <div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: 'var(--clay-secondary)', textTransform: 'uppercase', marginBottom: '0.5rem' }}>
                Recommended On-Site Inspection Focus:
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem' }}>
                {selectedEntity.recommended_focus_areas?.map((fa, idx) => (
                  <div key={idx} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.45rem', fontSize: '0.75rem', color: '#166534', background: '#f0fdf4', padding: '0.5rem 0.75rem', borderRadius: '8px', border: '1px solid #bbf7d0' }}>
                    <CheckCircle2 size={14} color="#15803d" style={{ marginTop: '0.1rem', flexShrink: 0 }} />
                    <span>{fa}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <div className="clay-card" style={{ textAlign: 'center', padding: '3rem' }}>
            Select an inspection target to view breakdown.
          </div>
        )}
      </div>
    </div>
  );
}
