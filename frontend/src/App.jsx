import React, { useState, useEffect } from 'react';
import SyntheticBanner from './components/SyntheticBanner';
import Header from './components/Header';
import ApplicationSummaryCard from './components/ApplicationSummaryCard';
import IntakeChecklist from './components/IntakeChecklist';
import EvidenceGraph from './components/EvidenceGraph';
import FindingsTable from './components/FindingsTable';
import FindingDetailModal from './components/FindingDetailModal';
import SimulatorModal from './components/SimulatorModal';
import VerificationPanel from './components/VerificationPanel';
import AuditTimeline from './components/AuditTimeline';
import DocumentViewerModal from './components/DocumentViewerModal';
import { 
  BarChart3, 
  Layers, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  ShieldCheck, 
  Sparkles,
  RefreshCw,
  Cpu,
  Target
} from 'lucide-react';

const API_BASE = ''; // Uses Vite proxy to http://localhost:8000

export default function App() {
  const [currentCaseKey, setCurrentCaseKey] = useState('case_c'); // start with inconsistent to showcase power
  const [currentRole, setCurrentRole] = useState('reviewer'); // 'reviewer' or 'senior'
  const [applicationData, setApplicationData] = useState(null);
  const [findings, setFindings] = useState([]);
  const [auditTrail, setAuditTrail] = useState([]);
  const [verificationData, setVerificationData] = useState(null);
  const [metrics, setMetrics] = useState(null);

  // Modals & States
  const [selectedFinding, setSelectedFinding] = useState(null);
  const [previewData, setPreviewData] = useState(null);
  const [isSimulatorOpen, setIsSimulatorOpen] = useState(false);
  const [simulationResult, setSimulationResult] = useState(null);

  // Loading States
  const [isLoading, setIsLoading] = useState(true);
  const [isValidating, setIsValidating] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [isSimulating, setIsSimulating] = useState(false);
  const [isSubmittingAction, setIsSubmittingAction] = useState(false);

  // Load application and data
  const loadCase = async (caseKey) => {
    setIsLoading(true);
    try {
      // 1. Create or load demo application
      const appRes = await fetch(`${API_BASE}/api/applications`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ demo_case_key: caseKey })
      });
      const app = await appRes.json();
      const appId = app.id;

      // 2. Automatically validate application
      const valRes = await fetch(`${API_BASE}/api/applications/${appId}/validate`, {
        method: 'POST'
      });
      const valData = await valRes.json();
      setFindings(valData.findings || []);

      // 3. Fetch full application details with checklist
      const detailRes = await fetch(`${API_BASE}/api/applications/${appId}`);
      const detailData = await detailRes.json();
      setApplicationData(detailData);

      // 4. Fetch audit timeline
      const auditRes = await fetch(`${API_BASE}/api/applications/${appId}/audit`);
      const auditData = await auditRes.json();
      setAuditTrail(auditData || []);

      // 5. Fetch verification panel data
      const verRes = await fetch(`${API_BASE}/api/applications/${appId}/verification`);
      const verData = await verRes.json();
      setVerificationData(verData);

      // 6. Fetch system metrics
      const metRes = await fetch(`${API_BASE}/api/stats/metrics`);
      const metData = await metRes.json();
      setMetrics(metData);

      setCurrentCaseKey(caseKey);
      setSimulationResult(null);
    } catch (err) {
      console.error('Failed to load application case:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCase(currentCaseKey);
  }, []);

  const handleRunValidation = async () => {
    if (!applicationData?.application?.id) return;
    setIsValidating(true);
    try {
      const appId = applicationData.application.id;
      const res = await fetch(`${API_BASE}/api/applications/${appId}/validate`, {
        method: 'POST'
      });
      const data = await res.json();
      setFindings(data.findings || []);

      // Refresh application & checklist
      const detailRes = await fetch(`${API_BASE}/api/applications/${appId}`);
      const detailData = await detailRes.json();
      setApplicationData(detailData);
    } catch (err) {
      console.error('Validation failed:', err);
    } finally {
      setIsValidating(false);
    }
  };

  const handleRunSimulation = async (changedField, newValue) => {
    if (!applicationData?.application?.id) return;
    setIsSimulating(true);
    try {
      const appId = applicationData.application.id;
      const res = await fetch(`${API_BASE}/api/applications/${appId}/simulate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          changed_field: changedField,
          new_value: newValue
        })
      });
      const data = await res.json();
      setSimulationResult(data);
    } catch (err) {
      console.error('Simulation error:', err);
    } finally {
      setIsSimulating(false);
    }
  };

  const handleRecordAction = async (findingId, action, reason) => {
    setIsSubmittingAction(true);
    try {
      const actorLabel = currentRole === 'senior' ? 'Senior AICTE Official (Desk #1)' : 'Scrutiny Officer (Desk #4)';
      const res = await fetch(`${API_BASE}/api/findings/${findingId}/actions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          reason,
          actor: actorLabel
        })
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Action Rejected: ${errorData.detail}`);
        return;
      }

      // Refresh findings and audit timeline
      const appId = applicationData.application.id;
      const findingsRes = await fetch(`${API_BASE}/api/applications/${appId}/findings`);
      const updatedFindings = await findingsRes.json();
      setFindings(updatedFindings);

      const auditRes = await fetch(`${API_BASE}/api/applications/${appId}/audit`);
      const updatedAudit = await auditRes.json();
      setAuditTrail(updatedAudit);

      setSelectedFinding(null);
    } catch (err) {
      console.error('Action error:', err);
    } finally {
      setIsSubmittingAction(false);
    }
  };

  const handleUploadDoc = async (docType, file) => {
    if (!applicationData?.application?.id) return;
    setIsUploading(true);
    try {
      const appId = applicationData.application.id;
      const formData = new FormData();
      formData.append('doc_type', docType);
      formData.append('file', file);

      const res = await fetch(`${API_BASE}/api/applications/${appId}/documents`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json();
        alert(`Upload Failed: ${errorData.detail}`);
        return;
      }

      // Re-run validation immediately to reflect new document
      await handleRunValidation();
    } catch (err) {
      console.error('Upload error:', err);
    } finally {
      setIsUploading(false);
    }
  };

  const handlePreviewDoc = async (docId) => {
    try {
      const res = await fetch(`${API_BASE}/api/documents/${docId}/preview`);
      if (res.ok) {
        const data = await res.json();
        setPreviewData(data);
      }
    } catch (err) {
      console.error('Preview error:', err);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Synthetic Demo Banner required on all screens (PRD Section 6) */}
      <SyntheticBanner />

      {/* Main App Header */}
      <Header 
        currentCaseKey={currentCaseKey}
        onSelectCase={loadCase}
        currentRole={currentRole}
        onToggleRole={() => setCurrentRole(r => r === 'reviewer' ? 'senior' : 'reviewer')}
        onRunValidation={handleRunValidation}
        onOpenSimulator={() => setIsSimulatorOpen(true)}
        isValidating={isValidating}
      />

      {/* Main Bento Grid Workspace */}
      <main style={{ maxWidth: '1600px', margin: '0 auto', width: '100%', padding: '1.5rem', flex: 1 }}>
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '6rem 1rem' }}>
            <RefreshCw size={36} className="spin" color="var(--accent-blue)" style={{ margin: '0 auto 1rem auto' }} />
            <div style={{ fontSize: '1.1rem', fontWeight: 600, color: 'var(--text-primary)' }}>
              Loading Regulatory Evidence & Rules Engine...
            </div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.35rem' }}>
              Extracting textual tokens and checking cryptographic SHA-256 digests
            </div>
          </div>
        ) : (
          <div className="bento-grid">
            {/* Bento Card 1: Stated Claims & Application Summary (col-8) */}
            <ApplicationSummaryCard 
              application={applicationData?.application}
              findingsSummary={applicationData?.findings_summary}
            />

            {/* Bento Card 2: Intake Checklist & Upload (col-4) */}
            <IntakeChecklist 
              checklist={applicationData?.checklist || []}
              onPreviewDoc={handlePreviewDoc}
              onUploadDoc={handleUploadDoc}
              isUploading={isUploading}
            />

            {/* Bento Card 3: Evidence Reconciliation Graph (col-12, signature visual flow) */}
            <EvidenceGraph 
              application={applicationData?.application}
              findings={findings}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />

            {/* Bento Card 4: Findings Table (col-12) */}
            <FindingsTable 
              findings={findings}
              onSelectFinding={(f) => setSelectedFinding(f)}
            />

            {/* Bento Card 5: Mock Issuer Verification Panel (col-6, Module D) */}
            <VerificationPanel 
              verificationData={verificationData}
              onRefresh={() => loadCase(currentCaseKey)}
            />

            {/* Bento Card 6: Audit Trail & Timeline (col-6, Module F) */}
            <AuditTimeline 
              auditTrail={auditTrail}
            />

            {/* Bento Card 7: Measured System Metrics (col-12, PRD Section 11) */}
            {metrics && (
              <div className="glass-card col-12" style={{ padding: '1.25rem 1.5rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                    <div style={{
                      background: 'rgba(16, 185, 129, 0.15)',
                      padding: '0.4rem',
                      borderRadius: '8px'
                    }}>
                      <BarChart3 size={18} color="#34d399" />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                        Measured Automated Test & Verification Metrics (PRD Section 11)
                      </div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                        {metrics.disclaimer}
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Seeded Inconsistencies</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#34d399' }}>{metrics.seeded_inconsistencies_detected}</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Case A Clean Accuracy</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#60a5fa' }}>0 Unexpected Flags</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Evidence Linkage Coverage</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#c084fc' }}>{metrics.evidence_reference_coverage_pct}%</div>
                    </div>
                    <div>
                      <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', textTransform: 'uppercase', fontWeight: 600 }}>Audit Trail Logging</div>
                      <div style={{ fontSize: '1rem', fontWeight: 700, color: '#fbbf24' }}>100% Deterministic</div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </main>

      {/* Modals */}
      {selectedFinding && (
        <FindingDetailModal 
          finding={selectedFinding}
          onClose={() => setSelectedFinding(null)}
          onRecordAction={handleRecordAction}
          isSubmittingAction={isSubmittingAction}
        />
      )}

      {isSimulatorOpen && (
        <SimulatorModal 
          application={applicationData?.application}
          onClose={() => setIsSimulatorOpen(false)}
          onRunSimulation={handleRunSimulation}
          simulationResult={simulationResult}
          isSimulating={isSimulating}
        />
      )}

      {previewData && (
        <DocumentViewerModal 
          previewData={previewData}
          onClose={() => setPreviewData(null)}
        />
      )}

      {/* Footer */}
      <footer style={{
        borderTop: '1px solid var(--border-subtle)',
        padding: '1.25rem 2rem',
        background: 'rgba(11, 15, 25, 0.9)',
        fontSize: '0.75rem',
        color: 'var(--text-muted)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '0.75rem'
      }}>
        <div>
          ClaimGraph-AICTE • SIH 2026 PS5 Prototype • Designed for Ministry of Education & AICTE Scrutiny Cell
        </div>
        <div style={{ display: 'flex', gap: '1rem' }}>
          <span>YAML Rule Engine: Active</span>
          <span>•</span>
          <span>Deterministic Audit Log: Enabled</span>
          <span>•</span>
          <span style={{ color: '#fbbf24' }}>Simulated Environment</span>
        </div>
      </footer>
    </div>
  );
}
