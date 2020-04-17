import json

from flask import Flask, jsonify, render_template, request
from redis import Redis


REDIS_HOST = "redis"
REDIS_PORT = 6379

app = Flask(__name__, static_url_path="")
db = Redis(host=REDIS_HOST, port=REDIS_PORT)


@app.route("/")
def root():
    return render_template("index.html")


@app.route("/graphs/<string:game>")
def graphs(game):
    return render_template("graphs.html", game=game)


@app.route("/statistics/<string:game>")
def get_statistics(game):
    glob = f"{game}:*"

    statistics = []

    for key in db.scan_iter(match=glob):
        value = db.get(key)

        if value is not None:
            statistics.append(json.loads(value))

    return jsonify(statistics)


@app.route("/statistics", methods=["POST"])
def store_statistics():
    statistics = request.json
    print(statistics)

    key = f"{statistics['game']}:{statistics['userId']}:{statistics['round']}"

    db.set(key, json.dumps(statistics))

    return jsonify(statistics)


if __name__ == "__main__":
    app.run(host="0.0.0.0", debug=True)
