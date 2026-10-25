import React, { useRef, useState } from 'react';
import { 
  CheckCircle, 
  AlertCircle, 
  UploadCloud, 
  FileCheck, 
  ExternalLink, 
  Hash, 
  Eye,
  Plus
} from 'lucide-react';

export default function IntakeChecklist({ 
  checklist, 
  onPreviewDoc, 
  onUploadDoc, 
  isUploading 
}) {
  const fileInputRef = useRef(null);
  const [selectedDocType, setSelectedDocType] = useState('aicte_affiliation_resolution');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      onUploadDoc(selectedDocType, file);
      e.target.value = '';
    }
  };

  const uploadedCount = checklist.filter(c => c.status === 'Uploaded').length;
  const totalCount = checklist.length;

  return (
    <div className="glass-card col-4" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <h2 style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Compliance Checklist
          </h2>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            Mandatory Documents (FR-A4)
          </div>
        </div>
        <span className={`badge ${uploadedCount === totalCount ? 'badge-emerald' : 'badge-amber'}`}>
          {uploadedCount} / {totalCount} Uploaded
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        width: '100%',
        height: '6px',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '999px',
        overflow: 'hidden',
        marginBottom: '1.25rem'
      }}>
        <div style={{
          width: `${(uploadedCount / totalCount) * 100}%`,
          height: '100%',
          background: uploadedCount === totalCount 
            ? 'linear-gradient(90deg, #10b981, #34d399)' 
            : 'linear-gradient(90deg, #f59e0b, #fbbf24)',
          borderRadius: '999px',
          transition: 'width 0.3s ease'
        }} />
      </div>

      {/* List of items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', flex: 1, overflowY: 'auto' }}>
        {checklist.map((item) => {
          const isUploaded = item.status === 'Uploaded';
          const doc = item.document;

          return (
            <div 
              key={item.doc_type}
              style={{
                background: isUploaded ? 'rgba(30, 41, 59, 0.4)' : 'rgba(244, 63, 94, 0.06)',
                border: `1px solid ${isUploaded ? 'rgba(255, 255, 255, 0.06)' : 'rgba(244, 63, 94, 0.2)'}`,
                borderRadius: '12px',
                padding: '0.75rem 0.9rem',
                display: 'flex',
                flexDirection: 'column',
                gap: '0.4rem',
                transition: 'all 0.2s ease'
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {isUploaded ? (
                    <CheckCircle size={15} color="#34d399" />
                  ) : (
                    <AlertCircle size={15} color="#fb7185" />
                  )}
                  <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                    {item.name}
                  </span>
                </div>
                <span className={`badge ${isUploaded ? 'badge-emerald' : 'badge-rose'}`} style={{ fontSize: '0.62rem' }}>
                  {item.status}
                </span>
              </div>

              {isUploaded && doc && (
                <div style={{ 
                  display: 'flex', 
                  alignItems: 'center', 
                  justifyContent: 'space-between',
                  paddingTop: '0.35rem',
                  borderTop: '1px solid rgba(255, 255, 255, 0.05)',
                  fontSize: '0.72rem',
                  color: 'var(--text-muted)'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.3rem', fontFamily: 'var(--font-mono)' }} title={`SHA-256: ${doc.sha256}`}>
                    <Hash size={11} color="#60a5fa" />
                    <span>{doc.sha256 ? `${doc.sha256.substring(0, 8)}...` : 'hash'}</span>
                  </div>
                  <button 
                    className="btn btn-outline btn-sm"
                    style={{ padding: '0.2rem 0.5rem', fontSize: '0.7rem' }}
                    onClick={() => onPreviewDoc(doc.id)}
                  >
                    <Eye size={11} /> View Evidence
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Upload Dropdown Trigger */}
      <div style={{ marginTop: '1.25rem', paddingTop: '1rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <select 
            className="input-clean"
            style={{ flex: 1, fontSize: '0.75rem' }}
            value={selectedDocType}
            onChange={(e) => setSelectedDocType(e.target.value)}
          >
            {checklist.map(c => (
              <option key={c.doc_type} value={c.doc_type}>
                {c.name}
              </option>
            ))}
          </select>
          <button 
            className="btn btn-outline btn-sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={isUploading}
          >
            <UploadCloud size={13} />
            <span>{isUploading ? 'Uploading...' : 'Upload PDF'}</span>
          </button>
          <input 
            type="file" 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
            accept="application/pdf"
            onChange={handleFileChange}
          />
        </div>
      </div>
    </div>
  );
}
