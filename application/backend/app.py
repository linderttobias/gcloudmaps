from flask import Flask, request, jsonify, g
from flask_cors import CORS
from google.oauth2 import id_token
from google.auth.transport import requests as reqs
from firestore import get_mindmaps, get_mindmaps_list, add_mindmap, delete_mindmap


app = Flask(__name__)
CORS(app)

resourceServices = {
    "mindmaps" : [
        "bigquery",
        "cloud-architecture",
        "cloudrun",
        "cloudstorage",
        "more-coming-soon"
    ],
    "list": None
}

@app.before_request
def check_user_authentication():
    g.user = None
    auth = request.headers.get("Authorization", None)

    if auth is None or not auth.startswith("Bearer "):
        g.user = "public"
        return

    token = auth[7:]  # Remove "Bearer: " prefix

    info = None
    try:
        if info is None:
            info = id_token.verify_oauth2_token(token, reqs.Request())
    except ValueError:
        g.user = "public"
        pass

    if info is not None:  # Remember the user sub address throughout this request
        if "sub" in info:
            g.user = info["sub"]
    return

@app.route("/api/list", methods=['GET'])
def handle_get_list():
    mml = get_mindmaps_list(g.user)
    return [{'value': item, 'label': item} for item in mml]

@app.route("/api/<resource_name>/<service_name>", methods=["GET"])
def handle_get(resource_name, service_name):
    if resource_name not in resourceServices:
        return "Not found", 404
    #if service_name and service_name not in resourceServices[resource_name]:
    #    return "Not found", 404
    return get_mindmaps(g.user, service_name)

@app.route("/api/<resource_name>/<service_name>", methods=["DELETE"])
def handle_delete(resource_name, service_name):
    if resource_name not in resourceServices:
        return "Not found", 404
    delete_mindmap(g.user, service_name)
    return "Successfull", 200
    
@app.route("/api/<resource_name>/<service_name>", methods=["POST"])
def handle_insert(resource_name, service_name):
    if resource_name not in resourceServices:
        return "Not found", 404
    if not request.is_json:
        return "Unsupported media type", 415

    data = request.get_json(silent=True)
    if data is None:
        return "Bad request", 400
    add_mindmap(g.user, service_name, data)
    return "Successfull", 200




if __name__ == '__main__':
    app.run(port=3001)