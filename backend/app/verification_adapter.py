from typing import Dict, Any, List
from .config import ISSUER_ADAPTER_DISCLAIMER

class MockIssuerAdapter:
    """
    Mock adapter representing integration with external registries (e.g. State Land Registry, Municipal Fire Service, AICTE Council DB).
    STRICT COMPLIANCE NOTE:
    'SIMULATED VERIFICATION. NOT CONNECTED TO THE ISSUING AUTHORITY.'
    A missing external response is never treated as evidence of fraud.
    """

    def __init__(self):
        self.disclaimer = ISSUER_ADAPTER_DISCLAIMER

    def verify_document(self, doc_type: str, filename: str, sha256: str, extracted_data: Dict[str, Any]) -> Dict[str, Any]:
        doc_type_lower = doc_type.lower()
        
        # Simulated responses based on mock criteria
        if "fire" in doc_type_lower:
            validity = extracted_data.get("validity_date", {}).get("value")
            if validity and validity < "2026-10-01":
                return {
                    "verification_status": "Mismatch (manual review required)",
                    "issuer_label": "State Fire Services & Disaster Safety Directorate (Mock)",
                    "status_code": "ISSUER_RECORD_LAPSED",
                    "notes": "State registry indicates certificate valid period expired. Requires physical re-inspection.",
                    "checks": {
                        "issuer_reachable": True,
                        "record_found": True,
                        "validity_match": False,
                        "hash_on_record": True
                    }
                }
            return {
                "verification_status": "Verified by configured demo source",
                "issuer_label": "State Fire Services & Disaster Safety Directorate (Mock)",
                "status_code": "VERIFIED_OK",
                "notes": "Electronic verification matched active Municipal Fire Department certificate registry.",
                "checks": {
                    "issuer_reachable": True,
                    "record_found": True,
                    "validity_match": True,
                    "hash_on_record": True
                }
            }

        elif "resolution" in doc_type_lower:
            intake = extracted_data.get("proposed_intake", {}).get("value")
            if intake and int(intake) > 360:
                return {
                    "verification_status": "Mismatch (manual review required)",
                    "issuer_label": "AICTE Central Approval Bureau (Mock Database)",
                    "status_code": "SANCTIONED_QUOTA_EXCEEDED",
                    "notes": "Council repository records sanctioned capacity limit as 360 seats.",
                    "checks": {
                        "issuer_reachable": True,
                        "record_found": True,
                        "intake_match": False,
                        "council_minutes_reference": "Resolution 2026/04/ENG-12"
                    }
                }
            return {
                "verification_status": "Verified by configured demo source",
                "issuer_label": "AICTE Central Approval Bureau (Mock Database)",
                "status_code": "VERIFIED_OK",
                "notes": "Matches AICTE Central Approval Bureau archival records.",
                "checks": {
                    "issuer_reachable": True,
                    "record_found": True,
                    "intake_match": True
                }
            }

        elif "land" in doc_type_lower:
            return {
                "verification_status": "Verified by configured demo source",
                "issuer_label": "Revenue & Land Administration Digital Portal (Mock)",
                "status_code": "LAND_RECORD_VALID",
                "notes": "Instructional land parcel deed authenticated against district survey records.",
                "checks": {
                    "issuer_reachable": True,
                    "record_found": True,
                    "encumbrance_free": True
                }
            }

        # Out-of-band / Unverified document (e.g. internal faculty registers)
        return {
            "verification_status": "Unverified (external verification unavailable)",
            "issuer_label": "Institutional Internal Cadre System",
            "status_code": "NO_EXTERNAL_ISSUER",
            "notes": "Internal document type has no centralized statutory API. A missing external response is not evidence of fraud.",
            "checks": {
                "issuer_reachable": False,
                "record_found": False,
                "manual_verification_required": True
            }
        }
