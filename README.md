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
│   ├── model/
│   ├── src/
│   └── requirements.txt
└── README.md
```

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

#### b. Patient Data Lambda

- **File:** `src/patient.py` or `deployment/patient_data_lambda.py`
- **Purpose:** Returns mock or real patient data.
- **Deployment Steps:**
  1. Deploy the file as a Lambda function.
  2. Set the handler to `patient.lambda_handler` or `patient_data_lambda.lambda_handler`.
  3. (Optional) Connect to a real database for live data.

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

-