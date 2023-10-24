import os
import json


def load_json_file(filename= "bigquery.json", directory = "data"):
    file_path = os.path.join(directory, filename)

    if os.path.exists(file_path):
        with open(file_path, 'r') as file:
            try:
                data = json.load(file)
                return data
            except json.JSONDecodeError as e:
                raise ValueError(f"Error parsing JSON file '{filename}': {e}")
    else:
        raise FileNotFoundError(f"JSON file '{filename}' not found in directory '{directory}'")

def save_json_file(data, filename="bigquery.json", directory = "data"):
    file_path = os.path.join(directory, filename)

    try:
        with open(file_path, "w") as file:
            file.write(data)
    except Exception as e:
        return "Error saving object to file", 500
    
def get_mindmaps(service_name):
    return load_json_file(service_name + ".json")

def insert_mindmaps(service_name, body):
    data = json.dumps(body)
    save_json_file(data, service_name + ".json", "data")
    return "success", 200
