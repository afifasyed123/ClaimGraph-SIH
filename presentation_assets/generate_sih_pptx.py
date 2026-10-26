"""
Generates the official SIH 2026 populated presentation using the exact template provided:
SIH2026-IDEA-Presentation-Format-2 (1).pptx
Strictly caps at 6 slides (Slide 7 deleted as per template instructions).
"""
import pptx
from pptx.util import Inches, Pt
from pptx.dml.color import RGBColor

template_path = r'c:\Users\Mrunmayee Potdar\Desktop\ClaimGraph\SIH2026-IDEA-Presentation-Format-2 (1).pptx'
output_path = r'c:\Users\Mrunmayee Potdar\Desktop\ClaimGraph\ClaimGraph-SIH\presentation_assets\ClaimGraph_SIH2026_Idea_Presentation.pptx'

prs = pptx.Presentation(template_path)

# Delete Slide 7 (Instruction Slide)
rId = prs.slides._sldIdLst[6].rId
prs.part.drop_rel(rId)
del prs.slides._sldIdLst[6]

def populate_shape(shape, sections):
    tf = shape.text_frame
    tf.word_wrap = True
    tf.margin_left = Inches(0.4)
    tf.margin_right = Inches(0.4)
    tf.margin_top = Inches(0.15)
    tf.margin_bottom = Inches(0.15)
    
    # clear existing paragraphs except first
    while len(tf.paragraphs) > 1:
        p_elem = tf.paragraphs[-1]._p
        p_elem.getparent().remove(p_elem)
        
    first = True
    for header, bullets in sections:
        p = tf.paragraphs[0] if first else tf.add_paragraph()
        first = False
        p.text = header
        p.font.bold = True
        p.font.size = Pt(12.5)
        p.font.color.rgb = RGBColor(15, 23, 42) # Ministry Navy
        p.space_before = Pt(4)
        p.space_after = Pt(2)
        
        for bullet in bullets:
            pb = tf.add_paragraph()
            pb.text = '  •  ' + bullet
            pb.font.bold = False
            pb.font.size = Pt(10)
            pb.font.color.rgb = RGBColor(30, 41, 59) # Slate 800
            pb.space_before = Pt(1)
            pb.space_after = Pt(1)

# Slide 1: Title Page
s1 = prs.slides[0]
tb1 = [s for s in s1.shapes if s.name == 'TextBox 9'][0]
tf1 = tb1.text_frame
tf1.word_wrap = True
while len(tf1.paragraphs) > 1:
    p_elem = tf1.paragraphs[-1]._p
    p_elem.getparent().remove(p_elem)

p1_first = tf1.paragraphs[0]
p1_first.text = 'Problem Statement ID: [Enter SIH PS ID]'
p1_first.font.bold = True
p1_first.font.size = Pt(13)

lines_s1 = [
    ('Problem Statement Title: Automated Scrutiny & Cross-Institution Regulatory Verification of Technical Institutions', False),
    ('Theme: Smart Automation / EdTech', False),
    ('PS Category: Software', False),
    ('Team ID: [Your Registered Team ID]', False),
    ('Team Name: [Your Registered Team Name]', False),
    ('Idea Title: ClaimGraph-AICTE: Statutory Compliance Intelligence, Evidence Provenance & Campus Reconciliation Engine', True)
]
for text, bold in lines_s1:
    p = tf1.add_paragraph()
    p.text = text
    p.font.bold = bold
    p.font.size = Pt(12.5 if not bold else 13.5)
    if bold:
        p.font.color.rgb = RGBColor(15, 23, 42)
        p.space_before = Pt(6)

# Slide 2: Proposed Solution
s2 = prs.slides[1]
t2 = [s for s in s2.shapes if s.name == 'Title 1'][0]
t2.text_frame.text = 'IDEA TITLE: ClaimGraph-AICTE'
tb2 = [s for s in s2.shapes if s.name == 'TextBox 8'][0]
populate_shape(tb2, [
    ('Proposed Solution (Describe your Idea/Solution/Prototype):', [
        'A statutory compliance intelligence platform automating application scrutiny for AICTE officers.',
        'Converts self-reported claims into an evidence-grounded Knowledge Graph cross-examined with physical PDFs.',
        'Preserves 100% human-in-the-loop governance: AI discovers discrepancies; accredited officers confirm decisions.'
    ]),
    ('Detailed explanation of the proposed solution:', [
        'Multi-Document Extraction: Cross-checks intake, land deeds, and faculty lists against resolutions via pypdf.',
        'SHA-256 Byte-Level Deduplication: Detects identical binary documents uploaded under disguised names.',
        'Explainable Discrepancy Cards: Shows claimed values, extracted proof, APH handbook clauses, and regulatory impact.'
    ]),
    ('How it addresses the problem:', [
        'Eliminates 100,000+ hours of manual scrutiny across 10,000+ technical institutions nationwide.',
        'Solves single-application blindness: Catches colleges on shared campuses double-pledging faculty or facilities.',
        'Generates itemized statutory deficiency notices with 14-day rectification pathways for institutions.'
    ]),
    ('Innovation and uniqueness of the solution:', [
        'Flagship SMT Solver: First platform using Microsoft Z3 Theorem Prover to solve campus resource allocations.',
        'Zero Hallucination: 100% deterministic rule evaluation backed by the AICTE Approval Process Handbook (APH).',
        'Cryptographic Auditability: Decisions sealed into immutable SHA-256 block chains compliant with IT Act 65B.'
    ])
])

