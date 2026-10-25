import React from 'react';
import { 
  Clock, 
  UserCheck, 
  ShieldAlert, 
  FileText, 
  CheckCircle2, 
  HelpCircle,
  CornerDownRight
} from 'lucide-react';

export default function AuditTimeline({ auditTrail }) {
  return (
    <div className="glass-card col-6" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
              Module F (P0)
            </span>
            <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
              Deterministic Reviewer History
            </span>
          </div>
          <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '0.2rem' }}>
            Scrutiny Audit Trail & Timeline (Screen 7)
          </h2>
        </div>
        <span className="badge badge-muted">
          {auditTrail?.length || 0} Actions Logged
        </span>
      </div>

      {!auditTrail || auditTrail.length === 0 ? (
        <div style={{
          textAlign: 'center',
          padding: '2.5rem 1rem',
          background: 'rgba(15, 23, 42, 0.4)',
          borderRadius: '12px',
          border: '1px dashed var(--border-subtle)',
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center'
        }}>
          <Clock size={32} color="var(--text-muted)" style={{ marginBottom: '0.5rem' }} />
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
            No Reviewer Actions Logged Yet
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '340px', marginTop: '0.25rem' }}>
            When a human scrutiny officer reviews a finding and records an official action, it is immutably timestamped here.
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', overflowY: 'auto', flex: 1, paddingRight: '0.3rem' }}>
          {auditTrail.map((act) => {
            return (
              <div 
                key={act.id}
                style={{
                  background: 'rgba(30, 41, 59, 0.45)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '12px',
                  padding: '0.85rem 1rem',
                  position: 'relative'
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                      {act.action}
                    </span>
                    <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {act.field_or_claim || 'General Assessment'}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                    {act.created_at ? act.created_at.replace('T', ' ').substring(0, 19) : 'Just now'}
                  </div>
                </div>

                {act.reason && (
                  <div style={{
                    fontSize: '0.75rem',
                    color: 'var(--text-secondary)',
                    background: 'rgba(15, 23, 42, 0.6)',
                    padding: '0.5rem 0.75rem',
                    borderRadius: '8px',
                    marginTop: '0.4rem',
                    borderLeft: '3px solid var(--accent-purple)'
                  }}>
                    "{act.reason}"
                  </div>
                )}

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '0.5rem', fontSize: '0.68rem', color: 'var(--text-muted)' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                    <UserCheck size={11} color="#60a5fa" />
                    <span>Actor: {act.actor}</span>
                  </div>
                  <div style={{ fontFamily: 'var(--font-mono)' }}>
                    Finding Ref: {act.finding_id}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
