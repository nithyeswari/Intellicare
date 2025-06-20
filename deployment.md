# Stroke Prediction Use Case: Deployment Plan

This deployment plan outlines the steps and components required to operationalize the Intellicare Stroke Prediction system, as illustrated in the architecture diagram.

---

## 1. Data Ingestion & Storage

- **Sources:** Health apps, patient mobile devices, and pre-timed pushes.
- **AWS Services:**  
  - **Amazon S3** and **Amazon DynamoDB** for storing raw and structured patient data.
  - **Amazon API Gateway** and **Scheduler** for ingesting and scheduling data pushes.
  - **Kinesis Data Streams**, **AWS Glue**, and **Amazon MSK** for real-time and batch ingestion and storage.

---

## 2. Data Processing

- **Lambda: Metadata & Chunk**  
  - Processes incoming data streams, extracts metadata, and chunks data for downstream processing.
- **AWS Glue**  
  - ETL jobs for cleaning and transforming patient data.
- **Patient In-house Test Data**  
  - Used for validation and model testing.

---

## 3. AI/ML Core & Feature Engineering

- **AWS HealthOmics, HealthImaging, Comprehend Medical, HealthScribe**  
  - Extracts features from omics, imaging, and clinical notes.
- **AWS SageMaker**  
  - Trains and hosts the stroke prediction model.
- **Model Artifacts:**  
  - Saved in the `stroke-prediction-mlops/model/` directory (`stroke-model.joblib`, `label_encoders.joblib`).

---

## 4. Lambda Functions

- **lambda_handler.py**  
  - Receives patient data and returns stroke risk prediction.
- **lambda_metadata_chunk.py**  
  - Handles metadata extraction and chunking.
- **lambda_vectorize_store.py**  
  - Calls embedding models and stores vectors in OpenSearch.
- **lambda_decision_triggers.py**  
  - Uses generative models to trigger alerts/notifications.
- **lambda_patient_data.py**  
  - Returns mock or real patient data for integration and testing.

---

## 5. Vector Database & Search

- **Amazon OpenSearch**  
  - Stores patient vectors for similarity search and retrieval.
- **Amazon Managed Service for Apache Flink**  
  - Real-time analytics and streaming data processing.

---

## 6. Notification & Alerts

- **Amazon Pinpoint**  
  - Sends notifications and alerts to patients and corporate consumers.
- **Rules Engine**  
  - Evaluates business rules and triggers alerts based on model output and patient data.

---

## 7. Frontend & DevOps

- **AWS Amplify**  
  - Hosts the React frontend and manages CI/CD.
- **Intellicare DevOps**  
  - Coordinates deployment of mobile apps and data science workflows.

---

## 8. Deployment Steps

1. **Prepare Data:**  
   - Ensure `stroke-prediction-mlops/src/data/healthcare-dataset-stroke-data.csv` is available.

2. **Install Dependencies:**  
   ```bash
   cd stroke-prediction-mlops
   pip install -r requirements.txt
   ```

3. **Train Model:**  
   ```bash
   cd src
   python train.py
   ```

4. **Deploy Lambda Functions:**  
   - Package each Lambda handler with required model files and dependencies.
   - Deploy via AWS Console or AWS CLI.
   - Set the correct handler for each Lambda (e.g., `lambda_handler.lambda_handler`).

5. **Configure AWS Services:**  
   - Set up API Gateway, Kinesis, Glue, OpenSearch, Pinpoint, and other required services.
   - Connect Lambda functions to triggers and data sources as per the architecture.

6. **Deploy Frontend:**  
   ```bash
   cd ../intellicare
   npm install
   npm start
   ```
   - Deploy to AWS Amplify for production.

---

## 9. Data Privacy & Compliance

- Ensure all patient data is anonymized and handled according to HIPAA and relevant data privacy regulations.

---

## 10. Monitoring & Maintenance

- Set up CloudWatch for Lambda and service monitoring.
- Regularly retrain and update the model with new data.
- Review and update rules and notification logic as needed.

---

**For detailed code and configuration, see the respective files in each directory.**