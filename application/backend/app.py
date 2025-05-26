import os
import logging
from flask import Flask, request
from flask_cors import CORS
import firestore


app = Flask(__name__)
CORS(app)

if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


@app.route("/list", methods=["GET"])
def get_list():
    mindmap_list = firestore.load_mindmaps_list("public")
    # Unfortunately we have to do the following remap step, as the Frontend excpects it this ways
    return [{"value": item, "label": item} for item in mindmap_list]


@app.route("/mindmaps/<string:mindmap>", methods=["GET"])
def get_mindmap(mindmap):
    if mindmap not in firestore.load_mindmaps_list("public"):
        return f"Mindmap {mindmap} for user public not found", 404
    return firestore.get_mindmap("public", mindmap)


@app.route("/mindmaps/<string:mindmap>", methods=["DELETE"])
def delete_mindmap(mindmap):
    if mindmap not in firestore.load_mindmaps_list("public"):
        return f"Mindmap {mindmap} for user public not found", 404
    firestore.delete_mindmap("public", mindmap)
    return "Successfull", 200


@app.route("/mindmaps/<string:mindmap>", methods=["POST"])
def add_mindmap(mindmap):
    if mindmap not in firestore.load_mindmaps_list("public"):
        return f"Mindmap {mindmap} for user public not found", 404
    if not request.is_json:
        return "Unsupported media type", 415

    data = request.get_json(silent=True)
    if data is None:
        return "Bad request", 400
    firestore.add_mindmap("public", mindmap, data)
    return "Successfull", 200


if __name__ == "__main__":
    app.run(
        host=os.environ("HOST", "localhost"),
        port=int(os.environ("PORT", "3001")),
        debug=True,
    )
