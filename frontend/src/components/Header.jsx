import React from 'react';
import { 
  Layers, 
  Play, 
  Sliders, 
  UserCheck, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  FileCheck2
} from 'lucide-react';

export default function Header({ 
  currentCaseKey, 
  onSelectCase, 
  currentRole, 
  onToggleRole, 
  onRunValidation, 
  onOpenSimulator,
  isValidating
}) {
  return (
    <header style={{
      borderBottom: '1px solid var(--border-subtle)',
      background: 'rgba(11, 15, 25, 0.85)',
      backdropFilter: 'var(--glass-blur)',
      position: 'sticky',
      top: '37px',
      zIndex: 90,
      padding: '0.85rem 2rem'
    }}>
      <div style={{
        maxWidth: '1600px',
        margin: '0 auto',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #2563eb, #7c3aed)',
            padding: '0.55rem',
            borderRadius: '12px',
            boxShadow: '0 0 20px rgba(59, 130, 246, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Layers size={22} color="#ffffff" />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ 
                fontFamily: 'var(--font-display)', 
                fontSize: '1.25rem', 
                fontWeight: 700, 
                letterSpacing: '-0.02em',
                background: 'linear-gradient(90deg, #ffffff, #93c5fd)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent'
              }}>
                ClaimGraph-AICTE
              </span>
              <span className="badge badge-purple" style={{ fontSize: '0.65rem' }}>
                Prototype v1.0
              </span>
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
              Evidence-Linked Scrutiny & Regulatory Verification Platform
            </div>
          </div>
        </div>

        {/* Demo Case Switcher (FR-A3) */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '0.4rem',
          background: 'rgba(15, 23, 42, 0.8)',
          padding: '0.3rem',
          borderRadius: '12px',
          border: '1px solid var(--border-subtle)'
        }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0 0.5rem', fontWeight: 600 }}>
            CASES:
          </span>
          <button 
            className={`btn btn-sm ${currentCaseKey === 'case_a' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectCase('case_a')}
            title="Consistent: All documents present, values match evidence and history (0 findings)"
          >
            Case A: Consistent
          </button>
          <button 
            className={`btn btn-sm ${currentCaseKey === 'case_b' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectCase('case_b')}
            title="Incomplete: Missing land cert, blank faculty field, expired fire NOC"
          >
            Case B: Incomplete
          </button>
          <button 
            className={`btn btn-sm ${currentCaseKey === 'case_c' ? 'btn-primary' : 'btn-outline'}`}
            onClick={() => onSelectCase('case_c')}
            title="Inconsistent: Field conflict (480 vs 360), historical mismatch, duplicate SHA-256"
          >
            Case C: Inconsistent
          </button>
        </div>

        {/* Action Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Role Switcher (PRD Section 3) */}
          <button 
            className="btn btn-outline btn-sm"
            onClick={onToggleRole}
            style={{ borderColor: currentRole === 'senior' ? 'var(--accent-purple)' : 'var(--border-subtle)' }}
          >
            {currentRole === 'reviewer' ? (
              <>
                <UserCheck size={14} color="#60a5fa" />
                <span>Scrutiny Reviewer</span>
              </>
            ) : (
              <>
                <ShieldCheck size={14} color="#c084fc" />
                <span>Senior Official (P1)</span>
              </>
            )}
          </button>

          {/* Change-Impact Simulator Button */}
          <button 
            className="btn btn-purple btn-sm"
            onClick={onOpenSimulator}
            title="Run Change-Impact Simulator on proposed parameter shifts"
          >
            <Sliders size={14} />
            <span>Impact Simulator</span>
          </button>

          {/* Run Validation Engine */}
          <button 
            className="btn btn-primary btn-sm"
            onClick={onRunValidation}
            disabled={isValidating}
          >
            <RefreshCw size={14} className={isValidating ? 'spin' : ''} />
            <span>{isValidating ? 'Validating...' : 'Run Validation'}</span>
          </button>
        </div>
      </div>
    </header>
  );
}
