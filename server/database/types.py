# alias common names
from server.extensions import db
from sqlalchemy import schema, types
from sqlalchemy.orm.relationships import RelationshipProperty

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


# Small hack to make type-hinting work
class __relationship_type_hinter__(RelationshipProperty):
    # implement __call__ to silence the silly "not callable" warning
    def __call__(self, *args, **kwargs):
        pass


# alias common names
backref: __relationship_type_hinter__ = db.backref
relationship: __relationship_type_hinter__ = db.relationship
