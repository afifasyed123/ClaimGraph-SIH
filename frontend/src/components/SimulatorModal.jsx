import React, { useState } from 'react';
import { 
  X, 
  Sliders, 
  Sparkles, 
  AlertTriangle, 
  CheckCircle, 
  RefreshCw, 
  ArrowRight,
  ShieldAlert,
  Info,
  TrendingUp,
  FileCheck2
} from 'lucide-react';

export default function SimulatorModal({ 
  application, 
  onClose, 
  onRunSimulation, 
  simulationResult, 
  isSimulating 
}) {
  const currentIntake = application?.proposed_intake || 360;
  const currentFaculty = application?.faculty_count || 24;

  const [field, setField] = useState('proposed_intake');
  const [val, setVal] = useState(currentIntake === 360 ? 480 : 360);

  const handleSimulate = () => {
    onRunSimulation(field, val);
  };

  const handleQuickScenario = (targetField, targetVal) => {
    setField(targetField);
    setVal(targetVal);
    onRunSimulation(targetField, targetVal);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '880px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-purple">
                <Sparkles size={11} /> Signature Feature (P0)
              </span>
              <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                Deterministic Delta Engine
              </span>
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Change-Impact Simulator (Screen 6)
            </h2>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
              Edit a value to evaluate ripple effects. Re-runs only dependent regulatory checks and reveals newly flagged, resolved, or unchanged findings.
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Disclaimer Banner (FR-G5 & FR-G6) */}
        <div style={{
          background: 'rgba(139, 92, 246, 0.1)',
          border: '1px solid rgba(139, 92, 246, 0.3)',
          borderRadius: '12px',
          padding: '0.75rem 1rem',
          display: 'flex',
          alignItems: 'center',
          gap: '0.6rem',
          marginBottom: '1.5rem',
          fontSize: '0.78rem',
          color: '#e9d5ff'
        }}>
          <Info size={16} color="#c084fc" />
          <div>
            <strong>Simulation of a proposed change. Not an AICTE decision.</strong>
            <span style={{ opacity: 0.85, marginLeft: '0.4rem' }}>
              The simulation runs in an isolated sandbox and will NOT overwrite the stored institutional application.
            </span>
          </div>
        </div>

        {/* Quick Scenario Triggers */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.4rem' }}>
            Illustrative Scenarios (PRD Section 6)
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickScenario('proposed_intake', 480)}
            >
              <TrendingUp size={13} color="#fb7185" />
              <span>Simulate 360 → 480 Intake (Surge Deficit)</span>
            </button>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickScenario('proposed_intake', 360)}
            >
              <CheckCircle size={13} color="#34d399" />
              <span>Simulate Normalization to 360 Seats</span>
            </button>
            <button 
              className="btn btn-outline btn-sm"
              onClick={() => handleQuickScenario('faculty_count', 32)}
            >
              <FileCheck2 size={13} color="#60a5fa" />
              <span>Simulate Adding 8 Faculty (Cadre Compliance)</span>
            </button>
          </div>
        </div>

        {/* Sandbox Input Form */}
        <div style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr auto', gap: '1rem', alignItems: 'flex-end' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Select Field to Mutate
              </label>
              <select 
                className="input-clean"
                style={{ width: '100%' }}
                value={field}
                onChange={(e) => {
                  setField(e.target.value);
                  setVal(e.target.value === 'proposed_intake' ? 480 : 32);
                }}
              >
                <option value="proposed_intake">proposed_intake (Student Quota)</option>
                <option value="faculty_count">faculty_count (Appointed Professors)</option>
                <option value="carpet_area_sqm">carpet_area_sqm (Instructional Space)</option>
              </select>
            </div>

            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                Hypothetical New Value
              </label>
              <input 
                type="number"
                className="input-clean"
                style={{ width: '100%' }}
                value={val}
                onChange={(e) => setVal(e.target.value)}
              />
            </div>

            <button 
              className="btn btn-purple"
              style={{ padding: '0.65rem 1.25rem' }}
              onClick={handleSimulate}
              disabled={isSimulating}
            >
              <RefreshCw size={14} className={isSimulating ? 'spin' : ''} />
              <span>{isSimulating ? 'Evaluating...' : 'Simulate Delta'}</span>
            </button>
          </div>
        </div>

        {/* Simulation Diff Output */}
        {simulationResult && (
          <div>
            <div style={{
              background: 'rgba(30, 41, 59, 0.5)',
              border: '1px solid var(--border-subtle)',
              borderRadius: '14px',
              padding: '1rem 1.25rem',
              marginBottom: '1.25rem'
            }}>
              <div style={{ fontSize: '0.72rem', color: '#c084fc', textTransform: 'uppercase', fontWeight: 700, marginBottom: '0.25rem' }}>
                Simulator Rationale & Ripple Effect
              </div>
              <div style={{ fontSize: '0.88rem', color: 'var(--text-primary)', fontWeight: 500 }}>
                {simulationResult.summary_explanation}
              </div>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.4rem' }}>
                Dependent Rules Evaluated: {simulationResult.dependent_rules_evaluated?.join(', ') || 'RULE-INTAKE-RATIO'}
              </div>
            </div>

            {/* Before vs After Columns (FR-G3) */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
              {/* Newly Flagged */}
              <div style={{
                background: 'rgba(244, 63, 94, 0.05)',
                border: '1px solid rgba(244, 63, 94, 0.25)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase' }}>
                    Newly Flagged
                  </span>
                  <span className="badge badge-rose" style={{ fontSize: '0.65rem' }}>
                    +{simulationResult.newly_flagged?.length || 0}
                  </span>
                </div>
                {simulationResult.newly_flagged?.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None triggered</div>
                ) : (
                  simulationResult.newly_flagged?.map(f => (
                    <div key={f.id} style={{ fontSize: '0.75rem', marginBottom: '0.5rem', padding: '0.4rem', background: 'rgba(244, 63, 94, 0.1)', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#fb7185' }}>{f.field_or_claim}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{f.reason}</div>
                    </div>
                  ))
                )}
              </div>

              {/* Resolved */}
              <div style={{
                background: 'rgba(16, 185, 129, 0.05)',
                border: '1px solid rgba(16, 185, 129, 0.25)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                    Resolved
                  </span>
                  <span className="badge badge-emerald" style={{ fontSize: '0.65rem' }}>
                    {simulationResult.resolved?.length || 0}
                  </span>
                </div>
                {simulationResult.resolved?.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None resolved</div>
                ) : (
                  simulationResult.resolved?.map(f => (
                    <div key={f.id} style={{ fontSize: '0.75rem', marginBottom: '0.5rem', padding: '0.4rem', background: 'rgba(16, 185, 129, 0.1)', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: '#34d399' }}>{f.field_or_claim}</div>
                      <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>Discrepancy cleared under new parameter</div>
                    </div>
                  ))
                )}
              </div>

              {/* Unchanged */}
              <div style={{
                background: 'rgba(30, 41, 59, 0.4)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '1rem'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem' }}>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                    Unchanged
                  </span>
                  <span className="badge badge-muted" style={{ fontSize: '0.65rem' }}>
                    {simulationResult.unchanged?.length || 0}
                  </span>
                </div>
                {simulationResult.unchanged?.length === 0 ? (
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>None</div>
                ) : (
                  simulationResult.unchanged?.map(f => (
                    <div key={f.id} style={{ fontSize: '0.75rem', marginBottom: '0.5rem', padding: '0.4rem', background: 'rgba(15, 23, 42, 0.4)', borderRadius: '6px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>{f.field_or_claim}</div>
                      <div style={{ color: 'var(--text-muted)', marginTop: '0.2rem' }}>Status unchanged</div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
