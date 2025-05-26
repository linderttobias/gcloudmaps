"""
Handles Firestore interactions for mindmap data.

Provides functions to:
- List mindmaps for a user.
- Retrieve a specific mindmap.
- Add or update a mindmap (atomic).
- Delete a mindmap (atomic).

Uses atomic transactions for data consistency. Logs errors and re-raises
critical exceptions for handling by app.py.
"""

from typing import Dict, List, Optional
from flask import current_app
from google.cloud import (
    firestore,
)  # For ArrayUnion, ArrayRemove, and @firestore.transactional

# Initialize the Firestore client.
# The `project` parameter is optional and represents which project the client
# will act on behalf of. If not supplied, the client falls back to the default
# project inferred from the environment (usually set via GOOGLE_CLOUD_PROJECT).
db = firestore.Client()


@firestore.transactional
def _add_mindmap_transaction(
    transaction: firestore.Transaction,
    mindmap_doc_ref: firestore.DocumentReference,
    user_doc_ref: firestore.DocumentReference,
    document_name: str,
    data: Dict,
):
    """
    Atomically sets/updates the mindmap data and adds its name to the user's
    'meta' list.

    This function is designed to be executed within a Firestore transaction.
    It assumes the user document (`user_doc_ref`) exists, which should be
    ensured by the calling function (`add_mindmap`) before invoking this
    transaction.

    Args:
        transaction (firestore.Transaction): The Firestore transaction object.
        mindmap_doc_ref (firestore.DocumentReference): Reference to the mindmap
                                                       document.
        user_doc_ref (firestore.DocumentReference): Reference to the user's
                                                    document.
        document_name (str): The name/identifier of the mindmap.
        data (Dict): The data to be stored in the mindmap document.
    """
    # Use LOG_TX_SETTING_MINDMAP constant
    current_app.logger.debug(
        f"Transaction: Setting/updating mindmap document '{document_name}'"
    )
    transaction.set(mindmap_doc_ref, data)

    current_app.logger.debug(
        f"Transaction: Ensuring '{document_name}' is in user's 'meta' list."
    )
    transaction.update(
        user_doc_ref, {"meta": firestore.ArrayUnion([document_name])}
    )


@firestore.transactional
def _delete_mindmap_transaction(
    transaction: firestore.Transaction,
    mindmap_doc_ref: firestore.DocumentReference,
    user_doc_ref: firestore.DocumentReference,
    document_name: str,
):
    """
    Atomically deletes the mindmap document and removes its name from the
    user's 'meta' list.

    This function is designed to be executed within a Firestore transaction.

    Args:
        transaction (firestore.Transaction): The Firestore transaction object.
        mindmap_doc_ref (firestore.DocumentReference): Reference to the mindmap
                                                       document to be deleted.
        user_doc_ref (firestore.DocumentReference): Reference to the user's
                                                    document.
        document_name (str): The name/identifier of the mindmap to be removed
                             from 'meta'.
    """
    # Use LOG_TX_DELETING_MINDMAP constant
    current_app.logger.debug(
        f"Transaction: Deleting mindmap document '{document_name}'"
    )
    transaction.delete(mindmap_doc_ref)

    current_app.logger.debug(
        f"Transaction: Removing '{document_name}' from user's 'meta' list."
    )
    transaction.update(
        user_doc_ref,
        {"meta": firestore.ArrayRemove([document_name])},
    )


def load_mindmaps_list(user: str) -> List[str]:
    """
    Loads the list of mindmap names for a given user.

    Args:
        user (str): The identifier of the user.

    Returns:
        List[str]: A list of mindmap names. Returns an empty list if the user
                   is not found, has no mindmaps, or if an error occurs.
    """
    current_app.logger.info(f"Loading mindmap list for user: {user}")
    doc_ref = db.collection("users").document(user)
    try:
        doc = doc_ref.get()
        if doc.exists:
            user_data = doc.to_dict()
            if user_data and isinstance(user_data.get("meta"), list):
                return user_data["meta"]
            else:
                log_msg = (
                    f"User document for '{user}' is missing 'meta' field, "
                    f"'meta' is not a list, or user_data is invalid. "
                    f"Returning empty list."
                )
                current_app.logger.warning(log_msg)
                return []
        else:
            current_app.logger.warning(
                f"User document for '{user}' not found. Returning empty list."
            )
            return []
    except Exception as e:
        log_msg = f"Error loading mindmap list for user '{user}': {e}"
        current_app.logger.error(log_msg, exc_info=True)
        return []


