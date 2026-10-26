import React, { useState } from 'react';
import { 
  Mail, 
  ArrowRight, 
  ShieldCheck, 
  Sparkles, 
  FileCheck2, 
  Building2, 
  History, 
  CheckCircle2, 
  AlertTriangle,
  Play
} from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('officer@aicte.gov.in');
  const [role, setRole] = useState('Scrutiny Reviewer');

  const handleSignIn = (selectedRole, options = null) => {
    onLogin(
      {
        name: selectedRole === 'Senior Officer' ? 'Dr. Arvind Deshmukh' : 'Priya Sharma',
        email: email,
        role: selectedRole
      },
      options
    );
  };

  const handleTryDemoCase = (caseKey) => {
    handleSignIn(role, { targetCase: caseKey });
  };

  return (
    <div style={{
      minHeight: '90vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1.5rem',
      maxWidth: '1240px',
      margin: '0 auto'
    }}>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
        gap: '2.5rem',
        alignItems: 'center',
        width: '100%'
      }}>
        {/* Left Column: Statutory Authority & Core Capabilities */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
          <div>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.5rem',
              background: '#eff6ff',
              color: 'var(--clay-blue-primary)',
              padding: '0.35rem 0.9rem',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '1rem',
              border: '1px solid #dbeafe'
            }}>
              <span style={{ color: '#ff9933' }}>🇮🇳</span>
              <span>All India Council for Technical Education · Statutory Scrutiny Portal</span>
            </div>

            <h1 style={{
              fontSize: '2.4rem',
              fontWeight: 800,
              color: '#0f172a',
              letterSpacing: '-0.025em',
              lineHeight: 1.15
            }}>
              ClaimGraph<span style={{ color: 'var(--clay-blue-primary)' }}>·AICTE</span>
            </h1>

            <p style={{
              fontSize: '1.05rem',
              color: '#475569',
              marginTop: '0.65rem',
              lineHeight: 1.6,
              maxWidth: '560px'
            }}>
              Automated, evidence-backed document compliance scrutiny and cross-institution claim reconciliation for Extension of Approval (EoA) applications under the AICTE Approval Process Handbook (APH).
            </p>
          </div>

          {/* Three Core Capabilities */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="clay-box-sm" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#eff6ff',
                color: 'var(--clay-blue-primary)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileCheck2 size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  Evidence-Backed Document Scrutiny
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', marginTop: '0.15rem', lineHeight: 1.45 }}>
                  Cross-verifies claims across Affiliation Resolutions, Land Deeds, Fire Safety NOCs, and Faculty Registers with exact document snippets.
                </div>
              </div>
            </div>

            <div className="clay-box-sm" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#fef3c7',
                color: '#d97706',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <Building2 size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  Cross-Institution Claim Reconciliation
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', marginTop: '0.15rem', lineHeight: 1.45 }}>
                  Automatically detects shared physical facilities (classrooms, auditoriums, labs) or double-counted faculty members across co-located colleges.
                </div>
              </div>
            </div>

            <div className="clay-box-sm" style={{ display: 'flex', gap: '0.85rem', alignItems: 'flex-start' }}>
              <div style={{
                width: '38px',
                height: '38px',
                borderRadius: '12px',
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <History size={19} />
              </div>
              <div>
                <div style={{ fontSize: '0.88rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
                  Auditable Human Review
                </div>
                <div style={{ fontSize: '0.78rem', color: 'var(--clay-text-secondary)', marginTop: '0.15rem', lineHeight: 1.45 }}>
                  All consequential reviewer actions are logged with officer justification into an immutable, cryptographically hashed (SHA-256) audit chain.
                </div>
              </div>
            </div>
          </div>

          {/* Quick Demo Case Selector */}
          <div>
            <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.5rem' }}>
              Try Demo Scrutiny Case (1-Click Entry):
            </div>
            <div style={{ display: 'flex', gap: '0.65rem', flexWrap: 'wrap' }}>
              <button
                type="button"
                onClick={() => handleTryDemoCase('case_c')}
                className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ padding: '0.55rem 0.95rem', fontSize: '0.78rem' }}
                title="Explore 480 vs 360 seat discrepancy and duplicate binary file"
              >
                <AlertTriangle size={14} color="#ef4444" />
                <span>Case C: Discrepancy & Campus Sharing</span>
              </button>

              <button
                type="button"
                onClick={() => handleTryDemoCase('case_b')}
                className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ padding: '0.55rem 0.95rem', fontSize: '0.78rem' }}
                title="Inspect expired Fire NOC and faculty shortfall"
              >
                <AlertTriangle size={14} color="#f59e0b" />
                <span>Case B: Missing NOC</span>
              </button>

              <button
                type="button"
                onClick={() => handleTryDemoCase('case_a')}
                className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                style={{ padding: '0.55rem 0.95rem', fontSize: '0.78rem' }}
                title="View fully compliant 1:12.5 SFR application"
              >
                <CheckCircle2 size={14} color="#10b981" />
                <span>Case A: Compliant</span>
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Officer Authentication Card */}
        <div style={{ maxWidth: '440px', width: '100%', margin: '0 auto' }}>
          <div className="clay-box animate-card-entrance animate-fade-in" style={{ padding: '2.5rem 2.2rem' }}>
            <div style={{ textAlign: 'center', marginBottom: '1.75rem' }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '20px',
                background: 'var(--clay-blue-gradient)',
                boxShadow: 'var(--clay-blue-glow)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                margin: '0 auto 1rem'
              }}>
                <ShieldCheck size={28} />
              </div>
              
              <h2 style={{ fontSize: '1.65rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
                Officer Sign In
              </h2>
              <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem' }}>
                Authorized AICTE Scrutiny Access
              </p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              {/* Email Field with Inset Well */}
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--clay-text-secondary)', marginBottom: '0.45rem' }}>
                  Officer ID / Email
                </label>
                <div className="clay-well" style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Mail size={16} color="#94a3b8" />
                  <input
                    type="text"
                    className="clay-input-clean"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="officer@aicte.gov.in"
                  />
                </div>
              </div>

              {/* Quick 1-Click Role Switch */}
              <div style={{ margin: '0.25rem 0' }}>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--clay-text-secondary)', marginBottom: '0.45rem' }}>
                  Select Officer Role
                </label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <button
                    type="button"
                    onClick={() => setRole('Scrutiny Reviewer')}
                    className={`clay-btn-pill transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${role === 'Scrutiny Reviewer' ? 'clay-btn-blue' : 'clay-btn-white'}`}
                    style={{ padding: '0.65rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    <span>Reviewer</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setRole('Senior Officer')}
                    className={`clay-btn-pill transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer ${role === 'Senior Officer' ? 'clay-btn-blue' : 'clay-btn-white'}`}
                    style={{ padding: '0.65rem 0.8rem', fontSize: '0.8rem' }}
                  >
                    <span>Senior Officer</span>
                  </button>
                </div>
              </div>

              {/* Primary Action Button: Open Review Dashboard */}
              <button
                type="button"
                onClick={() => handleSignIn(role)}
                className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
                style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
              >
                <span>Open Review Dashboard</span>
                <ArrowRight size={17} />
              </button>
            </div>

            {/* Discreet Synthetic Disclosure */}
            <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.72rem', color: '#64748b', lineHeight: 1.45 }}>
              🔒 Statutory Demonstration Environment. All application records and demonstration rules are synthetic prototypes for evaluation.
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
