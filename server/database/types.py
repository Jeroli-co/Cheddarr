# alias common names
import sqlalchemy
from server.extensions import db
from sqlalchemy.dialects import sqlite
from sqlalchemy.orm.relationships import RelationshipProperty

BigInteger = db.BigInteger().with_variant(
    sqlite.INTEGER(), "sqlite"
)  # type: sqlalchemy.types.BigInteger
Boolean = db.Boolean  # type: sqlalchemy.types.Boolean
Date = db.Date  # type: sqlalchemy.types.Date
Enum = db.Enum  # type: sqlalchemy.types.Enum
Float = db.Float  # type: sqlalchemy.types.Float
ForeignKey = db.ForeignKey  # type: sqlalchemy.schema.ForeignKey
Integer = db.Integer  # type: sqlalchemy.types.Integer
Interval = db.Interval  # type: sqlalchemy.types.Interval
Numeric = db.Numeric  # type: sqlalchemy.types.Numeric
SmallInteger = db.SmallInteger  # type: sqlalchemy.types.SmallInteger
String = db.String  # type: sqlalchemy.types.String
Text = db.Text  # type: sqlalchemy.types.Text
Time = db.Time  # type: sqlalchemy.types.Time
Table = db.Table


# Small hack to make type-hinting work
class __relationship_type_hinter__(RelationshipProperty):
    # implement __call__ to silence the silly "not callable" warning
    def __call__(self, *args, **kwargs):
        pass


# alias common names
backref = db.backref  # type: __relationship_type_hinter__
relationship = db.relationship  # type: __relationship_type_hinter__
