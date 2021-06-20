"""empty message

Revision ID: 2ab75f3fa7c6
Revises: 2337500663a0
Create Date: 2021-04-05 01:23:13.476200

"""
import sqlalchemy as sa
from alembic import op

# revision identifiers, used by Alembic.
revision = '2ab75f3fa7c6'
down_revision = '2337500663a0'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.add_column('mediarequest', sa.Column('language_profile_id', sa.Integer(), nullable=True))
    op.add_column('mediarequest', sa.Column('quality_profile_id', sa.Integer(), nullable=True))
    op.add_column('mediarequest', sa.Column('root_folder', sa.String(), nullable=True))
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_column('mediarequest', 'root_folder')
    op.drop_column('mediarequest', 'quality_profile_id')
    op.drop_column('mediarequest', 'language_profile_id')
    # ### end Alembic commands ###
