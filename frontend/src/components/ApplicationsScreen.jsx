import React, { useState } from 'react';
import { FileSpreadsheet, Search, Filter, ArrowRight, CheckCircle, AlertTriangle, Clock, RefreshCw } from 'lucide-react';

export default function ApplicationsScreen({ 
  applications, 
  onSelectApplication, 
  onValidateApplication,
  isValidating 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');

  const filteredApps = (applications || []).filter(app => {
    const matchesSearch = 
      (app.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (app.reference || '').toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || app.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      {/* Title & Controls */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clay-text-dark)', letterSpacing: '-0.02em' }}>
            Institutional Applications
          </h1>
          <p style={{ fontSize: '0.82rem', color: 'var(--clay-secondary)', marginTop: '0.2rem' }}>
            Extension of Approval (EoA) Submissions Register · Assessment Cycle 2026-27
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="clay-card" style={{ padding: '0.85rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '220px', position: 'relative' }}>
            <input
              type="text"
              placeholder="Search by institution name or reference number..."
              className="clay-input"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <span style={{ fontSize: '0.78rem', fontWeight: 600, color: 'var(--clay-secondary)' }}>
              Discipline:
            </span>
            <select
              className="clay-input"
              style={{ width: 'auto', padding: '0.55rem 0.85rem' }}
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
            >
              <option value="ALL">All Disciplines</option>
              <option value="Engineering & Technology">Engineering & Technology</option>
              <option value="Pharmacy">Pharmacy</option>
              <option value="Management">Management</option>
            </select>
          </div>
        </div>
      </div>

      {/* Applications Table */}
      <div className="clay-card" style={{ padding: '0.5rem', overflowX: 'auto' }}>
        <table className="clay-table">
          <thead>
            <tr>
              <th>Reference Number</th>
              <th>Institution Name</th>
              <th>Discipline / Category</th>
              <th>Sanctioned Intake</th>
              <th>Faculty Cadre</th>
              <th>Instructional Area</th>
              <th>Compliance Status</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredApps.length === 0 ? (
              <tr>
                <td colSpan={8} style={{ textAlign: 'center', padding: '2rem', color: 'var(--clay-text-muted)' }}>
                  No matching applications found.
                </td>
              </tr>
            ) : (
              filteredApps.map((app) => {
                const isClean = app.id === 'APP-CASE-A';
                const isIncomplete = app.id === 'APP-CASE-B';
                const isInconsistent = app.id === 'APP-CASE-C';

                return (
                  <tr key={app.id}>
                    <td style={{ fontFamily: 'var(--font-mono)', fontWeight: 600, fontSize: '0.75rem' }}>
                      {app.reference}
                    </td>
                    <td style={{ fontWeight: 700, color: 'var(--clay-text-dark)' }}>
                      {app.name}
                    </td>
                    <td>
                      <span className="clay-badge badge-neutral" style={{ textTransform: 'none' }}>
                        {app.category || 'Engineering'}
                      </span>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {app.proposed_intake ?? '—'} Seats
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {app.faculty_count !== null && app.faculty_count !== undefined ? `${app.faculty_count} Appointed` : (
                        <span style={{ color: '#b91c1c', fontWeight: 700 }}>Blank / Omitted</span>
                      )}
                    </td>
                    <td>
                      {app.carpet_area_sqm ? `${app.carpet_area_sqm} sq.m` : '—'}
                    </td>
                    <td>
                      {isClean && <span className="clay-badge badge-success">Consistent</span>}
                      {isIncomplete && <span className="clay-badge badge-warning">Incomplete</span>}
                      {isInconsistent && <span className="clay-badge badge-danger">Discrepancy</span>}
                      {!isClean && !isIncomplete && !isInconsistent && (
                        <span className="clay-badge badge-info">{app.status || 'Ready for Scrutiny'}</span>
                      )}
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button
                        onClick={() => onSelectApplication(app.id)}
                        className="clay-btn clay-btn-sm clay-btn-primary"
                        style={{ whiteSpace: 'nowrap' }}
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
  );
}
