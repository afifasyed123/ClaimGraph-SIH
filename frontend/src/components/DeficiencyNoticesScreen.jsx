import React, { useState } from 'react';
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
  const [targetAppId, setTargetAppId] = useState(activeApplication?.id || (applications.length > 0 ? applications[0].id : 'APP-CASE-C'));
  const [clarificationsNote, setClarificationsNote] = useState('');
  const [validationError, setValidationError] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copiedHash, setCopiedHash] = useState(false);

  const handleOpenModal = () => {
    setTargetAppId(activeApplication?.id || (applications.length > 0 ? applications[0].id : 'APP-CASE-C'));
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
    const chosenAppId = targetAppId || activeApplication?.id || (applications.length > 0 ? applications[0].id : 'APP-CASE-C');
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

  // Find target app object for display
  const chosenAppObj = applications.find(a => a.id === targetAppId) || activeApplication;

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
                        {n.generated_date ? n.generated_date : (n.generated_at ? new Date(n.generated_at).toLocaleDateString() : 'Active')}
                      </span>
                    </div>
                    <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                      {n.institution_name || 'Bharat College of Engineering'}
                    </div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
                      App Ref: {n.reference || n.application_reference || 'AICTE-APP-2026'}
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
                    Ref: {currentNotice.notice_number || currentNotice.id} · Issued: {currentNotice.generated_date || 'Current Scrutiny Cycle'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onVerifyReport && onVerifyReport(currentNotice.id)}
                    className="clay-btn-pill clay-btn-white"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                    title="Verify cryptographic authenticity and QR status"
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
                <p style={{ fontSize: '0.82rem', color: 'var(--clay-text-secondary)', lineHeight: 1.5 }}>
                  During automated compliance scrutiny for Extension of Approval (EoA) 2026-27, the following discrepancies were identified. You are directed to submit required clarifications within 15 days.
                </p>
              </div>

              {/* Specific Findings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
                  Specific Rectification Items:
                </div>
                {(currentNotice.deficiency_items || currentNotice.findings || [
                  { rule: 'AICTE-SFR-01', text: 'Faculty count does not satisfy 1:20 ratio for proposed 480 student intake.' },
                  { rule: 'AICTE-CAMPUS-02', text: 'Building Block A floor space shared without registered partition deed.' }
                ]).map((item, idx) => (
                  <div key={idx} className="clay-well" style={{ background: '#ffffff', display: 'flex', alignItems: 'flex-start', gap: '0.65rem' }}>
                    <div style={{
                      width: '24px',
                      height: '24px',
                      borderRadius: '50%',
                      background: '#fee2e2',
                      color: '#ef4444',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '0.75rem',
                      fontWeight: 800,
                      flexShrink: 0
                    }}>
                      {idx + 1}
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--clay-text-primary)' }}>
                        {item.deficiency_statement || item.text || item.summary || item.reason}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--clay-text-muted)', marginTop: '0.15rem' }}>
                        Rule: {item.applied_rule || item.rule || item.rule_id || 'AICTE-NORM'} 
                        {item.action_required ? ` · Action: ${item.action_required}` : ''}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Officer Directives & Clarifications Requested */}
              {currentNotice.clarifications_requested && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.25rem' }}>
                  <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Officer Directive & Clarifications Requested:
                  </div>
                  <div className="clay-well" style={{ background: '#fffbeb', border: '1px solid #fde68a', padding: '0.85rem 1rem', fontSize: '0.82rem', color: '#92400e', whiteSpace: 'pre-line', lineHeight: 1.55 }}>
                    {currentNotice.clarifications_requested}
                  </div>
                </div>
              )}

              {/* Digital Seal & Sign-off */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '1rem', flexWrap: 'wrap' }}>
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
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700, marginTop: '0.15rem' }}>
                    Digitally Sealed ✓
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
          <div className="modal-content-clay" style={{ maxWidth: '620px' }}>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.35rem' }}>
              Draft Statutory Deficiency Notice
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginBottom: '1.25rem' }}>
              Create an official inquiry letter requiring an institution to rectify identified compliance deficiencies.
            </p>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.15rem' }}>
              {/* Institution / Application Selection */}
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Target Institution / Application: <span style={{ color: '#ef4444' }}>*</span>
                </label>
                <div className="clay-well" style={{ padding: '0.25rem 0.5rem' }}>
                  {applications.length > 0 ? (
                    <select
                      value={targetAppId}
                      onChange={(e) => setTargetAppId(e.target.value)}
                      className="clay-input-clean"
                      style={{ width: '100%', padding: '0.5rem', background: 'transparent', fontWeight: 600, color: 'var(--clay-text-primary)' }}
                    >
                      {applications.map(app => (
                        <option key={app.id} value={app.id}>
                          {app.name} ({app.reference || app.id})
                        </option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ padding: '0.5rem', fontSize: '0.85rem', fontWeight: 600 }}>
                      {chosenAppObj?.name || 'Bharat College of Engineering'} ({chosenAppObj?.reference || 'APP-CASE-C'})
                    </div>
                  )}
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
                    placeholder="Enter the specific directives and requirements the college must fulfill (e.g., Provide registered partition deed for Block A and recruit 6 verified faculty members before intake approval)..."
                    className="clay-input-clean"
                    style={{ resize: 'vertical', width: '100%', lineHeight: 1.5 }}
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
