from flask import current_app
from google.cloud import firestore

# The `project` parameter is optional and represents which project the client
# will act on behalf of. If not supplied, the client falls back to the default
# project inferred from the environment.
db = firestore.Client()

## If user is existing, returns the document, in this case ['bigquery', 'cloudrun']
def load_mindmaps_list(user: str):
    current_app.logger.info(f"Load for user: {user}")
    doc_ref = db.collection("users").document(user)
    return doc_ref.get().to_dict()['meta']

def get_mindmap(user: str, document: str):
    current_app.logger.info(f"Load for user: {user}")
    doc_ref = db.collection(f"users/{user}/mindmaps").document(document)
    return doc_ref.get().to_dict()

def add_mindmap(user: str, document: str, data):
    doc_ref = db.document(f"users/{user}/mindmaps/{document}")
    doc_ref.set(
            data
        )
    
    doc_ref = db.collection("users").document(user)
    data = doc_ref.get().to_dict()['meta']

    if document not in data:
        doc_ref = db.document(f"users/{user}")

        data.append(document)
        doc_ref.set({"meta": data})

def delete_mindmap(user: str, document: str):
    doc_ref = db.collection(f"users/{user}/mindmaps").document(document)
    # Delete the document
    doc_ref.delete()

    doc_ref = db.collection("users").document(user)
    data = doc_ref.get().to_dict()['meta']
    data.remove(document)
    doc_ref.set({"meta": data})
