import atexit
import sys
import json

from os import environ, path

from flask import Flask, render_template, request, send_from_directory
from flask_apscheduler.scheduler import BackgroundScheduler

SHARE_DIR = "/share"


def create_app(*args, **kwargs):
    app = Flask(__name__)
    from .db import db
    db.init_app(app)

    scheduler = BackgroundScheduler()

    if (
        (not app.debug or environ.get('WERZEUG_RUN_MAIN') == 'true')
        and 'init-db' not in sys.argv
    ):
        scheduler = BackgroundScheduler()

        from . import bg_services as background

        scheduler.add_job(func=background.run_once, trigger="date")
        scheduler.add_job(func=background.update_pic,
                          trigger="cron", minute="*/10")
        scheduler.start()

    @app.route("/")
    def index():
        conn = db.get_db()
        todos = conn.execute(
            'SELECT id, todo FROM Todos'
        ).fetchall()
        rows = [dict(row) for row in todos]
        print(rows,flush=True)
        return render_template("index.html", todos=rows)

    @app.route("/add-todo", methods=["POST"])
    def add_todo():
        print(request, flush=True)
        conn = db.get_db()
        form = request.form
        todo = form.get("todo")
        if todo:
            conn.execute(
                'INSERT INTO Todos (todo) VALUES (?)',
                (todo,)
            )
            conn.commit()

        todos = conn.execute(
            'SELECT id, todo FROM Todos'
        ).fetchall()
        rows = [dict(row) for row in todos]
        json_output = json.dumps(rows,indent=2)

        return (json_output, 200)

    @app.route("/share/<path:filename>")
    def shared_image(filename):
        return send_from_directory(SHARE_DIR, filename)

    if (
        (not app.debug or environ.get('WERZEUG_RUN_MAIN') == 'true')
        and 'init-db' not in sys.argv
    ):
        atexit.register(scheduler.shutdown)

    if __name__ == "__main__":
        app.run(host="127.0.0.1")

    return app
