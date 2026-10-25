import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent
DATA_DIR = BASE_DIR / "data"
SYNTHETIC_DATA_DIR = BASE_DIR / "synthetic_data"
RULES_FILE = BASE_DIR / "rules" / "demonstration_rules.yaml"
DB_PATH = DATA_DIR / "claimgraph.db"

# Create directories
DATA_DIR.mkdir(parents=True, exist_ok=True)
SYNTHETIC_DATA_DIR.mkdir(parents=True, exist_ok=True)

# PRD Core Constants
DEMO_DATE = "2026-10-01"
SYNTHETIC_BANNER = "SYNTHETIC DEMO DATA. NOT A REAL INSTITUTION. All verification is simulated. Demonstration rules are not official AICTE requirements."
SIMULATOR_DISCLAIMER = "Simulation of a proposed change. Not an AICTE decision."
ISSUER_ADAPTER_DISCLAIMER = "SIMULATED VERIFICATION. NOT CONNECTED TO THE ISSUING AUTHORITY."
