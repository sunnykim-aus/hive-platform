"""
Crawls ABS (Australian Bureau of Statistics) housing publications.
ABS provides the authoritative quantitative ground truth:
- Housing Census (2011, 2016, 2021)
- Estimating Homelessness Census
- Housing Occupancy and Costs
- Housing Mobility and Conditions
- Survey of Income and Housing
- Residential Property Price Indexes
These reports provide hard numbers to validate qualitative AHURI findings.
"""
import json
import re
import time
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://www.abs.gov.au"

# Known ABS housing publication pages
KNOWN_REPORT_PAGES = [
    # Core housing statistics
    "/statistics/people/housing/housing-census/2021",
    "/statistics/people/housing/estimating-homelessness-census/2021",
    "/statistics/people/housing/housing-occupancy-and-costs/2019-20",
    "/statistics/people/housing/housing-mobility-and-conditions/2019-20",
    "/statistics/people/housing/index-household-advantage-and-disadvantage/2021",
    # Survey of Income and Housing
    "/statistics/economy/finance/survey-income-and-housing",
    # Property prices
    "/statistics/economy/price-indexes-and-inflation/residential-property-price-indexes-eight-capital-cities/latest-release",
    "/statistics/economy/price-indexes-and-inflation/total-value-dwellings/latest-release",
    # Rental market
    "/statistics/economy/price-indexes-and-inflation/rental-affordability-snapshot",
    # Affordability guide
    "/statistics/detailed-methodology-information/information-papers/guide-housing-affordability-statistics",
    # Census housing data older releases
    "/statistics/people/housing/housing-census/2016",
    "/statistics/people/housing/housing-census/2011",
    "/statistics/people/housing/estimating-homelessness-census/2016",
    "/statistics/people/housing/estimating-homelessness-census/2011",
    # Building activity
    "/statistics/industry/building-and-construction/building-activity-australia/latest-release",
    "/statistics/industry/building-and-construction/building-approvals-australia/latest-release",
]

LISTING_URL = "https://www.abs.gov.au/statistics/people/housing"


def _get(url, client, retries=3):
    for attempt in range(retries):
        try:
            r = client.get(url, timeout=30, follow_redirects=True)
            r.raise_for_status()
            return r
        except Exception as e:
            if attempt == retries - 1:
                print(f"  [skip] {url} — {e}")
                return None
            time.sleep(2 ** attempt)
    return None


def _parse_year(text):
    m = re.search(r"\b(200[0-9]|20[12]\d)\b", str(text))
    return int(m.group()) if m else None


def scrape_report(url, client):
    """Extract metadata and any PDF from an ABS statistical release page."""
    r = _get(url, client)
    if not r:
        return None
    soup = BeautifulSoup(r.text, "lxml")
    meta = {"url": url, "source": "ABS"}

    h1 = soup.find("h1")
    meta["title"] = h1.get_text(strip=True) if h1 else url.split("/")[-1].replace("-", " ").title()
    meta["year"] = _parse_year(url) or _parse_year(soup.get_text())
    meta["authors"] = "Australian Bureau of Statistics"
    meta["report_type"] = "Statistical Release"

    # Get the main statistical content as abstract
    content_parts = []
    for sel in [".abs-statistics-overview", ".statistics-content", "article", ".field--name-body", "main p"]:
        els = soup.select(sel)
        for el in els[:3]:
            text = el.get_text(strip=True)
            if len(text) > 100:
                content_parts.append(text[:500])
        if content_parts:
            break
    meta["abstract"] = " ".join(content_parts)[:1000] if content_parts else ""

    # PDF links (ABS sometimes has downloadable releases)
    pdf_url = None
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if ".pdf" in href.lower() and "abs.gov.au" in urljoin(BASE_URL, href):
            pdf_url = urljoin(BASE_URL, href)
            break
    meta["pdf_url"] = pdf_url

    # Also capture key statistics as text for the index
    # ABS pages have rich text content even without PDFs — we index the page text
    full_text = soup.get_text(separator=" ", strip=True)
    meta["page_text"] = full_text[:8000]  # will be used if no PDF
    return meta


def crawl(output_dir, meta_file, delay=1.5):
    output_dir = Path(output_dir)
    meta_file = Path(meta_file)
    output_dir.mkdir(parents=True, exist_ok=True)

    existing = {}
    if meta_file.exists():
        for line in meta_file.read_text().splitlines():
            try:
                r = json.loads(line)
                existing[r["url"]] = r
            except Exception:
                pass

    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
    all_urls = set(urljoin(BASE_URL, p) for p in KNOWN_REPORT_PAGES)

    with httpx.Client(headers=headers) as client:
        # Also discover from listing page
        print("Scanning ABS housing statistics listing...")
        r = _get(LISTING_URL, client)
        if r:
            soup = BeautifulSoup(r.text, "lxml")
            for a in soup.select("a[href]"):
                href = a.get("href", "")
                if "/statistics/" in href and len(href) > 30:
                    all_urls.add(urljoin(BASE_URL, href))

        new_urls = [u for u in all_urls if u not in existing]
        print(f"Fetching {len(new_urls)} ABS report pages...")

        with open(meta_file, "a") as mf:
            for url in tqdm(new_urls):
                meta = scrape_report(url, client)
                if not meta or not meta.get("title"):
                    continue

                pdf_url = meta.get("pdf_url")
                if pdf_url:
                    safe = re.sub(r"[^\w-]", "_", urlparse(pdf_url).path.strip("/"))[-80:]
                    pdf_path = output_dir / f"abs_{safe}.pdf"
                    if not pdf_path.exists():
                        resp = _get(pdf_url, client)
                        if resp and "pdf" in resp.headers.get("content-type", "").lower():
                            pdf_path.write_bytes(resp.content)
                            meta["pdf_path"] = str(pdf_path)
                        else:
                            meta["pdf_path"] = None
                    else:
                        meta["pdf_path"] = str(pdf_path)
                else:
                    # Save page text to a text file for indexing
                    page_text = meta.pop("page_text", "")
                    if page_text and len(page_text) > 300:
                        safe_name = re.sub(r"[^\w-]", "_", url.split("abs.gov.au")[-1])[:60]
                        txt_path = output_dir / f"abs_{safe_name}.txt"
                        txt_path.write_text(page_text)
                        meta["txt_path"] = str(txt_path)
                    meta["pdf_path"] = None

                mf.write(json.dumps(meta) + "\n")
                mf.flush()
                existing[url] = meta
                time.sleep(delay)

    print(f"ABS done. {len(existing)} reports.")
    return list(existing.values())
