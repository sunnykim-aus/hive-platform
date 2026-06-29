"""
Power Housing Australia — community housing sector peak body.
Their site has an SSL configuration issue that blocks automated crawling.
This crawler uses a workaround (disabled verification) and targets their
known publications. If SSL still fails, it logs a clear message with
manual download instructions.
"""
import json
import re
import time
import httpx
import ssl
from pathlib import Path
from bs4 import BeautifulSoup
from urllib.parse import urljoin, urlparse
from tqdm import tqdm

BASE_URL = "https://powerhousing.com.au"

LISTING_URLS = [
    "https://powerhousing.com.au/resources/",
    "https://powerhousing.com.au/publications/",
    "https://powerhousing.com.au/research/",
    "https://powerhousing.com.au/reports/",
    "https://powerhousing.com.au/advocacy/",
]

MANUAL_INSTRUCTIONS = """
Power Housing Australia's website has an SSL configuration that blocks automated downloads.
To add their reports manually:

1. Visit https://powerhousing.com.au/resources/
2. Download PDFs of their State of the Sector reports and advocacy papers
3. Place them in: data/power_housing/
4. Run: python add_manual_pdfs.py data/power_housing/
"""


def _get_with_ssl_fallback(url, retries=3):
    """Try with normal SSL, then with verification disabled."""
    headers = {"User-Agent": "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36"}
    for verify in [True, False]:
        for attempt in range(retries):
            try:
                r = httpx.get(url, headers=headers, timeout=30,
                              follow_redirects=True, verify=verify)
                r.raise_for_status()
                return r
            except ssl.SSLError:
                break  # SSL error — try without verification
            except Exception as e:
                if attempt == retries - 1:
                    continue
                time.sleep(2 ** attempt)
    return None


def _parse_year(text):
    m = re.search(r"\b(200[0-9]|20[12]\d)\b", str(text))
    return int(m.group()) if m else None


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

    pdf_urls = []

    print("Attempting Power Housing Australia crawl...")
    for listing_url in LISTING_URLS:
        r = _get_with_ssl_fallback(listing_url)
        if not r:
            continue
        soup = BeautifulSoup(r.text, "lxml")
        for a in soup.select("a[href]"):
            href = a.get("href", "")
            full = urljoin(BASE_URL, href)
            if ".pdf" in href.lower() or any(w in href.lower() for w in
                                              ["resource", "publication", "report", "research"]):
                pdf_urls.append((full, a.get_text(strip=True)))
        print(f"  {listing_url}: {len(pdf_urls)} links found")
        time.sleep(delay)

    if not pdf_urls:
        print("\n[Warning] Could not reach Power Housing Australia website due to SSL error.")
        print(MANUAL_INSTRUCTIONS)
        # Check for any manually placed PDFs
        manual_pdfs = list(output_dir.glob("*.pdf"))
        if manual_pdfs:
            print(f"Found {len(manual_pdfs)} manually placed PDFs — indexing them.")
            with open(meta_file, "a") as mf:
                for pdf_path in manual_pdfs:
                    url_key = f"manual://power_housing/{pdf_path.name}"
                    if url_key in existing:
                        continue
                    meta = {
                        "url": url_key,
                        "source": "Power Housing Australia",
                        "title": pdf_path.stem.replace("-", " ").replace("_", " ").title(),
                        "year": _parse_year(pdf_path.name),
                        "authors": "Power Housing Australia",
                        "report_type": "Sector Report",
                        "pdf_url": url_key,
                        "pdf_path": str(pdf_path),
                    }
                    mf.write(json.dumps(meta) + "\n")
                    mf.flush()
                    existing[url_key] = meta
        return list(existing.values())

    # Download found PDFs
    with open(meta_file, "a") as mf:
        for url, title in tqdm(pdf_urls):
            if url in existing or ".pdf" not in url.lower():
                continue
            r = _get_with_ssl_fallback(url)
            if not r:
                continue
            safe = re.sub(r"[^\w-]", "_", urlparse(url).path.strip("/"))[-80:]
            pdf_path = output_dir / f"ph_{safe}.pdf"
            if not pdf_path.exists():
                pdf_path.write_bytes(r.content)
            meta = {
                "url": url,
                "source": "Power Housing Australia",
                "title": title or pdf_path.stem.replace("-", " ").title(),
                "year": _parse_year(url) or _parse_year(title),
                "authors": "Power Housing Australia",
                "report_type": "Sector Report",
                "pdf_url": url,
                "pdf_path": str(pdf_path),
            }
            mf.write(json.dumps(meta) + "\n")
            mf.flush()
            existing[url] = meta
            time.sleep(delay)

    print(f"Power Housing done. {len(existing)} reports.")
    return list(existing.values())
