# Research Pipeline — keeping the evidence base current

Automates growth of the HIVE research evidence base: the Pinecone **`hive-research`**
index (namespace `research`) that the live SaaS search (`/api/search`,
`/api/policy-impact`) reads from. Lives in `research-pipeline/`.

## What it does

```
GitHub Action (monthly / manual)
  → crawler.run_all   : crawl 9 sources, download NEW report PDFs, append to data/reports_meta.json
  → pipeline.pinecone_ingest : chunk new PDFs → upsert new chunks to Pinecone (Pinecone embeds)
  → commit reports_meta.json + indexed_ids.json (incremental state)
```

Sources crawled: AHURI, Housing Australia, Treasury, Power Housing, Productivity
Commission, AIHW, ABS, DSS.

## Why it's safe to run against the live index

- **Deterministic chunk ids** — `{report_url}::chunk_{i}`. The live index was
  originally populated (via the one-time `migrate_to_pinecone.py`) with these
  same ids, so re-processing a report **overwrites in place — never duplicates**.
- **Incremental on both ends** — crawlers skip URLs already in
  `reports_meta.json`; the ingest skips chunk ids already in the
  `data/indexed_ids.json` ledger. A re-run with no new reports upserts nothing.
- **Pinecone does the embedding** (`llama-text-embed-v2`, integrated) — no heavy
  local ChromaDB/sentence-transformers needed, so it runs in CI.

Validated on a throwaway `hive-research-test` index (June 2026): 2 reports → 286
chunks; re-run added **0** and vector count held → idempotent confirmed.

## Run it

- **Automatically:** `.github/workflows/research-refresh.yml` — 15th monthly, or
  "Run workflow" in the Actions tab. Requires repo secret **`PINECONE_API_KEY`**.
- **Manually (local):**
  ```bash
  cd research-pipeline
  python3 -m venv .venv && .venv/bin/pip install -r requirements.txt
  export PINECONE_API_KEY=...            # the rotated key
  export PINECONE_INDEX=hive-research-test  # test first! omit to hit live
  .venv/bin/python -m crawler.run_all
  .venv/bin/python -m pipeline.pinecone_ingest
  ```
  Target index/namespace are env-overridable (`PINECONE_INDEX`,
  `PINECONE_NAMESPACE`); default to live `hive-research` / `research`.

## Files

- `crawler/` — 9 source crawlers + `run_all.py` (incremental: skips known URLs).
- `pipeline/processor.py` — PDF → cleaned word-chunks (400 words, 60 overlap).
- `pipeline/pinecone_ingest.py` — chunk → upsert to Pinecone, with local ledger.
- `config.py` — paths + chunking constants.
- `data/reports_meta.json` — JSONL, one report per line (committed, the seed/state).
- `data/indexed_ids.json` — ledger of upserted chunk ids (committed, grows each run).
- PDFs (`data/<source>/`) are **gitignored** — re-downloaded each run, ephemeral.

## Notes / gotchas

- `reports_meta.json` is **JSONL** (not a JSON array) — load line-by-line.
- The original code lives (frozen) in `fable5-final-rebuild/hive-final/intelligence/`;
  this is a slimmed, bug-fixed port (JSONL loader + chunk-field mapping fixed).
- The full Streamlit research app + ChromaDB path is **not** included here — only
  the crawl→Pinecone refresh, which is all the live SaaS needs.
