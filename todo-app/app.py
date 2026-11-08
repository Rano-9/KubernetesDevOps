from flask import Flask
from os import environ
from sys import stdout, stderr
from flask_apscheduler.scheduler import BackgroundScheduler

app = Flask(__name__)

scheduler = BackgroundScheduler()

def run_once():

    PORT = environ.get("PORT")
    print(f"Server started in port {PORT}",flush=True)

if not app.debug or environ.get('WERZEUG_RUN_MAIN') == 'true':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=run_once, trigger="date")
    scheduler.start()


@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

import atexit
atexit.register(lambda: scheduler.shutdown())

if __name__ == "__main__":
    app.run(host="127.0.0.1")