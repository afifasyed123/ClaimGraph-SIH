import React, { useState, useRef } from 'react';
import { 
  UploadCloud, 
  FileText, 
  X, 
  CheckCircle2, 
  AlertTriangle, 
  Plus, 
  Trash2, 
  Sparkles,
  Building2,
  Users
} from 'lucide-react';

export default function UploadModal({
  isOpen,
  onClose,
  currentAppId,
  applications = [],
  onUploadSuccess
}) {
  const [mode, setMode] = useState('attach'); // 'attach' to existing case or 'new' application
  const [targetAppId, setTargetAppId] = useState(currentAppId || 'APP-CASE-A');

  // New Application Fields
  const [newInstName, setNewInstName] = useState('');
  const [newRef, setNewRef] = useState('');
  const [newProgramme, setNewProgramme] = useState('Engineering and Technology');
  const [newIntake, setNewIntake] = useState(360);
  const [newFaculty, setNewFaculty] = useState(24);

  // Files & Upload state
  const [selectedFiles, setSelectedFiles] = useState([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [errorMessage, setErrorMessage] = useState(null);
  const [successResult, setSuccessResult] = useState(null);

  const fileInputRef = useRef(null);
  const MAX_SIZE_BYTES = 15 * 1024 * 1024; // 15 MB

  if (!isOpen) return null;

  const handleFileSelect = (filesList) => {
    setErrorMessage(null);
    const validPdfs = [];
    for (const f of Array.from(filesList)) {
      if (!f.name.toLowerCase().endsWith('.pdf')) {
        setErrorMessage(`File '${f.name}' was rejected. Only PDF documents are accepted for AICTE scrutiny.`);
        continue;
      }
      if (f.size > MAX_SIZE_BYTES) {
        setErrorMessage(`File '${f.name}' exceeds the 15 MB limit (${(f.size / (1024 * 1024)).toFixed(1)} MB).`);
        continue;
      }
      validPdfs.push(f);
    }
    setSelectedFiles(prev => [...prev, ...validPdfs]);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileSelect(e.dataTransfer.files);
    }
  };

  const handleLoadSamplePack = async (packKey) => {
    setErrorMessage(null);
    setIsUploading(true);
    setUploadProgress(20);
    try {
      const res = await fetch('/api/sample-packs');
      if (!res.ok) throw new Error('Could not load sample packs metadata');
      const packs = await res.json();
      const pack = packs[packKey];
      if (!pack) throw new Error('Sample pack not found');

      if (packKey === 'case_a') setTargetAppId('APP-CASE-A');
      if (packKey === 'case_b') setTargetAppId('APP-CASE-B');
      if (packKey === 'case_c') setTargetAppId('APP-CASE-C');

      const loadedFiles = [];
      for (const fn of pack.files) {
        const fileUrl = `/static/demo_applications/${pack.folder}/${fn}`;
        const fileResp = await fetch(fileUrl);
        if (fileResp.ok) {
          const blob = await fileResp.blob();
          const fileObj = new File([blob], fn, { type: 'application/pdf' });
          loadedFiles.push(fileObj);
        }
      }
      setSelectedFiles(loadedFiles);
      setSuccessResult({
        message: `Loaded ${loadedFiles.length} synthetic AICTE documents for ${pack.name}. Click "Upload & Verify Documents" below to run live scrutiny!`
      });
    } catch (err) {
      setErrorMessage(`Failed to auto-load sample pack: ${err.message}`);
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const removeFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleUploadSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage(null);
    setSuccessResult(null);

    if (selectedFiles.length === 0) {
      setErrorMessage('Please select or auto-load at least one PDF file to upload.');
      return;
    }

    setIsUploading(true);
    setUploadProgress(25);

    try {
      const formData = new FormData();
      selectedFiles.forEach(file => {
        formData.append('files', file);
      });
      formData.append('actor', 'Priya Sharma');

      let endpoint = '';
      if (mode === 'attach') {
        endpoint = `/api/applications/${targetAppId}/upload-batch`;
      } else {
        if (!newInstName.trim()) {
          setErrorMessage('Please enter an institution name for the new review case.');
          setIsUploading(false);
          return;
        }
        formData.append('name', newInstName.trim());
        formData.append('reference', newRef.trim() || `AICTE/2026/CUSTOM-${Date.now() % 10000}`);
        formData.append('programme', newProgramme);
        formData.append('proposed_intake', newIntake);
        formData.append('faculty_count', newFaculty);
        endpoint = '/api/applications/create-and-upload';
      }

      setUploadProgress(60);
      const res = await fetch(endpoint, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.detail || 'Upload processing failed on server.');
      }

      setUploadProgress(100);
      const data = await res.json();
      setSuccessResult(data);
      setSelectedFiles([]);

      setTimeout(() => {
        if (onUploadSuccess) {
          onUploadSuccess(data);
        }
        onClose();
      }, 1500);

    } catch (err) {
      setErrorMessage(err.message || 'An unexpected error occurred during document upload.');
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content-clay" style={{ maxWidth: '780px', width: '100%', maxHeight: '90vh', overflowY: 'auto' }}>
        {/* Modal Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', background: '#eff6ff', color: 'var(--clay-blue-primary)', padding: '0.25rem 0.75rem', borderRadius: '50px', fontSize: '0.75rem', fontWeight: 800, marginBottom: '0.4rem' }}>
              <Sparkles size={13} />
              <span>AICTE Compliance Document Intake</span>
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
              Upload Application & Supporting Documents
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--clay-text-secondary)', marginTop: '0.2rem' }}>
              Upload statutory PDF files for automated text extraction, SHA-256 duplicate checking, and rule evaluation.
            </p>
          </div>

          <button
            onClick={onClose}
            style={{
              border: 'none',
              background: 'transparent',
              cursor: 'pointer',
              color: '#94a3b8',
              padding: '0.4rem'
            }}
          >
            <X size={20} />
          </button>
        </div>

        {/* AICTE Document Guide Card */}
        <div style={{ background: '#f8fafc', borderRadius: '14px', padding: '0.85rem 1.1rem', border: '1px solid #e2e8f0', marginBottom: '1.1rem' }}>
          <div style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--clay-text-primary)', marginBottom: '0.35rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileText size={15} color="var(--clay-blue-primary)" />
            <span>Official AICTE Handbook Documents Required:</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.4rem', fontSize: '0.76rem', color: 'var(--clay-text-secondary)', lineHeight: 1.4 }}>
            <div>• <strong>Faculty Roster (Annexure 5)</strong>: Cadre ratio (1:2:6) & 1:20 SFR norm.</div>
            <div>• <strong>Fire Safety NOC (Clause 6.47)</strong>: Municipal certificate & expiry validation.</div>
            <div>• <strong>Land Deed (Annexure 3)</strong>: Registered land title deed & instructional area.</div>
            <div>• <strong>Resolution (Annexure 2)</strong>: Council/Trust minutes approving student intake.</div>
          </div>
        </div>

        {/* 1-Click Quick Demo Test Packs */}
        <div style={{ background: '#eff6ff', borderRadius: '14px', padding: '0.85rem 1.1rem', border: '1px solid #bfdbfe', marginBottom: '1.25rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 800, color: 'var(--clay-blue-primary)', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <Sparkles size={15} />
              <span>1-Click Test Packs (Click to Auto-fill Ready Handbook PDFs):</span>
            </span>
            <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Instant Evaluation</span>
          </div>
          <div style={{ display: 'flex', gap: '0.55rem', flexWrap: 'wrap' }}>
            <button
              type="button"
              onClick={() => handleLoadSamplePack('case_a')}
              className="clay-btn-pill clay-btn-white"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', border: '1px solid #10b981' }}
              title="Loads 4 valid documents with 0 discrepancies"
            >
              <CheckCircle2 size={13} color="#10b981" />
              <span>⚡ Auto-fill Case A (Clean)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePack('case_b')}
              className="clay-btn-pill clay-btn-white"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', border: '1px solid #f59e0b' }}
              title="Loads documents triggering expired Fire NOC & faculty shortage findings"
            >
              <AlertTriangle size={13} color="#f59e0b" />
              <span>⚡ Auto-fill Case B (Deficiencies)</span>
            </button>
            <button
              type="button"
              onClick={() => handleLoadSamplePack('case_c')}
              className="clay-btn-pill clay-btn-white"
              style={{ padding: '0.4rem 0.85rem', fontSize: '0.78rem', border: '1px solid #ef4444' }}
              title="Loads documents triggering 480 vs 360 intake conflict & SHA-256 duplicate detection"
            >
              <AlertTriangle size={13} color="#ef4444" />
              <span>⚡ Auto-fill Case C (Conflicts)</span>
            </button>
          </div>
        </div>

        {/* Workflow Mode Selector */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginBottom: '1.25rem' }}>
          <button
            type="button"
            onClick={() => setMode('attach')}
            className={`clay-btn-pill ${mode === 'attach' ? 'clay-btn-blue' : 'clay-btn-white'}`}
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
          >
            <span>Attach to Existing Case</span>
          </button>
          <button
            type="button"
            onClick={() => setMode('new')}
            className={`clay-btn-pill ${mode === 'new' ? 'clay-btn-blue' : 'clay-btn-white'}`}
            style={{ padding: '0.65rem 1rem', fontSize: '0.85rem' }}
          >
            <span>Start a New Review Case</span>
          </button>
        </div>

        <form onSubmit={handleUploadSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {/* Case Selection or New Fields */}
          {mode === 'attach' ? (
            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 700, color: 'var(--clay-text-secondary)', marginBottom: '0.4rem' }}>
                Select Review Application:
              </label>
              <div className="clay-well" style={{ padding: '0.5rem 0.85rem' }}>
                <select
                  value={targetAppId}
                  onChange={(e) => setTargetAppId(e.target.value)}
                  style={{
                    width: '100%',
                    border: 'none',
                    background: 'transparent',
                    fontFamily: 'inherit',
                    fontSize: '0.9rem',
                    color: 'var(--clay-text-primary)',
                    outline: 'none'
                  }}
                >
                  <option value="APP-CASE-A">Apex Institute of Technology & Engineering (APP-CASE-A)</option>
                  <option value="APP-CASE-B">Bharat College of Engineering (APP-CASE-B)</option>
                  <option value="APP-CASE-C">Chitkara Institute of Technology (APP-CASE-C)</option>
                  {applications.filter(a => !['APP-CASE-A', 'APP-CASE-B', 'APP-CASE-C'].includes(a.id)).map(a => (
                    <option key={a.id} value={a.id}>
                      {a.name} ({a.reference || a.id})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
              <div>
                <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', marginBottom: '0.35rem' }}>
                  Institution Name:
                </label>
                <div className="clay-well">
                  <input
                    type="text"
                    value={newInstName}
                    onChange={(e) => setNewInstName(e.target.value)}
                    placeholder="e.g. National Institute of Technology & Science"
                    className="clay-input-clean"
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', marginBottom: '0.35rem' }}>
                    Application Reference No:
                  </label>
                  <div className="clay-well">
                    <input
                      type="text"
                      value={newRef}
                      onChange={(e) => setNewRef(e.target.value)}
                      placeholder="e.g. AICTE/2026/NITS-0412"
                      className="clay-input-clean"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', marginBottom: '0.35rem' }}>
                    Academic Programme:
                  </label>
                  <div className="clay-well" style={{ padding: '0.45rem 0.85rem' }}>
                    <select
                      value={newProgramme}
                      onChange={(e) => setNewProgramme(e.target.value)}
                      style={{ width: '100%', border: 'none', background: 'transparent', outline: 'none', fontSize: '0.88rem' }}
                    >
                      <option value="Engineering and Technology">Engineering and Technology</option>
                      <option value="Management">Management (MBA/BBA)</option>
                      <option value="Computer Applications">Computer Applications (MCA/BCA)</option>
                      <option value="Pharmacy">Pharmacy</option>
                    </select>
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.85rem' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', marginBottom: '0.35rem' }}>
                    Proposed Student Intake:
                  </label>
                  <div className="clay-well">
                    <input
                      type="number"
                      value={newIntake}
                      onChange={(e) => setNewIntake(parseInt(e.target.value) || 0)}
                      className="clay-input-clean"
                    />
                  </div>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '0.78rem', fontWeight: 700, color: 'var(--clay-text-secondary)', marginBottom: '0.35rem' }}>
                    Declared Full-Time Faculty:
                  </label>
                  <div className="clay-well">
                    <input
                      type="number"
                      value={newFaculty}
                      onChange={(e) => setNewFaculty(parseInt(e.target.value) || 0)}
                      className="clay-input-clean"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            style={{
              padding: '2rem 1.5rem',
              borderRadius: '24px',
              border: isDragging ? '2px dashed var(--clay-blue-primary)' : '2px dashed #cbd5e1',
              background: isDragging ? '#eff6ff' : 'var(--clay-inset-bg)',
              boxShadow: 'var(--clay-shadow-inset-sm)',
              textAlign: 'center',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
          >
            <input
              ref={fileInputRef}
              type="file"
              multiple
              accept=".pdf"
              style={{ display: 'none' }}
              onChange={(e) => handleFileSelect(e.target.files)}
            />
            <div style={{
              width: '52px',
              height: '52px',
              borderRadius: '50%',
              background: '#ffffff',
              boxShadow: 'var(--clay-shadow-small)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--clay-blue-primary)',
              margin: '0 auto 0.85rem'
            }}>
              <UploadCloud size={26} />
            </div>
            <div style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--clay-text-primary)' }}>
              Drag & Drop PDF Documents Here, or Click to Browse
            </div>
            <div style={{ fontSize: '0.75rem', color: 'var(--clay-text-secondary)', marginTop: '0.3rem' }}>
              Accepts application forms, faculty lists, land deeds, and municipal NOCs in PDF format (Max 15 MB per file).
            </div>
          </div>

          {/* Selected Files List */}
          {selectedFiles.length > 0 && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ fontSize: '0.78rem', fontWeight: 800, color: 'var(--clay-text-secondary)', textTransform: 'uppercase' }}>
                Selected Files ({selectedFiles.length})
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', maxHeight: '160px', overflowY: 'auto' }}>
                {selectedFiles.map((file, idx) => (
                  <div
                    key={idx}
                    className="clay-well"
                    style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.55rem 0.85rem', background: '#ffffff' }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', minWidth: 0 }}>
                      <FileText size={16} color="var(--clay-blue-primary)" />
                      <span style={{ fontSize: '0.84rem', fontWeight: 700, color: 'var(--clay-text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {file.name}
                      </span>
                      <span style={{ fontSize: '0.72rem', color: 'var(--clay-text-muted)' }}>
                        ({(file.size / 1024).toFixed(1)} KB)
                      </span>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => { e.stopPropagation(); removeFile(idx); }}
                      style={{ border: 'none', background: 'transparent', cursor: 'pointer', color: '#ef4444', padding: '0.2rem' }}
                    >
                      <Trash2 size={15} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Error Message */}
          {errorMessage && (
            <div style={{ padding: '0.75rem 1rem', borderRadius: '16px', background: '#fef2f2', border: '1px solid #fecaca', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <AlertTriangle size={18} color="#ef4444" style={{ flexShrink: 0 }} />
              <div style={{ fontSize: '0.82rem', color: '#b91c1c', fontWeight: 700 }}>
                {errorMessage}
              </div>
            </div>
          )}

          {/* Success Result */}
          {successResult && (
            <div style={{ padding: '0.85rem 1rem', borderRadius: '16px', background: '#f0fdf4', border: '1px solid #bbf7d0', display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
              <CheckCircle2 size={20} color="#10b981" style={{ flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: '0.85rem', color: '#065f46', fontWeight: 800 }}>
                  {successResult.message}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#047857', marginTop: '0.15rem' }}>
                  Extracted text & fields stored in audit chain block. Refreshing scrutiny workspace...
                </div>
              </div>
            </div>
          )}

          {/* Progress Bar when uploading */}
          {isUploading && (
            <div style={{ width: '100%', height: '8px', background: '#e2e8f0', borderRadius: '50px', overflow: 'hidden' }}>
              <div style={{ width: `${uploadProgress}%`, height: '100%', background: 'var(--clay-blue-gradient)', transition: 'width 0.3s ease' }} />
            </div>
          )}

          {/* Action Buttons */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.75rem', marginTop: '0.5rem' }}>
            <button
              type="button"
              onClick={onClose}
              disabled={isUploading}
              className="clay-btn-pill clay-btn-white"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isUploading || selectedFiles.length === 0}
              className="clay-btn-pill clay-btn-blue"
            >
              <UploadCloud size={16} />
              <span>{isUploading ? 'Extracting & Validating...' : `Upload & Process ${selectedFiles.length > 0 ? `(${selectedFiles.length})` : ''}`}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
