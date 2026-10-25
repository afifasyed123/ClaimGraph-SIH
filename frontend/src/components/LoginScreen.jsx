import React, { useState } from 'react';
import { Mail, Lock, User, ArrowRight, ShieldCheck, Sparkles } from 'lucide-react';

export default function LoginScreen({ onLogin }) {
  const [email, setEmail] = useState('officer@aicte.gov.in');
  const [role, setRole] = useState('Scrutiny Reviewer');

  const handleSignIn = (selectedRole) => {
    onLogin({
      name: selectedRole === 'Senior Officer' ? 'Dr. Arvind Deshmukh' : 'Priya Sharma',
      email: email,
      role: selectedRole
    });
  };

  return (
    <div style={{
      minHeight: '88vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2rem 1.5rem'
    }}>
      <div style={{ width: '100%', maxWidth: '440px' }}>
        {/* Claymorphic Login Card (Mirrors the top-left card in reference image) */}
        <div className="clay-box" style={{ padding: '2.5rem 2.2rem' }}>
          <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
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
            
            <h1 style={{ fontSize: '1.8rem', fontWeight: 800, color: 'var(--clay-text-primary)', letterSpacing: '-0.02em' }}>
              Login
            </h1>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem' }}>
              ClaimGraph-AICTE Compliance Portal
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
                  placeholder="username@mail.com"
                />
              </div>
            </div>

            {/* Quick 1-Click Role Switch */}
            <div style={{ margin: '0.5rem 0' }}>
              <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 600, color: 'var(--clay-text-secondary)', marginBottom: '0.45rem' }}>
                Select Role
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                <button
                  type="button"
                  onClick={() => setRole('Scrutiny Reviewer')}
                  className={`clay-btn-pill ${role === 'Scrutiny Reviewer' ? 'clay-btn-blue' : 'clay-btn-white'}`}
                  style={{ padding: '0.6rem 0.8rem', fontSize: '0.8rem' }}
                >
                  Reviewer
                </button>
                <button
                  type="button"
                  onClick={() => setRole('Senior Officer')}
                  className={`clay-btn-pill ${role === 'Senior Officer' ? 'clay-btn-blue' : 'clay-btn-white'}`}
                  style={{ padding: '0.6rem 0.8rem', fontSize: '0.8rem' }}
                >
                  Senior Officer
                </button>
              </div>
            </div>

            {/* Primary Blue Action Button */}
            <button
              onClick={() => handleSignIn(role)}
              className="clay-btn-pill clay-btn-blue"
              style={{ width: '100%', padding: '0.9rem', fontSize: '0.95rem', marginTop: '0.5rem' }}
            >
              <span>Sign In</span>
              <ArrowRight size={17} />
            </button>
          </div>

          <div style={{ textAlign: 'center', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--clay-text-muted)' }}>
            Empowering authorized officers with explainable verification intelligence.
          </div>
        </div>
      </div>
    </div>
  );
}
