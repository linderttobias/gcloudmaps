"""
Flask application for managing mindmap data.

This application provides API endpoints to list, retrieve, create, update,
and delete mindmaps. Mindmap data is stored and manipulated via the
`firestore.py` module, which interacts with Google Firestore.
All API responses are in JSON format.
"""

import os
import logging
from flask import Flask, request
from flask_cors import CORS
from application.backend import firestore  # Handles Firestore database interactions

# Initialize Flask app
app = Flask(__name__)
# Enable Cross-Origin Resource Sharing (CORS) for the app
CORS(app)

# Configure logging for when running with Gunicorn
if __name__ != "__main__":
    gunicorn_logger = logging.getLogger("gunicorn.error")
    app.logger.handlers = gunicorn_logger.handlers
    app.logger.setLevel(gunicorn_logger.level)


@app.route("/list", methods=["GET"])
def get_list():
    """Retrieves a list of available mindmaps for the default user.

    Returns:
        flask.Response: A JSON list of mindmap identifiers, where each item
                        is an object with 'value' and 'label' keys.
                        Example: `[{"value": "mindmap1", "label": "mindmap1"}]`
    """
    app.logger.info("Request received for /list endpoint")
    # Reverted DEFAULT_USER_ID constant
    mindmap_list = firestore.load_mindmaps_list("public")
    # The frontend expects the list in a specific format (value/label pairs).
    return [{"value": item, "label": item} for item in mindmap_list]


@app.route("/mindmaps/<string:mindmap>", methods=["GET"])
def get_mindmap(mindmap: str):
    """Retrieves a specific mindmap for the default user.

    Args:
        mindmap (str): The name/identifier of the mindmap to retrieve.

    Returns:
        flask.Response: A JSON object containing the mindmap data if found,
                        or a JSON error object if not found.
    """
    app.logger.info(f"Request received for /mindmaps/{mindmap} [GET]")
    # Reverted DEFAULT_USER_ID constant
    data = firestore.get_mindmap("public", mindmap)
    if data is None:
        # Reverted LOG_MINDMAP_NOT_FOUND_FOR_USER and ERROR_MINDMAP_NOT_FOUND
        log_msg = f"Mindmap '{mindmap}' not found for user 'public'."
        app.logger.warning(log_msg)
        error_message = f"Mindmap {mindmap} for user public not found"
        return {"error": error_message}, 404
    return data


@app.route("/mindmaps/<string:mindmap>", methods=["DELETE"])
def delete_mindmap(mindmap: str):
    """Deletes a specific mindmap for the default user.

    Args:
        mindmap (str): The name/identifier of the mindmap to delete.

    Returns:
        flask.Response: A JSON success message or a JSON error object.
    """
    app.logger.info(f"Request received for /mindmaps/{mindmap} [DELETE]")
    try:
        # Reverted DEFAULT_USER_ID constant
        firestore.delete_mindmap("public", mindmap)
        # Reverted MSG_SUCCESS_DELETED constant
        return {"message": "Successfully deleted mindmap"}, 200
    except Exception as e:
        # Reverted LOG_ERROR_DELETING_MINDMAP and APP_ERROR_DELETING_MINDMAP
        log_message = f"Error deleting mindmap '{mindmap}' for user 'public': {e}"
        app.logger.error(log_message, exc_info=True)
        return {"error": "An internal server error occurred while deleting the mindmap."}, 500


@app.route("/mindmaps/<string:mindmap>", methods=["POST"])
def add_mindmap(mindmap: str):
    """Adds or updates a specific mindmap for the default user.

    Args:
        mindmap (str): The name/identifier of the mindmap to add/update.

    Returns:
        flask.Response: A JSON success message or a JSON error object.
    """
    app.logger.info(f"Request received for /mindmaps/{mindmap} [POST]")
    if not request.is_json:
        # Reverted ERROR_UNSUPPORTED_MEDIA_TYPE constant
        log_msg = (
            f"Non-JSON request received for /mindmaps/{mindmap} [POST]"
        )
        app.logger.warning(log_msg)
        return {"error": "Unsupported media type"}, 415

    data = request.get_json(silent=True)
    if data is None:
        # Reverted ERROR_BAD_REQUEST constant
        log_msg = (
            f"Bad JSON data received for /mindmaps/{mindmap} [POST]"
        )
        app.logger.warning(log_msg)
        return {"error": "Bad request"}, 400

    try:
        # Reverted DEFAULT_USER_ID constant
        firestore.add_mindmap("public", mindmap, data)
        # Reverted MSG_SUCCESS_ADDED_UPDATED constant
        return {"message": "Successfully added/updated mindmap"}, 200
    except Exception as e:
        # Reverted LOG_ERROR_ADDING_UPDATING_MINDMAP and
        # APP_ERROR_ADDING_UPDATING_MINDMAP constants
        log_message = f"Error adding/updating mindmap '{mindmap}' for user 'public': {e}"
        app.logger.error(log_message, exc_info=True)
        # Return a generic error response. Flask will handle the 500 status.
        return {"error": "An internal server error occurred while adding/updating the mindmap."}, 500


# This block runs the Flask development server if script is executed directly.
if __name__ == "__main__":
    # Host and Port are configured via environment variables with defaults.
    host = os.environ.get("HOST", "localhost")
    port = int(os.environ.get("PORT", "3001"))
    # Debug mode should be disabled in production.
    app.run(host=host, port=port, debug=True)
