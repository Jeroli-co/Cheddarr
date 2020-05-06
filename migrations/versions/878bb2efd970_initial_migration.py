"""empty message

Revision ID: 878bb2efd970
Revises: 
Create Date: 2020-05-06 19:26:06.052127

"""
import sqlalchemy_utils
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = "878bb2efd970"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "user",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("username", sa.String(length=128), nullable=False),
        sa.Column(
            "email", sqlalchemy_utils.types.email.EmailType(length=255), nullable=False
        ),
        sa.Column(
            "password",
            sqlalchemy_utils.types.password.PasswordType(max_length=1137),
            nullable=False,
        ),
        sa.Column("user_picture", sqlalchemy_utils.types.url.URLType(), nullable=True),
        sa.Column("session_token", sa.String(length=256), nullable=True),
        sa.Column("confirmed", sa.Boolean(), nullable=True),
        sa.Column("api_key", sa.String(length=256), nullable=True),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("email"),
        sa.UniqueConstraint("username"),
    )
    op.create_table(
        "friendship",
        sa.Column("friend_a_id", sa.Integer(), nullable=False),
        sa.Column("friend_b_id", sa.Integer(), nullable=False),
        sa.Column("pending", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["friend_a_id"], ["user.id"],),
        sa.ForeignKeyConstraint(["friend_b_id"], ["user.id"],),
        sa.PrimaryKeyConstraint("friend_a_id", "friend_b_id"),
    )
    op.create_table(
        "provider_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("name", sa.String(length=32), nullable=False),
        sa.Column("api_key", sa.String(length=256), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column(
            "type",
            sa.Enum(
                "MEDIA_SERVER", "MOVIE_REQUEST", "SERIES_REQUEST", name="providertype"
            ),
            nullable=True,
        ),
        sa.ForeignKeyConstraint(["user_id"], ["user.id"],),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("api_key"),
    )
    op.create_table(
        "plex_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("plex_user_id", sa.Integer(), nullable=False),
        sa.Column("machine_id", sa.String(length=64), nullable=True),
        sa.Column("machine_name", sa.String(length=64), nullable=True),
        sa.ForeignKeyConstraint(["id"], ["provider_config.id"],),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("plex_user_id"),
    )
    op.create_table(
        "radarr_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("host", sa.String(length=128), nullable=True),
        sa.Column("port", sa.String(length=5), nullable=True),
        sa.Column("ssl", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["id"], ["provider_config.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_table(
        "sonarr_config",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("host", sa.String(length=128), nullable=True),
        sa.Column("port", sa.String(length=5), nullable=True),
        sa.Column("ssl", sa.Boolean(), nullable=True),
        sa.ForeignKeyConstraint(["id"], ["provider_config.id"],),
        sa.PrimaryKeyConstraint("id"),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("sonarr_config")
    op.drop_table("radarr_config")
    op.drop_table("plex_config")
    op.drop_table("provider_config")
    op.drop_table("friendship")
    op.drop_table("user")
    # ### end Alembic commands ###