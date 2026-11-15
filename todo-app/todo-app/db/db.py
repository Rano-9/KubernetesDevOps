import sqlite3
from os import path, environ
from pathlib import Path
from datetime import datetime
import click
from flask import current_app, g

BASE_DIR = Path(__file__).resolve().parent
DEFAULT_DB = BASE_DIR / "database.sql"


def get_db():
    if 'db' not in g:
        db_path = current_app.config.get("DATABASE") or environ.get("DATABASE_PATH") or DEFAULT_DB
        g.db = sqlite3.connect(
            db_path,
            detect_types=sqlite3.PARSE_DECLTYPES
        )
        g.db.row_factory = sqlite3.Row

    return g.db


def close_db(e=None):
    db = g.pop('db', None)

    if db is not None:
        db.close()


def init_db():
    db = get_db()

    with current_app.open_resource('db/schema.sql') as f:
        db.executescript(f.read().decode('utf8'))


@click.command('init-db')
def init_db_command():
    """Clear the existing data and create new tables."""
    init_db()
    click.echo('Initialized the database.')


sqlite3.register_converter(
    "timestamp", lambda v: datetime.fromisoformat(v.decode())
)


def init_app(app):
    app.teardown_appcontext(close_db)
    app.cli.add_command(init_db_command)
