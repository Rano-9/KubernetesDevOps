#!/bin/sh
set -eu

SHARE_DIR="/share"
DB_DIR="$SHARE_DIR/db"
DB_FILE="$DB_DIR/database.sql"
INIT_MARKER="$SHARE_DIR/.initialized"

# First-boot volume initialization. Runs once per persistent volume.
if [ ! -f "$INIT_MARKER" ]; then
  mkdir -p "$DB_DIR"

  # Ensure the database path exists for DATABASE_PATH=/share/db/database.sql.
  if [ ! -f "$DB_FILE" ]; then
    touch "$DB_FILE"
    exec flask --app todo-app init-db
  fi

  touch "$INIT_MARKER"
fi

exec gunicorn \
  --workers 1 \
  --capture-output \
  --error-logfile - \
  'todo-app:create_app()' \
  --bind "0.0.0.0:$PORT"
