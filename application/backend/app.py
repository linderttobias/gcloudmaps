from flask import Flask, request, jsonify
from flask_cors import CORS
from data import get_mindmaps, insert_mindmaps

app = Flask(__name__)
CORS(app, resources={r"/*": {"origins": "*"}})


resourceServices = {
    "mindmaps" : [
        "bigquery",
        "cloud-architecture",
        "cloudrun",
        "cloudstorage",
        "more-coming-soon"
    ]
}

@app.route("/<resource_name>/<service_name>", methods=["GET"])
def handle_get(resource_name, service_name):
    if resource_name not in resourceServices:
        return "Not found", 404
    if service_name and service_name not in resourceServices[resource_name]:
        return "Not found", 404
    return get_mindmaps(service_name)
    
@app.route("/<resource_name>/<service_name>", methods=["POST"])
def handle_insert(resource_name, service_name):
    if resource_name not in resourceServices:
        return "Not found", 404
    if not request.is_json:
        return "Unsupported media type", 415

    body = request.get_json(silent=True)
    if body is None:
        return "Bad request", 400

    insert_mindmaps(service_name, body)
    return "Successfull", 200


if __name__ == '__main__':
    app.run(port=3001)