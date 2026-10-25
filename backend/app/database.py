import sqlite3
from contextlib import contextmanager
from .config import DB_PATH

@contextmanager
def get_db_context():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def get_db():
    conn = sqlite3.connect(str(DB_PATH), check_same_thread=False)
    conn.row_factory = sqlite3.Row
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    with get_db_context() as conn:
        cursor = conn.cursor()
        
        # Core tables as specified in PRD Section 9
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS applications (
            id TEXT PRIMARY KEY,
            institution_id TEXT NOT NULL,
            name TEXT NOT NULL,
            reference TEXT NOT NULL,
            type TEXT NOT NULL,
            category TEXT NOT NULL,
            proposed_intake INTEGER,
            faculty_count INTEGER,
            carpet_area_sqm REAL,
            status TEXT NOT NULL DEFAULT 'draft',
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS documents (
            id TEXT PRIMARY KEY,
            application_id TEXT NOT NULL,
            doc_type TEXT NOT NULL,
            filename TEXT NOT NULL,
            sha256 TEXT NOT NULL,
            file_path TEXT NOT NULL,
            processing_status TEXT NOT NULL DEFAULT 'uploaded',
            uploaded_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES applications(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS extracted_fields (
            id TEXT PRIMARY KEY,
            document_id TEXT NOT NULL,
            field TEXT NOT NULL,
            value TEXT,
            page INTEGER,
            extraction_status TEXT NOT NULL,
            FOREIGN KEY (document_id) REFERENCES documents(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS historical_records (
            id TEXT PRIMARY KEY,
            institution_id TEXT NOT NULL,
            field TEXT NOT NULL,
            value TEXT NOT NULL,
            as_of TEXT NOT NULL
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS rules (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            inputs TEXT NOT NULL,
            config TEXT,
            source TEXT NOT NULL,
            description TEXT
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS findings (
            id TEXT PRIMARY KEY,
            application_id TEXT NOT NULL,
            rule_id TEXT,
            type TEXT NOT NULL,
            severity TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Open',
            field_or_claim TEXT,
            extracted_value TEXT,
            comparison_value TEXT,
            source_document TEXT,
            page_or_field TEXT,
            reason TEXT,
            verification_status TEXT,
            recommended_next_step TEXT,
            rule_source TEXT,
            details_json TEXT,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES applications(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS reviewer_actions (
            id TEXT PRIMARY KEY,
            finding_id TEXT NOT NULL,
            application_id TEXT NOT NULL,
            action TEXT NOT NULL,
            reason TEXT,
            actor TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (finding_id) REFERENCES findings(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS simulations (
            id TEXT PRIMARY KEY,
            application_id TEXT NOT NULL,
            changed_field TEXT NOT NULL,
            old_value TEXT,
            new_value TEXT,
            result_json TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (application_id) REFERENCES applications(id)
        );
        """)

        # TULA Integration Tables: Campus, Facilities, Cross-Institution Claims, Hash-Chained Audit, Notices
        cursor.execute("""
        CREATE TABLE IF NOT EXISTS campuses (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            location TEXT NOT NULL,
            total_land_acres REAL NOT NULL,
            total_built_up_sqm REAL NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS campus_institutions (
            id TEXT PRIMARY KEY,
            campus_id TEXT NOT NULL,
            institution_id TEXT NOT NULL,
            application_id TEXT NOT NULL,
            institution_name TEXT NOT NULL,
            programme TEXT NOT NULL,
            sanctioned_intake INTEGER NOT NULL,
            faculty_count INTEGER NOT NULL,
            carpet_area_sqm REAL NOT NULL,
            FOREIGN KEY (campus_id) REFERENCES campuses(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS campus_facilities (
            id TEXT PRIMARY KEY,
            campus_id TEXT NOT NULL,
            name TEXT NOT NULL,
            type TEXT NOT NULL,
            total_carpet_area_sqm REAL NOT NULL,
            is_sharable INTEGER DEFAULT 1,
            claiming_institutions TEXT NOT NULL,
            claimed_areas_json TEXT NOT NULL,
            source_documents_json TEXT,
            FOREIGN KEY (campus_id) REFERENCES campuses(id)
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS campus_faculty (
            id TEXT PRIMARY KEY,
            name TEXT NOT NULL,
            department TEXT NOT NULL,
            designation TEXT NOT NULL,
            claimed_institutions TEXT NOT NULL,
            is_full_time INTEGER DEFAULT 1,
            source_evidence_json TEXT
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS audit_chain (
            index_num INTEGER PRIMARY KEY AUTOINCREMENT,
            id TEXT UNIQUE NOT NULL,
            prev_hash TEXT NOT NULL,
            current_hash TEXT NOT NULL,
            timestamp TEXT NOT NULL,
            actor TEXT NOT NULL,
            role TEXT NOT NULL,
            action TEXT NOT NULL,
            target_id TEXT NOT NULL,
            reason TEXT,
            payload_json TEXT
        );
        """)

        cursor.execute("""
        CREATE TABLE IF NOT EXISTS deficiency_notices (
            id TEXT PRIMARY KEY,
            application_id TEXT NOT NULL,
            campus_id TEXT,
            institution_name TEXT NOT NULL,
            reference TEXT NOT NULL,
            generated_date TEXT NOT NULL,
            findings_json TEXT NOT NULL,
            clarifications_requested TEXT NOT NULL,
            reviewer_name TEXT NOT NULL,
            notice_hash TEXT NOT NULL,
            qr_verification_url TEXT NOT NULL,
            status TEXT NOT NULL DEFAULT 'Generated'
        );
        """)

        # Add active/version columns to rules if missing
        try:
            cursor.execute("ALTER TABLE rules ADD COLUMN version TEXT DEFAULT '2026.1';")
        except sqlite3.OperationalError:
            pass
        try:
            cursor.execute("ALTER TABLE rules ADD COLUMN effective_date TEXT DEFAULT '2026-04-01';")
        except sqlite3.OperationalError:
            pass
        try:
            cursor.execute("ALTER TABLE rules ADD COLUMN is_active INTEGER DEFAULT 1;")
        except sqlite3.OperationalError:
            pass
        try:
            cursor.execute("ALTER TABLE rules ADD COLUMN illustrative_label TEXT DEFAULT 'Illustrative Configurable Demo Rule - Not Official AICTE Requirement';")
        except sqlite3.OperationalError:
            pass

        conn.commit()

