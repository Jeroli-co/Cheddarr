import logging
import logging.handlers
from copy import copy

from server.core import config


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

    def __init__(self, patern: str, colored: bool = True):
        logging.Formatter.__init__(self, patern)
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


def log_setup():
    config.LOGS_FOLDER.mkdir(parents=True, exist_ok=True)

    log_format = "%(asctime)s | %(levelname)s | %(message)s "

    file_handler = logging.handlers.TimedRotatingFileHandler(
        config.LOGS_FOLDER / config.LOGS_FILENAME,
        "midnight",
        1,
        utc=True,
        encoding="utf-8",
        backupCount=config.LOGS_MAX_FILES,
    )
    file_handler.suffix = "%Y-%m-%d.log"
    file_handler.setFormatter(LogFormatter(log_format, colored=False))
    stream_handler = logging.StreamHandler()
    stream_handler.setFormatter(LogFormatter(log_format))

    log = logging.getLogger()
    log.handlers = [file_handler, stream_handler]
    log.setLevel(config.LOG_LEVEL)

    for logger_name in log.root.manager.loggerDict.keys():
        override_logger = logging.getLogger(logger_name)
        for handler in override_logger.handlers:
            handler.setFormatter(LogFormatter(log_format))

    return log


logger = log_setup()
