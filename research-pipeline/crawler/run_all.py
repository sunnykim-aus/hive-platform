"""
Runs all source crawlers in sequence, writing to a single shared meta_file.
Sources: AHURI, Housing Australia, Treasury, Power Housing, Productivity Commission, AIHW, ABS, DSS
"""
from pathlib import Path
from config import META_FILE, DATA_DIR
from hive_logging import get_logger

from crawler import ahuri, housing_australia, treasury, power_housing
from crawler import productivity_commission, aihw, dss, abs as abs_crawler

logger = get_logger("crawler.run_all")


def crawl_all(max_ahuri=500, delay=1.2):
    DATA_DIR.mkdir(parents=True, exist_ok=True)

    sources = [
        ("AHURI", lambda: ahuri.crawl(
            output_dir=DATA_DIR / "ahuri", meta_file=META_FILE,
            max_reports=max_ahuri, delay=delay)),
        ("Housing Australia", lambda: housing_australia.crawl(
            output_dir=DATA_DIR / "housing_australia", meta_file=META_FILE, delay=delay)),
        ("Treasury Budget Papers", lambda: treasury.crawl(
            output_dir=DATA_DIR / "treasury", meta_file=META_FILE, delay=delay)),
        ("Power Housing Australia", lambda: power_housing.crawl(
            output_dir=DATA_DIR / "power_housing", meta_file=META_FILE, delay=delay)),
        ("Productivity Commission", lambda: productivity_commission.crawl(
            output_dir=DATA_DIR / "pc", meta_file=META_FILE, delay=delay)),
        ("AIHW", lambda: aihw.crawl(
            output_dir=DATA_DIR / "aihw", meta_file=META_FILE, delay=delay)),
        ("ABS", lambda: abs_crawler.crawl(
            output_dir=DATA_DIR / "abs", meta_file=META_FILE, delay=delay)),
        ("DSS", lambda: dss.crawl(
            output_dir=DATA_DIR / "dss", meta_file=META_FILE, delay=delay)),
    ]

    for i, (name, fn) in enumerate(sources, 1):
        print(f"\n{'=' * 60}")
        print(f"SOURCE {i}/{len(sources)}: {name}")
        print("=" * 60)
        try:
            fn()
        except Exception as e:
            logger.error("Crawler source %s failed: %s — continuing with next source", name, e)
            print(f"  [error] {name} failed: {e} — continuing with next source")

    total = len(META_FILE.read_text().splitlines()) if META_FILE.exists() else 0
    print(f"\n{'=' * 60}")
    print(f"ALL SOURCES DONE. Total reports in metadata: {total}")
    print(f"{'=' * 60}")


if __name__ == "__main__":
    crawl_all()
