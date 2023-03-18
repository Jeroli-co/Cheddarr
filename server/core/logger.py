import logging
import logging.config
import logging.handlers
import sys
from pathlib import Path

import loguru

from server.core.config import Config


class InterceptHandler(logging.Handler):
    loglevel_mapping = {
        50: "CRITICAL",
        40: "ERROR",
        30: "WARNING",
        20: "INFO",
        10: "DEBUG",
        0: "NOTSET",
    }

    def emit(self, record: logging.LogRecord) -> None:
        try:
            level = loguru.logger.level(record.levelname).name
        except AttributeError:
            level = self.loglevel_mapping[record.levelno]

        frame, depth = logging.currentframe(), 2
        while frame.f_code.co_filename == logging.__file__:
            frame = frame.f_back  # type: ignore
            depth += 1

        loguru.logger.opt(depth=depth, exception=record.exc_info).log(level, record.getMessage())


class LogLevelFilter:
    def __init__(self, level: str) -> None:
        self.level = level

    def __call__(self, record: loguru.Record) -> bool:
        levelno = loguru.logger.level(self.level).no
        return record["level"].no >= levelno


class Formatter:
    fmt = "<green>{time:YYYY-MM-DD HH:mm:ss.SSS}</green> | <level>{level: <8}</level> | <cyan>{name}</cyan>{extra[padding]} | <level>{message}</level>\n{exception}"
    padding = 0

    @classmethod
    def format(cls, record: loguru.Record) -> str:
        length = len("{name}:{function}:{line}".format(**record))
        cls.padding = max(cls.padding, length)
        record["extra"]["padding"] = " " * (cls.padding - length)
        return cls.fmt


class Logger:
    @classmethod
    def make_logger(cls, config: Config) -> loguru.Logger:
        return cls.customize_logging(
            config.logs_folder / config.logs_filename,
            level=config.log_level,
            rotation="1 day",
            retention="1 week",
        )

    @classmethod
    def customize_logging(cls, filepath: Path, level: str, rotation: str, retention: str) -> loguru.Logger:
        loguru.logger.remove()
        loguru.logger.add(
            sys.stdout,
            enqueue=True,
            backtrace=True,
            diagnose=True,
            colorize=True,
            level=0,
            filter=LogLevelFilter(level),
            format=Formatter.format,
        )
        loguru.logger.add(
            str(filepath),
            rotation=rotation,
            retention=retention,
            enqueue=True,
            backtrace=False,
            diagnose=False,
            colorize=False,
            level=0,
            filter=LogLevelFilter(level),
            serialize=True,
            format="{message}",
        )
        logging.basicConfig(handlers=[InterceptHandler()], level=0, force=True)

        for _log in [
            *logging.root.manager.loggerDict.keys(),
        ]:
            _logger = logging.getLogger(_log)
            if "access" in _logger.name and not _logger.handlers:
                _logger.handlers = []
                continue
            _logger.propagate = False
            _logger.handlers = [InterceptHandler()]

        return loguru.logger


logger: loguru.Logger
