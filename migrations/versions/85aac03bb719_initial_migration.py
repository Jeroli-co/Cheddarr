"""initial migration

Revision ID: 85aac03bb719
Revises: 
Create Date: 2020-09-14 18:00:10.722551

"""
from alembic import op
import sqlalchemy as sa
import sqlalchemy_utils

# revision identifiers, used by Alembic.
revision = "85aac03bb719"
down_revision = None
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table(
        "plexserver",
        sa.Column("machine_id", sa.String(length=128), nullable=False),
        sa.Column("name", sa.String(length=128), nullable=False),
        sa.PrimaryKeyConstraint("machine_id"),
    )
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
        sa.Column("avatar", sqlalchemy_utils.types.url.URLType(), nullable=True),
        sa.Column("session_token", sa.String(length=256), nullable=False),
        sa.Column("confirmed", sa.Boolean(), nullable=False),
        sa.Column("api_key", sa.String(length=256), nullable=True),
        sa.PrimaryKeyConstraint("id"),
    )
    op.create_index(op.f("ix_user_email"), "user", ["email"], unique=True)
    op.create_index(op.f("ix_user_username"), "user", ["username"], unique=True)
    op.create_table(
        "friendship",
        sa.Column("requesting_user_id", sa.Integer(), nullable=False),
        sa.Column("receiving_user_id", sa.Integer(), nullable=False),
        sa.Column("pending", sa.Boolean(), nullable=False),
        sa.ForeignKeyConstraint(
            ["receiving_user_id"],
            ["user.id"],
        ),
        sa.ForeignKeyConstraint(
            ["requesting_user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("requesting_user_id", "receiving_user_id"),
    )
    op.create_table(
        "plexconfig",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("api_key", sa.String(length=256), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column(
            "provider_type",
            sa.Enum(
                "MEDIA_SERVER", "MOVIE_REQUEST", "SERIES_REQUEST", name="providertype"
            ),
            nullable=False,
        ),
        sa.Column("plex_user_id", sa.Integer(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("api_key"),
    )
    op.create_table(
        "radarrconfig",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("api_key", sa.String(length=256), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column(
            "provider_type",
            sa.Enum(
                "MEDIA_SERVER", "MOVIE_REQUEST", "SERIES_REQUEST", name="providertype"
            ),
            nullable=False,
        ),
        sa.Column("host", sa.String(length=128), nullable=False),
        sa.Column("port", sa.String(length=5), nullable=True),
        sa.Column("ssl", sa.Boolean(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("api_key"),
    )
    op.create_table(
        "sonarrconfig",
        sa.Column("id", sa.Integer(), nullable=False),
        sa.Column("api_key", sa.String(length=256), nullable=False),
        sa.Column("enabled", sa.Boolean(), nullable=False),
        sa.Column(
            "provider_type",
            sa.Enum(
                "MEDIA_SERVER", "MOVIE_REQUEST", "SERIES_REQUEST", name="providertype"
            ),
            nullable=False,
        ),
        sa.Column("host", sa.String(length=128), nullable=False),
        sa.Column("port", sa.String(length=5), nullable=True),
        sa.Column("ssl", sa.Boolean(), nullable=False),
        sa.Column("user_id", sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(
            ["user_id"],
            ["user.id"],
        ),
        sa.PrimaryKeyConstraint("id"),
        sa.UniqueConstraint("api_key"),
    )
    op.create_table(
        "plexconfigserver",
        sa.Column("config_id", sa.Integer(), nullable=False),
        sa.Column("server_id", sa.String(length=128), nullable=False),
        sa.ForeignKeyConstraint(
            ["config_id"],
            ["plexconfig.id"],
        ),
        sa.ForeignKeyConstraint(
            ["server_id"],
            ["plexserver.machine_id"],
        ),
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table("plexconfigserver")
    op.drop_table("sonarrconfig")
    op.drop_table("radarrconfig")
    op.drop_table("plexconfig")
    op.drop_table("friendship")
    op.drop_index(op.f("ix_user_username"), table_name="user")
    op.drop_index(op.f("ix_user_email"), table_name="user")
    op.drop_table("user")
    op.drop_table("plexserver")
    # ### end Alembic commands ###
