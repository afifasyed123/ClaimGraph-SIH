import React, { useState } from 'react';
import { 
  FileCheck, 
  AlertTriangle, 
  CheckCircle2, 
  FileText, 
  Send, 
  Sparkles, 
  Info, 
  ChevronRight,
  HelpCircle,
  Building2,
  Users,
  MapPin,
  Sliders,
  UploadCloud,
  Trash2,
  Eye,
  ShieldCheck,
  AlertCircle,
  X,
  Check
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
  const [selectedAction, setSelectedAction] = useState('Additional evidence required');
  const [justificationReason, setJustificationReason] = useState('');
  const [actionSuccessMsg, setActionSuccessMsg] = useState(null);
  const [actionErrorMsg, setActionErrorMsg] = useState(null);
  const [isDeletingDocId, setIsDeletingDocId] = useState(null);
  const [isConfirmingAction, setIsConfirmingAction] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  const hasIssues = findings && findings.length > 0;
  const targetFinding = selectedFinding || (findings?.length > 0 ? findings[0] : null);

  const handleSelectAction = (actId) => {
    setSelectedAction(actId);
    if (!justificationReason.trim()) {
      if (actId === 'Referred for further verification or inspection') {
        setJustificationReason('Referred for physical inspection to verify on-ground faculty cadre and campus facilities.');
      } else if (actId === 'Additional evidence required' || actId === 'Clarification requested from institution') {
        setJustificationReason('Clarification requested regarding discrepancy between application claims and evidentiary records.');
      } else if (actId === 'Dismissed') {
        setJustificationReason('Supplemental evidence verified; finding dismissed by scrutiny committee.');
      }
    }
  };

  const handleOpenConfirmation = (e) => {
    e.preventDefault();
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    const fnd = targetFinding;
    if (!fnd && hasIssues) {
      setActionErrorMsg('Please select a discrepancy finding to record action on.');
      return;
    }

    if (['Dismissed', 'Referred for further verification or inspection', 'Additional evidence required'].includes(selectedAction)) {
      if (!justificationReason.trim()) {
        setActionErrorMsg('A brief justification note is required for consequential regulatory actions.');
        return;
      }
    }

    setIsConfirmingAction(true);
  };

  const handleConfirmedActionSubmit = async () => {
    setIsSubmittingAction(true);
    setActionErrorMsg(null);
    setActionSuccessMsg(null);

    const fnd = targetFinding;
    let reasonToSend = justificationReason.trim() || 'Scrutiny decision recorded in compliance with AICTE guidelines.';

    try {
      const result = await onRecordAction(fnd ? fnd.id : 'APPLICATION-REVIEW', selectedAction, reasonToSend);
      setActionSuccessMsg(`Decision logged successfully! Cryptographic Audit Block #${result?.audit_chain_block || 'Chain'}`);
      setJustificationReason('');
      setIsConfirmingAction(false);
      setTimeout(() => setActionSuccessMsg(null), 5000);
    } catch (err) {
      setActionErrorMsg(err.message || 'Failed to record decision.');
      setIsConfirmingAction(false);
    } finally {
      setIsSubmittingAction(false);
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

  // Helper for finding categorisation
  const getFindingCategory = (f) => {
    const text = ((f.reason || '') + ' ' + (f.summary || '') + ' ' + (f.rule_id || '')).toLowerCase();
    if (text.includes('checklist') || text.includes('omitted') || text.includes('missing') || text.includes('presence')) {
      return {
        label: 'Missing document',
        badgeClass: 'clay-badge badge-warning',
        type: 'missing'
      };
    }
    if (text.includes('discrepancy') || text.includes('mismatch') || text.includes('resolution') || text.includes('ratio')) {
      return {
        label: 'Information mismatch',
        badgeClass: 'clay-badge badge-danger',
        type: 'mismatch'
      };
    }
    return {
      label: 'Requires verification',
      badgeClass: 'clay-badge badge-info',
      type: 'verification'
    };
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Institution Quick Switcher */}
      <div className="clay-box" style={{ padding: '0.95rem 1.4rem', width: '100%' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.85rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Select Institution Under Review:
            </span>
          </div>
          <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onSelectCase && onSelectCase('case_a')}
              className={`clay-btn-pill transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${application?.id === 'APP-CASE-A' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <CheckCircle2 size={14} color={application?.id === 'APP-CASE-A' ? '#ffffff' : '#10b981'} />
              <span>Apex Institute (Consistent)</span>
            </button>

            <button
              onClick={() => onSelectCase && onSelectCase('case_b')}
              className={`clay-btn-pill transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${application?.id === 'APP-CASE-B' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <AlertTriangle size={14} color={application?.id === 'APP-CASE-B' ? '#ffffff' : '#f59e0b'} />
              <span>Bharat College (Deficiency / Expired NOC)</span>
            </button>

            <button
              onClick={() => onSelectCase && onSelectCase('case_c')}
              className={`clay-btn-pill transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] ${application?.id === 'APP-CASE-C' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.5rem 1rem', fontSize: '0.8rem' }}
            >
              <AlertTriangle size={14} color={application?.id === 'APP-CASE-C' ? '#ffffff' : '#ef4444'} />
              <span>Chitkara Institute (Intake Discrepancy & Campus Sharing)</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Institution Header Card */}
      <div className="clay-box" style={{ padding: '1.75rem 2.2rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span style={{
                fontSize: '0.74rem',
                fontWeight: 800,
                padding: '0.2rem 0.65rem',
                borderRadius: '50px',
                background: hasIssues ? '#fffbeb' : '#ecfdf5',
                color: hasIssues ? '#d97706' : '#059669',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.35rem',
                border: hasIssues ? '1px solid #fde68a' : '1px solid #a7f3d0'
              }}>
                {hasIssues ? <AlertTriangle size={13} /> : <CheckCircle2 size={13} />}
                {hasIssues ? `${findings.length} Issues Requiring Scrutiny` : 'No Discrepancy Detected'}
              </span>
              <span style={{ fontSize: '0.78rem', color: '#64748b', fontWeight: 600 }}>
                Application Ref: <strong style={{ color: '#0f172a' }}>{application?.reference || application?.id || 'AICTE-APP-2026'}</strong>
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                · Cycle: 2026–27
              </span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em' }}>
              {application?.name || 'Institution Verification Desk'}
            </h1>
            <p style={{ fontSize: '0.88rem', color: '#475569', marginTop: '0.25rem' }}>
              {application?.programme || 'Engineering and Technology'} · {application?.campus_name || 'Autonomous Campus'}
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenUpload}
              className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <UploadCloud size={15} />
              <span>Upload / Add Documents</span>
            </button>
            <button
              onClick={onRunValidation}
              disabled={isValidating}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <FileCheck size={15} color="var(--clay-blue-primary)" />
              <span>{isValidating ? 'Validating Rules...' : 'Re-Run Compliance Check'}</span>
            </button>
            <button
              onClick={onOpenSimulator}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ padding: '0.65rem 1.25rem' }}
            >
              <Sliders size={15} />
              <span>Simulator</span>
            </button>
          </div>
        </div>
      </div>

      {/* SECTION 1: Application Checklist & Findings */}
      <div className="clay-box" style={{ width: '100%', padding: '1.8rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Section 1 of 3
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
              Application Checklist & Scrutiny Findings
            </h2>
          </div>
          <div style={{ fontSize: '0.8rem', color: '#64748b' }}>
            Statutory Handbook Standards (APH 2024–27)
          </div>
        </div>

        {/* Claimed Parameters Snapshot */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
          gap: '1rem',
          marginBottom: '1.5rem'
        }}>
          <div className="clay-well" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Proposed Intake</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {application?.proposed_intake ?? 360} Students
            </div>
          </div>
          <div className="clay-well" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Reported Full-Time Faculty</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: application?.faculty_count ? '#059669' : '#dc2626' }}>
              {application?.faculty_count ? `${application.faculty_count} Appointed` : 'Shortfall / Omitted'}
            </div>
          </div>
          <div className="clay-well" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Declared Land Area</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {application?.land_acres ?? 2.5} Acres
            </div>
          </div>
          <div className="clay-well" style={{ padding: '0.75rem 1rem' }}>
            <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Instructional Carpet Area</div>
            <div style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
              {application?.carpet_area_sqm ?? 3200} sq.m
            </div>
          </div>
        </div>

        {/* Detailed Findings Cards */}
        {hasIssues ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: '#334155' }}>
              Identified Discrepancies & Disclosures ({findings.length}):
            </div>

            {findings.map((f, idx) => {
              const isSelected = targetFinding?.id === f.id;
              const cat = getFindingCategory(f);

              return (
                <div
                  key={f.id || idx}
                  onClick={() => onSelectFinding && onSelectFinding(f)}
                  className="clay-well"
                  style={{
                    cursor: 'pointer',
                    padding: '1.2rem',
                    border: isSelected ? '2px solid var(--clay-blue-primary)' : '1px solid rgba(160, 178, 206, 0.4)',
                    background: isSelected ? '#ffffff' : 'var(--clay-inset-bg)',
                    boxShadow: isSelected ? 'var(--clay-shadow-card)' : 'var(--clay-shadow-inset-sm)',
                    transition: 'all 0.2s ease',
                    borderRadius: '18px'
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '0.5rem', marginBottom: '0.5rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                      <span className={cat.badgeClass}>
                        {cat.label}
                      </span>
                      <span style={{ fontSize: '0.82rem', fontWeight: 800, color: '#0f172a' }}>
                        Discrepancy #{idx + 1}
                      </span>
                    </div>

                    <span style={{ fontSize: '0.72rem', fontFamily: 'monospace', fontWeight: 700, color: '#64748b', background: '#f1f5f9', padding: '0.2rem 0.5rem', borderRadius: '4px' }}>
                      Rule ID: {f.rule_id || 'AICTE-NORM-01'}
                    </span>
                  </div>

                  <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a', lineHeight: 1.45, marginBottom: '0.65rem' }}>
                    {f.reason || f.summary || f.description}
                  </div>

                  {/* Fact Comparison Grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                    gap: '0.65rem',
                    background: '#f8fafc',
                    padding: '0.75rem 0.95rem',
                    borderRadius: '12px',
                    border: '1px solid #e2e8f0',
                    marginBottom: '0.75rem'
                  }}>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>What was reported / claimed:</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f172a' }}>
                        {f.extracted_value ? String(f.extracted_value) : (application?.proposed_intake ? `${application.proposed_intake} Intake` : 'Information omitted')}
                      </div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.7rem', color: '#64748b', fontWeight: 600 }}>Statutory norm / verified proof:</div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0369a1' }}>
                        {f.comparison_value ? String(f.comparison_value) : (f.rule_id?.includes('DOC') ? 'Valid Mandatory Record' : '1:15 Faculty-Student Cadre')}
                      </div>
                    </div>
                  </div>

                  {/* Why it matters & Document Link */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem', paddingTop: '0.45rem', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.78rem', color: '#475569', maxWidth: '600px' }}>
                      <strong style={{ color: '#0f172a' }}>Why this matters:</strong> Institutional sanctions and student safety cannot be approved when mandatory clearance or approved seat quotas mismatch evidentiary resolutions.
                    </div>

                    {f.source_document && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          onOpenDocViewer && onOpenDocViewer(f.source_document);
                        }}
                        className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                        style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                      >
                        <Eye size={13} color="var(--clay-blue-primary)" />
                        <span>Inspect Evidence: {f.source_document}</span>
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        ) : (
          <div className="clay-well" style={{ textAlign: 'center', padding: '2.5rem 1rem' }}>
            <CheckCircle2 size={44} color="#10b981" style={{ margin: '0 auto 0.75rem' }} />
            <div style={{ fontSize: '1.15rem', fontWeight: 800, color: '#0f172a' }}>
              No Discrepancy Detected (100% Compliant)
            </div>
            <p style={{ fontSize: '0.85rem', color: '#475569', marginTop: '0.35rem', maxWidth: '480px', margin: '0.35rem auto 0', lineHeight: 1.5 }}>
              Declared faculty ratio (1:12.5), instructional square footage, land title deed, and municipal fire safety clearance fully satisfy AICTE norms for the requested student intake.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 2: Document Viewer & Evidence Provenance */}
      <div className="clay-box" style={{ width: '100%', padding: '1.8rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Section 2 of 3
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
              Document Viewer & Evidence Packets ({documents.length})
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Statutory PDF submissions with cryptographic SHA-256 digests and verified page extracts.
            </p>
          </div>

          <button
            onClick={onOpenUpload}
            className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
            style={{ fontSize: '0.8rem', padding: '0.55rem 1.1rem' }}
          >
            <UploadCloud size={15} color="var(--clay-blue-primary)" />
            <span>Upload Additional Document</span>
          </button>
        </div>

        {documents.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1rem' }}>
            {documents.map((doc) => (
              <div key={doc.id} className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', padding: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', minWidth: 0 }}>
                    <FileText size={19} color="var(--clay-blue-primary)" style={{ flexShrink: 0 }} />
                    <div style={{ minWidth: 0 }}>
                      <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.filename}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#64748b' }}>
                        Category: <strong style={{ color: '#334155' }}>{doc.doc_type?.replace(/_/g, ' ') || 'Statutory Record'}</strong>
                      </div>
                    </div>
                  </div>

                  <span className="clay-badge badge-success" style={{ flexShrink: 0, fontSize: '0.68rem' }}>
                    Verified PDF
                  </span>
                </div>

                <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: '#475569', background: '#ffffff', padding: '0.35rem 0.65rem', borderRadius: '6px', border: '1px solid #e2e8f0' }}>
                  SHA-256: {doc.sha256 ? doc.sha256.substring(0, 24) + '...' : 'Computing...'}
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid #e2e8f0' }}>
                  <button
                    onClick={() => onOpenDocViewer && onOpenDocViewer(doc.id)}
                    className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                    style={{ padding: '0.35rem 0.85rem', fontSize: '0.75rem' }}
                  >
                    <Eye size={13} color="var(--clay-blue-primary)" />
                    <span>Inspect Evidence</span>
                  </button>

                  <button
                    onClick={() => handleDelete(doc.id, doc.filename)}
                    disabled={isDeletingDocId === doc.id}
                    style={{
                      border: 'none',
                      background: 'transparent',
                      cursor: 'pointer',
                      color: '#dc2626',
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      padding: '0.35rem 0.5rem'
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
              Click "Upload Additional Document" above to attach PDF records for this application.
            </p>
          </div>
        )}
      </div>

      {/* SECTION 3: Reviewer Actions & Notes */}
      <div className="clay-box" style={{ width: '100%', padding: '1.8rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '0.75rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Section 3 of 3
            </div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a', marginTop: '0.15rem' }}>
              Reviewer Actions & Audit Trail
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Statutory decisions are preserved in authorized human hands. Automatic approval or rejection is prohibited.
            </p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', fontSize: '0.75rem', fontWeight: 700, color: '#059669', background: '#ecfdf5', padding: '0.35rem 0.85rem', borderRadius: '50px' }}>
            <ShieldCheck size={15} />
            <span>Cryptographic SHA-256 Audit Sealed</span>
          </div>
        </div>

        <form onSubmit={handleOpenConfirmation} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
              Select Official Regulatory Action:
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(190px, 1fr))', gap: '0.65rem' }}>
              {[
                { 
                  id: 'Additional evidence required', 
                  label: '💬 Request Evidence / Clarification', 
                  color: '#2563eb',
                  desc: 'Notify institution to supply missing certificates or clarify mismatches'
                },
                { 
                  id: 'Referred for further verification or inspection', 
                  label: '🏢 Refer for Physical Inspection', 
                  color: '#d97706',
                  desc: 'Dispatch Expert Visiting Committee (EVC) for on-ground physical audit'
                },
                { 
                  id: 'Dismissed', 
                  label: '❌ Record Reasoned Dismissal', 
                  color: '#dc2626',
                  desc: 'Dismiss finding with committee justification on verified evidence'
                },
                { 
                  id: 'Accepted for review', 
                  label: '✅ Accept for Further Review', 
                  color: '#059669',
                  desc: 'Acknowledge application packet satisfies initial scrutiny threshold'
                }
              ].map(act => (
                <button
                  key={act.id}
                  type="button"
                  onClick={() => handleSelectAction(act.id)}
                  className="clay-btn-pill transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
                  style={{
                    padding: '0.75rem 0.95rem',
                    fontSize: '0.82rem',
                    fontWeight: 700,
                    background: selectedAction === act.id ? act.color : '#ffffff',
                    color: selectedAction === act.id ? '#ffffff' : '#1e293b',
                    border: selectedAction === act.id ? `1px solid ${act.color}` : '1px solid #cbd5e1',
                    boxShadow: selectedAction === act.id ? '0 8px 18px rgba(0,0,0,0.12)' : 'var(--clay-shadow-small)',
                    textAlign: 'left',
                    justifyContent: 'flex-start'
                  }}
                >
                  {act.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: '#334155', marginBottom: '0.45rem' }}>
              Reviewer Justification & Administrative Notes:
            </label>
            <div className="clay-well" style={{ padding: '0.75rem 1rem' }}>
              <textarea
                rows={3}
                value={justificationReason}
                onChange={(e) => setJustificationReason(e.target.value)}
                placeholder="Enter statutory justification, specific handbook clause reference, or instructions for the applicant..."
                className="clay-input-clean"
                style={{ resize: 'vertical', width: '100%', fontSize: '0.88rem', lineHeight: 1.5 }}
              />
            </div>
          </div>

          {actionSuccessMsg && (
            <div style={{ fontSize: '0.82rem', color: '#059669', fontWeight: 700, background: '#ecfdf5', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #a7f3d0' }}>
              ✓ {actionSuccessMsg}
            </div>
          )}
          {actionErrorMsg && (
            <div style={{ fontSize: '0.82rem', color: '#dc2626', fontWeight: 700, background: '#fef2f2', padding: '0.75rem 1rem', borderRadius: '12px', border: '1px solid #fecaca' }}>
              ⚠️ {actionErrorMsg}
            </div>
          )}

          <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
            <button
              type="submit"
              className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
              style={{ padding: '0.85rem 1.8rem', fontSize: '0.92rem' }}
            >
              <Send size={16} />
              <span>Review & Record Action</span>
            </button>
          </div>
        </form>
      </div>

      {/* EXPLICIT CONFIRMATION MODAL (Consequential Reviewer Action) */}
      {isConfirmingAction && (
        <div className="modal-overlay">
          <div className="modal-content-clay" style={{ maxWidth: '580px', width: '100%', padding: '2.2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                <div style={{
                  width: '42px',
                  height: '42px',
                  borderRadius: '14px',
                  background: '#eff6ff',
                  color: 'var(--clay-blue-primary)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <ShieldCheck size={24} />
                </div>
                <div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#0f172a' }}>
                    Confirm Regulatory Action
                  </h3>
                  <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
                    AICTE Statutory Review Protocol
                  </div>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setIsConfirmingAction(false)}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <X size={20} />
              </button>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '1.5rem' }}>
              <div className="clay-well" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Action to be Recorded:</div>
                <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                  {selectedAction}
                </div>
              </div>

              <div className="clay-well" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Target Institution:</div>
                <div style={{ fontSize: '0.92rem', fontWeight: 700, color: '#0f172a' }}>
                  {application?.name} ({application?.reference || application?.id})
                </div>
              </div>

              <div className="clay-well" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <div style={{ fontSize: '0.72rem', color: '#64748b', fontWeight: 600 }}>Authorized Reviewer & Officer Note:</div>
                <div style={{ fontSize: '0.85rem', color: '#0f172a', fontWeight: 600 }}>
                  {currentUser?.name || 'Authorized Scrutiny Officer'} ({currentUser?.role || 'Reviewer'})
                </div>
                <div style={{ fontSize: '0.82rem', color: '#475569', fontStyle: 'italic', marginTop: '0.25rem', background: '#ffffff', padding: '0.5rem 0.75rem', borderRadius: '8px' }}>
                  "{justificationReason.trim() || 'No additional note provided'}"
                </div>
              </div>

              <div style={{ fontSize: '0.75rem', color: '#64748b', lineHeight: 1.5, background: '#f8fafc', padding: '0.75rem 1rem', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                🔒 <strong>Statutory Notice:</strong> This consequential decision will be sealed with a SHA-256 hash into the immutable audit chain. Formal compliance deficiency notifications and review registers will be updated accordingly.
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem' }}>
              <button
                type="button"
                onClick={() => setIsConfirmingAction(false)}
                className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ padding: '0.7rem 1.25rem', fontSize: '0.85rem' }}
                disabled={isSubmittingAction}
              >
                <span>Cancel</span>
              </button>

              <button
                type="button"
                onClick={handleConfirmedActionSubmit}
                disabled={isSubmittingAction}
                className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
                style={{ padding: '0.7rem 1.4rem', fontSize: '0.85rem' }}
              >
                <Check size={16} />
                <span>{isSubmittingAction ? 'Sealing in Audit Chain...' : 'Confirm & Record in Audit Trail'}</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
