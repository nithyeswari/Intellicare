{
 "cells": [
  {
   "cell_type": "code",
   "execution_count": 133,
   "id": "9377486a-8bdb-45ba-92e0-6a0f515a1952",
   "metadata": {},
   "outputs": [
    {
     "name": "stdout",
     "output_type": "stream",
     "text": [
      "Accuracy: 0.5757575757575758\n"
     ]
    },
    {
     "data": {
      "text/plain": [
       "['model/label_encoders.joblib']"
      ]
     },
     "execution_count": 133,
     "metadata": {},
     "output_type": "execute_result"
    }
   ],
   "source": [
    "import pandas as pd\n",
    "import joblib\n",
    "import os\n",
    "from sklearn.model_selection import train_test_split\n",
    "from sklearn.preprocessing import LabelEncoder\n",
    "from xgboost import XGBClassifier\n",
    "from sklearn.metrics import accuracy_score, classification_report\n",
    "\n",
    "# Load data\n",
    "df = pd.read_csv(r'data\\healthcare-dataset-stroke-data.csv')\n",
    "df = df.dropna()\n",
    "\n",
    "# Drop Patient ID (non-predictive)\n",
    "df = df.drop(columns=['Patient ID'])\n",
    "\n",
    "# Label encode categorical columns\n",
    "label_columns = [\n",
    "    'Symptoms', 'Chance of Symptom Occurrence', 'Earliest Occurrence', 'Linkage with Heart Issue',\n",
    "    'Measurement Mode', 'Variance', 'Measurement Frequency', 'Communication Mode',\n",
    "    'Severity Level', 'Duration', 'Gender', 'Smoking Status', 'Alcohol Intake',\n",
    "    'Cholesterol Level', 'Family History', 'Physical Activity', 'Previous Stroke',\n",
    "    'Atrial Fibrillation', 'Residence Type', 'Employment Type', 'Recommended Action'\n",
    "]\n",
    "\n",
    "le_dict = {}\n",
    "for col in label_columns:\n",
    "    df[col] = df[col].astype(str)  # Ensure all are strings for encoding\n",
    "    le = LabelEncoder()\n",
    "    df[col] = le.fit_transform(df[col])\n",
    "    le_dict[col] = le\n",
    "\n",
    "# Convert binary columns to numeric if needed\n",
    "binary_columns = ['Hypertension', 'Diabetes']\n",
    "for col in binary_columns:\n",
    "    df[col] = df[col].astype(str).str.strip().str.lower().map({'yes': 1, 'no': 0, '1': 1, '0': 0}).astype(int)\n",
    "\n",
    "# Define features and label\n",
    "X = df.drop(columns=['Recommended Action'])\n",
    "y = df['Recommended Action']\n",
    "\n",
    "# Train-test split\n",
    "X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)\n",
    "\n",
    "# Train model\n",
    "model = XGBClassifier(\n",
    "    n_estimators=200,\n",
    "    learning_rate=0.1,\n",
    "    max_depth=4,\n",
    "    subsample=0.9,\n",
    "    colsample_bytree=0.8,\n",
    "    random_state=42,\n",
    "    eval_metric='logloss'\n",
    ")\n",
    "model.fit(X_train, y_train)\n",
    "\n",
    "# Evaluate\n",
    "y_pred = model.predict(X_test)\n",
    "print(\"Accuracy:\", accuracy_score(y_test, y_pred))\n",
    "# Save model and encoders\n",
    "os.makedirs('model', exist_ok=True)\n",
    "joblib.dump(model, 'model/stroke-model.joblib')\n",
    "joblib.dump(le_dict, 'model/label_encoders.joblib')\n"
   ]
  },
  {
   "cell_type": "code",
   "execution_count": null,
   "id": "1fc162c7-35a5-4112-a4e3-978fee964021",
   "metadata": {},
   "outputs": [],
   "source": []
  }
 ],
 "metadata": {
  "kernelspec": {
   "display_name": "Python 3 (ipykernel)",
   "language": "python",
   "name": "python3"
  },
  "language_info": {
   "codemirror_mode": {
    "name": "ipython",
    "version": 3
   },
   "file_extension": ".py",
   "mimetype": "text/x-python",
   "name": "python",
   "nbconvert_exporter": "python",
   "pygments_lexer": "ipython3",
   "version": "3.12.7"
  }
 },
 "nbformat": 4,
 "nbformat_minor": 5
}
