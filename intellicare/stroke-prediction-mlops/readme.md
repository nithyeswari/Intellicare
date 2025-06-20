# Stroke Prediction MLOps

This directory contains all code and resources for the stroke prediction machine learning operations (MLOps) pipeline, including model training, Lambda deployment, and patient data simulation.

## Structure

```
stroke-prediction-mlops/
├── deployment/
│   ├── lambda_handler.py        # Lambda for stroke prediction inference
│   └── patient_data_lambda.py   # Lambda for fetching patient data (example)
├── model/
│   ├── stroke-model.joblib      # Trained ML model (generated after training)
│   └── label_encoders.joblib    # Label encoders for categorical features
├── src/
│   ├── train.py                 # Script to train the ML model
│   └── patient.py               # Lambda-style function for patient data (example)
├── requirements.txt             # Python dependencies
```

## Usage

### 1. Install Dependencies

```bash
pip install -r requirements.txt
```

### 2. Train the Model

From the `src/` directory:

```bash
python train.py
```

- This will train the XGBoost model and save the model and encoders in the `model/` directory.

### 3. Lambda Functions

#### a. Stroke Prediction Lambda

- **File:** `deployment/lambda_handler.py`
- **Purpose:** Receives patient data and returns a stroke risk prediction and confidence.
- **Deployment:** Package with `model/` directory and deploy to AWS Lambda.

#### b. Patient Data Lambda

- **File:** `src/patient.py` or `deployment/patient_data_lambda.py`
- **Purpose:** Returns mock (or real) patient data for testing or integration.
- **Deployment:** Deploy as a Lambda function or use locally for testing.

### 4. Testing Lambda Locally

You can test Lambda functions locally by creating a test script, e.g.:

```python
from lambda_handler import lambda_handler

event = {
    "body": '{"age": 67, "gender": "male", ...}'  # Fill with required fields
}
context = None

response = lambda_handler(event, context)
print(response)
```

### 5. Requirements

- Python 3.7+
- See `requirements.txt` for dependencies.

## Notes

- Update the data paths in scripts if your directory structure changes.
- For production, connect the patient data Lambda to a real database.
- Ensure the model and encoders are included when deploying Lambda