import React from 'react';
import { 
  X, 
  FileText, 
  Hash, 
  Layers, 
  ExternalLink, 
  CheckCircle, 
  FileSearch,
  Download
} from 'lucide-react';

export default function DocumentViewerModal({ 
  previewData, 
  onClose 
}) {
  if (!previewData) return null;

  const doc = previewData.document;
  const fields = previewData.extracted_fields || [];
  const pages = previewData.pages || [];

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px', padding: '1.75rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', borderBottom: '1px solid #e2e8f0', paddingBottom: '1rem', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span className="clay-badge badge-info">
                <FileText size={12} /> {doc.doc_type?.replace(/_/g, ' ').toUpperCase()}
              </span>
              <span className="clay-badge badge-success">
                {doc.processing_status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-text-dark)' }}>
              Evidence Preview: {doc.filename}
            </h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--clay-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              SHA-256 Digest: {doc.sha256}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="clay-btn clay-btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Extracted Fields Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--clay-secondary)', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileSearch size={14} color="#2563eb" /> Extracted Regulatory Metadata
          </h3>
          <div className="clay-inset" style={{ padding: 0, overflow: 'hidden' }}>
            <table className="clay-table">
              <thead>
                <tr>
                  <th>Field</th>
                  <th>Extracted Value</th>
                  <th>Page</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {fields.length === 0 ? (
                  <tr>
                    <td colSpan={4} style={{ textAlign: 'center', padding: '1rem', color: 'var(--clay-text-muted)' }}>
                      No metadata fields extracted from this document.
                    </td>
                  </tr>
                ) : (
                  fields.map((f, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{f.field.replace(/_/g, ' ').toUpperCase()}</td>
                      <td style={{ fontWeight: 700, color: '#1e3a8a' }}>{f.value}</td>
                      <td>Page {f.page || 1}</td>
                      <td>
                        <span className="clay-badge badge-success" style={{ fontSize: '0.62rem' }}>
                          Extracted
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Extracted Text Content per Page */}
        <div>
          <h3 style={{ fontSize: '0.75rem', textTransform: 'uppercase', color: 'var(--clay-secondary)', fontWeight: 800, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <Layers size={14} color="#2563eb" /> OCR & Raw Page Text Stream
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '280px', overflowY: 'auto' }}>
            {pages.map((p, idx) => (
              <div key={idx} className="clay-inset" style={{ background: '#f8fafc', padding: '0.85rem' }}>
                <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.35rem' }}>
                  Page {p.page} Text Stream:
                </div>
                <pre style={{
                  fontSize: '0.72rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--clay-text-dark)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.5,
                  margin: 0
                }}>
                  {p.text || 'No text content available on this page.'}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
