from abc import ABC, abstractmethod
from typing import Any


class BaseService(ABC):
    @abstractmethod
    def __init__(self, *args: Any, **kwargs: Any) -> None:
        raise NotImplementedError

    @staticmethod
    @abstractmethod
    def get_dependencies() -> list[Any]:
        raise NotImplementedError
