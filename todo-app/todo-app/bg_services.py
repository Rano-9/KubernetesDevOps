from urllib import request
from urllib.error import HTTPError, URLError

from os import environ, path

SHARE_DIR = "/share"

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
