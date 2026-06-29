"""
Crawls DSS (Department of Social Services) housing publications.
DSS administers housing assistance policy, NAHA, homelessness strategy,
National Housing and Homelessness Agreement (NHHA), and Indigenous housing.
"""
import json
import re
import time
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://www.dss.gov.au"

LISTING_URLS = [
    "https://www.dss.gov.au/housing",
    "https://www.dss.gov.au/our-responsibilities/housing-support",
    "https://www.dss.gov.au/our-responsibilities/housing-support/publications",
    "https://www.dss.gov.au/our-responsibilities/housing-support/programs-services",
    "https://www.dss.gov.au/housing-support/publications",
]

KNOWN_PAGES = [
    "https://www.dss.gov.au/our-responsibilities/housing-support/national-housing-and-homelessness-agreement",
    "https://www.dss.gov.au/our-responsibilities/housing-support/key-documents",
    "https://www.dss.gov.au/sites/default/files/documents/06_2021/national-housing-and-homelessness-agreement.pdf",
    "https://www.dss.gov.au/sites/default/files/documents/09_2019/aus-homelessness-strategy-2018-2023.pdf",
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


def _infer_title(url):
    path = urlparse(url).path
    name = path.split("/")[-1].replace("-", " ").replace("_", " ")
    return re.sub(r"\.pdf$", "", name, flags=re.IGNORECASE).title()[:120]


def scrape_listing(url, client):
    """Extract housing-related report links from DSS pages."""
    r = _get(url, client)
    if not r:
        return []
    soup = BeautifulSoup(r.text, "lxml")
    links = []
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        full = urljoin(BASE_URL, href)
        is_dss = "dss.gov.au" in full
        is_pdf = ".pdf" in href.lower()
        is_relevant = any(w in href.lower() or w in a.get_text("", strip=True).lower() for w in [
            "housing", "homelessness", "rental", "affordable", "social-housing",
            "shelter", "accommodation", "nhha", "naha", "community-housing"
        ])
        if is_dss and (is_pdf or is_relevant):
            links.append({"url": full, "title": a.get_text(strip=True), "is_pdf": is_pdf})
    return links


def scrape_report_page(url, client):
    r = _get(url, client)
    if not r:
        return None
    soup = BeautifulSoup(r.text, "lxml")
    meta = {"url": url, "source": "DSS"}

    h1 = soup.find("h1")
    meta["title"] = h1.get_text(strip=True) if h1 else _infer_title(url)
    meta["year"] = _parse_year(soup.get_text())
    meta["authors"] = "Department of Social Services"
    meta["report_type"] = "Government Policy Document"

    for sel in [".field--name-body", "article p", ".intro", ".content-block"]:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 80:
            meta["abstract"] = el.get_text(strip=True)[:800]
            break

    pdf_url = None
    for a in soup.select("a[href]"):
        if ".pdf" in a.get("href", "").lower():
            pdf_url = urljoin(BASE_URL, a["href"])
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
    all_report_items = list({"url": u, "title": "", "is_pdf": u.endswith(".pdf")} for u in KNOWN_PAGES)

    with httpx.Client(headers=headers) as client:
        print("Scanning DSS housing pages...")
        for listing_url in LISTING_URLS:
            found = scrape_listing(listing_url, client)
            all_report_items.extend(found)
            print(f"  {listing_url.split('/')[-1]}: {len(found)} links")
            time.sleep(delay)

        # Deduplicate
        seen = set()
        unique = []
        for item in all_report_items:
            if item["url"] not in seen and item["url"] not in existing:
                seen.add(item["url"])
                unique.append(item)

        print(f"\nFetching {len(unique)} new DSS pages/PDFs...")

        with open(meta_file, "a") as mf:
            for item in tqdm(unique):
                url = item["url"]
                if item.get("is_pdf"):
                    meta = {
                        "url": url, "source": "DSS",
                        "title": item.get("title") or _infer_title(url),
                        "year": _parse_year(url),
                        "authors": "Department of Social Services",
                        "report_type": "Government Policy Document",
                        "pdf_url": url,
                    }
                else:
                    meta = scrape_report_page(url, client)
                    if not meta:
                        continue

                pdf_url = meta.get("pdf_url")
                if pdf_url:
                    safe = re.sub(r"[^\w-]", "_", urlparse(pdf_url).path.strip("/"))[-80:]
                    pdf_path = output_dir / f"dss_{safe}.pdf"
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

    print(f"DSS done. {len(existing)} items.")
    return list(existing.values())