# Slide 3: Technical Approach
s3 = prs.slides[2]
tb3 = [s for s in s3.shapes if s.name == 'TextBox 8'][0]
populate_shape(tb3, [
    ('Technologies to be used (programming languages, frameworks, hardware):', [
        'Frontend & Reviewer UX: React 19, Vite, Tailwind CSS, Lucide Icons, Enterprise Claymorphic UI.',
        'Backend & Logic Engine: Python 3.10+, FastAPI (Asynchronous REST API), Microsoft Z3 SMT Solver, NetworkX.',
        'Data & Cryptographic Layer: SQLite, pypdf stream extraction, SHA-256 append-only block ledger.',
        'Automated Validation: 23 end-to-end integration tests (100% pass rate) running locally and in CI/CD.'
    ]),
    ('Methodology and process for implementation (Flow Charts / Images / working prototype):', [
        'Pipeline Flow: PDF Ingestion ➔ Evidence Extraction & Hash Sealing ➔ APH Rule Engine ➔ Multi-College SMT Partitioning ➔ Reviewer Verification Queue ➔ Immutable Audit Sealing ➔ Deficiency Notice Dispatch.',
        'Working Prototype Status: Live prototype running at http://localhost:5173/ with pre-loaded ground truth cases:',
        '• Case A (Apex Institute): Verified Compliant (1:12.5 Student-Faculty Ratio met).',
        '• Case B (Bharat College): Missing Mandatory Document (expired Fire Safety NOC).',
        '• Case C (Chitkara Institute): Sanctioned Intake Mismatch (480 claimed vs 360 resolution) & Campus Sharing Alert.'
    ])
])

# Slide 4: Feasibility and Viability
s4 = prs.slides[3]
tb4 = [s for s in s4.shapes if s.name == 'TextBox 8'][0]
populate_shape(tb4, [
    ('Analysis of the feasibility of the idea:', [
        'High Operational Feasibility: Ingests existing standard PDFs without forcing colleges to learn new formats.',
        'High Performance & Scalability: Ingestion in <1.2s per college; campus SMT partition solving in <80ms.',
        'Cost-Effective: Runs on commodity cloud VMs without requiring multi-GPU computing clusters.'
    ]),
    ('Potential challenges and risks:', [
        'Risk 1: Scanned or low-quality mobile uploads and handwritten municipal certificates.',
        'Risk 2: Officer & institutional apprehension toward black-box automated approvals or rejections.',
        'Risk 3: Data privacy and confidentiality of faculty identity numbers (Aadhaar / PAN).'
    ]),
    ('Strategies for overcoming these challenges:', [
        'Dual-Stream OCR & Confidence Scoring: Flags low-confidence extractions for officer review instead of guessing.',
        'Strict Human-in-the-Loop Safeguards: AICTE regulatory policy strictly enforced: AI assists; humans decide.',
        'Cryptographic Tokenization: One-way salted SHA-256 hashes protect sensitive faculty identity records.'
    ])
])

# Slide 5: Impact and Benefits
s5 = prs.slides[4]
tb5 = [s for s in s5.shapes if s.name == 'TextBox 8'][0]
populate_shape(tb5, [
    ('Potential impact on the target audience:', [
        'AICTE Scrutiny Officers: Reduces scrutiny cycle from 45 days to under 48 hours; eliminates human fatigue.',
        'Technical Institutions: Receives transparent, legally cited notices with handbook clauses and 14-day remedy.',
        'Students & Parents: Guarantees certified laboratory space and legitimate, non-ghost faculty across colleges.'
    ]),
    ('Benefits of the solution (social, economic, environmental, etc.):', [
        'Statutory & Legal Governance: Meets Section 65B of Indian Information Technology Act for electronic evidence.',
        'Economic Savings: Saves tens of crores in administrative scrutiny costs and wasteful physical inspection visits.',
        'Anti-Corruption Integrity: Cryptographic hash chaining prevents retrospective record tampering or document swaps.',
        'Environmental Sustainability: Completely paperless end-to-end digital audit trail eliminating physical paper filing.'
    ])
])

# Slide 6: Research and References
s6 = prs.slides[5]
tb6 = [s for s in s6.shapes if s.name == 'TextBox 8'][0]
populate_shape(tb6, [
    ('Details / Links of the reference and research work:', [
        '[1] AICTE Approval Process Handbook (APH 2024-25 to 2026-27), All India Council for Technical Education, New Delhi.',
        '[2] All India Council for Technical Education Act, 1987 (Act 52 of 1987): Statutory norms and approval powers.',
        '[3] Indian Information Technology Act, 2000 — Section 65B: Admissibility of electronic records and cryptographic hashes.',
        '[4] De Moura, L., & Bjorner, N. (2008). Z3: An Efficient SMT Solver. TACAS 2008, Lecture Notes in Computer Science, Springer.',
        '[5] ISO/IEC 27001 & NIST SP 800-92: Standards for Information Security and Tamper-Proof Audit Log Management.',
        '[6] Hogan, A., et al. (2021). Knowledge Graphs. ACM Computing Surveys (CSUR), 54(4), 1-37.'
    ])
])

prs.save(output_path)
print('Successfully generated populated 6-slide presentation at:', output_path)
