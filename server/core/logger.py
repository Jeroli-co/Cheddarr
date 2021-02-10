import logging
import logging.handlers
from server.core import settings

LOG_FILENAME = "cheddarr.log"
MAX_FILES = 10


def log_setup():
    formatter = logging.Formatter(
        "%(asctime)s - [%(levelname)s]: %(message)s", "%b %d %H:%M:%S"
    )

    file_handler = logging.handlers.TimedRotatingFileHandler(
        settings.LOGS_FOLDER / LOG_FILENAME,
        "midnight",
        1,
        utc=True,
        encoding="utf-8",
        backupCount=MAX_FILES,
    )
    file_handler.suffix = "%Y-%m-%d.log"
    file_handler.setFormatter(formatter)

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(formatter)

    log = logging.getLogger()
    log.addHandler(file_handler)
    log.addHandler(stream_handler)
    log.setLevel(settings.LOG_LEVEL)

    return log


logger = log_setup()
