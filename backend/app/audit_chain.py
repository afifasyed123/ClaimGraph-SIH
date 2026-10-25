import hashlib
import json
import time
from typing import Dict, Any, List, Optional
from .database import get_db_context

GENESIS_PREV_HASH = "0000000000000000000000000000000000000000000000000000000000000000"

def compute_record_hash(prev_hash: str, record_id: str, timestamp: str, actor: str, role: str, action: str, target_id: str, reason: str, payload_json: str) -> str:
    payload_str = f"{prev_hash}|{record_id}|{timestamp}|{actor}|{role}|{action}|{target_id}|{reason}|{payload_json}"
    return hashlib.sha256(payload_str.encode("utf-8")).hexdigest()

def record_audit_event(
    actor: str,
    role: str,
    action: str,
    target_id: str,
    reason: str = "",
    payload: Optional[Dict[str, Any]] = None
) -> Dict[str, Any]:
    """
    Appends a new cryptographically chained record to the audit trail.
    Ensures mathematical tamper evidence and reproducible provenance.
    """
    payload_json = json.dumps(payload or {}, sort_keys=True)
    timestamp = time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    record_id = f"AUD-{int(time.time() * 1000)}-{action[:6].upper()}"

    with get_db_context() as conn:
        cursor = conn.cursor()

        # Get latest record to find previous hash
        cursor.execute("SELECT current_hash FROM audit_chain ORDER BY index_num DESC LIMIT 1")
        last_row = cursor.fetchone()
        prev_hash = last_row["current_hash"] if last_row else GENESIS_PREV_HASH

        current_hash = compute_record_hash(
            prev_hash=prev_hash,
            record_id=record_id,
            timestamp=timestamp,
            actor=actor,
            role=role,
            action=action,
            target_id=target_id,
            reason=reason or "",
            payload_json=payload_json
        )

        cursor.execute("""
        INSERT INTO audit_chain (id, prev_hash, current_hash, timestamp, actor, role, action, target_id, reason, payload_json)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            record_id,
            prev_hash,
            current_hash,
            timestamp,
            actor,
            role,
            action,
            target_id,
            reason or "",
            payload_json
        ))
        conn.commit()

        cursor.execute("SELECT index_num FROM audit_chain WHERE id = ?", (record_id,))
        index_num = cursor.fetchone()["index_num"]

    return {
        "index_num": index_num,
        "id": record_id,
        "prev_hash": prev_hash,
        "current_hash": current_hash,
        "timestamp": timestamp,
        "actor": actor,
        "role": role,
        "action": action,
        "target_id": target_id,
        "reason": reason
    }

def get_audit_chain(limit: int = 100) -> List[Dict[str, Any]]:
    """Retrieves chronological audit chain records"""
    with get_db_context() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_chain ORDER BY index_num DESC LIMIT ?", (limit,))
        rows = cursor.fetchall()
        result = []
        for r in rows:
            item = dict(r)
            try:
                item["payload"] = json.loads(item.get("payload_json", "{}"))
            except Exception:
                item["payload"] = {}
            result.append(item)
        return result

def verify_audit_chain_integrity() -> Dict[str, Any]:
    """
    Verifies cryptographic hash chain integrity from genesis record.
    Returns whether the chain is authentic and un-tampered.
    """
    with get_db_context() as conn:
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM audit_chain ORDER BY index_num ASC")
        rows = cursor.fetchall()

    if not rows:
        return {
            "is_valid": True,
            "total_records": 0,
            "status": "Genesis State (Empty Chain)",
            "verification_message": "Audit chain initialized. No records present to verify.",
            "verified_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
        }

    expected_prev = GENESIS_PREV_HASH
    for i, row in enumerate(rows):
        r_prev = row["prev_hash"]
        r_curr = row["current_hash"]
        
        # 1. Check prev_hash linkage
        if r_prev != expected_prev:
            return {
                "is_valid": False,
                "broken_at_index": row["index_num"],
                "record_id": row["id"],
                "status": "TAMPER_DETECTED",
                "verification_message": f"Hash linkage broken at block #{row['index_num']}. Expected prev_hash {expected_prev[:12]}..., found {r_prev[:12]}...",
                "verified_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }

        # 2. Recompute current hash
        recomputed = compute_record_hash(
            prev_hash=r_prev,
            record_id=row["id"],
            timestamp=row["timestamp"],
            actor=row["actor"],
            role=row["role"],
            action=row["action"],
            target_id=row["target_id"],
            reason=row["reason"] or "",
            payload_json=row["payload_json"] or "{}"
        )

        if recomputed != r_curr:
            return {
                "is_valid": False,
                "broken_at_index": row["index_num"],
                "record_id": row["id"],
                "status": "TAMPER_DETECTED",
                "verification_message": f"Block content integrity failure at block #{row['index_num']}. Digest mismatch.",
                "verified_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
            }

        expected_prev = r_curr

    return {
        "is_valid": True,
        "total_records": len(rows),
        "status": "AUTHENTIC_AND_VERIFIED",
        "latest_block_hash": expected_prev,
        "verification_message": f"All {len(rows)} cryptographically linked audit blocks verified authentic. SHA-256 chain is intact.",
        "verified_at": time.strftime("%Y-%m-%dT%H:%M:%SZ", time.gmtime())
    }
