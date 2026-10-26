import React, { useState, useEffect } from 'react';
import SyntheticBanner from './components/SyntheticBanner';
import ClayHeader from './components/ClayHeader';
import Sidebar from './components/Sidebar';
import LoginScreen from './components/LoginScreen';
import OverviewScreen from './components/OverviewScreen';
import ApplicationsScreen from './components/ApplicationsScreen';
import ScrutinyWorkspace from './components/ScrutinyWorkspace';
import CampusReconciliationScreen from './components/CampusReconciliationScreen';
import SimulatorScreen from './components/SimulatorScreen';
import InspectionPriorityScreen from './components/InspectionPriorityScreen';
import DeficiencyNoticesScreen from './components/DeficiencyNoticesScreen';
import AuditVerificationScreen from './components/AuditVerificationScreen';
import RuleRegistryScreen from './components/RuleRegistryScreen';
import DocumentViewerModal from './components/DocumentViewerModal';
import ReportVerificationModal from './components/ReportVerificationModal';
import UploadModal from './components/UploadModal';

export default function App() {
  // Authentication State
  const [currentUser, setCurrentUser] = useState(null);

  // Navigation State: 'overview', 'applications', 'scrutiny', 'campus_reconciliation', 'simulator', 'inspection_priority', 'notices', 'audit', 'rules'
  const [activeScreen, setActiveScreen] = useState('overview');

  // Active Application Selection
  const [activeCaseKey, setActiveCaseKey] = useState('case_c');
  const [activeAppId, setActiveAppId] = useState('APP-CASE-C');

  // Data States
  const [applications, setApplications] = useState([]);
  const [applicationData, setApplicationData] = useState(null);
  const [findings, setFindings] = useState([]);
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [campusData, setCampusData] = useState(null);
  const [priorityData, setPriorityData] = useState(null);
  const [notices, setNotices] = useState([]);
  const [auditChain, setAuditChain] = useState([]);
  const [rules, setRules] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [metrics, setMetrics] = useState(null);

  // Status & Loaders
  const [isValidating, setIsValidating] = useState(false);
  const [isReconciling, setIsReconciling] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isVerifyingAudit, setIsVerifyingAudit] = useState(false);

  // Modals
  const [previewDocData, setPreviewDocData] = useState(null);
  const [verifyingReportId, setVerifyingReportId] = useState(null);
  const [isUploadOpen, setIsUploadOpen] = useState(false);

  // Initial Load & Refresh
  useEffect(() => {
    loadInitialData();
  }, []);

  // When activeAppId changes, load application details
  useEffect(() => {
    if (activeAppId) {
      loadApplicationDetails(activeAppId);
    }
  }, [activeAppId]);

  const loadInitialData = async () => {
    try {
      // 1. Fetch system metrics
      fetch('/api/stats/metrics').then(r => r.json()).then(setMetrics).catch(() => {});

      // 2. Fetch campuses & reconcile
      loadCampusReconciliation();

      // 3. Fetch inspection priorities
      fetch('/api/inspection-priority').then(r => r.json()).then(setPriorityData).catch(() => {});

      // 4. Fetch deficiency notices
      fetch('/api/notices').then(r => r.json()).then(setNotices).catch(() => {});

      // 5. Fetch audit chain
      fetch('/api/audit/chain').then(r => r.json()).then(setAuditChain).catch(() => {});

      // 6. Fetch rule registry
      fetch('/api/rules').then(r => r.json()).then(d => setRules(d.rules || [])).catch(() => {});

      // 7. Load baseline applications list
      loadApplicationsList();
    } catch (err) {
      console.error("Initial load error:", err);
    }
  };

  const loadApplicationsList = async () => {
    try {
      // Seed if necessary by hitting /api/cases
      const casesRes = await fetch('/api/cases');
      const casesList = await casesRes.json();
      
      // Load apps for cases
      const apps = [];
      for (const c of casesList) {
        try {
          const r = await fetch(`/api/applications/${c.id}`);
          if (r.ok) {
            const data = await r.json();
            apps.push(data.application);
          }
        } catch (_) {}
      }

      // Add Pharmacy and Management if present
      for (const extraId of ['APP-CAMPUS-PHARM', 'APP-CAMPUS-MGMT']) {
        try {
          const r = await fetch(`/api/applications/${extraId}`);
          if (r.ok) {
            const data = await r.json();
            apps.push(data.application);
          }
        } catch (_) {}
      }

      setApplications(apps);
    } catch (err) {
      console.error(err);
    }
  };

  const loadApplicationDetails = async (appId) => {
    try {
      const res = await fetch(`/api/applications/${appId}`);
      if (!res.ok) return;
      const data = await res.json();
      setApplicationData(data);

      // Fetch findings
      const fRes = await fetch(`/api/applications/${appId}/findings`);
      if (fRes.ok) {
        const fList = await fRes.json();
        setFindings(fList);
        setSelectedFinding(fList.length > 0 ? fList[0] : null);
      }

      // Fetch verification panel data
      const vRes = await fetch(`/api/applications/${appId}/verification`);
      if (vRes.ok) {
        const vData = await vRes.json();
        setVerificationData(vData);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const loadCampusReconciliation = async () => {
    setIsReconciling(true);
    try {
      const res = await fetch('/api/campuses/CAMPUS-VV-01/reconcile');
      if (res.ok) {
        const data = await res.json();
        setCampusData(data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsReconciling(false);
    }
  };

  // Actions
  const handleSelectCase = async (caseKey) => {
    setActiveCaseKey(caseKey);
    const caseMap = {
      'case_a': 'APP-CASE-A',
      'case_b': 'APP-CASE-B',
      'case_c': 'APP-CASE-C'
    };
    const targetId = caseMap[caseKey] || caseKey;
    setActiveAppId(targetId);
  };

  const handleRunValidation = async () => {
    if (!activeAppId) return;
    setIsValidating(true);
    try {
      const res = await fetch(`/api/applications/${activeAppId}/validate`, { method: 'POST' });
      if (res.ok) {
        const result = await res.json();
        setFindings(result.findings || []);
        setSelectedFinding(result.findings?.length > 0 ? result.findings[0] : null);
        loadApplicationDetails(activeAppId);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRecordAction = async (findingId, action, reason) => {
    const res = await fetch(`/api/findings/${findingId}/actions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        action: action,
        reason: reason,
        actor: currentUser?.name || 'Scrutiny Officer'
      })
    });

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to record reviewer action.');
    }

    const data = await res.json();
    
    // Refresh findings & audit chain
    loadApplicationDetails(activeAppId);
    fetch('/api/audit/chain').then(r => r.json()).then(setAuditChain).catch(() => {});
    
    return data;
  };

  const handleRunCampusSimulation = async (payload) => {
    setIsSimulating(true);
    try {
      const res = await fetch('/api/campuses/CAMPUS-VV-01/simulate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
      }
      return await res.json();
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRunAppSimulation = async (field, newVal) => {
    setIsSimulating(true);
    try {
      const res = await fetch(`/api/applications/${activeAppId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ changed_field: field, new_value: newVal })
      });
      if (!res.ok) {
        const err = await res.json();
        throw new Error(err.detail);
      }
      return await res.json();
    } finally {
      setIsSimulating(false);
    }
  };

  const handleGenerateNotice = async (payload) => {
    const res = await fetch('/api/notices/generate', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        application_id: payload.application_id,
        reviewer_name: currentUser?.name || 'AICTE Scrutiny Officer',
        clarifications_note: payload.clarifications_note
      })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail);
    }
    const notice = await res.json();
    // Refresh notices list
    fetch('/api/notices').then(r => r.json()).then(setNotices).catch(() => {});
    return notice;
  };

  const handleVerifyAuditChain = async () => {
    setIsVerifyingAudit(true);
    try {
      const res = await fetch('/api/audit/verify', { method: 'POST' });
      return await res.json();
    } finally {
      setIsVerifyingAudit(false);
    }
  };

  const handleToggleRule = async (ruleId, isActive) => {
    await fetch(`/api/rules/${ruleId}/toggle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_active: isActive })
    });
  };

  const handleOpenDocViewer = async (docIdOrName) => {
    // Look up doc in current application
    const docs = applicationData?.documents || [];
    const targetDoc = docs.find(d => d.id === docIdOrName || d.filename === docIdOrName || d.doc_type === docIdOrName);
    const targetDocId = targetDoc ? targetDoc.id : docIdOrName;

    try {
      const res = await fetch(`/api/documents/${targetDocId}/preview`);
      if (res.ok) {
        const data = await res.json();
        setPreviewDocData(data);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleUploadSuccess = (result) => {
    const targetId = result.application_id || activeAppId;
    setActiveAppId(targetId);
    loadApplicationsList();
    loadApplicationDetails(targetId);
    fetch('/api/audit/chain').then(r => r.json()).then(setAuditChain).catch(() => {});
    setActiveScreen('scrutiny');
  };

  const handleDeleteDocument = async (docId) => {
    const res = await fetch(`/api/documents/${docId}`, { method: 'DELETE' });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Failed to remove document.');
    }
    loadApplicationDetails(activeAppId);
    fetch('/api/audit/chain').then(r => r.json()).then(setAuditChain).catch(() => {});
  };

  // If user is not logged in, show polished Demo Login Screen
  if (!currentUser) {
    return (
      <div style={{ minHeight: '100vh', background: 'var(--clay-canvas)' }}>
        <SyntheticBanner />
        <LoginScreen onLogin={(user, options) => {
          setCurrentUser(user);
          if (options?.targetCase) {
            handleSelectCase(options.targetCase);
            setActiveScreen('scrutiny');
          } else if (options?.targetScreen) {
            setActiveScreen(options.targetScreen);
          }
        }} />
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', background: 'var(--clay-canvas)', display: 'flex', flexDirection: 'column' }}>
      {/* Permanent Synthetic Data Banner */}
      <SyntheticBanner />

      {/* Main Application Navigation Header */}
      <ClayHeader
        activeScreen={activeScreen}
        onSelectScreen={(s) => setActiveScreen(s)}
        currentUser={currentUser}
        onLogout={() => setCurrentUser(null)}
        unreadCount={findings?.length || 2}
        onOpenUpload={() => setIsUploadOpen(true)}
      />

      <main className="clay-main">
        {activeScreen === 'overview' && (
          <OverviewScreen
            metrics={metrics}
            applications={applications}
            demoCases={applications}
            notices={notices}
            onSelectCase={(caseKey) => {
              handleSelectCase(caseKey);
              setActiveScreen('scrutiny');
            }}
            onSelectAppId={(appId) => {
              setActiveAppId(appId);
              setActiveScreen('scrutiny');
            }}
            onNavigate={(s) => setActiveScreen(s)}
            campusData={campusData}
            auditTimeline={auditChain}
            onOpenUpload={() => setIsUploadOpen(true)}
          />
        )}

        {activeScreen === 'applications' && (
          <ApplicationsScreen
            applications={applications}
            onSelectApplication={(id) => {
              setActiveAppId(id);
              setActiveScreen('scrutiny');
            }}
            onValidateApplication={handleRunValidation}
            isValidating={isValidating}
          />
        )}

        {activeScreen === 'scrutiny' && (
          <ScrutinyWorkspace
            application={applicationData?.application}
            checklist={applicationData?.checklist}
            documents={applicationData?.documents || []}
            findings={findings}
            selectedFinding={selectedFinding}
            onSelectFinding={setSelectedFinding}
            onRecordAction={handleRecordAction}
            onOpenDocViewer={handleOpenDocViewer}
            onOpenSimulator={() => setActiveScreen('simulator')}
            onRunValidation={handleRunValidation}
            isValidating={isValidating}
            currentUser={currentUser}
            onSelectCase={handleSelectCase}
            onOpenUpload={() => setIsUploadOpen(true)}
            onDeleteDocument={handleDeleteDocument}
          />
        )}

        {activeScreen === 'campus_reconciliation' && (
          <CampusReconciliationScreen
            campusData={campusData}
            onReconcileCampus={loadCampusReconciliation}
            onNavigateToSimulator={() => setActiveScreen('simulator')}
            onOpenDocViewer={handleOpenDocViewer}
            isReconciling={isReconciling}
          />
        )}

        {activeScreen === 'simulator' && (
          <SimulatorScreen
            campusData={campusData}
            activeApplication={applicationData?.application}
            onRunCampusSimulation={handleRunCampusSimulation}
            onRunAppSimulation={handleRunAppSimulation}
            isSimulating={isSimulating}
          />
        )}

        {activeScreen === 'inspection_priority' && (
          <InspectionPriorityScreen
            priorityData={priorityData}
            onSelectTarget={(id) => {
              if (id === 'CAMPUS-VV-01') {
                setActiveScreen('campus_reconciliation');
              } else {
                setActiveAppId(id);
                setActiveScreen('scrutiny');
              }
            }}
          />
        )}

        {activeScreen === 'notices' && (
          <DeficiencyNoticesScreen
            notices={notices}
            applications={applications}
            onGenerateNotice={handleGenerateNotice}
            activeApplication={applicationData?.application}
            onVerifyReport={(repId) => setVerifyingReportId(repId)}
          />
        )}

        {activeScreen === 'audit' && (
          <AuditVerificationScreen
            auditChain={auditChain}
            onVerifyAuditChain={handleVerifyAuditChain}
            verificationData={verificationData}
            isVerifying={isVerifyingAudit}
          />
        )}

        {activeScreen === 'rules' && (
          <RuleRegistryScreen
            rules={rules}
            onToggleRule={handleToggleRule}
          />
        )}
      </main>

      {/* Global Modals */}
      {previewDocData && (
        <DocumentViewerModal
          previewData={previewDocData}
          onClose={() => setPreviewDocData(null)}
        />
      )}

      {verifyingReportId && (
        <ReportVerificationModal
          reportId={verifyingReportId}
          onClose={() => setVerifyingReportId(null)}
        />
      )}

      <UploadModal
        isOpen={isUploadOpen}
        onClose={() => setIsUploadOpen(false)}
        currentAppId={activeAppId}
        applications={applications}
        onUploadSuccess={handleUploadSuccess}
      />
    </div>
  );
}
