"""
Downloads Australian Federal Budget Papers relevant to housing.
Budget Paper 2 (Budget Measures) is the primary source — it lists every
program, its funding, and year-by-year allocations.
Budget Paper 1 (Budget Strategy and Outlook) has macro housing analysis.

Archive structure: https://archive.budget.gov.au/{year}/
Years covered: 2010-11 through 2025-26
"""
import json
import re
import time
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin
from tqdm import tqdm

ARCHIVE_BASE = "https://archive.budget.gov.au"

# Budget years to crawl (covers 15-year window of community housing history)
BUDGET_YEARS = [
    "2025-26", "2024-25", "2023-24", "2022-23", "2021-22",
    "2020-21", "2019-20", "2018-19", "2017-18", "2016-17",
    "2015-16", "2014-15", "2013-14", "2012-13", "2011-12", "2010-11",
]

# Budget papers most relevant to housing
# bp2 = Budget Measures (lists every housing program + funding)
# bp1 = Budget Strategy and Outlook (macro context)
# myefo = Mid-Year Economic and Fiscal Outlook
PRIORITY_PAPERS = ["bp2", "bp1", "myefo"]

# Known direct PDF patterns per year
# Different years have different file structures — we probe and fall back
BP2_PATTERNS = [
    "{year}/bp2/download/bp2.pdf",
    "{year}/bp2/bp2.pdf",
    "{year}/content/bp2/download/bp2.pdf",
    "{year}/bp2/download/Budget_Paper_No_2.pdf",
    "{year}/bp2/download/bp2_combined.pdf",
]

BP1_PATTERNS = [
    "{year}/bp1/download/bp1.pdf",
    "{year}/bp1/bp1.pdf",
    "{year}/content/bp1/download/bp1.pdf",
    "{year}/bp1/download/bp1_{year}.pdf",
    "{year}/bp1/download/bp1_2024-25.pdf",
]


def _get(url, client, retries=3):
    for attempt in range(retries):
        try:
            r = client.get(url, timeout=60, follow_redirects=True)
            if r.status_code == 200:
                return r
            if r.status_code == 404:
                return None
        except Exception as e:
            if attempt == retries - 1:
                return None
            time.sleep(2 ** attempt)
    return None


def _parse_year(text):
    m = re.search(r"\b(200[0-9]|20[12]\d)\b", str(text))
    return int(m.group()) if m else None


def find_pdf_on_page(url, client):
    """Scrape a budget year index page to find PDF download links."""
    r = _get(url, client)
    if not r:
        return {}
    soup = BeautifulSoup(r.text, "lxml")
    pdfs = {}
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if ".pdf" in href.lower():
            full = urljoin(url, href)
            text = a.get_text(strip=True).lower()
            if "bp2" in href.lower() or "budget measure" in text or "paper 2" in text:
                pdfs["bp2"] = full
            elif "bp1" in href.lower() or "strategy" in text or "paper 1" in text or "outlook" in text:
                pdfs["bp1"] = full
            elif "myefo" in href.lower() or "mid-year" in text:
                pdfs["myefo"] = full
    return pdfs


def crawl(output_dir, meta_file, delay=2.0):
    output_dir = Path(output_dir)
    meta_file = Path(meta_file)
    output_dir.mkdir(parents=True, exist_ok=True)

    existing = set()
    if meta_file.exists():
        for line in meta_file.read_text().splitlines():
            try:
                r = json.loads(line)
                if r.get("source") == "Treasury":
                    existing.add(r["url"])
            except Exception:
                pass

    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}

    print(f"Downloading Budget Papers for {len(BUDGET_YEARS)} years...")

    with httpx.Client(headers=headers) as client, open(meta_file, "a") as mf:
        for year in tqdm(BUDGET_YEARS):
            year_url = f"{ARCHIVE_BASE}/{year}/"
            start_year = int(year.split("-")[0])

            # Try to find PDFs from the archive index page first
            page_pdfs = find_pdf_on_page(year_url, client)

            for paper_type in PRIORITY_PAPERS:
                # Try page-discovered URL first, then patterns
                pdf_url = page_pdfs.get(paper_type)

                if not pdf_url:
                    patterns = BP2_PATTERNS if paper_type == "bp2" else BP1_PATTERNS
                    for pattern in patterns:
                        candidate = f"{ARCHIVE_BASE}/" + pattern.format(year=year)
                        r = _get(candidate, client)
                        if r and "pdf" in r.headers.get("content-type", "").lower():
                            pdf_url = candidate
                            break

                if not pdf_url or pdf_url in existing:
                    continue

                # Download the PDF
                r = _get(pdf_url, client)
                if not r or "pdf" not in r.headers.get("content-type", "").lower():
                    continue

                fname = f"budget_{year}_{paper_type}.pdf"
                pdf_path = output_dir / fname
                if not pdf_path.exists():
                    pdf_path.write_bytes(r.content)

                title_map = {
                    "bp2": f"Federal Budget {year} — Budget Measures (Budget Paper No. 2)",
                    "bp1": f"Federal Budget {year} — Budget Strategy and Outlook (Budget Paper No. 1)",
                    "myefo": f"Federal Budget {year} — Mid-Year Economic and Fiscal Outlook (MYEFO)",
                }
                meta = {
                    "url": pdf_url,
                    "source": "Treasury",
                    "title": title_map.get(paper_type, f"Budget Paper {year}"),
                    "year": start_year,
                    "authors": "Australian Government Treasury",
                    "report_type": "Budget Paper",
                    "abstract": (
                        f"Australian Federal Budget {year} — {paper_type.upper()}. "
                        "Contains detailed housing program expenditure, funding allocations "
                        "for social housing, affordable housing programs, and homelessness initiatives."
                    ),
                    "pdf_url": pdf_url,
                    "pdf_path": str(pdf_path),
                }
                mf.write(json.dumps(meta) + "\n")
                mf.flush()
                existing.add(pdf_url)
                print(f"  Downloaded: {fname} ({len(r.content) // 1024}KB)")
                time.sleep(delay)

    print(f"Treasury done. {len(existing)} budget papers downloaded.")