def get_mindmap(user: str, document: str) -> Optional[Dict]:
    """
    Retrieves a specific mindmap document for a user.

    Args:
        user (str): The identifier of the user.
        document (str): The name/identifier of the mindmap document.

    Returns:
        Optional[Dict]: A dictionary containing the mindmap data if found,
                        otherwise None.
    """
    current_app.logger.info(f"Loading mindmap '{document}' for user: {user}")
    doc_ref = (
        db.collection("users")
        .document(user)
        .collection("mindmaps")
        .document(document)
    )
    try:
        doc = doc_ref.get()
        if doc.exists:
            return doc.to_dict()
        else:
            log_msg = f"Mindmap '{document}' not found for user '{user}'."
            current_app.logger.info(log_msg)
            return None
    except Exception as e:
        log_msg = f"Error loading mindmap '{document}' for user '{user}': {e}"
        current_app.logger.error(log_msg, exc_info=True)
        return None


def add_mindmap(user: str, document_name: str, data: Dict):
    """
    Adds or updates a mindmap for a user and updates the user's list of
    mindmaps.
    ...
    """
    current_app.logger.info(
        f"Attempting to add/update mindmap '{document_name}' for user: {user}"
    )
    mindmap_doc_ref = (
        db.collection("users")
        .document(user)
        .collection("mindmaps")
        .document(document_name)
    )
    user_doc_ref = db.collection("users").document(user)

    try:
        transaction = db.transaction()
        user_doc_snapshot = user_doc_ref.get(transaction=transaction)

        if not user_doc_snapshot.exists:
            current_app.logger.info(
                f"User document for '{user}' not found. Creating it within transaction."
            )
            transaction.set(user_doc_ref, {"meta": [document_name]})
            transaction.set(mindmap_doc_ref, data)
            log_msg = (
                f"Successfully created user '{user}' and added mindmap '{document_name}' "
                f"in transaction."
            )
            current_app.logger.info(log_msg)
        else:
            _add_mindmap_transaction(
                transaction, mindmap_doc_ref, user_doc_ref, document_name, data
            )
            log_msg = (
                f"Successfully added/updated mindmap '{document_name}' and updated meta for user "
                f"'{user}'."
            )
            current_app.logger.info(log_msg)

    except Exception as e:
        log_msg = f"Error adding/updating mindmap '{document_name}' for user '{user}': {e}"
        current_app.logger.error(log_msg, exc_info=True)
        raise


def delete_mindmap(user: str, document_name: str):
    """
    Deletes a mindmap for a user and removes it from the user's list of
    mindmaps.
    ...
    """
    current_app.logger.info(
        f"Attempting to delete mindmap '{document_name}' for user: {user}"
    )
    mindmap_doc_ref = (
        db.collection("users")
        .document(user)
        .collection("mindmaps")
        .document(document_name)
    )
    user_doc_ref = db.collection("users").document(user)

    try:
        transaction = db.transaction()
        _delete_mindmap_transaction(
            transaction, mindmap_doc_ref, user_doc_ref, document_name
        )
        log_msg = (
            f"Successfully initiated deletion for mindmap '{document_name}' and updated meta "
            f"for user '{user}'."
        )
        current_app.logger.info(log_msg)
    except Exception as e:
        log_msg = f"Error deleting mindmap '{document_name}' for user '{user}': {e}"
        current_app.logger.error(log_msg, exc_info=True)
        raise
