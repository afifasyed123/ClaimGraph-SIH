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
    { id: 'scrutiny', label: 'Scrutiny', icon: Search },
    { id: 'campus_reconciliation', label: 'Campus', icon: Building2 },
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
            gap: '0.55rem', 
            cursor: 'pointer',
            padding: '0.15rem 0.35rem',
            flexShrink: 0
          }}
        >
          <div style={{
            width: '34px',
            height: '34px',
            borderRadius: '12px',
            background: 'var(--clay-blue-gradient)',
            color: '#ffffff',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 4px 12px rgba(37, 99, 235, 0.35)',
            flexShrink: 0
          }}>
            <Sparkles size={16} />
          </div>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#0F172A', letterSpacing: '-0.02em', lineHeight: 1.1 }}>
              ClaimGraph<span style={{ color: 'var(--clay-blue-primary)' }}>·AICTE</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', marginTop: '0.1rem' }}>
              <div className="live-ping-container" title="Statutory Scrutiny Engine Active & Monitoring">
                <span className="live-ping-badge"></span>
                <span className="live-ping-dot"></span>
              </div>
              <span style={{ fontSize: '0.65rem', color: '#64748b', fontWeight: 600, whiteSpace: 'nowrap' }}>
                Compliance Engine · Active
              </span>
            </div>
          </div>
        </div>

        {/* Center Navigation Tabs (Pill Buttons) */}
        <nav style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.25rem', 
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
                style={{ padding: '0.45rem 0.75rem', fontSize: '0.8rem', gap: '0.35rem' }}
              >
                <Icon size={15} />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Action Group */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexShrink: 0 }}>
          <button
            onClick={onOpenUpload}
            className="clay-btn-pill clay-btn-blue transition-all duration-200 hover:scale-[1.01] active:scale-[0.99] cursor-pointer"
            style={{ padding: '0.42rem 0.85rem', fontSize: '0.8rem', gap: '0.4rem' }}
          >
            <UploadCloud size={14} />
            <span>Upload</span>
          </button>

          <button 
            title="Notifications / Pending Issues"
            onClick={() => onSelectScreen('scrutiny')}
            className={`clay-icon-btn ${activeScreen === 'scrutiny' ? 'active' : ''}`}
            style={{ position: 'relative', width: '36px', height: '36px' }}
          >
            <Bell size={16} />
            {unreadCount > 0 && (
              <span style={{
                position: 'absolute',
                top: '7px',
                right: '7px',
                width: '7px',
                height: '7px',
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
            gap: '0.45rem',
            padding: '0.25rem 0.65rem 0.25rem 0.35rem',
            borderRadius: '50px',
            background: 'var(--clay-inset-bg)',
            boxShadow: 'var(--clay-shadow-inset-sm)',
            flexShrink: 0
          }}>
            <div style={{
              width: '28px',
              height: '28px',
              borderRadius: '50%',
              background: '#ffffff',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--clay-blue-primary)',
              fontWeight: 800,
              fontSize: '0.78rem',
              boxShadow: '1px 2px 5px rgba(160, 178, 206, 0.35)',
              flexShrink: 0
            }}>
              {currentUser?.name ? currentUser.name[0] : 'P'}
            </div>
            <div style={{
              fontSize: '0.78rem',
              fontWeight: 700,
              color: 'var(--clay-text-primary)',
              whiteSpace: 'nowrap',
              maxWidth: '120px',
              overflow: 'hidden',
              textOverflow: 'ellipsis'
            }}>
              {currentUser?.name || 'Priya Sharma'}
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
                padding: '0.15rem',
                marginLeft: '0.15rem'
              }}
            >
              <LogOut size={14} />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
