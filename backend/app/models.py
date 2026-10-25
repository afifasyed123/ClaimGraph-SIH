from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ReviewerActionCreate(BaseModel):
    action: str  # Must be one of: 'Accepted for review', 'Additional evidence required', 'Dismissed', 'Referred for further verification or inspection'
    reason: Optional[str] = ""
    actor: Optional[str] = "Scrutiny Reviewer"

class SimulationRequest(BaseModel):
    changed_field: str  # e.g., 'proposed_intake' or 'faculty_count'
    new_value: Any

class FindingItem(BaseModel):
    id: str
    application_id: str
    rule_id: Optional[str]
    type: str  # missing_document, missing_field, expired_document, invalid_date, field_mismatch, history_mismatch, duplicate_file, infra_gap, unverified
    severity: str  # high, medium, low, info
    status: str  # Open, Accepted for review, Additional evidence required, Dismissed, Referred
    field_or_claim: Optional[str]
    extracted_value: Optional[str]
    comparison_value: Optional[str]
    source_document: Optional[str]
    page_or_field: Optional[str]
    reason: Optional[str]
    verification_status: Optional[str]
    recommended_next_step: Optional[str]
    rule_source: Optional[str] = "Demonstration Rule - Illustrative Only"
    details_json: Optional[Dict[str, Any]] = None
    created_at: Optional[str] = None

class SimulationFindingDiff(BaseModel):
    newly_flagged: List[FindingItem] = []
    resolved: List[FindingItem] = []
    unchanged: List[FindingItem] = []
    before_count: int
    after_count: int
    summary_explanation: str
    disclaimer: str = "Simulation of a proposed change. Not an AICTE decision."

class AuditTrailItem(BaseModel):
    id: str
    finding_id: str
    application_id: str
    action: str
    reason: Optional[str]
    actor: str
    created_at: str
    finding_type: Optional[str] = None
    field_or_claim: Optional[str] = None

class VerificationStatusItem(BaseModel):
    document_id: str
    doc_type: str
    filename: str
    sha256: str
    verification_status: str  # 'Verified by configured demo source', 'Unverified (external verification unavailable)', 'Mismatch (manual review required)', 'Verification failed or unavailable'
    issuer_label: str
    issuer_disclaimer: str = "SIMULATED VERIFICATION. NOT CONNECTED TO THE ISSUING AUTHORITY."
    checks: Dict[str, Any]

class ApplicationCreate(BaseModel):
    institution_id: Optional[str] = None
    name: Optional[str] = None
    reference: Optional[str] = None
    category: str = "Engineering & Technology"
    type: str = "Extension of Approval (EoA)"
    proposed_intake: Optional[int] = None
    faculty_count: Optional[int] = None
    carpet_area_sqm: Optional[float] = None
    demo_case_key: Optional[str] = None  # 'case_a', 'case_b', 'case_c'

class CampusSimulationRequest(BaseModel):
    campus_id: str = "CAMPUS-VV-01"
    target_institution_id: Optional[str] = None
    proposed_intake: Optional[int] = None
    faculty_count: Optional[int] = None
    faculty_reallocation: Optional[str] = None # 'exclusive_apex', 'exclusive_pharm', 'split_50_50', or 'unchanged'
    facility_repartition: Optional[str] = None # 'partition_600_600', 'full_apex', 'full_mgmt', or 'unchanged'

class DeficiencyNoticeCreate(BaseModel):
    application_id: str
    reviewer_name: Optional[str] = "AICTE Scrutiny Officer"
    clarifications_note: Optional[str] = ""

class RuleToggleRequest(BaseModel):
    is_active: bool
    threshold: Optional[Any] = None

