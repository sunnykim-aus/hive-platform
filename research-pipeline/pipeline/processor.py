"""
Extracts text from PDFs, cleans it, and splits into overlapping chunks.
Each chunk carries full metadata so it can be retrieved and cited independently.
"""
import re
import json
from pathlib import Path
from typing import Iterator
import pdfplumber


def _clean(text: str) -> str:
    text = re.sub(r"\n{3,}", "\n\n", text)
    text = re.sub(r"[ \t]+", " ", text)
    text = re.sub(r"\f", "\n\n", text)  # form feeds
    # Remove page headers/footers (short lines repeated frequently)
    lines = text.split("\n")
    cleaned = []
    for line in lines:
        stripped = line.strip()
        if len(stripped) < 4:  # skip near-empty lines
            continue
        cleaned.append(stripped)
    return "\n".join(cleaned)


def _word_chunks(text: str, chunk_words: int, overlap_words: int) -> list[str]:
    words = text.split()
    if not words:
        return []
    chunks = []
    start = 0
    while start < len(words):
        end = min(start + chunk_words, len(words))
        chunk = " ".join(words[start:end])
        chunks.append(chunk)
        if end == len(words):
            break
        start += chunk_words - overlap_words
    return chunks


def extract_pdf_text(pdf_path: Path) -> str:
    """Extract full text from a PDF using pdfplumber."""
    pages = []
    try:
        with pdfplumber.open(pdf_path) as pdf:
            for page in pdf.pages:
                text = page.extract_text(x_tolerance=3, y_tolerance=3)
                if text:
                    pages.append(text)
    except Exception as e:
        print(f"  [warn] PDF extraction failed for {pdf_path.name}: {e}")
        return ""
    return "\n\n".join(pages)


def extract_txt_text(txt_path: Path) -> str:
    try:
        return txt_path.read_text(encoding="utf-8", errors="ignore")
    except Exception:
        return ""


def process_report(meta: dict, chunk_words: int = 400, overlap_words: int = 60) -> list[dict]:
    """
    Given a report metadata dict (with pdf_path), return a list of chunk dicts
    ready for embedding.
    """
    pdf_path = meta.get("pdf_path")
    txt_path = meta.get("txt_path")

    if pdf_path and Path(pdf_path).exists():
        raw_text = extract_pdf_text(Path(pdf_path))
    elif txt_path and Path(txt_path).exists():
        raw_text = extract_txt_text(Path(txt_path))
    else:
        return []
    if not raw_text or len(raw_text.strip()) < 200:
        return []

    cleaned = _clean(raw_text)
    text_chunks = _word_chunks(cleaned, chunk_words, overlap_words)

    chunks = []
    for i, chunk_text in enumerate(text_chunks):
        chunks.append({
            "chunk_id": f"{meta['url']}::chunk_{i}",
            "text": chunk_text,
            "source_url": meta.get("url", ""),
            "title": meta.get("title", ""),
            "year": meta.get("year"),
            "authors": meta.get("authors", ""),
            "report_type": meta.get("report_type", ""),
            "source_agency": meta.get("source", "AHURI"),
            "abstract": meta.get("abstract", ""),
            "chunk_index": i,
            "total_chunks": len(text_chunks),
        })
    return chunks


def process_all(meta_file: Path, chunk_words: int = 400, overlap_words: int = 60) -> Iterator[list[dict]]:
    """
    Generator that yields chunk lists for each report in meta_file.
    Use this to feed the embedding pipeline incrementally.
    """
    if not meta_file.exists():
        print(f"No metadata file at {meta_file}. Run the crawler first.")
        return

    for line in meta_file.read_text().splitlines():
        try:
            meta = json.loads(line)
        except Exception:
            continue
        chunks = process_report(meta, chunk_words, overlap_words)
        if chunks:
            yield chunks
