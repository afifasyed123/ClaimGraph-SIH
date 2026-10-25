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
      <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '840px', padding: '2rem' }}>
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.25rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem' }}>
              <span className="badge badge-blue">
                <FileText size={12} /> {doc.doc_type?.replace('_', ' ').toUpperCase()}
              </span>
              <span className="badge badge-emerald">
                {doc.processing_status}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              Evidence Viewer: {doc.filename}
            </h2>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)', marginTop: '0.2rem' }}>
              SHA-256 Digest: {doc.sha256}
            </div>
          </div>
          <button 
            onClick={onClose}
            className="btn btn-outline btn-sm"
            style={{ borderRadius: '50%', width: '32px', height: '32px', padding: 0 }}
          >
            <X size={16} />
          </button>
        </div>

        {/* Extracted Fields Table */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <FileSearch size={14} color="#60a5fa" /> Extracted Regulatory Metadata (FR-B1 & FR-B2)
          </h3>
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            border: '1px solid var(--border-subtle)',
            borderRadius: '12px',
            overflow: 'hidden'
          }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.8rem' }}>
              <thead>
                <tr style={{ background: 'rgba(30, 41, 59, 0.5)', color: 'var(--text-muted)', textAlign: 'left', fontSize: '0.72rem', textTransform: 'uppercase' }}>
                  <th style={{ padding: '0.5rem 0.85rem' }}>Field</th>
                  <th style={{ padding: '0.5rem 0.85rem' }}>Extracted Value</th>
                  <th style={{ padding: '0.5rem 0.85rem' }}>Page</th>
                  <th style={{ padding: '0.5rem 0.85rem' }}>Extraction Status</th>
                </tr>
              </thead>
              <tbody>
                {fields.map(f => (
                  <tr key={f.id} style={{ borderTop: '1px solid var(--border-subtle)' }}>
                    <td style={{ padding: '0.5rem 0.85rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                      {f.field.replace('_', ' ').toUpperCase()}
                    </td>
                    <td style={{ padding: '0.5rem 0.85rem', color: '#38bdf8', fontFamily: 'var(--font-mono)' }}>
                      {f.value || <span style={{ color: 'var(--text-muted)' }}>Not found</span>}
                    </td>
                    <td style={{ padding: '0.5rem 0.85rem', color: 'var(--text-secondary)' }}>
                      Page {f.page || 1}
                    </td>
                    <td style={{ padding: '0.5rem 0.85rem' }}>
                      <span className="badge badge-emerald" style={{ fontSize: '0.62rem' }}>
                        {f.extraction_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Document Pages & Content Preview */}
        <div>
          <h3 style={{ fontSize: '0.8rem', textTransform: 'uppercase', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.5rem' }}>
            Text Extraction Stream Per Page
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '240px', overflowY: 'auto' }}>
            {pages.map(p => (
              <div 
                key={p.page_number}
                style={{
                  background: 'rgba(30, 41, 59, 0.4)',
                  border: '1px solid var(--border-subtle)',
                  borderRadius: '10px',
                  padding: '0.85rem'
                }}
              >
                <div style={{ fontSize: '0.72rem', fontWeight: 700, color: '#fbbf24', marginBottom: '0.35rem' }}>
                  Page {p.page_number} ({p.extraction_status})
                </div>
                <pre style={{
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-mono)',
                  color: 'var(--text-secondary)',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.45
                }}>
                  {p.text || 'Empty page or scanned PDF layer'}
                </pre>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
