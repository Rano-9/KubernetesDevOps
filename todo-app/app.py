import atexit
from urllib import request
from urllib.error import HTTPError, URLError

from os import environ, path

from flask import Flask, render_template, send_from_directory
from flask_apscheduler.scheduler import BackgroundScheduler

app = Flask(__name__)
SHARE_DIR = "/share"

scheduler = BackgroundScheduler()


def run_once():

    PORT = environ.get("PORT")

    if not path.isfile("/share/placeholder.jpg"):
        update_pic()
    print(f"Server started in port {PORT}", flush=True)


def update_pic():
    random_url = "https://picsum.photos/300"
    req = request.Request(
        random_url,
        headers={
            "User-Agent": (
                "Mozilla/5.0 (X11; Linux x86_64) "
            ),
            "Accept": "image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8",
        },
        method="GET",
    )
    print(f"request url: {random_url}", flush=True)

    try:
        with request.urlopen(req, timeout=20) as response:
            if response.status != 200:
                raise RuntimeError(f"HTTP {response.status}")
            image = response.read()
            print("image requested", flush=True)

    except (HTTPError, URLError) as err:
        print(f"Donwload failed: {err}", flush=True)
        return

    with open(f"{SHARE_DIR}/placeholder.jpg", "wb+") as handler:
        handler.write(image)
        print("image writen", flush=True)


if not app.debug or environ.get('WERZEUG_RUN_MAIN') == 'true':
    scheduler = BackgroundScheduler()
    scheduler.add_job(func=run_once, trigger="date")
    scheduler.add_job(func=update_pic, trigger="cron", minute="*/10")
    scheduler.start()


@app.route("/")
def hello_world():
    return render_template("index.html")


@app.route("/share/<path:filename>")
def shared_image(filename):
    return send_from_directory(SHARE_DIR, filename)


atexit.register(scheduler.shutdown)

if __name__ == "__main__":
    app.run(host="127.0.0.1")
