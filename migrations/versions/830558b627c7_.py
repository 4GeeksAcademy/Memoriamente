"""empty message

Revision ID: 830558b627c7
Revises: f39bb2bbfd7f
Create Date: 2024-11-21 19:29:06.665216

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = '830558b627c7'
down_revision = 'f39bb2bbfd7f'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.drop_constraint('user_seudonimo_key', type_='unique')
        batch_op.drop_column('seudonimo')

    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    with op.batch_alter_table('user', schema=None) as batch_op:
        batch_op.add_column(sa.Column('seudonimo', sa.VARCHAR(length=120), autoincrement=False, nullable=False))
        batch_op.create_unique_constraint('user_seudonimo_key', ['seudonimo'])

    # ### end Alembic commands ###