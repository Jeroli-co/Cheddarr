import logging
import logging.handlers
from copy import copy

from server.core import config

LOGGING_CONFIG = {
    "version": 1,
    "disable_existing_loggers": False,
    "formatters": {
        "console": {
            "()": "server.core.logger.LogFormatter",
            "fmt": "%(asctime)s | %(levelname)s | [%(process)d] - %(message)s ",
            "colored": True,
        },
        "file": {
            "()": "server.core.logger.LogFormatter",
            "fmt": "%(asctime)s | %(levelname)s | [%(process)d] - %(message)s ",
            "colored": False,
        },
    },
    "handlers": {
        "console": {
            "formatter": "console",
            "class": "logging.StreamHandler",
        },
        "file": {
            "formatter": "file",
            "class": "logging.handlers.TimedRotatingFileHandler",
            "filename": config.logs_folder / config.logs_filename,
            "when": "midnight",
            "interval": 1,
            "utc": True,
            "encoding": "utf-8",
            "backupCount": config.logs_max_files,
        },
    },
    "loggers": {
        "gunicorn.error": {
            "handlers": ["console", "file"],
            "level": config.log_level,
        },
    },
    "root": {
        "handlers": ["console", "file"],
        "level": config.log_level,
    },
}


class LogFormatter(logging.Formatter):
    MAPPING = {
        "DEBUG": 37,  # white
        "INFO": 32,  # cyan
        "WARNING": 33,  # yellow
        "ERROR": 31,  # red
        "CRITICAL": 41,  # white on red bg
    }

    PREFIX = "\033["
    SUFFIX = "\033[0m"

    def __init__(self, fmt: str, colored: bool = True):
        logging.Formatter.__init__(self, fmt)
        self.colored = colored

    def format(self, record):
        record_ = copy(record)
        if self.colored:
            levelname = record_.levelname
            seq = self.MAPPING.get(levelname, 37)  # default white
            colored_levelname = ("{0}{1}m{2}{3}").format(self.PREFIX, seq, levelname, self.SUFFIX)
            record_.levelname = colored_levelname

        formatted_record = logging.Formatter.format(self, record_)
        if not self.colored and record.exc_info:
            formatted_record = formatted_record.replace("\n", "")
        return formatted_record


