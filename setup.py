import os

from passlib.crypto.scrypt import backend
from setuptools import setup

import server


def read(fname):
    return open(os.path.join(os.path.dirname(__file__), fname)).read()


setup(
    name="Cheddarr",
    version=server.__version__,
    url=backend.__homepage__,
    author=backend.__author__,
    license=backend.__license__,
    entry_points={"console_scripts": ["flask=manage:main"]},
)
