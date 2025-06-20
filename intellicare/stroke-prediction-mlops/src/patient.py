import json
from datetime import datetime

def lambda_handler(event, context):
    # Example: Return latest patient data (replace with DB query as needed)
    patient_data = {
        "id": "PATIENT_123456",
        "demographics": {
            "age": 67,
            "gender": "male",
            "ethnicity": "Caucasian"
        },
        "medicalHistory": {
            "hypertension": True,
            "diabetes": False,
            "heartDisease": True,
            "strokeHistory": False,
            "smokingStatus": "former"
        },
        "vitalSigns": {
            "bloodPressure": { "systolic": 142, "diastolic": 92 },
            "heartRate": 78,
            "temperature": 98.6,
            "oxygenSaturation": 97
        },
        "labResults": {
            "cholesterol": 210,
            "glucose": 105
        },
        "symptoms": {
            "facialDropping": False,
            "armWeakness": False,
            "speechDifficulty": False,
            "severity": 1
        },
        "healthTracking": {
            "steps": 8239,
            "sleepHours": 7.2,
            "calories": 320,
            "distance": 7.8,
            "activeMinutes": 72,
            "isRealTime": True,
            "lastUpdated": datetime.now().isoformat()
        }
    }
    return {
        "statusCode": 200,
        "body": json.dumps(patient_data)
    }