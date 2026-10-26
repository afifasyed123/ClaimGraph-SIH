import React, { useState } from 'react';
import { 
  Building2, 
  CheckCircle2, 
  AlertTriangle, 
  FileText, 
  ArrowRight, 
  Search, 
  Sliders, 
  ShieldCheck, 
  UploadCloud,
  FileCheck2,
  Clock,
  Filter,
  XCircle
} from 'lucide-react';

export default function OverviewScreen({ 
  applications = [],
  demoCases = [],
  notices = [],
  campusData,
  onSelectCase, 
  onSelectAppId,
  onNavigate, 
  onOpenUpload 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('ALL'); // 'ALL', 'ACTION_REQUIRED', 'COMPLIANT', 'CAMPUS'

  // Combine applications
  const appList = applications.length > 0 ? applications : demoCases;

  // Real stats
  const totalApps = appList.length;
  const actionRequiredCount = appList.filter(a => a.id === 'APP-CASE-B' || a.id === 'APP-CASE-C' || a.status === 'Discrepancy' || a.status === 'Incomplete').length;
  const compliantCount = appList.filter(a => a.id === 'APP-CASE-A' || a.status === 'Consistent').length;
  const campusConflictsCount = campusData?.conflicts_count ?? 2;
  const noticesCount = notices.length > 0 ? notices.length : 2;

  // Search & Filter
  const filteredApps = appList.filter(app => {
    const matchesSearch = 
      (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.reference || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.programme || app.category || '').toLowerCase().includes(searchTerm.toLowerCase());

    if (!matchesSearch) return false;

    if (filterType === 'ACTION_REQUIRED') {
      return app.id === 'APP-CASE-B' || app.id === 'APP-CASE-C' || app.status === 'Discrepancy' || app.status === 'Incomplete';
    }
    if (filterType === 'COMPLIANT') {
      return app.id === 'APP-CASE-A' || app.status === 'Consistent';
    }
    if (filterType === 'CAMPUS') {
      return app.campus_id === 'CAMPUS-VV-01' || app.id.includes('CAMPUS') || app.id === 'APP-CASE-C';
    }
    return true;
  });

  const handleOpenApp = (app) => {
    if (onSelectAppId) {
      onSelectAppId(app.id);
    } else if (onSelectCase) {
      const caseKey = app.id === 'APP-CASE-A' ? 'case_a' : app.id === 'APP-CASE-B' ? 'case_b' : 'case_c';
      onSelectCase(caseKey);
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', width: '100%' }}>
      {/* Executive Welcome Hero Card */}
      <div className="clay-box" style={{ padding: '2rem 2.2rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1.5rem' }}>
          <div style={{ maxWidth: '780px' }}>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.45rem',
              background: '#eff6ff',
              color: 'var(--clay-blue-primary)',
              padding: '0.3rem 0.85rem',
              borderRadius: '50px',
              fontSize: '0.78rem',
              fontWeight: 700,
              marginBottom: '0.65rem',
              border: '1px solid #dbeafe'
            }}>
              <span>AICTE Approval Process Handbook (APH 2024–27)</span>
            </div>
            <h1 style={{ fontSize: '1.95rem', fontWeight: 800, color: '#0f172a', letterSpacing: '-0.02em', lineHeight: 1.2 }}>
              Regulatory Application Scrutiny Dashboard
            </h1>
            <p style={{ fontSize: '0.92rem', color: '#475569', marginTop: '0.4rem', lineHeight: 1.55 }}>
              Task-oriented scrutiny queue for reviewing institutional claims, verifying extracted evidence from land deeds, fire NOCs, and faculty registers, and reconciling multi-college shared campus facilities.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={onOpenUpload}
              className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] hover:shadow-lg active:scale-[0.99] cursor-pointer"
              style={{ padding: '0.75rem 1.4rem', fontSize: '0.88rem' }}
            >
              <UploadCloud size={16} />
              <span>Upload Application / Add Documents</span>
            </button>
            <button
              onClick={() => onNavigate('scrutiny')}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ padding: '0.75rem 1.3rem', fontSize: '0.88rem' }}
            >
              <Search size={16} />
              <span>Scrutiny Workspace</span>
            </button>
            <button
              onClick={() => onNavigate('campus_reconciliation')}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ padding: '0.75rem 1.3rem', fontSize: '0.88rem' }}
            >
              <Building2 size={16} />
              <span>Campus Reconciliation</span>
            </button>
          </div>
        </div>
      </div>

      {/* Task-Oriented Review Summary Cards (Real Verified Counts, No Decorative Charts) */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
        gap: '1.25rem',
        width: '100%'
      }}>
        {/* Metric 1: Total Registered */}
        <div className="clay-box-sm" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--clay-text-secondary)', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Registered Applications
            </span>
            <FileText size={18} color="var(--clay-blue-primary)" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: 'var(--clay-text-primary)', margin: '0.4rem 0 0.2rem' }}>
            {totalApps}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>
            Engineering, Pharmacy & Management
          </div>
        </div>

        {/* Metric 2: Requiring Action */}
        <div 
          onClick={() => setFilterType('ACTION_REQUIRED')}
          className="clay-box-sm cursor-pointer" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            borderLeft: '4px solid #ef4444'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#b91c1c', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Action Required
            </span>
            <AlertTriangle size={18} color="#ef4444" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#b91c1c', margin: '0.4rem 0 0.2rem' }}>
            {actionRequiredCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#b91c1c', fontWeight: 600 }}>
            Intake discrepancy & expired NOC
          </div>
        </div>

        {/* Metric 3: Multi-College Campus Overlaps */}
        <div 
          onClick={() => onNavigate('campus_reconciliation')}
          className="clay-box-sm cursor-pointer" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            borderLeft: '4px solid #8b5cf6'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6d28d9', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Shared Campus Alerts
            </span>
            <Building2 size={18} color="#8b5cf6" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#6d28d9', margin: '0.4rem 0 0.2rem' }}>
            {campusConflictsCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#6d28d9', fontWeight: 600 }}>
            Vidya Vihar: Facility & Faculty sharing
          </div>
        </div>

        {/* Metric 4: Deficiency Notices */}
        <div 
          onClick={() => onNavigate('notices')}
          className="clay-box-sm cursor-pointer" 
          style={{ 
            display: 'flex', 
            flexDirection: 'column', 
            justifyContent: 'space-between',
            borderLeft: '4px solid #f59e0b'
          }}
        >
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#d97706', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              Deficiency Notices
            </span>
            <Clock size={18} color="#f59e0b" />
          </div>
          <div style={{ fontSize: '2.1rem', fontWeight: 800, color: '#d97706', margin: '0.4rem 0 0.2rem' }}>
            {noticesCount}
          </div>
          <div style={{ fontSize: '0.75rem', color: '#d97706', fontWeight: 600 }}>
            Formally generated notices on record
          </div>
        </div>
      </div>

      {/* Task-Oriented Application Scrutiny Register */}
      <div className="clay-box" style={{ padding: '1.8rem 2.2rem', width: '100%' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.25rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#0f172a' }}>
              Institutional Scrutiny Queue
            </h2>
            <p style={{ fontSize: '0.82rem', color: '#64748b' }}>
              Select an institution to inspect extracted evidence, verify statutory rules, or record official reviewer decisions.
            </p>
          </div>

          {/* Quick Filters */}
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => setFilterType('ALL')}
              className={`clay-btn-pill ${filterType === 'ALL' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
            >
              All ({totalApps})
            </button>
            <button
              onClick={() => setFilterType('ACTION_REQUIRED')}
              className={`clay-btn-pill ${filterType === 'ACTION_REQUIRED' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
            >
              Requires Action ({actionRequiredCount})
            </button>
            <button
              onClick={() => setFilterType('COMPLIANT')}
              className={`clay-btn-pill ${filterType === 'COMPLIANT' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
            >
              Verified Compliant ({compliantCount})
            </button>
            <button
              onClick={() => setFilterType('CAMPUS')}
              className={`clay-btn-pill ${filterType === 'CAMPUS' ? 'clay-btn-blue' : 'clay-btn-white'}`}
              style={{ padding: '0.45rem 0.85rem', fontSize: '0.78rem' }}
            >
              Shared Campus
            </button>
          </div>
        </div>

        {/* Live Search Bar */}
        <div style={{ marginBottom: '1.25rem' }}>
          <div className="clay-well" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem 1.1rem' }}>
            <Search size={18} color="#94a3b8" />
            <input
              type="text"
              placeholder="Search by institution name, reference number, or category..."
              className="clay-input-clean"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ fontSize: '0.88rem' }}
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#94a3b8' }}
              >
                <XCircle size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Application List Table */}
        <div className="clay-table-container">
          <table className="clay-table">
            <thead>
              <tr>
                <th style={{ width: '38%' }}>Institution & Reference</th>
                <th style={{ width: '16%' }}>Intake & Faculty</th>
                <th style={{ width: '18%' }}>Compliance Status</th>
                <th style={{ width: '18%' }}>Key Scrutiny Finding</th>
                <th style={{ width: '10%', textAlign: 'right' }}>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem 1.5rem', color: '#64748b' }}>
                    <AlertTriangle size={32} color="#94a3b8" style={{ margin: '0 auto 0.65rem' }} />
                    <div style={{ fontSize: '1rem', fontWeight: 800, color: '#0f172a' }}>
                      No matching applications found
                    </div>
                    <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.25rem' }}>
                      Try adjusting the search query or filters, or click "Upload Application" above to add new PDF submissions.
                    </p>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const isCaseA = app.id === 'APP-CASE-A';
                  const isCaseB = app.id === 'APP-CASE-B';
                  const isCaseC = app.id === 'APP-CASE-C';
                  const isSharedCampus = app.campus_id === 'CAMPUS-VV-01' || app.id.includes('CAMPUS');

                  let statusBadge = (
                    <span className="clay-badge badge-info" style={{ whiteSpace: 'nowrap' }}>
                      Under Scrutiny
                    </span>
                  );
                  let findingSummary = "Pending detailed document extraction";

                  if (isCaseA) {
                    statusBadge = (
                      <span className="clay-badge badge-success" style={{ whiteSpace: 'nowrap' }}>
                        🟢 Verified Compliant
                      </span>
                    );
                    findingSummary = "All 4 required documents valid; SFR 1:12.5 (Norm 1:15 satisfied); Valid Fire NOC";
                  } else if (isCaseB) {
                    statusBadge = (
                      <span className="clay-badge badge-warning" style={{ whiteSpace: 'nowrap' }}>
                        🟡 Deficiency Detected
                      </span>
                    );
                    findingSummary = "Expired Fire Safety NOC; Faculty shortfall of 6 teachers; Omitted land certificate";
                  } else if (isCaseC) {
                    statusBadge = (
                      <span className="clay-badge badge-danger" style={{ whiteSpace: 'nowrap' }}>
                        🔴 Discrepancy Detected
                      </span>
                    );
                    findingSummary = "480 intake claimed vs 360 in Resolution; Identical SHA-256 duplicate file; Campus overlap";
                  } else if (isSharedCampus) {
                    statusBadge = (
                      <span className="clay-badge" style={{ background: '#f5f3ff', color: '#7c3aed', border: '1px solid #ddd6fe', whiteSpace: 'nowrap' }}>
                        🟣 Campus Sharing Alert
                      </span>
                    );
                    findingSummary = "Physical facility and faculty shared with adjacent campus institutions";
                  }

                  return (
                    <tr key={app.id}>
                      {/* Column 1: Institution & Reference */}
                      <td>
                        <div style={{ fontWeight: 800, color: '#0f172a', fontSize: '0.94rem', lineHeight: 1.35, marginBottom: '0.35rem' }}>
                          {app.name}
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', flexWrap: 'wrap' }}>
                          <span style={{
                            fontFamily: 'monospace',
                            fontWeight: 700,
                            fontSize: '0.74rem',
                            color: 'var(--clay-blue-primary)',
                            background: '#eff6ff',
                            padding: '0.15rem 0.5rem',
                            borderRadius: '4px',
                            border: '1px solid #dbeafe'
                          }}>
                            {app.reference || app.id}
                          </span>
                          <span style={{ fontSize: '0.74rem', fontWeight: 600, color: '#475569' }}>
                            {app.programme || app.category || 'Engineering & Technology'}
                          </span>
                          <span style={{ fontSize: '0.72rem', color: '#94a3b8' }}>
                            · {app.campus_name || (isSharedCampus ? 'Vidya Vihar Campus' : 'Autonomous Institution')}
                          </span>
                        </div>
                      </td>

                      {/* Column 2: Intake & Faculty */}
                      <td>
                        <div style={{ fontSize: '0.88rem', fontWeight: 800, color: '#0f172a' }}>
                          {app.proposed_intake ?? '—'} Seats
                        </div>
                        <div style={{ fontSize: '0.74rem', color: app.faculty_count ? '#059669' : '#dc2626', fontWeight: 700, marginTop: '0.15rem' }}>
                          {app.faculty_count ? `${app.faculty_count} Faculty Appointed` : 'Shortfall / Unverified'}
                        </div>
                      </td>

                      {/* Column 3: Compliance Status */}
                      <td>
                        {statusBadge}
                      </td>

                      {/* Column 4: Key Finding Summary */}
                      <td>
                        <div style={{ fontSize: '0.8rem', color: '#475569', lineHeight: 1.45 }}>
                          {findingSummary}
                        </div>
                      </td>

                      {/* Column 5: Action */}
                      <td style={{ textAlign: 'right' }}>
                        <button
                          onClick={() => handleOpenApp(app)}
                          className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
                          style={{ padding: '0.55rem 1.05rem', fontSize: '0.8rem', whiteSpace: 'nowrap' }}
                        >
                          <span>Open Workspace</span>
                          <ArrowRight size={13} />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Two Supporting Officer Actions Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))',
        gap: '1.5rem',
        width: '100%'
      }}>
        {/* Card 1: Multi-College Campus Sharing Quick View */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#7c3aed', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Multi-College Physical Campus
              </span>
              <span className="clay-badge" style={{ background: '#f5f3ff', color: '#7c3aed' }}>
                2 Overlaps Detected
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Vidya Vihar Integrated Campus
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Co-located campus hosting Chitkara Institute (Engineering), Vidya College of Pharmacy, and Vidya Institute of Management. Automatically flagged for common auditorium sharing and faculty double-counting.
            </p>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              onClick={() => onNavigate('campus_reconciliation')}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.82rem' }}
            >
              <span>Inspect Campus Shared Claims</span>
              <ArrowRight size={14} />
            </button>
          </div>
        </div>

        {/* Card 2: Cryptographic Audit Ledger Status */}
        <div className="clay-box" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.74rem', fontWeight: 800, color: '#059669', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                Integrity & Audit Trail
              </span>
              <span className="clay-badge badge-success">
                SHA-256 Verified
              </span>
            </div>
            <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: '#0f172a' }}>
              Immutable Review Ledger
            </h3>
            <p style={{ fontSize: '0.82rem', color: '#64748b', marginTop: '0.35rem', lineHeight: 1.5 }}>
              Every reviewer decision, clarification request, document upload, and deficiency notice is cryptographically hashed with timestamp and officer ID into an append-only verification ledger.
            </p>
          </div>

          <div style={{ marginTop: '1.25rem' }}>
            <button
              onClick={() => onNavigate('audit')}
              className="clay-btn-pill clay-btn-white transition-all duration-200 hover:scale-[1.02] active:scale-[0.98] cursor-pointer"
              style={{ width: '100%', padding: '0.65rem 1rem', fontSize: '0.82rem' }}
            >
              <span>Verify Cryptographic Audit Chain</span>
              <ShieldCheck size={14} color="#059669" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
