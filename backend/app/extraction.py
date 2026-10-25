import hashlib
import re
from pathlib import Path
from typing import Dict, Any, List
from pypdf import PdfReader

def extract_text_per_page(pdf_path: Path) -> List[Dict[str, Any]]:
    pages_data = []
    try:
        reader = PdfReader(str(pdf_path))
        for idx, page in enumerate(reader.pages):
            text = page.extract_text() or ""
            pages_data.append({
                "page_number": idx + 1,
                "text": text,
                "extraction_status": "success" if text.strip() else "empty_or_scanned"
            })
    except Exception as e:
        pages_data.append({
            "page_number": 1,
            "text": "",
            "extraction_status": f"failed: {str(e)}"
        })
    return pages_data

def extract_fields_from_text(pages_data: List[Dict[str, Any]]) -> Dict[str, Dict[str, Any]]:
    """
    Extracts fixed field set:
    - institution_name
    - application_reference
    - programme
    - proposed_intake
    - faculty_count
    - document_date
    - validity_date
    - carpet_area_sqm
    Adheres strictly to FR-B4: If extraction fails, show failure explicitly; never invent a value.
    """
    extracted = {}
    combined_text = "\n".join([p["text"] for p in pages_data])

    field_patterns = {
        "institution_name": r"Institution:\s*([^\n\r]+)",
        "application_reference": r"Application Reference:\s*([^\n\r]+)",
        "programme": r"Programme:\s*([^\n\r]+)",
        "proposed_intake": r"Proposed Intake:\s*(\d+)",
        "faculty_count": r"Faculty Count:\s*(\d+)",
        "document_date": r"Document Date:\s*([\d\-\/]+)",
        "validity_date": r"Validity Date:\s*([\d\-\/]+)",
        "carpet_area_sqm": r"Carpet Area Sqm:\s*([\d\.]+)",
    }

    for field, pattern in field_patterns.items():
        match = re.search(pattern, combined_text, re.IGNORECASE)
        if match:
            raw_val = match.group(1).strip()
            # Find which page it was found on
            page_found = 1
            for p in pages_data:
                if re.search(pattern, p["text"], re.IGNORECASE):
                    page_found = p["page_number"]
                    break
            extracted[field] = {
                "value": raw_val,
                "page": page_found,
                "status": "success"
            }
        else:
            extracted[field] = {
                "value": None,
                "page": None,
                "status": "not_found"
            }

    return extracted

def compute_file_hash(pdf_path: Path) -> str:
    h = hashlib.sha256()
    with open(pdf_path, "rb") as f:
        while chunk := f.read(8192):
            h.update(chunk)
    return h.hexdigest()
