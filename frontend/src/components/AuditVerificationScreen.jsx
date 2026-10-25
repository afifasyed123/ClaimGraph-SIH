import React, { useState } from 'react';
import { 
  ShieldCheck, 
  CheckCircle2, 
  AlertTriangle, 
  RefreshCw, 
  Sparkles,
  Lock,
  Link,
  Building2,
  FileCheck
} from 'lucide-react';

export default function AuditVerificationScreen({
  auditChain = [],
  onVerifyAuditChain,
  verificationData,
  isVerifying
}) {
  const [verifyResult, setVerifyResult] = useState(null);

  const handleVerify = async () => {
    try {
      const res = await onVerifyAuditChain();
      setVerifyResult(res);
    } catch (err) {
      console.error(err);
    }
  };

  const issuerItems = verificationData?.items || [
    { source: 'Revenue Department Land Registry', status: 'VERIFIED', type: 'Title Deed & Land Extent' },
    { source: 'State Technical University Portal', status: 'VERIFIED', type: 'Faculty Enrolment Master' },
    { source: 'National Building Code (NBC) Portal', status: 'VERIFIED', type: 'Fire Safety Certificate' }
  ];

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', width: '100%' }}>
      {/* Header */}
      <div className="clay-box" style={{ padding: '2rem 2.2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.45rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.3rem 0.85rem', borderRadius: '50px', fontSize: '0.78rem', fontWeight: 700, marginBottom: '0.5rem' }}>
              <Sparkles size={14} />
              <span>Tamper-Evident Provenance</span>
            </div>
            <h1 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
              Audit Chain & Integrity Verification
            </h1>
            <p style={{ fontSize: '0.9rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem', maxWidth: '650px', lineHeight: 1.5 }}>
              Every human review action and automated check is permanently recorded in a cryptographic SHA-256 hash-chain to guarantee transparency.
            </p>
          </div>

          <button
            onClick={handleVerify}
            disabled={isVerifying}
            className="clay-btn-pill clay-btn-blue"
          >
            <RefreshCw size={16} className={isVerifying ? 'spin' : ''} />
            <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}</span>
          </button>
        </div>
      </div>

      {/* Chain Verification Result Card */}
      {verifyResult && (
        <div className="clay-box" style={{
          background: verifyResult.is_valid ? '#f0fdf4' : '#fef2f2',
          border: verifyResult.is_valid ? '2px solid #86efac' : '2px solid #fca5a5',
          padding: '1.5rem 1.8rem'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
            {verifyResult.is_valid ? (
              <CheckCircle2 size={28} color="#10b981" />
            ) : (
              <AlertTriangle size={28} color="#ef4444" />
            )}
            <div>
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: verifyResult.is_valid ? '#065f46' : '#991b1b' }}>
                {verifyResult.is_valid ? 'All Audit Blocks Cryptographically Validated' : 'Audit Chain Discrepancy Found'}
              </div>
              <div style={{ fontSize: '0.82rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
                {verifyResult.verification_message || 'Every block from Genesis #0 to the latest reviewer action mathematically hashes to the next block with zero tampering.'}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Visual Block Chain (Matching Stepper from Reference Image) */}
      <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Cryptographic Ledger Blocks ({auditChain.length} Blocks)
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {auditChain.map((b, idx) => (
            <div key={b.block_index || idx} className="clay-well" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{
                  fontSize: '0.75rem',
                  fontWeight: 800,
                  padding: '0.2rem 0.6rem',
                  borderRadius: '50px',
                  background: 'var(--clay-blue-gradient)',
                  color: '#ffffff'
                }}>
                  Block #{b.block_index}
                </span>
                <span style={{ fontSize: '0.7rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
                  {b.timestamp ? new Date(b.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) : 'Verified'}
                </span>
              </div>

              <div style={{ fontSize: '0.92rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                {b.action || 'Application Initialized'}
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)' }}>
                Actor: {b.actor || 'AICTE Engine'} · Target: {b.target_type || 'Case'}
              </div>

              <div style={{ fontSize: '0.68rem', fontFamily: 'monospace', color: 'var(--clay-text-muted)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', marginTop: '0.25rem' }}>
                Hash: {b.current_hash ? b.current_hash.substring(0, 24) + '...' : '0000000000...'}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* External Verified Data Issuers */}
      <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <div style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
          Cross-Institutional Source Verification
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1rem' }}>
          {issuerItems.map((item, idx) => (
            <div key={idx} className="clay-well" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem' }}>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  {item.source}
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', marginTop: '0.15rem' }}>
                  {item.type}
                </div>
              </div>
              <div style={{
                fontSize: '0.72rem',
                fontWeight: 800,
                color: '#10b981',
                background: '#ecfdf5',
                padding: '0.25rem 0.65rem',
                borderRadius: '50px',
                display: 'flex',
                alignItems: 'center',
                gap: '0.25rem',
                flexShrink: 0
              }}>
                <CheckCircle2 size={12} />
                <span>Verified</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
