import React, { useState, useEffect } from 'react';
import { 
  FileWarning, 
  Printer, 
  QrCode, 
  Plus, 
  FileText, 
  CheckCircle2, 
  Sparkles,
  Building2,
  Calendar,
  AlertTriangle,
  Copy,
  Check,
  Lock,
  FileCheck
} from 'lucide-react';

export default function DeficiencyNoticesScreen({
  notices = [],
  applications = [],
  onGenerateNotice,
  activeApplication,
  onVerifyReport
}) {
  const [selectedNotice, setSelectedNotice] = useState(notices.length > 0 ? notices[0] : null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [selectedAppId, setSelectedAppId] = useState(activeApplication?.id || (applications.length > 0 ? applications[0].id : 'APP-CASE-B'));
  const [clarificationsNote, setClarificationsNote] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  useEffect(() => {
    if (!selectedNotice && notices.length > 0) {
      setSelectedNotice(notices[0]);
    }
  }, [notices, selectedNotice]);

  const handleOpenModal = () => {
    setSelectedAppId(activeApplication?.id || (applications.length > 0 ? applications[0].id : 'APP-CASE-B'));
    setValidationError('');
    setIsGenerateOpen(true);
  };

  const handleLoadTemplate = () => {
    setClarificationsNote(
      "1. Submit original notarized Governing Body resolution regarding the proposed intake expansion.\n" +
      "2. Provide biometric staff roster, Form 16, and bank salary disbursement statements for faculty.\n" +
      "3. Upload valid Municipal Fire Safety NOC renewed for the current academic session."
    );
    setValidationError('');
  };

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    const trimmed = clarificationsNote.trim();
    if (!trimmed) {
      setValidationError('Clarifications note cannot be empty. Please specify the required instructions or rectifications.');
      return;
    }
    const chosenAppId = selectedAppId || activeApplication?.id || (applications.length > 0 ? applications[0].id : 'APP-CASE-B');
    if (!chosenAppId) {
      setValidationError('Please select a target application/institution.');
      return;
    }

    setIsGenerating(true);
    setValidationError('');
    try {
      const newNotice = await onGenerateNotice({
        application_id: chosenAppId,
        clarifications_note: trimmed
      });
      setSelectedNotice(newNotice);
      setIsGenerateOpen(false);
      setClarificationsNote('');
    } catch (err) {
      setValidationError(err.message || 'Failed to issue deficiency notice.');
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentNotice = selectedNotice || (notices.length > 0 ? notices[0] : null);
  const activeHash = currentNotice?.notice_hash || currentNotice?.digest;

  const handleCopyHash = (hashText) => {
    if (!hashText) return;
    navigator.clipboard.writeText(hashText);
    setCopiedHash(true);
    setTimeout(() => setCopiedHash(false), 2000);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div className="clay-box" style={{ padding: '2rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.3rem 0.85rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={14} />
              <span>Official Statutory Communication</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
              Deficiency Notices Register
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem', maxWidth: '650px', lineHeight: 1.5 }}>
              Generate official, tamper-evident AICTE compliance inquiries with verifiable QR codes and SHA-256 digital seals.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={handleOpenModal}
              className="clay-btn-pill clay-btn-blue"
            >
              <Plus size={16} />
              <span>Draft New Deficiency Notice</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Notice List on Left, Official Printable Document Preview on Right */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem'
      }}>
        {/* Left Column: Notices List */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
            Issued Deficiency Notices ({notices.length})
          </div>

          {notices.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--clay-text-muted)', fontSize: '0.85rem' }}>
              No deficiency notices issued yet. Click "Draft New Deficiency Notice" to issue one.
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              {notices.map((n, idx) => {
                const isSelected = currentNotice?.id === n.id;
                const dateStr = n.generated_at || n.generated_date;
                return (
                  <div
                    key={n.id || idx}
                    onClick={() => setSelectedNotice(n)}
                    className="clay-well"
                    style={{
                      cursor: 'pointer',
                      background: isSelected ? '#ffffff' : 'var(--clay-inset-bg)',
                      boxShadow: isSelected ? 'var(--clay-shadow-small)' : 'var(--clay-shadow-inset-sm)',
                      border: isSelected ? '2px solid var(--clay-blue-primary)' : '1px solid rgba(160, 178, 206, 0.3)',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                      <span style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-blue-primary)' }}>
                        {n.notice_number || n.id}
                      </span>
                      <span style={{ fontSize: '0.7rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
                        {dateStr || '2026-10-01'}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                      {n.institution_name || 'Technical Institution'}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.2rem' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                        Ref: {n.application_reference || n.reference || 'AICTE-APP-2026'}
                      </span>
                      <span style={{
                        fontSize: '0.68rem',
                        fontWeight: 700,
                        padding: '0.15rem 0.55rem',
                        borderRadius: '50px',
                        background: '#fef3c7',
                        color: '#92400e'
                      }}>
                        {n.status || 'Issued'}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Clean Official Notice Document View */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {currentNotice ? (
            <>
              {/* Document Header */}
              <div style={{ borderBottom: '2px solid #e2e8f0', paddingBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 800, color: 'var(--clay-blue-primary)', letterSpacing: '0.05em' }}>
                    ALL INDIA COUNCIL FOR TECHNICAL EDUCATION
                  </div>
                  <h2 style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginTop: '0.2rem' }}>
                    Deficiency & Rectification Memo
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-muted)' }}>
                    Ref: {currentNotice.notice_number || currentNotice.id} · Issued: {currentNotice.generated_at || currentNotice.generated_date || '2026-10-01'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onVerifyReport && onVerifyReport(currentNotice.id)}
                    className="clay-btn-pill clay-btn-white"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                    title="Verify Cryptographic Seal & Authenticity"
                  >
                    <QrCode size={15} color="var(--clay-blue-primary)" />
                    <span>Verify Seal</span>
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="clay-btn-pill clay-btn-white"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    <Printer size={15} />
                    <span>Print</span>
                  </button>
                </div>
              </div>

              {/* Notice Details */}
              <div className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                  To: The Principal / Director, {currentNotice.institution_name}
                </div>
                <div style={{ fontSize: '0.76rem', color: 'var(--clay-text-muted)' }}>
                  Application Reference: {currentNotice.application_reference || currentNotice.reference} · Academic Cycle: 2026-27 (EoA)
                </div>
                <p style={{ fontSize: '0.82rem', color: 'var(--clay-text-secondary)', lineHeight: 1.5, marginTop: '0.2rem' }}>
                  During automated compliance scrutiny for Extension of Approval (EoA) 2026-27, the following discrepancies were identified against AICTE Approval Process Handbook norms. You are directed to submit required certified clarifications within 15 days.
                </p>
              </div>

              {/* Findings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
                  Itemized Regulatory Deficiencies ({(currentNotice.deficiency_items || currentNotice.findings || []).length}):
                </div>
                {(currentNotice.deficiency_items || currentNotice.findings || [
                  { deficiency_statement: 'Faculty count does not satisfy statutory ratio for proposed student intake.', applied_rule: 'AICTE-SFR-01' }
                ]).map((item, idx) => (
                  <div key={idx} className="clay-well" style={{ background: '#ffffff', display: 'flex', alignItems: 'flex-start', gap: '0.75rem', padding: '0.85rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: item.severity === 'high' ? '#fee2e2' : '#fef3c7',
                      color: item.severity === 'high' ? '#ef4444' : '#b45309',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                        {item.deficiency_statement || item.reason || item.text || item.summary || 'Discrepancy detected against submitted evidence.'}
                      </div>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--clay-text-muted)' }}>
                        <span><strong>Rule:</strong> {item.applied_rule || item.rule || item.rule_id || 'AICTE-NORM'}</span>
                        {item.evidence_document && <span><strong>Doc:</strong> {item.evidence_document} ({item.page_reference || 'Page 1'})</span>}
                        {item.extracted_value && <span><strong>Found:</strong> {String(item.extracted_value)}</span>}
                        {item.comparison_norm && <span><strong>Norm:</strong> {String(item.comparison_norm)}</span>}
                      </div>
                      {item.action_required && (
                        <div style={{ fontSize: '0.74rem', color: '#0369a1', marginTop: '0.25rem', background: '#f0f9ff', padding: '0.2rem 0.5rem', borderRadius: '4px', display: 'inline-block' }}>
                          👉 <strong>Required Action:</strong> {item.action_required}
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Officer Directives & Clarifications Requested */}
              {currentNotice.clarifications_requested && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--clay-blue-primary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    Officer Directive & Clarifications Requested:
                  </div>
                  <div className="clay-well" style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#92400e', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                    {currentNotice.clarifications_requested}
                  </div>
                </div>
              )}

              {/* Digital Seal & Sign-off */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
                <div style={{ flex: 1, minWidth: '220px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginBottom: '0.2rem' }}>
                    <Lock size={12} color="var(--clay-text-muted)" />
                    <span style={{ fontSize: '0.72rem', fontWeight: 700, color: 'var(--clay-text-muted)' }}>
                      Cryptographic SHA-256 Digest (Public Verification Fingerprint):
                    </span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: '#1e3a8a', wordBreak: 'break-all', background: '#f8fafc', padding: '0.35rem 0.55rem', borderRadius: '4px', border: '1px solid #e2e8f0', flex: 1 }}>
                      {activeHash || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
                    </div>
                    {activeHash && (
                      <button
                        type="button"
                        onClick={() => handleCopyHash(activeHash)}
                        className="clay-btn-pill clay-btn-white"
                        style={{ padding: '0.25rem 0.55rem', fontSize: '0.7rem' }}
                        title="Copy public verification hash"
                      >
                        {copiedHash ? <Check size={12} color="#15803d" /> : <Copy size={12} />}
                        <span>{copiedHash ? 'Copied' : 'Copy'}</span>
                      </button>
                    )}
                  </div>
                  <div style={{ fontSize: '0.67rem', color: '#64748b', marginTop: '0.25rem' }}>
                    Public checksum seal · Not a private key. Used by QR verification to prevent tampering.
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                    {currentNotice.reviewer_name || 'AICTE Scrutiny Officer'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
                    Digitally Sealed & Verifiable ✓
                  </div>
                </div>
              </div>
            </>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 1rem', color: 'var(--clay-text-muted)' }}>
              Select a notice on the left to preview.
            </div>
          )}
        </div>
      </div>

      {/* Generate Notice Modal */}
      {isGenerateOpen && (
        <div className="modal-overlay">
          <div className="modal-content-clay" style={{ maxWidth: '580px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.3rem' }}>
              Draft Statutory Deficiency Notice
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginBottom: '1.25rem' }}>
              Create an official AICTE inquiry memo populated with verified compliance findings.
            </p>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Institution / Application Selection */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Target Institution / Application: <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="clay-well" style={{ padding: '0.25rem 0.5rem' }}>
                  <select
                    value={selectedAppId}
                    onChange={(e) => setSelectedAppId(e.target.value)}
                    className="clay-input-clean"
                    style={{ width: '100%', padding: '0.5rem', background: 'transparent', fontWeight: 600, color: 'var(--clay-text-primary)' }}
                  >
                    {applications && applications.length > 0 ? (
                      applications.map(app => (
                        <option key={app.id} value={app.id}>
                          {app.name} ({app.reference || app.id})
                        </option>
                      ))
                    ) : (
                      <>
                        <option value="APP-CASE-B">Case B — Bharat College of Engineering (Deficient / Expired NOC)</option>
                        <option value="APP-CASE-C">Case C — Chitkara Institute of Technology (Intake Conflict & Duplicate)</option>
                        <option value="APP-CASE-A">Case A — Apex Institute of Technology (Consistent)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              {/* Rectification Note */}
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                  <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
                    Specific Clarifications / Rectification Directives: <span style={{ color: '#ef4444' }}>* (Required)</span>
                  </label>
                  <button
                    type="button"
                    onClick={handleLoadTemplate}
                    className="clay-btn-pill clay-btn-white"
                    style={{ fontSize: '0.72rem', padding: '0.2rem 0.6rem' }}
                    title="Insert standard AICTE compliance notice directives"
                  >
                    <FileText size={12} color="var(--clay-blue-primary)" />
                    <span>Insert Standard Template</span>
                  </button>
                </div>

                <div className="clay-well">
                  <textarea
                    rows={5}
                    value={clarificationsNote}
                    onChange={(e) => {
                      setClarificationsNote(e.target.value);
                      if (validationError) setValidationError('');
                    }}
                    placeholder="Enter instructions for college (e.g., Provide registered partition deed for Block A and recruit required faculty before approval)..."
                    className="clay-input-clean"
                    style={{ resize: 'vertical', width: '100%' }}
                    required
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.35rem', fontSize: '0.72rem', color: 'var(--clay-text-muted)' }}>
                  <span>Must not be left blank. These directives are cryptographically sealed into the notice.</span>
                  <span>{clarificationsNote.trim().length} characters</span>
                </div>
              </div>

              {/* Validation Error Banner */}
              {validationError && (
                <div style={{
                  background: '#fef2f2',
                  border: '1px solid #fecaca',
                  borderRadius: '8px',
                  padding: '0.65rem 0.9rem',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.5rem',
                  color: '#b91c1c',
                  fontSize: '0.82rem'
                }}>
                  <AlertTriangle size={16} style={{ flexShrink: 0 }} />
                  <span>{validationError}</span>
                </div>
              )}

              {/* Action Buttons */}
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
                <button
                  type="button"
                  onClick={() => setIsGenerateOpen(false)}
                  className="clay-btn-pill clay-btn-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isGenerating || !clarificationsNote.trim()}
                  className="clay-btn-pill clay-btn-blue"
                  style={{
                    opacity: (!clarificationsNote.trim() || isGenerating) ? 0.6 : 1,
                    cursor: (!clarificationsNote.trim() || isGenerating) ? 'not-allowed' : 'pointer'
                  }}
                  title={!clarificationsNote.trim() ? "Please write clarification directives to enable submission" : ""}
                >
                  <Plus size={16} />
                  <span>{isGenerating ? 'Generating...' : 'Issue Notice'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
