"""
Crawls Housing Australia (formerly NHFIC) publications.
Uses hub pages to find direct PDF links — the site is partly JS-rendered
so we target known static listing pages and follow PDF hrefs directly.
"""
import json
import re
import time
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://www.housingaustralia.gov.au"

# Known hub pages that contain direct PDF/report links
HUB_PAGES = [
    "/reports-and-publications",
    "/trends-and-insights-reports",
    "/research-data-analytics",
    "/annual-report-2024-25",
    "/annual-report-2023-24",
    "/annual-report-2022-23",
    "/annual-report-2021-22",
    "/social-bond-report-2024-25",
    "/social-bond-report-2023-24",
    "/social-bond-report-2022-23",
]

# Known direct report pages (NHFIC era + Housing Australia)
KNOWN_REPORTS = [
    "https://www.housingaustralia.gov.au/research-data-analytics/hgs-trends-and-insights-report-2024-25",
    "https://www.housingaustralia.gov.au/sites/default/files/2024-09/housing_australia_home_guarantee_scheme_trends_and_insights_report_2023-24.pdf",
    "https://www.housingaustralia.gov.au/sites/default/files/2023-10/hgs_trends_and_insights_report_2022-23.pdf",
    "https://www.housingaustralia.gov.au/sites/default/files/2022-10/nhfic-first-home-loan-deposit-scheme-fhlds-new-home-guarantee-nhg-trends-insights-report-202021.pdf",
    "https://www.housingaustralia.gov.au/sites/default/files/2022-10/20200826-nhfic-fhlds-research-report_0.pdf",
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
    m = re.search(r"\b(200[5-9]|20[12]\d)\b", str(text))
    return int(m.group()) if m else None


def _infer_title_from_url(url):
    path = urlparse(url).path
    name = path.split("/")[-1].replace("-", " ").replace("_", " ")
    name = re.sub(r"\.pdf$", "", name, flags=re.IGNORECASE)
    return name.title()[:120]


def harvest_hub_page(url, client):
    """Extract all report/PDF links from a hub page."""
    r = _get(url, client)
    if not r:
        return []
    soup = BeautifulSoup(r.text, "lxml")
    found = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        full = urljoin(BASE_URL, href)
        if not full.startswith("https://www.housingaustralia.gov.au"):
            continue
        text = a.get_text(strip=True)
        is_pdf = ".pdf" in href.lower()
        is_report_page = any(w in href.lower() for w in [
            "report", "annual", "bond", "trends", "insight", "research", "data"
        ]) and not any(w in href.lower() for w in ["contact", "about", "career", "news"])
        if is_pdf or is_report_page:
            found.append({"url": full, "title": text, "is_pdf": is_pdf})
    return found


def scrape_report_page(url, client):
    """Get metadata and PDF link from a report detail page."""
    r = _get(url, client)
    if not r:
        return None
    soup = BeautifulSoup(r.text, "lxml")
    meta = {"url": url, "source": "Housing Australia"}

    h1 = soup.find("h1")
    meta["title"] = h1.get_text(strip=True) if h1 else _infer_title_from_url(url)
    meta["year"] = _parse_year(soup.get_text())
    meta["report_type"] = "Annual Report" if "annual-report" in url else "Research Report"
    meta["authors"] = "Housing Australia"

    # Abstract
    for sel in [".field--name-body", "article p", ".intro", ".summary"]:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 80:
            meta["abstract"] = el.get_text(strip=True)[:800]
            break

    # PDF link
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
    all_urls = set(KNOWN_REPORTS)

    with httpx.Client(headers=headers) as client:
        print("Scanning Housing Australia hub pages...")
        for path in HUB_PAGES:
            found = harvest_hub_page(urljoin(BASE_URL, path), client)
            for item in found:
                all_urls.add(item["url"])
            print(f"  {path}: {len(found)} links")
            time.sleep(delay)

        new_urls = [u for u in all_urls if u not in existing]
        print(f"\nFetching {len(new_urls)} new report pages/PDFs...")

        with open(meta_file, "a") as mf:
            for url in tqdm(new_urls):
                if url.lower().endswith(".pdf"):
                    # Direct PDF — synthesise metadata
                    meta = {
                        "url": url,
                        "source": "Housing Australia",
                        "title": _infer_title_from_url(url),
                        "year": _parse_year(url),
                        "authors": "Housing Australia",
                        "report_type": "Research Report",
                        "pdf_url": url,
                    }
                else:
                    meta = scrape_report_page(url, client)
                    if not meta:
                        continue

                # Download PDF
                pdf_url = meta.get("pdf_url")
                if pdf_url:
                    safe = re.sub(r"[^\w-]", "_", urlparse(pdf_url).path.strip("/"))[-80:]
                    pdf_path = output_dir / f"{safe}.pdf"
                    if not pdf_path.exists():
                        r = _get(pdf_url, client)
                        if r and "pdf" in r.headers.get("content-type", "").lower():
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

    print(f"Housing Australia done. {len(existing)} reports.")
    return list(existing.values())
