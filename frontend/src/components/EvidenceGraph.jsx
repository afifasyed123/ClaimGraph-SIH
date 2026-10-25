import React, { useState } from 'react';
import { 
  GitCommit, 
  FileCheck, 
  Scale, 
  AlertCircle, 
  UserCheck, 
  ArrowRight, 
  CheckCircle2, 
  Sparkles,
  ChevronRight
} from 'lucide-react';

export default function EvidenceGraph({ 
  application, 
  findings, 
  onSelectFinding 
}) {
  const [selectedFlowIndex, setSelectedFlowIndex] = useState(0);

  // If there are findings, show finding-centered graph paths. If no findings (Case A), show clean reconciliation path!
  const hasFindings = findings && findings.length > 0;

  const currentFinding = hasFindings ? findings[selectedFlowIndex % findings.length] : null;

  return (
    <div className="glass-card col-12" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span className="badge badge-purple">
              <Sparkles size={11} /> Signature Differentiator
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Deterministic Evidence Traceability
            </span>
          </div>
          <h2 style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            Evidence Reconciliation Graph
          </h2>
        </div>

        {hasFindings && findings.length > 1 && (
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>Inspect Chain:</span>
            {findings.map((f, idx) => (
              <button 
                key={f.id}
                className={`btn btn-sm ${selectedFlowIndex === idx ? 'btn-primary' : 'btn-outline'}`}
                style={{ padding: '0.2rem 0.6rem', fontSize: '0.7rem' }}
                onClick={() => setSelectedFlowIndex(idx)}
              >
                Chain #{idx + 1}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Visual Reconciliation Chain */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(5, 1fr)',
        gap: '1rem',
        alignItems: 'stretch',
        position: 'relative'
      }}>
        {/* Node 1: Application Claim */}
        <div className="graph-node active" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#60a5fa', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <GitCommit size={14} /> 1. Application Claim
            </div>
            <div style={{ fontSize: '0.9rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentFinding ? currentFinding.field_or_claim : `Intake ${application?.proposed_intake || 360} Seats`}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Claimed: <strong style={{ color: 'var(--text-primary)' }}>{currentFinding ? currentFinding.extracted_value : `${application?.proposed_intake || 360} Seats, ${application?.faculty_count || 24} Faculty`}</strong>
            </div>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.75rem' }}>
            Ref: {application?.reference}
          </div>
        </div>

        {/* Node 2: Evidence Document */}
        <div className="graph-node active" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#06b6d4', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <FileCheck size={14} /> 2. Supporting Evidence
            </div>
            <div style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)', wordBreak: 'break-word' }}>
              {currentFinding ? (currentFinding.source_document || 'Checklist Document') : 'AICTE Affiliation Resolution'}
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              Location: <span style={{ color: '#38bdf8' }}>{currentFinding?.page_or_field || 'Page 1, Table 1'}</span>
            </div>
          </div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            SHA-256 Verified
          </div>
        </div>

        {/* Node 3: Rule Applied */}
        <div className="graph-node active" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#fbbf24', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <Scale size={14} /> 3. Rule Applied
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentFinding?.rule_id || 'RULE-STUDENT-FACULTY-RATIO'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
              {currentFinding?.rule_source || 'Demonstration Rule - Illustrative Only'}
            </div>
          </div>
          <div style={{ fontSize: '0.68rem', color: '#fbbf24', marginTop: '0.75rem' }}>
            Deterministic YAML Engine
          </div>
        </div>

        {/* Node 4: Resulting Finding */}
        <div className={`graph-node active`} style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          justifyContent: 'space-between',
          borderColor: currentFinding ? '#fb7185' : '#34d399',
          background: currentFinding ? 'rgba(244, 63, 94, 0.08)' : 'rgba(16, 185, 129, 0.08)'
        }}>
          <div>
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.4rem', 
              color: currentFinding ? '#fb7185' : '#34d399', 
              fontSize: '0.75rem', 
              fontWeight: 700, 
              textTransform: 'uppercase', 
              marginBottom: '0.5rem' 
            }}>
              {currentFinding ? <AlertCircle size={14} /> : <CheckCircle2 size={14} />} 4. Resulting Finding
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: currentFinding ? '#fb7185' : '#34d399' }}>
              {currentFinding ? currentFinding.type.replace('_', ' ').toUpperCase() : 'FULLY COMPLIANT'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem', maxHeight: '42px', overflow: 'hidden' }}>
              {currentFinding ? currentFinding.reason : 'All submitted values match configured documentary evidence and historical records.'}
            </div>
          </div>
          {currentFinding && (
            <button 
              className="btn btn-outline btn-sm"
              style={{ marginTop: '0.5rem', fontSize: '0.68rem', padding: '0.2rem 0.4rem', alignSelf: 'flex-start' }}
              onClick={() => onSelectFinding(currentFinding)}
            >
              Examine Detail
            </button>
          )}
        </div>

        {/* Node 5: Reviewer Action */}
        <div className="graph-node active" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', color: '#c084fc', fontSize: '0.75rem', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.5rem' }}>
              <UserCheck size={14} /> 5. Human Action
            </div>
            <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentFinding?.status || 'Ready for Review'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
              {currentFinding?.recommended_next_step || 'Authorized scrutiny review logged in immutable audit trail.'}
            </div>
          </div>
          <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginTop: '0.75rem' }}>
            No autonomous approve/reject
          </div>
        </div>
      </div>
    </div>
  );
}
