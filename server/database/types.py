from sqlalchemy import schema, types
from sqlalchemy_utils import types as utils_types

from server.extensions import db

# alias common names and types
Boolean: types.Boolean = db.Boolean
Date: types.Date = db.Date
Enum: types.Enum = db.Enum
Float: types.Float = db.Float
Integer: types.Integer = db.Integer
Interval: types.Interval = db.Interval
Numeric: types.Date = db.Numeric
String: types.String = db.String
Text: types.Text = db.Text
Time: types.Time = db.Time
Table: schema.Table = db.Table
ForeignKey: schema.ForeignKey = db.ForeignKey
UniqueConstraint: schema.UniqueConstraint = db.UniqueConstraint
ForeignKeyConstraint: schema.ForeignKeyConstraint = db.ForeignKeyConstraint
UUID = utils_types.UUIDType
Email = utils_types.EmailType
Password = utils_types.PasswordType
URL = utils_types.URLType

from sqlalchemy.orm import relationship, backref  # noqa
