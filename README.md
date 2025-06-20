# Intellicare

Intellicare is an integrated platform for stroke prediction and patient data management using machine learning and AWS Lambda.

## Project Structure

```
Intellicare/
├── intellicare/
│   ├── public/
│   ├── src/
│   └── ...
├── stroke-prediction-mlops/
│   ├── deployment/
│   │   ├── lambda_handler.py
│   │   ├── lambda_metadata_chunk.py
│   │   ├── lambda_vectorize_store.py
│   │   ├── lambda_decision_triggers.py
│   │   └── lambda_patient_data.py
│   ├── model/
│   │   ├── stroke-model.joblib
│   │   └── label_encoders.joblib
│   ├── src/
│   │   ├── train.py
│   │   ├── ingest_kinesis.py
│   │   ├── process_glue.py
│   │   ├── health_omnis.py
│   │   ├── health_imaging.py
│   │   ├── comprehend_medical.py
│   │   ├── healthscribe.py
│   │   └── rules_engine.py
│   └── requirements.txt
└── README.md
```

## Data

The main dataset used for model training is:
- `stroke-prediction-mlops/src/data/healthcare-dataset-stroke-data.csv`

This dataset contains anonymized patient health records, including demographics, medical history, vital signs, and stroke-related features.  
**Note:** Ensure this file exists before running the training script.

## Getting Started

### 1. Install Dependencies

Navigate to the MLOps directory and install Python dependencies:

```bash
cd stroke-prediction-mlops
pip install -r requirements.txt
```

### 2. Train the Model

From the `src` directory, run:

```bash
cd src
python train.py
```

This will generate the trained model and encoders in the `model/` directory.

### 3. Deploy Lambda Functions

#### a. Stroke Prediction Lambda

- **File:** `deployment/lambda_handler.py`
- **Purpose:** Receives patient data and returns stroke risk prediction.
- **Deployment Steps:**
  1. Package `lambda_handler.py`, `../model/stroke-model.joblib`, and `../model/label_encoders.joblib` together.
  2. Deploy to AWS Lambda using the AWS Console or AWS CLI.
  3. Set the handler to `lambda_handler.lambda_handler`.
  4. (Optional) Use API Gateway to expose as an HTTP endpoint.

#### b. Metadata & Chunk Lambda

- **File:** `deployment/lambda_metadata_chunk.py`
- **Purpose:** Processes incoming data, extracts metadata, and chunks as needed.

#### c. Vectorize & Store Lambda

- **File:** `deployment/lambda_vectorize_store.py`
- **Purpose:** Calls embedding models and stores vectors in OpenSearch.

#### d. Decision Triggers Lambda

- **File:** `deployment/lambda_decision_triggers.py`
- **Purpose:** Uses generative models to trigger alerts/notifications.

#### e. Patient Data Lambda

- **File:** `deployment/lambda_patient_data.py`
- **Purpose:** Returns mock or real patient data.

### 4. Test Lambda Functions Locally

Create a test script (e.g., `test_lambda.py`) and invoke the handler:

```python
from lambda_handler import lambda_handler

event = {
    "body": '{"age": 67, "gender": "male", ...}'  # Fill with required fields
}
context = None

response = lambda_handler(event, context)
print(response)
```

### 5. Frontend

The React frontend is in the `intellicare` directory.  
Install dependencies and start the app:

```bash
cd ../intellicare
npm install
npm start
```

### 6. Environment & Requirements

- Python 3.7+
- Node.js 16+
- AWS account for Lambda deployment

---

## Notes

- Update data paths in scripts if your structure changes.