from google.cloud import firestore
from data import load_json_file
from google.cloud.firestore_v1.base_query import FieldFilter

# The `project` parameter is optional and represents which project the client
# will act on behalf of. If not supplied, the client falls back to the default
# project inferred from the environment.
db = firestore.Client(project="experimentplanet")

def init_load():
    for service in ["cloud-architecture"]:
        doc_ref = db.document(f"users/public/mindmaps/cloudarchitecture")
        data = load_json_file(f"{service}.json")
        doc_ref.set(
            data
        )
    doc_ref = db.document("users/public")
    doc_ref.set({'meta': ["bigquery", "cloudarchitecture", "cloudstorage", "cloudrun"]})


## If user is existing, returns the document, in this case ['bigquery', 'cloudrun']
def get_mindmaps_list(user: str):
    print("FIRESTORE", ",", "GET_MINDMAPS_LIST", ",", user)
    doc_ref = db.collection("users").document(user)
    return doc_ref.get().to_dict()['meta']


def get_mindmaps(user: str, document: str):
    print("FIRESTORE", ",", "GET_MINDMAPS", ",", document, ",", user)
    doc_ref = db.collection(f"users/{user}/mindmaps").document(document)
    return doc_ref.get().to_dict()

def add_mindmap(user: str, document: str, data):
    print("FIRESTORE", ",", "ADD_MINDMAPS_LIST", ",", user)
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
    print("FIRESTORE", ",", "DELETE_MINDMAP", ",", document, ",", user)
    doc_ref = db.collection(f"users/{user}/mindmaps").document(document)
    # Delete the document
    doc_ref.delete()

    doc_ref = db.collection("users").document(user)
    data = doc_ref.get().to_dict()['meta']
    data.remove(document)
    print(data)
    doc_ref.set({"meta": data})




if __name__ == "__main__":
    init_load()