import json
import hashlib
from pathlib import Path
import pytest
from pypdf import PdfReader

ROOT_DIR = Path(__file__).resolve().parent.parent
MANIFESTS_DIR = ROOT_DIR / "manifests"
CASE_A_DIR = ROOT_DIR / "case_A_consistent"
CASE_B_DIR = ROOT_DIR / "case_B_deficient"
CASE_C_DIR = ROOT_DIR / "case_C_conflicting"
CAMPUS_DIR = ROOT_DIR / "campus_reconciliation"

def calculate_hash(filepath: Path) -> str:
    h = hashlib.sha256()
    with open(filepath, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()

def test_all_pdf_documents_exist_and_readable():
    """Verify all handbook-informed PDFs exist, are > 1KB, and contain readable text."""
    all_pdfs = list(CASE_A_DIR.glob("*.pdf")) + list(CASE_B_DIR.glob("*.pdf")) + \
               list(CASE_C_DIR.glob("*.pdf")) + list(CAMPUS_DIR.glob("*.pdf"))
    
    assert len(all_pdfs) >= 14, f"Expected at least 14 generated PDFs, found {len(all_pdfs)}"

    for pdf in all_pdfs:
        assert pdf.stat().st_size > 1000, f"File {pdf.name} is too small: {pdf.stat().st_size} bytes"
        reader = PdfReader(str(pdf))
        assert len(reader.pages) >= 1
        text = reader.pages[0].extract_text()
        assert len(text.strip()) > 50, f"File {pdf.name} has no extractable text"
        # Verify statutory watermark is present on every generated document
        assert "SYNTHETIC DEMO DOCUMENT — NOT AN OFFICIAL AICTE DOCUMENT" in text, \
            f"File {pdf.name} missing mandatory synthetic watermark"

def test_case_c_sha256_duplicate_detection():
    """Verify Case C duplicate file has exact SHA-256 match with original Fire NOC."""
    fire_noc = CASE_C_DIR / "Fire_Safety_NOC.pdf"
    dup_land = CASE_C_DIR / "Land_Registration_Deed_Duplicate.pdf"

    assert fire_noc.exists() and dup_land.exists()
    hash_fire = calculate_hash(fire_noc)
    hash_dup = calculate_hash(dup_land)

    assert hash_fire == hash_dup, "Case C duplicate file must have byte-identical SHA-256 hash"

def test_manifests_integrity_and_expected_findings():
    """Verify all manifests are valid and match expected scenario findings."""
    for manifest_name, expected_count in [
        ("manifest_case_a.json", 0),
        ("manifest_case_b.json", 3),
        ("manifest_case_c.json", 2),
        ("manifest_campus.json", 2)
    ]:
        manifest_path = MANIFESTS_DIR / manifest_name
        assert manifest_path.exists(), f"Missing manifest: {manifest_name}"
        with open(manifest_path, "r") as f:
            data = json.load(f)
            if "expected_findings" in data:
                assert len(data["expected_findings"]) == expected_count, \
                    f"{manifest_name} expected {expected_count} findings, found {len(data['expected_findings'])}"
            elif "expected_conflicts" in data:
                assert len(data["expected_conflicts"]) == expected_count, \
                    f"{manifest_name} expected {expected_count} conflicts, found {len(data['expected_conflicts'])}"

def test_case_a_faculty_ratio_satisfies_handbook_norm():
    """Verify Case A faculty count mathematically satisfies 1:20 SFR norm."""
    with open(ROOT_DIR / "source_data" / "case_a_consistent.json", "r") as f:
        data = json.load(f)
    intake = data["proposed_intake"]
    faculty = data["faculty_count"]
    sfr = intake / faculty
    assert sfr <= 20.0, f"Case A SFR {sfr} exceeds AICTE 20:1 norm"
