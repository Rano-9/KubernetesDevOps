from flask import Flask
from os import environ
from sys import stdout, modules

cli = modules['flask.cli']
cli.show_server_banner = lambda *x: None

PORT = environ.get("PORT")

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"


if __name__ == "__main__":
    print(f"Server started in port {PORT}",file=stdout)
    app.run(host="127.0.0.1",port=PORT)