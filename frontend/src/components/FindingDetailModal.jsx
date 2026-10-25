import React, { useState } from 'react';
import { 
  X, 
  AlertTriangle, 
  FileText, 
  Scale, 
  HelpCircle, 
  ArrowRight, 
  ShieldCheck, 
  Send,
  CornerDownRight,
  Clock,
  UserCheck
} from 'lucide-react';

export default function FindingDetailModal({ 
  finding, 
  onClose, 
  onRecordAction, 
  isSubmittingAction 
}) {
  if (!finding) return null;

  const [selectedAction, setSelectedAction] = useState('Accepted for review');
  const [reason, setReason] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  const isReasonMandatory = ['Dismissed', 'Referred for further verification or inspection'].includes(selectedAction);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isReasonMandatory && !reason.trim()) {
      setErrorMsg(`Action '${selectedAction}' strictly requires an administrative reason (FR-F1).`);
      return;
    }
    setErrorMsg('');
    onRecordAction(finding.id, selectedAction, reason);
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
              <span className={`badge ${finding.severity.toLowerCase() === 'high' ? 'badge-rose' : 'badge-amber'}`}>
                {finding.severity} Severity
              </span>
              <span className="badge badge-muted">
                {finding.type.replace('_', ' ').toUpperCase()}
              </span>
              <span className="badge badge-blue">
                Status: {finding.status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              {finding.field_or_claim}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
              Finding ID: {finding.id}
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

        {/* Side-by-Side Comparison Box (FR-C4) */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr 1fr',
          gap: '1rem',
          background: 'rgba(15, 23, 42, 0.7)',
          border: '1px solid var(--border-subtle)',
          borderRadius: '14px',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>
              Extracted Claim / Submitted Value
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#fb7185' }}>
              {finding.extracted_value || 'Missing / Blank'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Document: {finding.source_document || 'Application Form'}
            </div>
          </div>

          <div style={{ borderLeft: '1px solid var(--border-subtle)', paddingLeft: '1rem' }}>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>
              Statutory Requirement / Benchmark
            </div>
            <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#38bdf8' }}>
              {finding.comparison_value || 'AICTE Directive'}
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Location: {finding.page_or_field || 'Section 3.2'}
            </div>
          </div>
        </div>

        {/* Explanation & Rule Rationale */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Scale size={14} color="#fbbf24" /> Rule Rationale & Finding Explanation
          </h3>
          <div style={{
            background: 'rgba(30, 41, 59, 0.4)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            padding: '1rem',
            fontSize: '0.875rem',
            color: 'var(--text-primary)',
            lineHeight: 1.6
          }}>
            {finding.reason}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.4rem', fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            <span>Rule ID: {finding.rule_id}</span>
            <span style={{ color: '#fbbf24' }}>{finding.rule_source}</span>
          </div>
        </div>

        {/* Recommended Next Step */}
        <div style={{ marginBottom: '1.75rem' }}>
          <h3 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <CornerDownRight size={14} color="#34d399" /> Recommended Next Step for Reviewer
          </h3>
          <div style={{
            background: 'rgba(16, 185, 129, 0.08)',
            border: '1px solid rgba(16, 185, 129, 0.25)',
            borderRadius: '12px',
            padding: '0.85rem 1rem',
            fontSize: '0.85rem',
            color: '#a7f3d0'
          }}>
            {finding.recommended_next_step || 'Review supporting records with institutional nodal officer.'}
          </div>
        </div>

        {/* Reviewer Action Form (FR-F1, FR-F2, FR-F4) */}
        <form onSubmit={handleSubmit} style={{
          background: 'rgba(15, 23, 42, 0.85)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '14px',
          padding: '1.25rem'
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
              <UserCheck size={16} color="#c084fc" /> Record Authorized Reviewer Action
            </div>
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
              Non-Goal (FR-F4): No Approve/Reject Action
            </span>
          </div>

          {errorMsg && (
            <div style={{ color: '#fb7185', fontSize: '0.75rem', marginBottom: '0.75rem', fontWeight: 600 }}>
              ⚠️ {errorMsg}
            </div>
          )}

          {/* Action Choice Buttons */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: '0.5rem', marginBottom: '1rem' }}>
            {[
              'Accepted for review',
              'Additional evidence required',
              'Dismissed',
              'Referred for further verification or inspection'
            ].map(act => (
              <button
                type="button"
                key={act}
                className={`btn btn-sm ${selectedAction === act ? 'btn-primary' : 'btn-outline'}`}
                style={{ fontSize: '0.75rem', padding: '0.5rem', textAlign: 'center' }}
                onClick={() => setSelectedAction(act)}
              >
                {act}
              </button>
            ))}
          </div>

          {/* Administrative Reason input */}
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
              Administrative Reason {isReasonMandatory && <span style={{ color: '#fb7185' }}>* (Mandatory for Dismissed / Referred)</span>}
            </label>
            <textarea 
              className="input-clean"
              style={{ width: '100%', minHeight: '60px', resize: 'vertical' }}
              placeholder="Enter official scrutiny note, deficiency letter remarks, or verification referral justification..."
              value={reason}
              onChange={(e) => setReason(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
            <button type="button" className="btn btn-outline btn-sm" onClick={onClose}>
              Cancel
            </button>
            <button 
              type="submit" 
              className="btn btn-primary btn-sm"
              disabled={isSubmittingAction}
            >
              <Send size={13} />
              <span>{isSubmittingAction ? 'Recording...' : 'Commit Action to Audit Trail'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
