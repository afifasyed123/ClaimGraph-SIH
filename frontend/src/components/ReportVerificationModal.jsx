import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, AlertTriangle, QrCode, Lock, X, Copy, Check } from 'lucide-react';

export default function ReportVerificationModal({ reportId, onClose }) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!reportId) return;
    setLoading(true);
    fetch(`/api/reports/verify/${reportId}`)
      .then(res => {
        if (!res.ok) throw new Error(`Report #${reportId} not found.`);
        return res.json();
      })
      .then(d => {
        setData(d);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, [reportId]);

  return (
    <div className="modal-overlay">
      <div className="modal-content" style={{ maxWidth: '550px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid #e2e8f0', paddingBottom: '0.75rem', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <ShieldCheck size={20} color="#15803d" />
            <h3 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--clay-text-dark)' }}>
              Report Authenticity Verification
            </h3>
          </div>
          <button onClick={onClose} className="clay-btn clay-btn-sm" style={{ padding: '0.25rem 0.5rem' }}>
            <X size={16} />
          </button>
        </div>

        {loading ? (
          <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--clay-secondary)' }}>
            Verifying cryptographic digest from repository...
          </div>
        ) : error ? (
          <div style={{ background: '#fee2e2', border: '1px solid #fecaca', padding: '1rem', borderRadius: '8px', color: '#b91c1c', fontSize: '0.85rem' }}>
            {error}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ background: '#f0fdf4', border: '1.5px solid #bbf7d0', borderRadius: '10px', padding: '1rem', textAlign: 'center' }}>
              <CheckCircle2 size={36} color="#15803d" style={{ margin: '0 auto 0.4rem' }} />
              <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#166534' }}>
                {data.status}
              </div>
              <div style={{ fontSize: '0.78rem', color: '#15803d', marginTop: '0.2rem' }}>
                {data.verification_status}
              </div>
            </div>

            <div className="clay-inset" style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.65rem', fontSize: '0.8rem' }}>
              <div>
                <span style={{ color: 'var(--clay-secondary)', fontWeight: 600 }}>Report ID: </span>
                <strong style={{ fontFamily: 'var(--font-mono)' }}>{data.report_id}</strong>
              </div>
              <div>
                <span style={{ color: 'var(--clay-secondary)', fontWeight: 600 }}>Type: </span>
                <strong>{data.report_type}</strong>
              </div>
              {data.institution_name && (
                <div>
                  <span style={{ color: 'var(--clay-secondary)', fontWeight: 600 }}>Institution: </span>
                  <strong>{data.institution_name}</strong>
                </div>
              )}
              {data.application_reference && (
                <div>
                  <span style={{ color: 'var(--clay-secondary)', fontWeight: 600 }}>Reference: </span>
                  <strong style={{ fontFamily: 'var(--font-mono)' }}>{data.application_reference}</strong>
                </div>
              )}
              {data.stored_hash && (
                <div style={{ marginTop: '0.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.25rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
                      <Lock size={13} color="var(--clay-secondary)" />
                      <span style={{ color: 'var(--clay-secondary)', fontWeight: 700, fontSize: '0.75rem' }}>
                        Stored Cryptographic Digest (SHA-256):
                      </span>
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        navigator.clipboard.writeText(data.stored_hash);
                        setCopied(true);
                        setTimeout(() => setCopied(false), 2000);
                      }}
                      style={{
                        background: '#f1f5f9',
                        border: '1px solid #cbd5e1',
                        cursor: 'pointer',
                        color: copied ? '#15803d' : '#1e40af',
                        fontSize: '0.72rem',
                        fontWeight: 700,
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: '0.25rem',
                        padding: '0.15rem 0.5rem',
                        borderRadius: '4px',
                        transition: 'all 0.15s ease'
                      }}
                      title="Copy SHA-256 Digest"
                    >
                      {copied ? <Check size={12} /> : <Copy size={12} />}
                      <span>{copied ? 'Copied' : 'Copy'}</span>
                    </button>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)', fontSize: '0.72rem', color: '#1e3a8a', wordBreak: 'break-all', background: '#ffffff', padding: '0.45rem 0.65rem', borderRadius: '6px', border: '1px solid #cbd5e1', lineHeight: 1.45 }}>
                    {data.stored_hash}
                  </div>
                  <div style={{ fontSize: '0.7rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.45, background: '#eff6ff', padding: '0.45rem 0.65rem', borderRadius: '6px', borderLeft: '3px solid #3b82f6' }}>
                    <strong>Note:</strong> This is a public cryptographic checksum (digest), <em>not a secret key</em>. It acts as an immutable digital seal so anyone can verify that the document contents have not been modified since issuance.
                  </div>
                </div>
              )}
            </div>

            <div style={{ fontSize: '0.68rem', color: '#64748b', textAlign: 'center', background: '#f8fafc', padding: '0.5rem', borderRadius: '6px' }}>
              {data.disclaimer}
            </div>

            <button onClick={onClose} className="clay-btn clay-btn-primary" style={{ width: '100%' }}>
              Done
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
