import React from 'react';
import { 
  LayoutDashboard, 
  FileSpreadsheet, 
  ScanSearch, 
  Network, 
  Sliders, 
  Flame, 
  FileWarning, 
  ShieldCheck, 
  BookOpenCheck,
  LogOut,
  User,
  Sparkles
} from 'lucide-react';

export default function Sidebar({ activeScreen, onSelectScreen, currentUser, onLogout }) {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: LayoutDashboard },
    { id: 'applications', label: 'Applications', icon: FileSpreadsheet },
    { id: 'scrutiny', label: 'Scrutiny Workspace', icon: ScanSearch },
    { 
      id: 'campus_reconciliation', 
      label: 'Campus Reconciliation', 
      icon: Network, 
      badge: 'Z3 SMT' 
    },
    { id: 'simulator', label: 'Impact Simulator', icon: Sliders },
    { id: 'inspection_priority', label: 'Inspection Priority', icon: Flame },
    { id: 'notices', label: 'Deficiency Notices', icon: FileWarning },
    { id: 'audit', label: 'Audit & Verification', icon: ShieldCheck },
    { id: 'rules', label: 'Rule Registry', icon: BookOpenCheck },
  ];

  return (
    <aside className="sidebar">
      {/* Brand header */}
      <div style={{ padding: '1.25rem 1.25rem 0.75rem', borderBottom: '1px solid #e2e8f0' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <div style={{
            background: 'linear-gradient(135deg, #1e3a8a, #3b82f6)',
            color: '#ffffff',
            padding: '0.45rem',
            borderRadius: '10px',
            boxShadow: 'var(--clay-shadow-sm)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center'
          }}>
            <Network size={20} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.98rem', color: 'var(--clay-text-dark)', letterSpacing: '-0.02em' }}>
              ClaimGraph<span style={{ color: '#2563eb' }}>-AICTE</span>
            </div>
            <div style={{ fontSize: '0.65rem', color: 'var(--clay-text-muted)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>Regulatory Compliance</span>
              <Sparkles size={10} color="#2563eb" />
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Links */}
      <nav style={{ flex: 1, padding: '0.75rem 0' }}>
        <div style={{ padding: '0 1.25rem 0.5rem', fontSize: '0.65rem', fontWeight: 800, color: 'var(--clay-text-light)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
          Workspaces
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeScreen === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onSelectScreen(item.id)}
              className={`nav-item ${isActive ? 'active' : ''}`}
              style={{ width: 'calc(100% - 1.5rem)', textAlign: 'left', border: 'none', background: 'transparent' }}
            >
              <Icon size={17} />
              <span style={{ flex: 1 }}>{item.label}</span>
              {item.badge && (
                <span style={{
                  fontSize: '0.6rem',
                  fontWeight: 700,
                  padding: '0.15rem 0.45rem',
                  borderRadius: '6px',
                  background: isActive ? '#1e3a8a' : '#dbeafe',
                  color: isActive ? '#ffffff' : '#1e40af',
                }}>
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Current User & Role */}
      <div style={{ padding: '1rem', borderTop: '1px solid #e2e8f0', background: '#f8fafc' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '0.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.55rem', overflow: 'hidden' }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '8px',
              background: '#e2e8f0',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--clay-secondary)',
              flexShrink: 0
            }}>
              <User size={16} />
            </div>
            <div style={{ minWidth: 0 }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-dark)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {currentUser?.name || 'Review Officer'}
              </div>
              <div style={{ fontSize: '0.68rem', color: '#2563eb', fontWeight: 600 }}>
                {currentUser?.role || 'Reviewer'}
              </div>
            </div>
          </div>
          <button
            onClick={onLogout}
            title="Sign Out of Demo"
            className="clay-btn clay-btn-sm"
            style={{ padding: '0.35rem 0.5rem', background: '#ffffff', color: 'var(--clay-secondary)' }}
          >
            <LogOut size={14} />
          </button>
        </div>
      </div>
    </aside>
  );
}
