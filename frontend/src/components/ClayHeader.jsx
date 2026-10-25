import React from 'react';
import { 
  Home, 
  Search, 
  Building2, 
  Sliders, 
  FileText, 
  ShieldCheck, 
  Bell, 
  LogOut,
  Sparkles,
  UploadCloud
} from 'lucide-react';

export default function ClayHeader({
  activeScreen,
  onSelectScreen,
  currentUser,
  onLogout,
  unreadCount = 2,
  onOpenUpload
}) {
  const tabs = [
    { id: 'overview', label: 'Dashboard', icon: Home },
    { id: 'scrutiny', label: 'College Check', icon: Search },
    { id: 'campus_reconciliation', label: 'Campus Check', icon: Building2 },
    { id: 'simulator', label: 'Simulator', icon: Sliders },
    { id: 'notices', label: 'Notices', icon: FileText },
    { id: 'audit', label: 'Audit Chain', icon: ShieldCheck }
  ];

  return (
    <header className="clay-nav-container">
      <div className="clay-nav-bar" style={{ flexWrap: 'nowrap' }}>
        {/* Brand Pill */}
        <div 
          onClick={() => onSelectScreen('overview')}
          style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '0.65rem', 
            cursor: 'pointer',
            padding: '0.2rem 0.4rem',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '38px',
            height: '38px',
            borderRadius: '14px',
            background: 'var(--clay-blue-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 6px 14px rgba(37, 99, 235, 0.35)'
          }}>
            <Sparkles size={18} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '1rem', color: 'var(--clay-text-primary)', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              ClaimGraph<span style={{ color: 'var(--clay-blue-primary)' }}>·AICTE</span>
            </div>
            <div style={{ fontSize: '0.68rem', color: 'var(--clay-text-muted)', fontWeight: 600 }}>
              Regulatory Compliance Portal
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Pill Buttons) */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.35rem', 
          flexWrap: 'nowrap',
          overflow: 'visible',
          flexShrink: 0
        }}>
          {tabs.map((tab) => {
            const Icon = tab.icon;
            const isActive = activeScreen === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => onSelectScreen(tab.id)}
                className={`clay-nav-tab ${isActive ? 'active' : ''}`}
              >
                <Icon size={16} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', flexShrink: 0 }}>
          <button
            onClick={onOpenUpload}
            className="clay-btn-pill clay-btn-blue"
            style={{ padding: '0.45rem 1rem', fontSize: '0.82rem' }}
          >
            <UploadCloud size={15} />
            <span>Upload</span>
          </button>

          <button 
            title="Notifications / Pending Issues"
            onClick={() => onSelectScreen('scrutiny')}
            className={`clay-icon-btn ${activeScreen === 'scrutiny' ? 'active' : ''}`}
            style={{ position: 'relative' }}
          >
            <Bell size={18} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '9px',
                right: '9px',
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                background: '#ef4444',
                boxShadow: '0 0 6px rgba(239, 68, 68, 0.6)'
              }} />
            )}
          </button>

          {/* User Profile Pill & Logout */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.55rem',
            padding: '0.35rem 0.85rem 0.35rem 0.45rem',
            borderRadius: '50px',
            background: 'var(--clay-inset-bg)',
            boxShadow: 'var(--clay-shadow-inset-sm)'
          }}>
            <div style={{
              width: '32px',
              height: '32px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--clay-blue-primary)',
              fontWeight: 800,
              fontSize: '0.82rem',
              boxShadow: '2px 3px 6px rgba(160, 178, 206, 0.35)'
            }}>
              {currentUser?.name ? currentUser.name[0] : 'O'}
            </div>
            <div style={{ fontSize: '0.82rem', fontWeight: 700, color: 'var(--clay-text-primary)', whiteSpace: 'nowrap' }}>
              {currentUser?.name || 'Dr. Arvind Deshmukh'}
            </div>
            <button
              onClick={onLogout}
              title="Sign Out"
              style={{
                border: 'none',
                background: 'transparent',
                cursor: 'pointer',
                color: '#94a3b8',
                display: 'flex',
                alignItems: 'center',
                padding: '0.2rem',
                marginLeft: '0.2rem'
              }}
            >
              <LogOut size={15} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
