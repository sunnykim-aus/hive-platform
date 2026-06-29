"""
Crawls Productivity Commission housing-related inquiries and research reports.
Uses targeted known report URLs + search page scraping.
The PC has produced major housing reports that are critical for policy analysis.
"""
import json
import re
import time
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://www.pc.gov.au"

# Known PC housing-related reports and inquiries (authoritative ground truth)
KNOWN_REPORT_PAGES = [
    # Major housing inquiries
    "https://www.pc.gov.au/inquiries/completed/housing-homelessness",
    "https://www.pc.gov.au/inquiries/completed/housing-decisions-older-australians",
    "https://www.pc.gov.au/inquiries/completed/remote-housing-nt",
    "https://www.pc.gov.au/inquiries/completed/rent-assistance",
    # Research papers touching housing
    "https://www.pc.gov.au/research/completed/housing-norms",
    "https://www.pc.gov.au/research/completed/local-government",
    # Annual reports on government services (housing chapter)
    "https://www.pc.gov.au/ongoing/report-on-government-services",
    "https://www.pc.gov.au/ongoing/report-on-government-services/2024",
    "https://www.pc.gov.au/ongoing/report-on-government-services/2023",
    "https://www.pc.gov.au/ongoing/report-on-government-services/2022",
    "https://www.pc.gov.au/ongoing/report-on-government-services/2021",
    "https://www.pc.gov.au/ongoing/report-on-government-services/2020",
    # Productivity review
    "https://www.pc.gov.au/inquiries/completed/productivity-review/report",
]

SEARCH_URLS = [
    "https://www.pc.gov.au/inquiries-and-research/?q=housing&tab=research",
    "https://www.pc.gov.au/inquiries-and-research/?q=housing&tab=inquiries",
    "https://www.pc.gov.au/inquiries-and-research/?q=affordable+housing",
    "https://www.pc.gov.au/inquiries-and-research/?q=social+housing",
    "https://www.pc.gov.au/inquiries-and-research/?q=homelessness",
    "https://www.pc.gov.au/inquiries-and-research/?q=rent+assistance",
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


def scrape_search_page(url, client):
    """Extract report links from PC search/listing pages."""
    r = _get(url, client)
    if not r:
        return []
    soup = BeautifulSoup(r.text, "lxml")
    links = []
    for a in soup.select("main a[href], article a[href], .listing a[href]"):
        href = a.get("href", "")
        if not href:
            continue
        full = urljoin(BASE_URL, href)
        if "pc.gov.au" not in full:
            continue
        if any(w in href for w in ["/inquiries/", "/research/", "/ongoing/"]):
            links.append(full)
    return list(set(links))


def scrape_report_page(url, client):
    """Extract metadata and PDF links from a PC report page."""
    r = _get(url, client)
    if not r:
        return None
    soup = BeautifulSoup(r.text, "lxml")
    meta = {"url": url, "source": "Productivity Commission"}

    h1 = soup.find("h1")
    meta["title"] = h1.get_text(strip=True) if h1 else url.split("/")[-1].replace("-", " ").title()
    meta["year"] = _parse_year(soup.get_text())
    meta["authors"] = "Productivity Commission"
    meta["report_type"] = (
        "Inquiry Report" if "/inquiries/" in url
        else "Research Paper" if "/research/" in url
        else "Ongoing Report"
    )

    for sel in [".intro-text", ".field-intro", "article p", ".summary-text"]:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 80:
            meta["abstract"] = el.get_text(strip=True)[:800]
            break

    # Collect all PDF links on the page
    pdf_urls = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if ".pdf" in href.lower():
            pdf_urls.append(urljoin(BASE_URL, href))

    meta["pdf_url"] = pdf_urls[0] if pdf_urls else None
    meta["all_pdf_urls"] = pdf_urls[:5]
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
    all_urls = set(KNOWN_REPORT_PAGES)

    with httpx.Client(headers=headers) as client:
        print("Searching PC for housing reports...")
        for search_url in SEARCH_URLS:
            found = scrape_search_page(search_url, client)
            all_urls.update(found)
            print(f"  {search_url.split('?')[1]}: {len(found)} links")
            time.sleep(delay)

        new_urls = [u for u in all_urls if u not in existing]
        print(f"\nFetching {len(new_urls)} PC report pages...")

        with open(meta_file, "a") as mf:
            for url in tqdm(new_urls):
                meta = scrape_report_page(url, client)
                if not meta:
                    continue

                # Download primary PDF
                pdf_url = meta.get("pdf_url")
                if pdf_url:
                    safe = re.sub(r"[^\w-]", "_", urlparse(pdf_url).path.strip("/"))[-80:]
                    pdf_path = output_dir / f"pc_{safe}.pdf"
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

    print(f"Productivity Commission done. {len(existing)} reports.")
    return list(existing.values())
