import React, { useState } from 'react';
import { 
  X, 
  FileText, 
  Hash, 
  Layers, 
  ExternalLink, 
  CheckCircle, 
  FileSearch,
  Download,
  AlertCircle
} from 'lucide-react';

export default function DocumentViewerModal({ 
  previewData, 
  onClose 
}) {
  if (!previewData) return null;

  const doc = previewData.document || {};
  const fields = previewData.extracted_fields || [];
  const pages = previewData.pages || [];
  const pdfUrl = previewData.pdf_url || previewData.file_url || doc.pdf_url || doc.file_url || '';

  const [activeTab, setActiveTab] = useState('pdf');

  return (
    <div className="modal-overlay" onClick={onClose} style={{ zIndex: 9999 }}>
      <div 
        className="modal-content" 
        onClick={(e) => e.stopPropagation()} 
        style={{ 
          maxWidth: '960px', 
          width: '94vw', 
          maxHeight: '92vh',
          overflowY: 'auto',
          padding: '1.75rem' 
        }}
      >
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'flex-start', 
          borderBottom: '1px solid #e2e8f0', 
          paddingBottom: '1rem', 
          marginBottom: '1.25rem',
          gap: '1rem'
        }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.35rem', flexWrap: 'wrap' }}>
              <span className="clay-badge badge-info">
                <FileText size={12} /> {doc.doc_type?.replace(/_/g, ' ').toUpperCase() || 'DOCUMENT'}
              </span>
              <span className="clay-badge badge-success">
                {doc.processing_status || 'PROCESSED & EXTRACTED'}
              </span>
            </div>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--clay-text-dark)', margin: 0 }}>
              Evidence Preview: {doc.filename || 'Document'}
            </h2>
            <div style={{ fontSize: '0.72rem', color: 'var(--clay-secondary)', fontFamily: 'var(--font-mono)', marginTop: '0.25rem', wordBreak: 'break-all' }}>
              SHA-256 Digest: {doc.sha256 || 'N/A'}
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexShrink: 0 }}>
            {pdfUrl && (
              <a 
                href={pdfUrl}
                download={doc.filename || 'official_document.pdf'}
                target="_blank"
                rel="noopener noreferrer"
                className="clay-btn-pill clay-btn-primary"
                style={{
                  textDecoration: 'none',
                  fontSize: '0.82rem',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.45rem',
                  padding: '0.45rem 0.95rem',
                  fontWeight: 700
                }}
                title="Download Original PDF"
              >
                <Download size={15} />
                <span>📥 Download Original PDF</span>
              </a>
            )}
            <button 
              onClick={onClose}
              className="clay-btn clay-btn-sm"
              style={{ borderRadius: '50%', width: '34px', height: '34px', padding: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}
              title="Close modal"
            >
              <X size={18} />
            </button>
          </div>
        </div>

        {/* Tab Toggle Navigation */}
        <div style={{
          display: 'flex',
          gap: '0.5rem',
          marginBottom: '1.25rem',
          background: '#f1f5f9',
          padding: '4px',
          borderRadius: '12px',
          width: 'fit-content'
        }}>
          <button
            type="button"
            onClick={() => setActiveTab('pdf')}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'pdf' ? 700 : 600,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: activeTab === 'pdf' ? '#ffffff' : 'transparent',
              color: activeTab === 'pdf' ? '#1d4ed8' : '#64748b',
              boxShadow: activeTab === 'pdf' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <FileText size={15} />
            <span>📄 Official PDF Document View</span>
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('metadata')}
            style={{
              padding: '0.5rem 1.1rem',
              borderRadius: '8px',
              border: 'none',
              cursor: 'pointer',
              fontWeight: activeTab === 'metadata' ? 700 : 600,
              fontSize: '0.84rem',
              display: 'flex',
              alignItems: 'center',
              gap: '0.45rem',
              transition: 'all 0.15s ease',
              background: activeTab === 'metadata' ? '#ffffff' : 'transparent',
              color: activeTab === 'metadata' ? '#1d4ed8' : '#64748b',
              boxShadow: activeTab === 'metadata' ? '0 1px 3px rgba(0,0,0,0.1)' : 'none'
            }}
          >
            <FileSearch size={15} />
            <span>🔍 Extracted Metadata & OCR</span>
          </button>
        </div>

        {/* Tab 1: Official PDF Document View */}
        {activeTab === 'pdf' && (
          <div>
            {pdfUrl ? (
              <div>
                <div style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  marginBottom: '0.75rem',
                  padding: '0.55rem 0.9rem',
                  background: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e2e8f0',
                  fontSize: '0.78rem',
                  color: '#475569'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                    <CheckCircle size={15} color="#10b981" />
                    <span style={{ fontWeight: 600 }}>
                      Authentic Document Stream • Formatted Letterhead, Official Signatures, & AICTE Synthetic Watermark
                    </span>
                  </div>
                  <a
                    href={pdfUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      color: '#2563eb',
                      fontWeight: 700,
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.3rem',
                      fontSize: '0.75rem'
                    }}
                  >
                    <span>Open in Fullscreen</span>
                    <ExternalLink size={13} />
                  </a>
                </div>

                <iframe
                  src={pdfUrl}
                  title={`Official PDF Document: ${doc.filename || 'Document View'}`}
                  style={{
                    width: '100%',
                    height: '540px',
                    borderRadius: '12px',
                    border: '1px solid #cbd5e1',
                    background: '#f8fafc',
                    display: 'block'
                  }}
                />
              </div>
            ) : (
              <div className="clay-inset" style={{ padding: '2.5rem', textAlign: 'center', background: '#f8fafc' }}>
                <AlertCircle size={40} color="#94a3b8" style={{ margin: '0 auto 1rem', display: 'block' }} />
                <h4 style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--clay-text-dark)', marginBottom: '0.5rem' }}>
                  No Direct PDF Stream Configured
                </h4>
                <p style={{ fontSize: '0.82rem', color: 'var(--clay-text-muted)', maxWidth: '420px', margin: '0 auto 1.25rem' }}>
                  A rendered PDF stream is not directly linked for this reference. Please inspect the extracted OCR text and regulatory metadata.
                </p>
                <button
                  onClick={() => setActiveTab('metadata')}
                  className="clay-btn-pill clay-btn-primary"
                  style={{ fontSize: '0.8rem' }}
                >
                  View Extracted Metadata & OCR
                </button>
              </div>
            )}
          </div>
        )}

        {/* Tab 2: Extracted Metadata & OCR */}
        {activeTab === 'metadata' && (
          <div>
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
                              {f.extraction_status || 'Extracted'}
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
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '300px', overflowY: 'auto' }}>
                {pages.map((p, idx) => (
                  <div key={idx} className="clay-inset" style={{ background: '#f8fafc', padding: '0.85rem' }}>
                    <div style={{ fontSize: '0.68rem', fontWeight: 700, color: '#2563eb', marginBottom: '0.35rem' }}>
                      Page {p.page || p.page_num || p.page_number || idx + 1} Text Stream:
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
        )}
      </div>
    </div>
  );
}
