from pathlib import Path

DATA_DIR = Path("data")
AHURI_DIR = DATA_DIR / "ahuri"
CHROMA_DIR = DATA_DIR / "chroma"
META_FILE = DATA_DIR / "reports_meta.json"

# Source data directories
SOURCE_DIRS = {
    "ahuri": DATA_DIR / "ahuri",
    "housing_australia": DATA_DIR / "housing_australia",
    "pc": DATA_DIR / "pc",
    "aihw": DATA_DIR / "aihw",
    "dss": DATA_DIR / "dss",
}

CHUNK_WORDS = 400
CHUNK_OVERLAP_WORDS = 60
EMBEDDING_MODEL = "all-MiniLM-L6-v2"
CLAUDE_MODEL = "claude-sonnet-4-6"
MAX_SYNTHESIS_CHUNKS = 18

SOURCES = {
    "ahuri": {
        "name": "AHURI",
        "base_url": "https://www.ahuri.edu.au",
        "research_url": "https://www.ahuri.edu.au/research",
    }
}

# Key Australian housing policy events for timeline context
POLICY_TIMELINE = [
    {"year": 2008, "event": "Nation Building Economic Stimulus Plan announced", "amount_bn": 5.6, "type": "construction"},
    {"year": 2009, "event": "Social Housing Initiative — 20,000 new public housing dwellings", "amount_bn": 5.6, "type": "public_housing"},
    {"year": 2011, "event": "National Rental Affordability Scheme (NRAS) — 50,000 dwellings target", "amount_bn": 4.5, "type": "affordable_rental"},
    {"year": 2012, "event": "National Affordable Housing Agreement (NAHA) reform", "amount_bn": 1.3, "type": "agreement"},
    {"year": 2018, "event": "National Housing Finance and Investment Corporation (NHFIC) established", "amount_bn": 1.0, "type": "financing"},
    {"year": 2019, "event": "First Home Loan Deposit Scheme launched", "amount_bn": 0.5, "type": "homeownership"},
    {"year": 2021, "event": "HomeBuilder scheme (COVID response)", "amount_bn": 2.5, "type": "construction"},
    {"year": 2022, "event": "Housing Accord — 1 million new homes target by 2029", "amount_bn": 10.0, "type": "supply"},
    {"year": 2023, "event": "Housing Australia Future Fund — $10B for social/affordable housing", "amount_bn": 10.0, "type": "social_housing"},
    {"year": 2024, "event": "Help to Buy shared equity scheme", "amount_bn": 5.5, "type": "homeownership"},
]
