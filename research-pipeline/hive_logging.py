"""
HIVE Intelligence — shared logging.

Stdlib-only logging helper used across the app, search, digest and crawler
modules. Logs to stderr by default; set HIVE_LOG_FILE to also write to a file,
and HIVE_LOG_LEVEL (DEBUG/INFO/WARNING/ERROR) to change verbosity.

Usage:
    from hive_logging import get_logger
    logger = get_logger(__name__)
    logger.warning("Claude insight call failed: %s", exc)
"""
import logging
import os
import sys

_FORMAT = "%(asctime)s %(levelname)-7s [%(name)s] %(message)s"
_DATEFMT = "%Y-%m-%d %H:%M:%S"
_configured = False


def _configure_root() -> None:
    """Attach console (and optional file) handlers to the 'hive' root logger once."""
    global _configured
    if _configured:
        return

    root = logging.getLogger("hive")
    level_name = os.environ.get("HIVE_LOG_LEVEL", "INFO").upper()
    root.setLevel(getattr(logging, level_name, logging.INFO))

    formatter = logging.Formatter(_FORMAT, datefmt=_DATEFMT)

    console = logging.StreamHandler(sys.stderr)
    console.setFormatter(formatter)
    root.addHandler(console)

    log_file = os.environ.get("HIVE_LOG_FILE")
    if log_file:
        try:
            file_handler = logging.FileHandler(log_file)
            file_handler.setFormatter(formatter)
            root.addHandler(file_handler)
        except OSError as exc:  # unwritable path — keep console logging
            root.warning("Could not open HIVE_LOG_FILE %r: %s", log_file, exc)

    root.propagate = False
    _configured = True


def get_logger(name: str = "hive") -> logging.Logger:
    """Return a logger namespaced under 'hive' (e.g. hive.crawler.ahuri)."""
    _configure_root()
    if name == "hive" or name.startswith("hive."):
        full = name
    else:
        full = f"hive.{name}"
    return logging.getLogger(full)
