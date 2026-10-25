import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  HelpCircle, 
  Building, 
  FileCheck2, 
  ExternalLink,
  Info
} from 'lucide-react';

export default function VerificationPanel({ 
  verificationData, 
  onRefresh 
}) {
  if (!verificationData || !verificationData.items) return null;

  return (
    <div className="glass-card col-6" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
              Module D (P1)
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Mock Issuer Adapter Interface
            </span>
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            Statutory Registry Verification Panel
          </h2>
        </div>
      </div>

      {/* Mandatory Disclaimer (FR-D3 & FR-D5) */}
      <div style={{
        background: 'rgba(245, 158, 11, 0.08)',
        border: '1px solid rgba(245, 158, 11, 0.25)',
        borderRadius: '10px',
        padding: '0.65rem 0.85rem',
        fontSize: '0.75rem',
        color: '#fef3c7',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem',
        marginBottom: '1rem'
      }}>
        <Info size={14} color="#fbbf24" style={{ flexShrink: 0 }} />
        <div>
          <strong>SIMULATED VERIFICATION. NOT CONNECTED TO THE ISSUING AUTHORITY.</strong>
          <div style={{ opacity: 0.8, fontSize: '0.7rem', marginTop: '0.1rem' }}>
            A missing external response is never treated as evidence of fraud.
          </div>
        </div>
      </div>

      {/* List of Verified / Checked Documents */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        {verificationData.items.map(item => {
          let badgeClass = 'badge-muted';
          if (item.verification_status.includes('Verified')) badgeClass = 'badge-emerald';
          else if (item.verification_status.includes('Mismatch')) badgeClass = 'badge-rose';
          else if (item.verification_status.includes('Unverified')) badgeClass = 'badge-amber';

          return (
            <div 
              key={item.document_id}
              style={{
                background: 'rgba(15, 23, 42, 0.6)',
                border: '1px solid var(--border-subtle)',
                borderRadius: '12px',
                padding: '0.85rem 1rem'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                <div>
                  <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.doc_type.replace('_', ' ').toUpperCase()}
                  </div>
                  <div style={{ fontSize: '0.72rem', color: '#60a5fa' }}>
                    {item.issuer_label}
                  </div>
                </div>
                <span className={`badge ${badgeClass}`} style={{ fontSize: '0.65rem' }}>
                  {item.verification_status}
                </span>
              </div>

              <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.35rem', lineHeight: 1.4 }}>
                {item.notes}
              </div>

              <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem', fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                <span>File: {item.filename}</span>
                <span>•</span>
                <span>SHA-256: {item.sha256 ? item.sha256.substring(0, 10) : 'hash'}...</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
