import logging
import logging.config
import logging.handlers
import sys
from pathlib import Path

from loguru import logger


class InterceptHandler(logging.Handler):
    loglevel_mapping = {
        50: "CRITICAL",
        40: "ERROR",
        30: "WARNING",
        20: "INFO",
        10: "DEBUG",
        0: "NOTSET",
    }

    def emit(self, record):
        try:
            level = logger.level(record.levelname).name
        except AttributeError:
            level = self.loglevel_mapping[record.levelno]

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back
            depth += 1

        logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


class Formatter:
    fmt = "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>{extra[padding]} | <level>{message}</level>\n{exception}"
    padding = 0

    @classmethod
    def format(cls, record):
        length = len("{name}:{function}:{line}".format(**record))
        cls.padding = max(cls.padding, length)
        record["extra"]["padding"] = " " * (cls.padding - length)
        return cls.fmt


class Logger:
    @classmethod
    def make_logger(cls, log_path: Path, log_level: str):
        logger.remove()
        log = cls.customize_logging(
            filepath=log_path,
            level=log_level,
            rotation="1 day",
            retention="1 week",
        )
        return log

    @classmethod
    def customize_logging(cls, filepath: Path, level: str, rotation: str, retention: str):
        logger.remove()
        logger.add(
            sys.stdout,
            enqueue=True,
            backtrace=True,
            diagnose=True,
            colorize=True,
            level=level.upper(),
            format=Formatter.format,
        )
        logger.add(
            str(filepath),
            rotation=rotation,
            retention=retention,
            enqueue=True,
            backtrace=False,
            diagnose=False,
            colorize=False,
            level=level.upper(),
            serialize=True,
            format="{message}",
        )

        logging.basicConfig(handlers=[InterceptHandler()], level=0)

        for _log in [
            *logging.root.manager.loggerDict.keys(),
        ]:
            _logger = logging.getLogger(_log)
            if "access" in _logger.name and not _logger.handlers:
                _logger.handlers = []
                continue
            _logger.propagate = False
            _logger.handlers = [InterceptHandler()]

        return logger
