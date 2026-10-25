import React, { useState } from 'react';
import { 
  CASES, 
  DEMO_DATE, 
  INITIAL_AUDIT_LOG, 
  MOCK_ISSUER_RECORDS 
} from './data/mockData';
import { 
  ShieldCheck, 
  UserCheck, 
  AlertTriangle, 
  CheckCircle, 
  FileText, 
  Clock, 
  Sliders, 
  LogOut, 
  Lock, 
  Layers, 
  ExternalLink,
  ChevronRight,
  Info
} from 'lucide-react';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [loginRole, setLoginRole] = useState('Scrutiny Committee Reviewer');

  // Navigation State
  const [activeTab, setActiveTab] = useState('scrutiny'); // 'scrutiny', 'simulator', 'audit'
  const [activeCaseKey, setActiveCaseKey] = useState('case_c'); // start with inconsistent to showcase scrutiny
  const [selectedFindingId, setSelectedFindingId] = useState('FND-CR-001');

  // Reviewer Action State
  const [selectedAction, setSelectedAction] = useState('Accepted for review');
  const [actionReason, setActionReason] = useState('');
  const [actionFeedback, setActionFeedback] = useState('');

  // Audit Log State
  const [auditLog, setAuditLog] = useState(INITIAL_AUDIT_LOG);

  // Simulator State
  const [simIntake, setSimIntake] = useState(480);
  const [simFaculty, setSimFaculty] = useState(20);
  const [simResult, setSimResult] = useState(null);

  // Current Active Case Data
  const currentCase = CASES[activeCaseKey];
  const findings = currentCase.findings || [];
  const selectedFinding = findings.find(f => f.id === selectedFindingId) || findings[0] || null;

  // Handle Login Presets
  const handleLoginAs = (name, email, role) => {
    setCurrentUser({ name, email, role });
  };

  const handleCustomLogin = (e) => {
    e.preventDefault();
    if (!loginEmail) return;
    setCurrentUser({
      name: loginEmail.split('@')[0],
      email: loginEmail,
      role: loginRole
    });
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setLoginPassword('');
    setActionFeedback('');
  };

  // Handle Reviewer Action Submission
  const handleSaveAction = (e) => {
    e.preventDefault();
    if (!selectedFinding) return;

    if (['Dismissed', 'Referred for further verification or inspection'].includes(selectedAction) && !actionReason.trim()) {
      setActionFeedback('⚠️ Action strictly requires an administrative reason note.');
      return;
    }

    const newLog = {
      id: `LOG-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().replace('T', ' ').substring(0, 19),
      finding_id: selectedFinding.id,
      action: selectedAction,
      reviewer: `${currentUser.name} (${currentUser.role})`,
      reason: actionReason.trim() || 'Action recorded by authorized reviewer without additional notes.'
    };

    setAuditLog([newLog, ...auditLog]);
    setActionFeedback(`✓ Action "${selectedAction}" recorded to immutable audit log!`);
    setActionReason('');
    setTimeout(() => setActionFeedback(''), 4000);
  };

  // Handle Change-Impact Simulation
  const handleRunSimulation = () => {
    const intake = Number(simIntake);
    const faculty = Number(simFaculty);
    const ratio = faculty > 0 ? (intake / faculty) : 999;

    const newlyFlagged = [];
    const resolved = [];
    const unchanged = [];

    // Rule 1: Intake Quota vs Sanctioned 360
    if (intake > 360) {
      newlyFlagged.push({
        id: "SIM-RULE-INTAKE",
        field: "Proposed Intake Quota",
        severity: "High",
        reason: `Proposed intake (${intake}) exceeds governing body sanctioned baseline of 360 seats.`
      });
    } else {
      resolved.push({
        id: "SIM-RULE-INTAKE",
        field: "Proposed Intake Quota",
        severity: "Compliant",
        reason: `Intake (${intake}) is within or matches sanctioned capacity of 360 seats.`
      });
    }

    // Rule 2: Student-to-Faculty Ratio 1:15 Norm
    if (ratio > 15.0) {
      const minFaculty = Math.ceil(intake / 15);
      newlyFlagged.push({
        id: "SIM-RULE-RATIO",
        field: "Student-to-Faculty Ratio",
        severity: "High",
        reason: `Ratio is 1:${ratio.toFixed(1)} (${faculty} faculty for ${intake} intake). Violates 1:15 norm (requires at least ${minFaculty} faculty).`
      });
    } else {
      resolved.push({
        id: "SIM-RULE-RATIO",
        field: "Student-to-Faculty Ratio",
        severity: "Compliant",
        reason: `Ratio 1:${ratio.toFixed(1)} satisfies the standard statutory 1:15 requirement.`
      });
    }

    // Rule 3: File Integrity (unchanged by intake changes)
    if (activeCaseKey === 'case_c') {
      unchanged.push({
        id: "SIM-RULE-HASH",
        field: "Document Cryptographic Hash",
        severity: "High",
        reason: "SHA-256 collision across Land Certificate and Faculty Register remains unresolved."
      });
    }

    setSimResult({
      intake,
      faculty,
      ratio: ratio.toFixed(1),
      newlyFlagged,
      resolved,
      unchanged
    });
  };

  // ---------------------------------------------------------------------------
  // 1. LOGIN SCREEN (If not authenticated)
  // ---------------------------------------------------------------------------
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
        {/* Mandatory Top Banner */}
        <div className="top-synthetic-banner">
          <AlertTriangle size={14} />
          <span>SYNTHETIC DEMO DATA. NOT A REAL INSTITUTION. All verification is simulated. Demonstration rules are not official AICTE requirements.</span>
        </div>

        {/* Centered Login Box */}
        <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <div className="admin-card" style={{ maxWidth: '460px', width: '100%', padding: '2rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ background: '#1e3a8a', padding: '0.4rem', borderRadius: '6px' }}>
                <ShieldCheck size={22} color="#60a5fa" />
              </div>
              <span className="status-pill status-blue" style={{ fontSize: '0.65rem' }}>
                AICTE Scrutiny Desk
              </span>
            </div>

            <h1 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.25rem' }}>
              Extension of Approval (EoA) 2026-27
            </h1>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.5rem' }}>
              Authorized Portal for Application & Supporting Document Scrutiny
            </p>

            {/* Quick 1-Click Demo Logins */}
            <div style={{ marginBottom: '1.25rem', padding: '0.85rem', background: '#1f2937', borderRadius: '6px', border: '1px solid #374151' }}>
              <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.5rem' }}>
                Quick 1-Click Demo Credentials
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => handleLoginAs('Dr. R. Sharma', 'r.sharma@aicte.gov.in', 'Scrutiny Committee Reviewer')}
                >
                  <UserCheck size={14} color="#60a5fa" />
                  <span>Log in as Reviewer (Dr. R. Sharma)</span>
                </button>
                <button 
                  className="btn btn-secondary btn-sm"
                  style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                  onClick={() => handleLoginAs('Shri V. Iyer', 'v.iyer@aicte.gov.in', 'Senior Regional Officer (Approvals Cell)')}
                >
                  <ShieldCheck size={14} color="#34d399" />
                  <span>Log in as Senior Officer (Shri V. Iyer)</span>
                </button>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleCustomLogin} style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 500 }}>
                  Reviewer ID / Official Email
                </label>
                <input 
                  type="email" 
                  className="form-input" 
                  placeholder="officer.mumbai@aicte.gov.in"
                  value={loginEmail}
                  onChange={(e) => setLoginEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 500 }}>
                  Access Password / Token
                </label>
                <input 
                  type="password" 
                  className="form-input" 
                  placeholder="••••••••••••"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  required
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 500 }}>
                  Designated Role
                </label>
                <select 
                  className="form-input"
                  value={loginRole}
                  onChange={(e) => setLoginRole(e.target.value)}
                >
                  <option value="Scrutiny Committee Reviewer">Scrutiny Committee Reviewer (Default)</option>
                  <option value="Senior Regional Officer (Approvals Cell)">Senior Regional Officer (Approvals Cell)</option>
                </select>
              </div>

              <button type="submit" className="btn btn-primary" style={{ marginTop: '0.5rem' }}>
                Enter Scrutiny Workspace
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  // ---------------------------------------------------------------------------
  // 2. AUTHENTICATED WORKSPACE
  // ---------------------------------------------------------------------------
  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', background: 'var(--bg-main)' }}>
      {/* 1. Mandatory Top Banner across all pages */}
      <div className="top-synthetic-banner">
        <AlertTriangle size={14} />
        <span>SYNTHETIC DEMO DATA. NOT A REAL INSTITUTION. All verification is simulated. Demonstration rules are not official AICTE requirements.</span>
      </div>

      {/* 2. Top Header Bar */}
      <header style={{
        background: '#111827',
        borderBottom: '1px solid #374151',
        padding: '0.75rem 1.5rem',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
        gap: '1rem'
      }}>
        {/* Brand & User identity */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem' }}>
          <div style={{ background: '#2563eb', padding: '0.4rem', borderRadius: '6px' }}>
            <Layers size={18} color="#ffffff" />
          </div>
          <div>
            <div style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff' }}>
              ClaimGraph-AICTE
            </div>
            <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              EoA Scrutiny Cycle 2026-27 • SIH 2026 PS5
            </div>
          </div>
        </div>

        {/* Center Case Switcher (1-Click Selector Bar) */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#1f2937', padding: '0.25rem', borderRadius: '6px', border: '1px solid #374151' }}>
          <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)', padding: '0 0.5rem', fontWeight: 600 }}>
            CASES:
          </span>
          <button 
            className={`btn btn-sm ${activeCaseKey === 'case_a' ? 'btn-active-tab' : 'btn-secondary'}`}
            onClick={() => { setActiveCaseKey('case_a'); setSelectedFindingId(null); }}
          >
            Case A: Consistent (Apex)
          </button>
          <button 
            className={`btn btn-sm ${activeCaseKey === 'case_b' ? 'btn-active-tab' : 'btn-secondary'}`}
            onClick={() => { setActiveCaseKey('case_b'); setSelectedFindingId('FND-BV-001'); }}
          >
            Case B: Incomplete (Blue Valley)
          </button>
          <button 
            className={`btn btn-sm ${activeCaseKey === 'case_c' ? 'btn-active-tab' : 'btn-secondary'}`}
            onClick={() => { setActiveCaseKey('case_c'); setSelectedFindingId('FND-CR-001'); }}
          >
            Case C: Inconsistent (Crestview)
          </button>
        </div>

        {/* Right User Controls */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              {currentUser.name}
            </div>
            <span className="status-pill status-blue" style={{ fontSize: '0.62rem' }}>
              {currentUser.role}
            </span>
          </div>
          <button 
            className="btn btn-secondary btn-sm"
            onClick={handleLogout}
            title="Log out of session"
          >
            <LogOut size={13} />
            <span>Log Out</span>
          </button>
        </div>
      </header>

      {/* 3. Three-Tab Navigation Bar */}
      <div style={{
        background: '#0f172a',
        borderBottom: '1px solid #374151',
        padding: '0 1.5rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <button 
          onClick={() => setActiveTab('scrutiny')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'scrutiny' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'scrutiny' ? '#ffffff' : '#9ca3af',
            padding: '0.8rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <FileText size={15} />
          <span>Tab 1: Scrutiny & Evidence Workspace</span>
        </button>

        <button 
          onClick={() => { setActiveTab('simulator'); if (!simResult) handleRunSimulation(); }}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'simulator' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'simulator' ? '#ffffff' : '#9ca3af',
            padding: '0.8rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Sliders size={15} />
          <span>Tab 2: Change-Impact Simulator</span>
        </button>

        <button 
          onClick={() => setActiveTab('audit')}
          style={{
            background: 'none',
            border: 'none',
            borderBottom: activeTab === 'audit' ? '2px solid #3b82f6' : '2px solid transparent',
            color: activeTab === 'audit' ? '#ffffff' : '#9ca3af',
            padding: '0.8rem 1rem',
            fontSize: '0.85rem',
            fontWeight: 600,
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem'
          }}
        >
          <Clock size={15} />
          <span>Tab 3: Audit Trail & Mock Verification</span>
        </button>
      </div>

      {/* Main Workspace Body */}
      <main style={{ flex: 1, padding: '1.25rem 1.5rem', maxWidth: '1600px', width: '100%', margin: '0 auto' }}>
        
        {/* =================================================================== */}
        {/* TAB 1: SCRUTINY & EVIDENCE WORKSPACE (3-Column Layout) */}
        {/* =================================================================== */}
        {activeTab === 'scrutiny' && (
          <div>
            {/* Institution Banner Summary */}
            <div className="admin-card" style={{ marginBottom: '1rem', padding: '0.85rem 1.25rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.75rem' }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff' }}>
                    {currentCase.name}
                  </span>
                  <span className={`status-pill ${findings.length === 0 ? 'status-emerald' : 'status-rose'}`}>
                    {currentCase.status}
                  </span>
                </div>
                <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                  Code: <span className="font-mono">{currentCase.code}</span> • Region: {currentCase.region} • Category: {currentCase.category}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.25rem', fontSize: '0.8rem' }}>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Proposed Intake</div>
                  <div style={{ fontWeight: 700, color: currentCase.claims.proposed_intake ? '#ffffff' : '#fb7185' }}>
                    {currentCase.claims.proposed_intake || 'Blank'} seats
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Faculty Appointed</div>
                  <div style={{ fontWeight: 700, color: currentCase.claims.faculty_count ? '#ffffff' : '#fb7185' }}>
                    {currentCase.claims.faculty_count !== null ? currentCase.claims.faculty_count : 'Not Provided'}
                  </div>
                </div>
                <div>
                  <div style={{ color: 'var(--text-muted)', fontSize: '0.7rem', textTransform: 'uppercase' }}>Cadre Ratio</div>
                  <div style={{ fontWeight: 700, color: currentCase.claims.student_faculty_ratio.includes('Deficit') ? '#fb7185' : '#34d399' }}>
                    {currentCase.claims.student_faculty_ratio}
                  </div>
                </div>
              </div>
            </div>

            {/* 3-Column Scrutiny Grid */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '320px 1fr 340px',
              gap: '1rem',
              alignItems: 'start'
            }}>
              
              {/* LEFT COLUMN: Checklist & Claims */}
              <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.03em', marginBottom: '0.4rem' }}>
                    Document Checklist (FR-A4)
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>
                    Mandatory Extension of Approval records
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    {currentCase.documents.map(doc => {
                      const isUploaded = doc.status === 'Uploaded';
                      const isMissing = doc.status === 'Missing';
                      const isCollision = doc.status === 'Duplicate Collision';

                      let badgeClass = 'status-emerald';
                      if (isMissing) badgeClass = 'status-rose';
                      else if (isCollision) badgeClass = 'status-rose';
                      else if (doc.status.includes('Expired')) badgeClass = 'status-amber';

                      return (
                        <div 
                          key={doc.id}
                          style={{
                            background: '#1f2937',
                            border: '1px solid #374151',
                            borderRadius: '6px',
                            padding: '0.6rem 0.75rem'
                          }}
                        >
                          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.25rem' }}>
                            <div style={{ fontSize: '0.78rem', fontWeight: 600, color: '#ffffff', maxWidth: '200px' }}>
                              {doc.name}
                            </div>
                            <span className={`status-pill ${badgeClass}`} style={{ fontSize: '0.62rem' }}>
                              {doc.status}
                            </span>
                          </div>

                          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontFamily: 'monospace' }}>
                            SHA-256: {doc.sha256 ? `${doc.sha256.substring(0, 12)}...` : 'N/A'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Findings Selector List */}
                <div style={{ borderTop: '1px solid #374151', paddingTop: '0.85rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                    <h3 style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                      Seeded Findings
                    </h3>
                    <span className={`status-pill ${findings.length === 0 ? 'status-emerald' : 'status-rose'}`}>
                      {findings.length} Found
                    </span>
                  </div>

                  {findings.length === 0 ? (
                    <div style={{ padding: '1rem', background: '#064e3b26', border: '1px solid #065f46', borderRadius: '6px', textAlign: 'center', color: '#34d399', fontSize: '0.75rem' }}>
                      ✓ Zero discrepancies on configured rules. Case A is consistent.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                      {findings.map(f => (
                        <button
                          key={f.id}
                          onClick={() => setSelectedFindingId(f.id)}
                          style={{
                            background: selectedFindingId === f.id ? '#1e3a8a' : '#1f2937',
                            border: `1px solid ${selectedFindingId === f.id ? '#3b82f6' : '#374151'}`,
                            borderRadius: '6px',
                            padding: '0.5rem 0.65rem',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center'
                          }}
                        >
                          <div>
                            <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#ffffff' }}>
                              {f.field_or_claim}
                            </div>
                            <div style={{ fontSize: '0.68rem', color: '#9ca3af' }}>
                              {f.type}
                            </div>
                          </div>
                          <span className="status-pill status-rose" style={{ fontSize: '0.6rem' }}>
                            {f.severity}
                          </span>
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {/* CENTER COLUMN: Explainable Finding Detail & Document Preview */}
              <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                      Explainable Finding Detail (FR-C4 & FR-C5)
                    </h2>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                      Side-by-side reconciliation against documentary evidence
                    </div>
                  </div>
                  {selectedFinding && (
                    <span className="status-pill status-rose">
                      {selectedFinding.severity} Severity
                    </span>
                  )}
                </div>

                {!selectedFinding ? (
                  <div style={{ textAlign: 'center', padding: '3.5rem 1rem', background: '#1f2937', borderRadius: '6px' }}>
                    <CheckCircle size={36} color="#34d399" style={{ margin: '0 auto 0.5rem auto' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>
                      All Claims Reconciled Successfully
                    </div>
                    <p style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', maxWidth: '420px', margin: '0.35rem auto 0 auto' }}>
                      Case A (Apex Institute) exhibits zero seeded inconsistencies. The 360 proposed intake matches the Affiliation Resolution PDF, faculty cadre ratio (1:15) is fully satisfied, and Fire NOC validity extends into 2027.
                    </p>
                  </div>
                ) : (
                  <>
                    {/* Side-by-Side Comparison Box */}
                    <div style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr 1fr',
                      gap: '0.85rem',
                      background: '#1f2937',
                      border: '1px solid #374151',
                      borderRadius: '6px',
                      padding: '1rem'
                    }}>
                      <div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Stated Application Claim
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fb7185', marginTop: '0.2rem' }}>
                          {selectedFinding.claimed_value}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                          Source: {selectedFinding.source_doc}
                        </div>
                      </div>

                      <div style={{ borderLeft: '1px solid #374151', paddingLeft: '0.85rem' }}>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>
                          Document Evidence / Benchmark Norm
                        </div>
                        <div style={{ fontSize: '1rem', fontWeight: 700, color: '#38bdf8', marginTop: '0.2rem' }}>
                          {selectedFinding.extracted_value}
                        </div>
                        <div style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
                          Location: {selectedFinding.page_ref}
                        </div>
                      </div>
                    </div>

                    {/* Applied Rule Card */}
                    <div style={{ background: '#182234', border: '1px solid #2563eb40', borderRadius: '6px', padding: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                        <span className="status-pill status-blue" style={{ fontSize: '0.65rem' }}>
                          Rule: {selectedFinding.rule_id}
                        </span>
                        <span style={{ fontSize: '0.68rem', color: '#fbbf24' }}>
                          Demonstration Rule - Illustrative Only
                        </span>
                      </div>
                      <div style={{ fontSize: '0.82rem', fontWeight: 600, color: '#ffffff' }}>
                        {selectedFinding.rule_name}
                      </div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: 1.4 }}>
                        {selectedFinding.explanation}
                      </div>
                    </div>

                    {/* Cited PDF Document Preview Snippet */}
                    <div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600, marginBottom: '0.35rem' }}>
                        Document Preview & OCR Extract ({selectedFinding.source_doc})
                      </div>
                      <div style={{
                        background: '#090d16',
                        border: '1px solid #374151',
                        borderRadius: '6px',
                        padding: '0.85rem',
                        fontFamily: 'monospace',
                        fontSize: '0.75rem',
                        color: '#93c5fd',
                        lineHeight: 1.5,
                        position: 'relative'
                      }}>
                        <div style={{ position: 'absolute', top: '6px', right: '8px', fontSize: '0.65rem', color: 'var(--text-muted)' }}>
                          {selectedFinding.page_ref} • OCR Confirmed
                        </div>
                        <div style={{ background: 'rgba(234, 179, 8, 0.15)', borderLeft: '3px solid #eab308', padding: '0.4rem 0.6rem', color: '#fef08a' }}>
                          "{selectedFinding.snippet}"
                        </div>
                      </div>
                    </div>

                    {/* Recommended Next Step */}
                    <div style={{ background: '#064e3b26', border: '1px solid #065f46', borderRadius: '6px', padding: '0.75rem' }}>
                      <div style={{ fontSize: '0.7rem', color: '#34d399', textTransform: 'uppercase', fontWeight: 700 }}>
                        Recommended Next Step for Reviewer:
                      </div>
                      <div style={{ fontSize: '0.78rem', color: '#e5e7eb', marginTop: '0.2rem' }}>
                        {selectedFinding.recommended_step}
                      </div>
                    </div>
                  </>
                )}
              </div>

              {/* RIGHT COLUMN: Human Reviewer Action Box */}
              <div className="admin-card" style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
                <div>
                  <h2 style={{ fontSize: '0.9rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase', letterSpacing: '0.03em' }}>
                    Reviewer Action Desk
                  </h2>
                  <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                    Module F: Deterministic Human-in-the-Loop Decisions
                  </div>
                </div>

                {/* Regulatory Non-Goal Warning */}
                <div style={{ background: '#7f1d1d20', border: '1px solid #991b1b', borderRadius: '6px', padding: '0.6rem 0.75rem', fontSize: '0.72rem', color: '#fca5a5' }}>
                  <strong>Strict Regulatory Rule (FR-F4):</strong> ClaimGraph-AICTE does not approve or reject applications. Select from authorized scrutiny actions only.
                </div>

                {actionFeedback && (
                  <div style={{ background: '#064e3b33', border: '1px solid #059669', borderRadius: '6px', padding: '0.5rem', fontSize: '0.75rem', color: '#6ee7b7' }}>
                    {actionFeedback}
                  </div>
                )}

                <form onSubmit={handleSaveAction} style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600, color: '#e5e7eb' }}>
                    Select Permitted Regulatory Action:
                  </div>

                  {[
                    "Accepted for review",
                    "Additional evidence required",
                    "Dismissed",
                    "Referred for further verification or inspection"
                  ].map(actionOption => (
                    <label 
                      key={actionOption}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        background: selectedAction === actionOption ? '#1e3a8a' : '#1f2937',
                        border: `1px solid ${selectedAction === actionOption ? '#3b82f6' : '#374151'}`,
                        borderRadius: '6px',
                        padding: '0.5rem 0.65rem',
                        fontSize: '0.75rem',
                        color: '#ffffff',
                        cursor: 'pointer'
                      }}
                    >
                      <input 
                        type="radio" 
                        name="action_option" 
                        value={actionOption}
                        checked={selectedAction === actionOption}
                        onChange={(e) => setSelectedAction(e.target.value)}
                      />
                      <span>{actionOption}</span>
                    </label>
                  ))}

                  {/* Reason Textarea (Mandatory if Dismissed / Referred) */}
                  <div>
                    <label style={{ display: 'block', fontSize: '0.72rem', color: 'var(--text-secondary)', marginBottom: '0.3rem', fontWeight: 500 }}>
                      Administrative Reason Note {['Dismissed', 'Referred for further verification or inspection'].includes(selectedAction) && <span style={{ color: '#fb7185' }}>* (Mandatory)</span>}
                    </label>
                    <textarea 
                      className="form-input"
                      rows={3}
                      placeholder="Enter official deficiency remarks, scrutiny minutes reference, or referral justification..."
                      value={actionReason}
                      onChange={(e) => setActionReason(e.target.value)}
                    />
                  </div>

                  <button 
                    type="submit" 
                    className="btn btn-primary"
                    disabled={!selectedFinding}
                  >
                    Save Action to Audit Log
                  </button>
                </form>
              </div>

            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: CHANGE-IMPACT SIMULATOR STUDIO */}
        {/* =================================================================== */}
        {activeTab === 'simulator' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {/* Header info */}
            <div className="admin-card" style={{ padding: '1rem 1.25rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <span className="status-pill status-blue" style={{ fontSize: '0.65rem' }}>
                      Signature Feature (P0)
                    </span>
                    <span style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                      Module G: Deterministic Delta Evaluation
                    </span>
                  </div>
                  <h2 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginTop: '0.2rem' }}>
                    Change-Impact Simulator
                  </h2>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>
                    Edit a value (e.g., proposed intake 360 ➔ 480). Re-runs only dependent rules and computes before/after findings.
                  </div>
                </div>

                <div style={{ background: '#1f2937', padding: '0.5rem 0.85rem', borderRadius: '6px', border: '1px solid #374151', fontSize: '0.75rem', color: '#fbbf24' }}>
                  <strong>Notice (FR-G5 & FR-G6):</strong> Simulation of a proposed change. Not an AICTE decision. Stored application records are not modified.
                </div>
              </div>
            </div>

            {/* Interactive Inputs Card */}
            <div className="admin-card" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr)) auto', gap: '1.25rem', alignItems: 'flex-end' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Proposed Intake Seats (Student Quota)
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="range" 
                    min={180} 
                    max={600} 
                    step={60} 
                    value={simIntake}
                    onChange={(e) => setSimIntake(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ width: '90px', textAlign: 'center', fontWeight: 700 }}
                    value={simIntake}
                    onChange={(e) => setSimIntake(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.35rem', fontWeight: 600 }}>
                  Appointed Teaching Faculty Count
                </label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <input 
                    type="range" 
                    min={12} 
                    max={40} 
                    step={2} 
                    value={simFaculty}
                    onChange={(e) => setSimFaculty(Number(e.target.value))}
                    style={{ flex: 1 }}
                  />
                  <input 
                    type="number" 
                    className="form-input" 
                    style={{ width: '90px', textAlign: 'center', fontWeight: 700 }}
                    value={simFaculty}
                    onChange={(e) => setSimFaculty(Number(e.target.value))}
                  />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  className="btn btn-secondary"
                  onClick={() => { setSimIntake(360); setSimFaculty(24); }}
                  title="Reset to 360 intake & 24 faculty (Compliant baseline)"
                >
                  Reset Baseline (360 / 24)
                </button>
                <button 
                  className="btn btn-primary"
                  onClick={handleRunSimulation}
                >
                  Run Simulation
                </button>
              </div>
            </div>

            {/* Simulation Comparison Output */}
            {simResult && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1rem' }}>
                {/* 1. Newly Flagged Findings (Crimson) */}
                <div className="admin-card" style={{ borderColor: 'rgba(244, 63, 94, 0.4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#fb7185', textTransform: 'uppercase' }}>
                      Newly Flagged Discrepancies
                    </div>
                    <span className="status-pill status-rose">
                      {simResult.newlyFlagged.length}
                    </span>
                  </div>

                  {simResult.newlyFlagged.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
                      No new discrepancies triggered under this scenario.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {simResult.newlyFlagged.map(item => (
                        <div key={item.id} style={{ background: '#88133726', border: '1px solid #9f1239', borderRadius: '6px', padding: '0.65rem' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#fecdd3' }}>
                            {item.field}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#fca5a5', marginTop: '0.25rem' }}>
                            {item.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 2. Resolved Findings (Emerald) */}
                <div className="admin-card" style={{ borderColor: 'rgba(16, 185, 129, 0.4)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#34d399', textTransform: 'uppercase' }}>
                      Resolved Findings
                    </div>
                    <span className="status-pill status-emerald">
                      {simResult.resolved.length}
                    </span>
                  </div>

                  {simResult.resolved.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
                      No previous discrepancies resolved under this scenario.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {simResult.resolved.map(item => (
                        <div key={item.id} style={{ background: '#064e3b26', border: '1px solid #065f46', borderRadius: '6px', padding: '0.65rem' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#a7f3d0' }}>
                            {item.field}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#6ee7b7', marginTop: '0.25rem' }}>
                            {item.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>

                {/* 3. Unchanged Findings (Slate) */}
                <div className="admin-card">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', borderBottom: '1px solid #374151', paddingBottom: '0.5rem' }}>
                    <div style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase' }}>
                      Unchanged Findings
                    </div>
                    <span className="status-pill status-slate">
                      {simResult.unchanged.length}
                    </span>
                  </div>

                  {simResult.unchanged.length === 0 ? (
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', padding: '1rem 0' }}>
                      Zero static findings.
                    </div>
                  ) : (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                      {simResult.unchanged.map(item => (
                        <div key={item.id} style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '0.65rem' }}>
                          <div style={{ fontSize: '0.78rem', fontWeight: 700, color: '#ffffff' }}>
                            {item.field}
                          </div>
                          <div style={{ fontSize: '0.72rem', color: '#9ca3af', marginTop: '0.25rem' }}>
                            {item.reason}
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: AUDIT TRAIL & MOCK VERIFICATION PANEL */}
        {/* =================================================================== */}
        {activeTab === 'audit' && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {/* Mock Issuer Status Cards (FR-D3 & FR-D5) */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                    Mock Issuer Adapter Status (Module D)
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Simulated external registry checks (State Land Registry, Municipal Fire Directorate, AICTE Sanction DB)
                  </div>
                </div>
                <span className="status-pill status-amber" style={{ fontSize: '0.65rem' }}>
                  SIMULATED VERIFICATION
                </span>
              </div>

              {/* Mandatory Disclaimer */}
              <div style={{ background: '#78350f26', border: '1px solid #92400e', borderRadius: '6px', padding: '0.65rem 0.85rem', fontSize: '0.75rem', color: '#fde68a', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Info size={16} color="#fbbf24" style={{ flexShrink: 0 }} />
                <span>
                  <strong>SIMULATED VERIFICATION. NOT CONNECTED TO THE ISSUING AUTHORITY.</strong> A missing external response is never treated as evidence of fraud.
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '0.85rem' }}>
                {MOCK_ISSUER_RECORDS.map((item, idx) => {
                  let badge = 'status-emerald';
                  if (item.badge === 'mismatch') badge = 'status-rose';
                  else if (item.badge === 'unverified') badge = 'status-amber';

                  return (
                    <div key={idx} style={{ background: '#1f2937', border: '1px solid #374151', borderRadius: '6px', padding: '0.85rem' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.35rem' }}>
                        <div style={{ fontSize: '0.8rem', fontWeight: 700, color: '#ffffff' }}>
                          {item.type}
                        </div>
                        <span className={`status-pill ${badge}`} style={{ fontSize: '0.6rem' }}>
                          {item.status}
                        </span>
                      </div>
                      <div style={{ fontSize: '0.72rem', color: '#60a5fa', marginBottom: '0.35rem' }}>
                        {item.authority}
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                        {item.details}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Audit Timeline Table (FR-F3) */}
            <div className="admin-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                <div>
                  <h2 style={{ fontSize: '0.95rem', fontWeight: 700, color: '#ffffff', textTransform: 'uppercase' }}>
                    Immutable Scrutiny Audit Ledger (FR-F3)
                  </h2>
                  <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                    Chronological timeline of all authorized reviewer actions and administrative notes
                  </div>
                </div>
                <span className="status-pill status-slate">
                  {auditLog.length} Actions Recorded
                </span>
              </div>

              <div style={{ overflowX: 'auto' }}>
                <table className="admin-table">
                  <thead>
                    <tr>
                      <th>Timestamp</th>
                      <th>Finding ID</th>
                      <th>Action Taken</th>
                      <th>Reviewer / Actor</th>
                      <th>Reason / Scrutiny Justification</th>
                    </tr>
                  </thead>
                  <tbody>
                    {auditLog.map(log => (
                      <tr key={log.id}>
                        <td style={{ fontFamily: 'monospace', color: 'var(--text-muted)' }}>
                          {log.timestamp}
                        </td>
                        <td style={{ fontFamily: 'monospace', color: '#38bdf8', fontWeight: 600 }}>
                          {log.finding_id}
                        </td>
                        <td>
                          <span className="status-pill status-blue" style={{ fontSize: '0.65rem' }}>
                            {log.action}
                          </span>
                        </td>
                        <td style={{ fontWeight: 600, color: '#ffffff' }}>
                          {log.reviewer}
                        </td>
                        <td style={{ color: 'var(--text-secondary)', maxWidth: '420px' }}>
                          "{log.reason}"
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}

      </main>

      {/* Footer */}
      <footer style={{
        background: '#111827',
        borderTop: '1px solid #374151',
        padding: '0.75rem 1.5rem',
        fontSize: '0.72rem',
        color: 'var(--text-muted)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.5rem'
      }}>
        <div>
          ClaimGraph-AICTE • SIH 2026 Problem Statement 5 (PS5) • Evidence-Linked Validation Platform
        </div>
        <div style={{ display: 'flex', gap: '0.85rem' }}>
          <span>Demo Date: {DEMO_DATE}</span>
          <span>•</span>
          <span>Deterministic Audit Ledger: Active</span>
          <span>•</span>
          <span style={{ color: '#fbbf24' }}>Synthetic Prototype</span>
        </div>
      </footer>
    </div>
  );
}
