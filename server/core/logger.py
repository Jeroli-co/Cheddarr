import logging
import logging.handlers
from copy import copy

from server.core import config

LOG_FILENAME = "cheddarr.log"
MAX_FILES = 10


class ColoredFormatter(logging.Formatter):
    MAPPING = {
        "DEBUG": 37,  # white
        "INFO": 32,  # cyan
        "WARNING": 33,  # yellow
        "ERROR": 31,  # red
        "CRITICAL": 41,  # white on red bg
    }

    PREFIX = "\033["
    SUFFIX = "\033[0m"

    def __init__(
        self,
        patern,
    ):
        logging.Formatter.__init__(self, patern)

    def format(self, record):
        colored_record = copy(record)
        levelname = colored_record.levelname
        seq = self.MAPPING.get(levelname, 37)  # default white
        colored_levelname = ("{0}{1}m{2}{3}").format(self.PREFIX, seq, levelname, self.SUFFIX)
        colored_record.levelname = colored_levelname
        return logging.Formatter.format(self, colored_record)


def log_setup():
    config.LOGS_FOLDER.mkdir(parents=True, exist_ok=True)

    file_handler = logging.handlers.TimedRotatingFileHandler(
        config.LOGS_FOLDER / LOG_FILENAME,
        "midnight",
        1,
        utc=True,
        encoding="utf-8",
        backupCount=MAX_FILES,
    )
    log_format = "%(asctime)s - %(levelname)s - %(message)s"
    file_handler.suffix = "%Y-%m-%d.log"
    file_handler.setFormatter(logging.Formatter(log_format))

    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(ColoredFormatter(log_format))

    log = logging.getLogger()
    log.addHandler(file_handler)
    log.addHandler(stream_handler)
    log.setLevel(config.LOG_LEVEL)

    return log


logger = log_setup()
