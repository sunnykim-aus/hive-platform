"""
Crawls AIHW (Australian Institute of Health and Welfare) housing reports.
AIHW produces the most authoritative quantitative housing data:
- Homelessness in Australia (annual)
- Housing assistance in Australia (annual)
- National Housing Assistance Data Repository
- Indigenous housing data
"""
import json
import re
import time
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://www.aihw.gov.au"

SEARCH_URLS = [
    "https://www.aihw.gov.au/reports-data/health-welfare-overview/housing/overview",
    "https://www.aihw.gov.au/reports/housing-assistance/housing-assistance-in-australia-2024",
    "https://www.aihw.gov.au/reports/homelessness-services/homelessness-australia",
    "https://www.aihw.gov.au/reports/indigenous-australians/housing",
]

# Known AIHW report series for housing
KNOWN_SERIES = [
    "housing-assistance-in-australia",
    "homelessness-australia",
    "specialist-homelessness-services",
    "housing-indigenous-australians",
]

LISTING_URLS = [
    "https://www.aihw.gov.au/reports-data/health-welfare-overview/housing",
    "https://www.aihw.gov.au/search#search=housing&collection=aihw-web",
]


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


def scrape_listing(url, client):
    """Extract report links from AIHW listing/overview pages."""
    r = _get(url, client)
    if not r:
        return []
    soup = BeautifulSoup(r.text, "lxml")
    links = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        full = urljoin(BASE_URL, href)
        if "aihw.gov.au/reports" in full and len(href) > 20:
            links.append(full)
    return list(set(links))


def scrape_report(url, client):
    """Extract metadata + PDF from an AIHW report page."""
    r = _get(url, client)
    if not r:
        return None
    soup = BeautifulSoup(r.text, "lxml")
    meta = {"url": url, "source": "AIHW"}

    h1 = soup.find("h1")
    meta["title"] = h1.get_text(strip=True) if h1 else ""
    meta["year"] = _parse_year(soup.get_text())
    meta["authors"] = "Australian Institute of Health and Welfare"
    meta["report_type"] = "Statistical Report"

    for sel in [".report-summary", ".field--name-body", "article p", ".intro", ".summary"]:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 80:
            meta["abstract"] = el.get_text(strip=True)[:800]
            break

    pdf_url = None
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if ".pdf" in href.lower():
            pdf_url = urljoin(BASE_URL, href)
            break
    meta["pdf_url"] = pdf_url
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
    all_urls = set(SEARCH_URLS)

    with httpx.Client(headers=headers) as client:
        print("Scanning AIHW housing reports...")
        for listing_url in LISTING_URLS:
            found = scrape_listing(listing_url, client)
            housing_links = [
                u for u in found if any(w in u.lower() for w in [
                    "housing", "homelessness", "shelter", "indigenous-housing", "rental"
                ])
            ]
            all_urls.update(housing_links)
            print(f"  Found {len(housing_links)} housing-related links from {listing_url.split('/')[-1]}")
            time.sleep(delay)

        new_urls = [u for u in all_urls if u not in existing]
        print(f"\nFetching {len(new_urls)} AIHW report pages...")

        with open(meta_file, "a") as mf:
            for url in tqdm(new_urls):
                meta = scrape_report(url, client)
                if not meta or not meta.get("title"):
                    continue

                pdf_url = meta.get("pdf_url")
                if pdf_url:
                    safe = re.sub(r"[^\w-]", "_", urlparse(pdf_url).path.strip("/"))[-80:]
                    pdf_path = output_dir / f"aihw_{safe}.pdf"
                    if not pdf_path.exists():
                        r = _get(pdf_url, client)
                        if r and ("pdf" in r.headers.get("content-type", "").lower() or pdf_url.endswith(".pdf")):
                            pdf_path.write_bytes(r.content)
                            meta["pdf_path"] = str(pdf_path)
                        else:
                            meta["pdf_path"] = None
                    else:
                        meta["pdf_path"] = str(pdf_path)
                else:
                    meta["pdf_path"] = None

                mf.write(json.dumps(meta) + "\n")
                mf.flush()
                existing[url] = meta
                time.sleep(delay)

    print(f"AIHW done. {len(existing)} reports.")
    return list(existing.values())
