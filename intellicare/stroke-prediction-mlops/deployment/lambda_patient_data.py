import json

def lambda_handler(event, context):
    # Fetch or simulate patient data
    patient_data = {
        "id": "PATIENT_001",
        "age": 65,
        "gender": "female",
        "symptoms": ["headache", "numbness"],
        "timestamp": "2025-06-20T12:00:00Z"
    }
    return {
        "statusCode": 200,
        "body": json.dumps(patient_data)
    }