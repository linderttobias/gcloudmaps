import logging
from flask import Flask, request, g
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as reqs
import firestore


app = Flask(__name__)
CORS(app)

if __name__ != '__main__':
    gunicorn_logger = logging.getLogger('gunicorn.error')
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)

@app.before_request
def check_user_authentication():
    g.user = None
    auth = request.headers.get("Authorization", None)

    if auth is None or not auth.startswith("Bearer "):
        app.logger.info("Request without Authorization - Using public user ..")
        g.user = "public"
        return

    token = auth[7:]  # 'Bearer: XYZ' -> 'XYU'

    info = None
    try:
        if info is None:
            info = id_token.verify_oauth2_token(token, reqs.Request())
    except ValueError:
        app.logger.info("Oauth2 Token invalid - Using public user ..")
        g.user = "public"

    if info is not None:  # Remember the user sub address throughout this request
        if "sub" in info:
            g.user = info["sub"]
    return


@app.route("/list", methods=["GET"])
def get_list():
    mindmap_list = firestore.load_mindmaps_list(g.user)
    # Unfortunately we have to do the following remap step, as the Frontend excpects it this ways
    return [{"value": item, "label": item} for item in mindmap_list]


@app.route("/mindmaps/<string:mindmap>", methods=["GET"])
def get_mindmap(mindmap):
    if mindmap not in firestore.load_mindmaps_list(g.user):
        return f"Mindmap {mindmap} for user {g.user} not found", 404
    return firestore.get_mindmap(g.user, mindmap)


@app.route("/mindmaps/<string:mindmap>", methods=["DELETE"])
def delete_mindmap(mindmap):
    if mindmap not in firestore.load_mindmaps_list(g.user):
        return f"Mindmap {mindmap} for user {g.user} not found", 404
    firestore.delete_mindmap(g.user, mindmap)
    return "Successfull", 200


@app.route("/mindmaps/<string:mindmap>", methods=["POST"])
def add_mindmap(mindmap):
    if mindmap not in firestore.load_mindmaps_list(g.user):
        return f"Mindmap {mindmap} for user {g.user} not found", 404
    if not request.is_json:
        return "Unsupported media type", 415

    data = request.get_json(silent=True)
    if data is None:
        return "Bad request", 400
    firestore.add_mindmap(g.user, mindmap, data)
    return "Successfull", 200


if __name__ == "__main__":
    app.run(host="localhost", port=3001, debug=True)
