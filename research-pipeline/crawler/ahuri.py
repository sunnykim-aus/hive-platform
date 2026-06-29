"""
Crawls AHURI (Australian Housing and Urban Research Institute) research publications.
Downloads PDFs and extracts metadata from report listing and detail pages.
"""
import json
import time
import re
import httpx
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://www.ahuri.edu.au"
LIBRARY_URL = "https://www.ahuri.edu.au/research/research-library"


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


def scrape_listing_page(page_num, client):
    """Extract report links and metadata from one page of the research library."""
    url = LIBRARY_URL + (f"?page={page_num}" if page_num > 0 else "")
    r = _get(url, client)
    if not r:
        return [], False

    soup = BeautifulSoup(r.text, "lxml")
    reports = []

    for row in soup.select("div.views-row"):
        a = row.select_one("h3 a")
        if not a:
            continue
        href = a.get("href", "")
        if not href:
            continue
        full_url = urljoin(BASE_URL, href)

        title = a.get_text(strip=True)
        date_el = row.select_one(".search-library-item-date")
        year = _parse_year(date_el.get_text() if date_el else "")
        author_el = row.select_one(".search-library-item-author")
        authors = author_el.get_text(strip=True) if author_el else ""
        cat_el = row.select_one(".search-library-item-category")
        report_type = cat_el.get_text(strip=True) if cat_el else "Research Publication"

        reports.append({
            "url": full_url,
            "title": title,
            "year": year,
            "authors": authors,
            "report_type": report_type,
        })

    # Check if there's a next page
    has_next = bool(soup.select_one("li.pager__item--next"))
    return reports, has_next


def scrape_report_detail(url, client):
    """Extract PDF link and abstract from an individual report page."""
    r = _get(url, client)
    if not r:
        return None

    soup = BeautifulSoup(r.text, "lxml")
    meta = {"url": url, "source": "AHURI"}

    h1 = soup.find("h1")
    meta["title"] = h1.get_text(strip=True) if h1 else ""

    # Abstract / body text
    for sel in [".field--name-body", ".field--name-field-summary", "article .field", ".abstract"]:
        el = soup.select_one(sel)
        if el and len(el.get_text(strip=True)) > 80:
            meta["abstract"] = el.get_text(strip=True)[:1000]
            break

    # PDF link — AHURI typically has a direct download button
    pdf_url = None
    for a in soup.select("a[href]"):
        href = a.get("href", "")
        if ".pdf" in href.lower():
            pdf_url = urljoin(BASE_URL, href)
            break

    # Also check for links with download-related text
    if not pdf_url:
        for a in soup.select("a"):
            text = a.get_text(strip=True).lower()
            href = a.get("href", "")
            if href and any(w in text for w in ["download", "full report", "pdf"]):
                pdf_url = urljoin(BASE_URL, href)
                break

    meta["pdf_url"] = pdf_url
    return meta


def download_pdf(pdf_url, dest_path, client):
    if dest_path.exists():
        return True
    r = _get(pdf_url, client)
    if not r:
        return False
    content_type = r.headers.get("content-type", "").lower()
    if "pdf" not in content_type and not pdf_url.lower().endswith(".pdf"):
        return False
    dest_path.write_bytes(r.content)
    return True


def crawl(output_dir, meta_file, max_reports=500, delay=1.0):
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

    headers = {
        "User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) "
                      "AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36"
    }

    all_listings = []
    with httpx.Client(headers=headers) as client:
        print("Scanning AHURI research library...")
        page = 0
        while len(all_listings) < max_reports:
            found, has_next = scrape_listing_page(page, client)
            if not found:
                break
            all_listings.extend(found)
            print(f"  Page {page}: {len(found)} reports (total so far: {len(all_listings)})")
            if not has_next:
                break
            page += 1
            time.sleep(delay)

        # Deduplicate
        seen = set()
        unique = []
        for r in all_listings:
            if r["url"] not in seen and r["url"] not in existing:
                seen.add(r["url"])
                unique.append(r)

        print(f"\nFound {len(unique)} new reports to fetch details for...")

        with open(meta_file, "a") as mf:
            for listing in tqdm(unique[:max_reports]):
                detail = scrape_report_detail(listing["url"], client)
                if not detail:
                    continue

                # Merge listing metadata into detail
                for key in ["title", "year", "authors", "report_type"]:
                    if not detail.get(key) and listing.get(key):
                        detail[key] = listing[key]

                # Determine report type from URL if not set
                if not detail.get("report_type") or detail["report_type"] == "Research Publication":
                    if "final-report" in listing["url"]:
                        detail["report_type"] = "Final Report"
                    elif "policy-bulletin" in listing["url"]:
                        detail["report_type"] = "Policy Bulletin"
                    elif "research-brief" in listing["url"]:
                        detail["report_type"] = "Research Brief"

                # Download PDF
                if detail.get("pdf_url"):
                    safe = re.sub(r"[^\w-]", "_", urlparse(detail["pdf_url"]).path.strip("/"))[-80:]
                    pdf_path = output_dir / f"{safe}.pdf"
                    ok = download_pdf(detail["pdf_url"], pdf_path, client)
                    detail["pdf_path"] = str(pdf_path) if ok else None
                else:
                    detail["pdf_path"] = None

                mf.write(json.dumps(detail) + "\n")
                mf.flush()
                existing[detail["url"]] = detail
                time.sleep(delay)

    downloaded = sum(1 for r in existing.values() if r.get("pdf_path"))
    print(f"\nDone. {len(existing)} reports in metadata. {downloaded} PDFs downloaded.")
    return list(existing.values())
