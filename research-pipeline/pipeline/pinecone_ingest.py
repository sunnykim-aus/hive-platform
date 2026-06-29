"""
HIVE — Pinecone Ingestion Pipeline
Crawls research sources, processes new PDFs, upserts to Pinecone.
Skips anything already indexed (safe to re-run anytime).

Run manually:  python -m pipeline.pinecone_ingest
Run via CI:    triggered by GitHub Actions monthly workflow
"""
import os
import json
import time
import hashlib
import logging
from pathlib import Path
from datetime import date
from typing import Iterator

from dotenv import load_dotenv
load_dotenv()

from pinecone import Pinecone
from pipeline.processor import process_report
from config import META_FILE, SOURCE_DIRS, CHUNK_WORDS, CHUNK_OVERLAP_WORDS

logging.basicConfig(level=logging.INFO, format="%(asctime)s %(message)s")
log = logging.getLogger(__name__)

INDEX_NAME  = os.environ.get("PINECONE_INDEX", "hive-research")
NAMESPACE   = os.environ.get("PINECONE_NAMESPACE", "research")
BATCH_SIZE  = 90


# ── Pinecone helpers ──────────────────────────────────────────────────────────

def get_index():
    pc = Pinecone(api_key=os.environ["PINECONE_API_KEY"])
    return pc.Index(INDEX_NAME)


def get_indexed_ids(index) -> set[str]:
    """Fetch all chunk IDs already in Pinecone (by listing namespaces + stats)."""
    try:
        stats = index.describe_index_stats()
        ns = stats.get("namespaces", {}).get(NAMESPACE, {})
        count = ns.get("vector_count", 0)
        log.info(f"Pinecone currently has {count} chunks in namespace '{NAMESPACE}'")
    except Exception as e:
        log.warning(f"Could not fetch index stats: {e}")

    # We rely on chunk_id determinism (hash of url+chunk_index) to skip dupes
    # Pinecone free tier doesn't support list-all-ids, so we track locally
    ledger_path = Path("data/indexed_ids.json")
    if ledger_path.exists():
        return set(json.loads(ledger_path.read_text()))
    return set()


def save_indexed_ids(ids: set[str]):
    ledger_path = Path("data/indexed_ids.json")
    ledger_path.parent.mkdir(parents=True, exist_ok=True)
    ledger_path.write_text(json.dumps(list(ids)))


def upsert_batch(index, records: list[dict]):
    """Upsert a batch to Pinecone with retry on rate limit."""
    for attempt in range(5):
        try:
            index.upsert_records(records=records, namespace=NAMESPACE)
            return True
        except Exception as e:
            if "429" in str(e) or "RESOURCE_EXHAUSTED" in str(e):
                wait = 15 * (attempt + 1)
                log.warning(f"Rate limited — waiting {wait}s (attempt {attempt+1}/5)")
                time.sleep(wait)
            else:
                log.error(f"Upsert error: {e}")
                return False
    return False


# ── Main ingestion ────────────────────────────────────────────────────────────

def run(meta_file: Path = META_FILE) -> dict:
    """
    Main entry point. Returns a summary dict for the digest email.
    """
    if not meta_file.exists():
        log.error(f"Meta file not found: {meta_file}")
        return {"new_chunks": 0, "new_reports": 0, "errors": 0}

    index        = get_index()
    indexed_ids  = get_indexed_ids(index)
    log.info(f"Local ledger has {len(indexed_ids)} previously indexed chunk IDs")

    # reports_meta.json is JSONL (one report object per line)
    reports = [json.loads(line) for line in meta_file.read_text().splitlines() if line.strip()]
    log.info(f"Found {len(reports)} reports in metadata")

    batch        = []
    new_chunks   = 0
    new_reports  = set()
    errors       = 0
    total_migrated = 0

    for report in reports:
        report_chunks   = list(process_report(report, CHUNK_WORDS, CHUNK_OVERLAP_WORDS))
        new_in_report   = 0

        for chunk in report_chunks:
            chunk_id = chunk["chunk_id"]
            if chunk_id in indexed_ids:
                continue  # already in Pinecone — skip

            # process_report already maps meta fields (url->source_url, source->
            # source_agency, etc.) onto each chunk, so read from the chunk.
            record = {
                "_id":          chunk_id,
                "text":         chunk["text"],
                "title":        chunk.get("title", ""),
                "source_url":   chunk.get("source_url", ""),
                "source_agency":chunk.get("source_agency", ""),
                "authors":      chunk.get("authors", ""),
                "year":         str(chunk.get("year") or ""),
                "report_type":  chunk.get("report_type", ""),
                "chunk_index":  str(chunk.get("chunk_index", "0")),
            }
            batch.append(record)
            new_in_report += 1

            if len(batch) >= BATCH_SIZE:
                success = upsert_batch(index, batch)
                if success:
                    for r in batch:
                        indexed_ids.add(r["_id"])
                    total_migrated += len(batch)
                    log.info(f"  ✅ Upserted {total_migrated} new chunks so far")
                else:
                    errors += len(batch)
                batch = []
                time.sleep(1.5)

        if new_in_report > 0:
            new_reports.add(report.get("title", "Unknown"))
            new_chunks += new_in_report

    # Flush remaining batch
    if batch:
        success = upsert_batch(index, batch)
        if success:
            for r in batch:
                indexed_ids.add(r["_id"])
            total_migrated += len(batch)
        else:
            errors += len(batch)

    # Save updated ledger
    save_indexed_ids(indexed_ids)

    summary = {
        "date":        date.today().isoformat(),
        "new_chunks":  new_chunks,
        "new_reports": len(new_reports),
        "report_titles": list(new_reports)[:20],  # cap at 20 for email
        "errors":      errors,
    }

    log.info(f"\n{'='*50}")
    log.info(f"Ingestion complete — {new_chunks} new chunks from {len(new_reports)} new reports")
    if errors:
        log.warning(f"{errors} chunks failed to upsert")

    return summary


if __name__ == "__main__":
    summary = run()
    print(json.dumps(summary, indent=2))
