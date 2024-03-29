"""empty message

Revision ID: c446bad70344
Revises: 2ab75f3fa7c6
Create Date: 2021-06-05 17:37:21.524744

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'c446bad70344'
down_revision = '2ab75f3fa7c6'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('friendship')
    with op.batch_alter_table('mediaprovidersetting', schema=None) as batch_op:
        batch_op.drop_constraint('fk_mediaprovidersetting_user_id_user', type_='foreignkey')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('mediarequest', schema=None) as batch_op:
        batch_op.drop_constraint('fk_mediarequest_requested_user_id_user', type_='foreignkey')
        batch_op.drop_column('requested_user_id')

    with op.batch_alter_table('mediaserverepisode', schema=None) as batch_op:
        batch_op.add_column(sa.Column('external_id', sa.String(), nullable=False))
        batch_op.create_unique_constraint(batch_op.f('uq_mediaservermedia_external_id'), ['external_id', 'server_id'])
        batch_op.drop_column('server_media_id')

    with op.batch_alter_table('mediaservermedia', schema=None) as batch_op:
        batch_op.add_column(sa.Column('external_id', sa.String(), nullable=False))
        batch_op.create_unique_constraint(batch_op.f('uq_mediaservermedia_external_id'), ['external_id', 'server_id'])
        batch_op.drop_column('server_media_id')

    with op.batch_alter_table('mediaserverseason', schema=None) as batch_op:
        batch_op.add_column(sa.Column('external_id', sa.String(), nullable=False))
        batch_op.alter_column('server_media_id',
               existing_type=sa.VARCHAR(),
               type_=sa.Integer(),
               existing_nullable=False)
        batch_op.create_unique_constraint(batch_op.f('uq_mediaservermedia_external_id'), ['external_id', 'server_id'])
        batch_op.drop_constraint('fk_mediaserverseason_media_id_mediaservermedia', type_='foreignkey')
        batch_op.create_foreign_key(batch_op.f('fk_mediaserverseason_server_media_id_mediaservermedia'), 'mediaservermedia', ['server_media_id'], ['id'])
        batch_op.drop_column('media_id')

    with op.batch_alter_table('mediaserversetting', schema=None) as batch_op:
        batch_op.drop_constraint('fk_mediaserversetting_user_id_user', type_='foreignkey')
        batch_op.drop_column('user_id')

    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(),
               nullable=True)

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.alter_column('email',
               existing_type=sa.VARCHAR(),
               nullable=False)

    with op.batch_alter_table('mediaserversetting', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('fk_mediaserversetting_user_id_user', 'user', ['user_id'], ['id'])

    with op.batch_alter_table('mediaserverseason', schema=None) as batch_op:
        batch_op.add_column(sa.Column('media_id', sa.INTEGER(), nullable=False))
        batch_op.drop_constraint(batch_op.f('fk_mediaserverseason_server_media_id_mediaservermedia'), type_='foreignkey')
        batch_op.create_foreign_key('fk_mediaserverseason_media_id_mediaservermedia', 'mediaservermedia', ['media_id'], ['id'])
        batch_op.drop_constraint(batch_op.f('uq_mediaservermedia_external_id'), type_='unique')
        batch_op.alter_column('server_media_id',
               existing_type=sa.Integer(),
               type_=sa.VARCHAR(),
               existing_nullable=False)
        batch_op.drop_column('external_id')

    with op.batch_alter_table('mediaservermedia', schema=None) as batch_op:
        batch_op.add_column(sa.Column('server_media_id', sa.VARCHAR(), nullable=False))
        batch_op.drop_constraint(batch_op.f('uq_mediaservermedia_external_id'), type_='unique')
        batch_op.drop_column('external_id')

    with op.batch_alter_table('mediaserverepisode', schema=None) as batch_op:
        batch_op.add_column(sa.Column('server_media_id', sa.VARCHAR(), nullable=False))
        batch_op.drop_constraint(batch_op.f('uq_mediaservermedia_external_id'), type_='unique')
        batch_op.drop_column('external_id')

    with op.batch_alter_table('mediarequest', schema=None) as batch_op:
        batch_op.add_column(sa.Column('requested_user_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('fk_mediarequest_requested_user_id_user', 'user', ['requested_user_id'], ['id'])

    with op.batch_alter_table('mediaprovidersetting', schema=None) as batch_op:
        batch_op.add_column(sa.Column('user_id', sa.INTEGER(), nullable=False))
        batch_op.create_foreign_key('fk_mediaprovidersetting_user_id_user', 'user', ['user_id'], ['id'])

    op.create_table('friendship',
    sa.Column('pending', sa.BOOLEAN(), nullable=True),
    sa.Column('requesting_user_id', sa.INTEGER(), nullable=False),
    sa.Column('requested_user_id', sa.INTEGER(), nullable=False),
    sa.ForeignKeyConstraint(['requested_user_id'], ['user.id'], name='fk_friendship_requested_user_id_user'),
    sa.ForeignKeyConstraint(['requesting_user_id'], ['user.id'], name='fk_friendship_requesting_user_id_user'),
    sa.PrimaryKeyConstraint('requesting_user_id', 'requested_user_id', name='pk_friendship')
    )
    # ### end Alembic commands ###
