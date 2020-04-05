from server import db


class Friendship(db.Model):
    friend_a_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    friend_b_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    pending = db.Column(db.Boolean, default=True)
