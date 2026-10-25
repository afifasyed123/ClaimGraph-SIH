import React, { useState } from 'react';
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Send, 
  Sparkles, 
  Info, 
  ExternalLink,
  ChevronRight,
  HelpCircle,
  Building2,
  Users,
  MapPin,
  Sliders,
  UploadCloud,
  Trash2,
  Eye,
  ShieldCheck
} from 'lucide-react';

export default function ScrutinyWorkspace({
  application,
  checklist = [],
  documents = [],
  findings = [],
  selectedFinding,
  onSelectFinding,
  onRecordAction,
  onOpenDocViewer,
  onOpenSimulator,
  onRunValidation,
  isValidating,
  currentUser,
  onSelectCase,
  onOpenUpload,
  onDeleteDocument
}) {
  const [selectedAction, setSelectedAction] = useState('Accepted for review');
  const [justificationReason, setJustificationReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [actionErrorMsg, setActionErrorMsg] = useState(null);
  const [isDeletingDocId, setIsDeletingDocId] = useState(null);

  const handleActionSubmit = async (e) => {
    e.preventDefault();
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    if (['Dismissed', 'Referred for further verification or inspection'].includes(selectedAction)) {
      if (!justificationReason.trim()) {
        setActionErrorMsg(`Please enter a brief reason for "${selectedAction}".`);
        return;
      }
    }

    try {
      if (!selectedFinding) {
        setActionErrorMsg('Please select a finding first.');
        return;
      }
      const result = await onRecordAction(selectedFinding.id, selectedAction, justificationReason);
      setActionSuccessMsg(`Decision logged successfully! (Audit Block #${result?.audit_chain_block || 'Chain'})`);
      setJustificationReason('');
      setTimeout(() => setActionSuccessMsg(null), 4000);
    } catch (err) {
      setActionErrorMsg(err.message || 'Failed to record decision.');
    }
  };

  const handleDelete = async (docId, filename) => {
    if (!window.confirm(`Are you sure you want to remove '${filename}'? This will re-evaluate compliance rules and record an audit block.`)) {
      return;
    }
    setIsDeletingDocId(docId);
    try {
      if (onDeleteDocument) {
        await onDeleteDocument(docId);
      }
    } catch (err) {
      setActionErrorMsg(err.message || 'Failed to delete document.');
    } finally {
      setIsDeletingDocId(null);
    }
  };

  const hasIssues = findings && findings.length > 0;
  const currentFinding = selectedFinding || (findings.length > 0 ? findings[0] : null);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* College Switcher Pills (Ultra-Friendly Quick Switch) */}
      <div className="clay-box" style={{ padding: '1rem 1.4rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '1rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Institution:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectCase && onSelectCase('case_a')}
              className={`clay-btn-pill ${application?.id === 'APP-CASE-A' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}
            >
              <CheckCircle2 size={15} color={application?.id === 'APP-CASE-A' ? '#ffffff' : '#10b981'} />
              <span>Apex Institute (Compliant)</span>
            </button>

            <button
              onClick={() => onSelectCase && onSelectCase('case_b')}
              className={`clay-btn-pill ${application?.id === 'APP-CASE-B' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}
            >
              <AlertTriangle size={15} color={application?.id === 'APP-CASE-B' ? '#ffffff' : '#f59e0b'} />
              <span>Bharat College (Incomplete / Expired NOC)</span>
            </button>

            <button
              onClick={() => onSelectCase && onSelectCase('case_c')}
              className={`clay-btn-pill ${application?.id === 'APP-CASE-C' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.55rem 1.1rem', fontSize: '0.82rem' }}
            >
              <AlertTriangle size={15} color={application?.id === 'APP-CASE-C' ? '#ffffff' : '#ef4444'} />
              <span>Chitkara Institute (Intake Mismatch & Campus Conflict)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main College Header Card with Upload Button */}
      <div className="clay-box" style={{ padding: '1.8rem 2.2rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.4rem' }}>
              <span style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '50px',
                background: hasIssues ? '#fffbeb' : '#ecfdf5',
                color: hasIssues ? '#d97706' : '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem'
              }}>
                {hasIssues ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                {hasIssues ? `${findings.length} Issues Identified` : 'Fully Compliant'}
              </span>
              <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
                Application Ref: {application?.reference || application?.id || 'AICTE-APP-2026'}
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
              {application?.name || 'Institution Verification Desk'}
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', marginTop: '0.25rem' }}>
              {application?.programme || 'Engineering and Technology'} · Academic Year 2026-27 · {application?.campus_name || 'Autonomous Campus'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenUpload}
              className="clay-btn-pill clay-btn-blue"
            >
              <UploadCloud size={16} />
              <span>Upload / Add Documents</span>
            </button>
            <button
              onClick={onRunValidation}
              disabled={isValidating}
              className="clay-btn-pill clay-btn-white"
            >
              <FileCheck size={16} color="var(--clay-blue-primary)" />
              <span>{isValidating ? 'Validating...' : 'Re-Run Compliance Check'}</span>
            </button>
            <button
              onClick={onOpenSimulator}
              className="clay-btn-pill clay-btn-white"
            >
              <Sliders size={16} />
              <span>Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* Two Clear Comparison Cards (What Was Claimed vs What Documents & Rules Verify) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Card 1: What the College Submitted */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
            <div style={{
              width: '36px',
              height: '36px',
              borderRadius: '12px',
              background: '#eff6ff',
              color: 'var(--clay-blue-primary)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <FileText size={18} />
            </div>
            <div>
              <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                1. What the College Claimed
              </h2>
              <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)' }}>
                Parameters extracted from institutional application & certificates
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            <div className="clay-well" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>Proposed Student Intake</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  {application?.proposed_intake || application?.claims?.find(c => c.field === 'proposed_intake')?.value || 360} Students
                </div>
              </div>
              <Users size={22} color="var(--clay-blue-primary)" />
            </div>

            <div className="clay-well" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>Declared Full-Time Faculty</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  {application?.faculty_count || 18} Teachers
                </div>
              </div>
              <Users size={22} color="#10b981" />
            </div>

            <div className="clay-well" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>Campus Land Area</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  {application?.land_acres || 2.5} Acres
                </div>
              </div>
              <MapPin size={22} color="#f59e0b" />
            </div>

            <div className="clay-well" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', fontWeight: 600 }}>Instructional Floor Space</div>
                <div style={{ fontSize: '1.2rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  {application?.carpet_area_sqm || application?.built_up_sqm || 3200} sq. metres
                </div>
              </div>
              <Building2 size={22} color="#8b5cf6" />
            </div>
          </div>
        </div>

        {/* Card 2: AICTE Automated Verification Findings */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem', width: '100%' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <div style={{
                width: '36px',
                height: '36px',
                borderRadius: '12px',
                background: hasIssues ? '#fffbeb' : '#ecfdf5',
                color: hasIssues ? '#d97706' : '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                {hasIssues ? <AlertTriangle size={18} /> : <CheckCircle2 size={18} />}
              </div>
              <div>
                <h2 style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  2. Automated Rule Check & Finding
                </h2>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-muted)' }}>
                  Verified mathematically against AICTE Handbook 2024-2027 Norms
                </div>
              </div>
            </div>

            {hasIssues && (
              <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '0.2rem 0.6rem', borderRadius: '50px', background: '#fee2e2', color: '#b91c1c' }}>
                Action Required
              </span>
            )}
          </div>

          {hasIssues ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {findings.map((f, idx) => {
                const isSelected = currentFinding?.id === f.id;
                return (
                  <div
                    key={f.id || idx}
                    onClick={() => onSelectFinding && onSelectFinding(f)}
                    className="clay-well"
                    style={{
                      cursor: 'pointer',
                      border: isSelected ? '2px solid var(--clay-blue-primary)' : '1px solid rgba(160, 178, 206, 0.3)',
                      background: isSelected ? '#ffffff' : 'var(--clay-inset-bg)',
                      boxShadow: isSelected ? 'var(--clay-shadow-small)' : 'var(--clay-shadow-inset-sm)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: '#b91c1c' }}>
                        ⚠️ Discrepancy #{idx + 1}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
                        {f.rule_id || 'AICTE-NORM'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: 'var(--clay-text-primary)', lineHeight: 1.4 }}>
                      {f.reason || f.summary || f.description}
                    </div>
                    {f.source_document && (
                      <div style={{ fontSize: '0.75rem', color: 'var(--clay-blue-primary)', marginTop: '0.35rem', fontWeight: 600 }}>
                        📄 Evidence Source: {f.source_document} ({f.page_or_field || 'Page 1'})
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="clay-well" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
              <CheckCircle2 size={42} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
              <div style={{ fontSize: '1.05rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                All AICTE Rules Verified (100% Pass)
              </div>
              <p style={{ fontSize: '0.82rem', color: 'var(--clay-text-secondary)', marginTop: '0.35rem', maxWidth: '340px', margin: '0.35rem auto 0' }}>
                Declared faculty ratio (1:15), classroom square footage, and title deeds fully satisfy AICTE norms for the requested student intake.
              </p>
            </div>
          )}

          {/* Action Decision Form */}
          <div style={{ marginTop: 'auto', paddingTop: '0.5rem' }}>
            <form onSubmit={handleActionSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
                Official Regulatory Action:
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '0.5rem' }}>
                {[
                  { id: 'Accepted for review', label: '✅ Accept', color: '#10b981' },
                  { id: 'Clarification requested from institution', label: '💬 Ask Proof', color: '#2563eb' },
                  { id: 'Referred for further verification or inspection', label: '🏢 Inspect', color: '#f59e0b' },
                  { id: 'Dismissed', label: '❌ Dismiss', color: '#ef4444' }
                ].map(act => (
                  <button
                    key={act.id}
                    type="button"
                    onClick={() => setSelectedAction(act.id)}
                    className="clay-btn-pill"
                    style={{
                      padding: '0.55rem 0.6rem',
                      fontSize: '0.78rem',
                      background: selectedAction === act.id ? act.color : '#ffffff',
                      color: selectedAction === act.id ? '#ffffff' : 'var(--clay-text-primary)',
                      border: 'var(--clay-border-soft)',
                      boxShadow: selectedAction === act.id ? '0 6px 14px rgba(0,0,0,0.15)' : 'var(--clay-shadow-small)'
                    }}
                  >
                    {act.label}
                  </button>
                ))}
              </div>

              {['Dismissed', 'Referred for further verification or inspection', 'Clarification requested from institution'].includes(selectedAction) && (
                <div className="clay-well" style={{ padding: '0.65rem 0.85rem' }}>
                  <input
                    type="text"
                    value={justificationReason}
                    onChange={(e) => setJustificationReason(e.target.value)}
                    placeholder="Enter reason for clarification or inspection..."
                    className="clay-input-clean"
                  />
                </div>
              )}

              {actionSuccessMsg && (
                <div style={{ fontSize: '0.78rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '0.5rem 0.8rem', borderRadius: '12px' }}>
                  {actionSuccessMsg}
                </div>
              )}
              {actionErrorMsg && (
                <div style={{ fontSize: '0.78rem', color: '#b91c1c', fontWeight: 700, background: '#fef2f2', padding: '0.5rem 0.8rem', borderRadius: '12px' }}>
                  {actionErrorMsg}
                </div>
              )}

              <button
                type="submit"
                className="clay-btn-pill clay-btn-blue"
                style={{ width: '100%', padding: '0.75rem' }}
              >
                <Send size={15} />
                <span>Record Action in Audit Chain</span>
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Attached Evidence Documents & Provenance Section (Phase 4 & 5 Requirement) */}
      <div className="clay-box" style={{ width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Attached Evidence Documents ({documents.length})
            </div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
              Uploaded Statutory Application Packets
            </h3>
          </div>

          <button
            onClick={onOpenUpload}
            className="clay-btn-pill clay-btn-white"
            style={{ fontSize: '0.82rem', padding: '0.55rem 1.1rem' }}
          >
            <UploadCloud size={15} color="var(--clay-blue-primary)" />
            <span>Upload Another Document</span>
          </button>
        </div>

        {documents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {documents.map((doc) => (
              <div key={doc.id} className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                    <FileText size={18} color="var(--clay-blue-primary)" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--clay-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.filename}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--clay-text-muted)' }}>
                        Type: {doc.doc_type?.replace(/_/g, ' ') || 'Document'}
                      </div>
                    </div>
                  </div>

                  <span style={{ fontSize: '0.68rem', fontWeight: 800, padding: '0.2rem 0.5rem', borderRadius: '50px', background: '#eff6ff', color: 'var(--clay-blue-primary)', flexShrink: 0 }}>
                    Verified PDF
                  </span>
                </div>

                <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--clay-text-secondary)', background: '#ffffff', padding: '0.3rem 0.6rem', borderRadius: '8px' }}>
                  SHA-256: {doc.sha256 ? doc.sha256.substring(0, 24) + '...' : 'Computing...'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => onOpenDocViewer && onOpenDocViewer(doc.id)}
                    className="clay-btn-pill clay-btn-white"
                    style={{ padding: '0.4rem 0.85rem', fontSize: '0.75rem' }}
                  >
                    <Eye size={13} />
                    <span>Preview</span>
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.filename)}
                    disabled={isDeletingDocId === doc.id}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#ef4444',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.4rem 0.6rem'
                    }}
                  >
                    <Trash2 size={13} />
                    <span>{isDeletingDocId === doc.id ? 'Removing...' : 'Remove'}</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="clay-well" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
            <FileText size={32} color="#94a3b8" style={{ margin: '0 auto 0.5rem' }} />
            <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
              No Attached Documents Uploaded
            </div>
            <p style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
              Click "Upload / Add Documents" above to upload applicant PDF documents.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
