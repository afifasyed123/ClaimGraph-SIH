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
  Calendar
} from 'lucide-react';

export default function DeficiencyNoticesScreen({
  notices = [],
  onGenerateNotice,
  activeApplication,
  onVerifyReport
}) {
  const [selectedNotice, setSelectedNotice] = useState(notices.length > 0 ? notices[0] : null);
  const [isGenerateOpen, setIsGenerateOpen] = useState(false);
  const [clarificationsNote, setClarificationsNote] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleCreateSubmit = async (e) => {
    e.preventDefault();
    setIsGenerating(true);
    try {
      const newNotice = await onGenerateNotice({
        application_id: activeApplication?.id || 'APP-CASE-C',
        clarifications_note: clarificationsNote || 'Please provide updated land partition deeds and confirmed faculty appointments.'
      });
      setSelectedNotice(newNotice);
      setIsGenerateOpen(false);
      setClarificationsNote('');
    } catch (err) {
      console.error(err);
    } finally {
      setIsGenerating(false);
    }
  };

  const currentNotice = selectedNotice || (notices.length > 0 ? notices[0] : null);

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
              onClick={() => setIsGenerateOpen(true)}
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
                      {n.notice_number || `NOTICE-${n.id}`}
                    </span>
                    <span style={{ fontSize: '0.7rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
                      {n.generated_at ? new Date(n.generated_at).toLocaleDateString() : 'Today'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                    {n.institution_name || 'Bharat College of Engineering'}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
                    App Ref: {n.application_reference || 'AICTE-APP-2026'}
                  </div>
                </div>
              );
            })}
          </div>
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
                    Ref: {currentNotice.notice_number} · Issued: {currentNotice.generated_at ? new Date(currentNotice.generated_at).toLocaleDateString() : 'Today'}
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '0.5rem' }}>
                  <button
                    onClick={() => onVerifyReport && onVerifyReport(currentNotice.id)}
                    className="clay-btn-pill clay-btn-white"
                    style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
                  >
                    <QrCode size={15} color="var(--clay-blue-primary)" />
                    <span>Verify QR</span>
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

              {/* Findings List */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)' }}>
                  Specific Rectification Items:
                </div>
                {(currentNotice.findings || [
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
                        {item.text || item.summary}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--clay-text-muted)' }}>
                        Rule: {item.rule || item.rule_id || 'AICTE-NORM'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {/* Digital Seal & Sign-off */}
              <div style={{ marginTop: 'auto', paddingTop: '1rem', borderTop: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: '0.72rem', color: 'var(--clay-text-muted)' }}>Cryptographic SHA-256 Digest:</div>
                  <div style={{ fontSize: '0.7rem', fontFamily: 'monospace', color: 'var(--clay-text-secondary)' }}>
                    {currentNotice.digest ? currentNotice.digest.substring(0, 32) + '...' : 'e3b0c44298fc1c149afbf4c8996fb924...'}
                  </div>
                </div>

                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                    {currentNotice.reviewer_name || 'AICTE Scrutiny Officer'}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#10b981', fontWeight: 700 }}>
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
          <div className="modal-content-clay">
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.5rem' }}>
              Draft Statutory Deficiency Notice
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginBottom: '1.25rem' }}>
              Create an official inquiry letter for {activeApplication?.name || 'Bharat College of Engineering'}.
            </p>

            <form onSubmit={handleCreateSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div>
                <label style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)', display: 'block', marginBottom: '0.35rem' }}>
                  Specific Clarifications / Rectification Note:
                </label>
                <div className="clay-well">
                  <textarea
                    rows={4}
                    value={clarificationsNote}
                    onChange={(e) => setClarificationsNote(e.target.value)}
                    placeholder="Enter instructions for college (e.g., Provide registered partition deed for Block A and recruit 6 faculty members before intake approval)..."
                    className="clay-input-clean"
                    style={{ resize: 'vertical' }}
                  />
                </div>
              </div>

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
                  disabled={isGenerating}
                  className="clay-btn-pill clay-btn-blue"
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
