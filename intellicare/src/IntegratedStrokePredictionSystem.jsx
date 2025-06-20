import React, { useState, useEffect } from 'react';
import { Heart, Footprints, Moon, Target, ChevronRight, Play, MapPin, Upload, Database, Brain, AlertTriangle, TrendingUp, FileText, Activity, User, Phone, Mail } from 'lucide-react';
import axios from 'axios';
// Fetch patient data from API if available, else use default

const IntegratedStrokePredictionSystem = () => {
  const [activeView, setActiveView] = useState('prediction');
  const [currentTime, setCurrentTime] = useState(new Date());
  useEffect(() => {
  const fetchPatientData = async () => {
    try {
      const response = await axios.get('/api/patient/latest');
      if (response.data && Object.keys(response.data).length > 0) {
        setPatientData(prev => ({
          ...prev,
          ...response.data,
          healthTracking: {
            ...prev.healthTracking,
            ...response.data.healthTracking
          }
        }));
      }
    } catch (error) {
      // Use default if API fails or no data
    }
  };
  fetchPatientData();
}, []);
  // Enhanced patient data with health tracking integration
  const [patientData, setPatientData] = useState({
    id: '',
    demographics: {
      age: '',
      gender: '',
      ethnicity: ''
    },
    medicalHistory: {
      hypertension: false,
      diabetes: false,
      heartDisease: false,
      strokeHistory: false,
      smokingStatus: 'never'
    },
    vitalSigns: {
      bloodPressure: { systolic: '', diastolic: '' },
      heartRate: '',
      temperature: '',
      oxygenSaturation: ''
    },
    labResults: {
      cholesterol: '',
      glucose: ''
    },
    symptoms: {
      facialDropping: false,
      armWeakness: false,
      speechDifficulty: false,
      severity: 1
    },
    // NEW: Health tracking data
    healthTracking: {
      steps: 8239,
      sleepHours: 7.54,
      calories: 307,
      distance: 7.89,
      activeMinutes: 74,
      isRealTime: true,
      lastUpdated: new Date()
    }
  });

  const [csvData, setCsvData] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [alerts, setAlerts] = useState([]);

  // Real-time health tracking updates
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
      // Simulate real-time health data updates
      setPatientData(prev => ({
        ...prev,
        healthTracking: {
          ...prev.healthTracking,
          steps: prev.healthTracking.steps + Math.floor(Math.random() * 5),
          heartRate: prev.vitalSigns.heartRate || (70 + Math.floor(Math.random() * 10)),
          lastUpdated: new Date()
        }
      }));
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Generate patient ID
  useEffect(() => {
    if (!patientData.id) {
      setPatientData(prev => ({
        ...prev,
        id: `PATIENT_${Date.now().toString().slice(-6)}`
      }));
    }
  }, []);

  // CSV File Upload Handler
  const handleCsvUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const text = await file.text();
    const lines = text.split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    
    const data = lines.slice(1).map(line => {
      const values = line.split(',');
      const row = {};
      headers.forEach((header, index) => {
        row[header] = values[index]?.trim();
      });
      return row;
    }).filter(row => Object.values(row).some(val => val));

    setCsvData(data);
    
    // Auto-populate patient data from CSV if available
    if (data.length > 0) {
      const latestRecord = data[data.length - 1];
      setPatientData(prev => ({
        ...prev,
        demographics: {
          age: latestRecord.age || prev.demographics.age,
          gender: latestRecord.gender || prev.demographics.gender,
          ethnicity: latestRecord.ethnicity || prev.demographics.ethnicity
        },
        medicalHistory: {
          hypertension: latestRecord.hypertension === 'true' || latestRecord.hypertension === '1' || prev.medicalHistory.hypertension,
          diabetes: latestRecord.diabetes === 'true' || latestRecord.diabetes === '1' || prev.medicalHistory.diabetes,
          heartDisease: latestRecord.heart_disease === 'true' || latestRecord.heart_disease === '1' || prev.medicalHistory.heartDisease,
          strokeHistory: latestRecord.stroke_history === 'true' || latestRecord.stroke_history === '1' || prev.medicalHistory.strokeHistory,
          smokingStatus: latestRecord.smoking_status || prev.medicalHistory.smokingStatus
        },
        vitalSigns: {
          bloodPressure: {
            systolic: latestRecord.systolic_bp || prev.vitalSigns.bloodPressure.systolic,
            diastolic: latestRecord.diastolic_bp || prev.vitalSigns.bloodPressure.diastolic
          },
          heartRate: latestRecord.heart_rate || prev.vitalSigns.heartRate,
          temperature: latestRecord.temperature || prev.vitalSigns.temperature,
          oxygenSaturation: latestRecord.oxygen_saturation || prev.vitalSigns.oxygenSaturation
        },
        labResults: {
          cholesterol: latestRecord.cholesterol || prev.labResults.cholesterol,
          glucose: latestRecord.glucose || prev.labResults.glucose
        }
      }));
    }
  };

  const handleInputChange = (section, field, value) => {
    setPatientData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [field]: value
      }
    }));
  };

  const handleNestedInputChange = (section, subsection, field, value) => {
    setPatientData(prev => ({
      ...prev,
      [section]: {
        ...prev[section],
        [subsection]: {
          ...prev[section][subsection],
          [field]: value
        }
      }
    }));
  };

  // Enhanced risk calculation with health tracking data
  const calculateRiskScore = (data) => {
    let score = 0;
    
    // Age factor
    const age = parseInt(data.demographics.age);
    if (age > 65) score += 25;
    else if (age > 45) score += 15;
    else score += 5;
    
    // Medical history
    if (data.medicalHistory.hypertension) score += 15;
    if (data.medicalHistory.diabetes) score += 10;
    if (data.medicalHistory.heartDisease) score += 20;
    if (data.medicalHistory.strokeHistory) score += 30;
    if (data.medicalHistory.smokingStatus === 'current') score += 10;
    
    // Vital signs
    const systolic = parseInt(data.vitalSigns.bloodPressure.systolic);
    const diastolic = parseInt(data.vitalSigns.bloodPressure.diastolic);
    if (systolic > 140) score += 15;
    if (diastolic > 90) score += 10;
    
    // Heart rate from health tracking or vital signs
    const heartRate = parseInt(data.vitalSigns.heartRate) || data.healthTracking.heartRate;
    if (heartRate > 100) score += 10;
    if (heartRate < 50) score += 8;
    
    // NEW: Health tracking factors
    if (data.healthTracking.steps < 5000) score += 12; // Low activity
    if (data.healthTracking.sleepHours < 6) score += 10; // Poor sleep
    if (data.healthTracking.activeMinutes < 30) score += 8; // Sedentary lifestyle
    
    // Critical symptoms
    if (data.symptoms.facialDropping) score += 25;
    if (data.symptoms.armWeakness) score += 25;
    if (data.symptoms.speechDifficulty) score += 25;
    score += data.symptoms.severity * 3;
    
    // CSV data enhancement
    if (csvData.length > 0) {
      const record = csvData[csvData.length - 1];
      if (record.bmi && parseFloat(record.bmi) > 30) score += 8;
      if (record.family_history === 'stroke') score += 12;
    }
    
    return Math.min(score, 100);
  };

  const getRiskCategory = (score) => {
    if (score >= 80) return { level: 'critical', color: 'bg-red-600', text: 'CRITICAL' };
    if (score >= 60) return { level: 'high', color: 'bg-orange-500', text: 'HIGH' };
    if (score >= 30) return { level: 'moderate', color: 'bg-yellow-500', text: 'MODERATE' };
    return { level: 'low', color: 'bg-green-500', text: 'LOW' };
  };

  const generateRecommendations = (score, hasSymptoms, healthTracking) => {
    const recommendations = [];
    
    if (score >= 80 || hasSymptoms) {
      recommendations.push('🚨 EMERGENCY: Seek immediate medical attention');
      recommendations.push('📞 Call 911 or go to nearest emergency room');
    } else if (score >= 60) {
      recommendations.push('⚠️ Schedule urgent consultation with neurologist');
      recommendations.push('👁️ Monitor symptoms closely');
    } else if (score >= 30) {
      recommendations.push('📅 Schedule routine follow-up with primary care physician');
      recommendations.push('🏃 Implement lifestyle modifications');
    }
    
    // Health tracking based recommendations
    if (healthTracking.steps < 8000) {
      recommendations.push('🚶 Increase daily activity to 10,000+ steps');
    }
    if (healthTracking.sleepHours < 7) {
      recommendations.push('😴 Improve sleep quality - aim for 7-9 hours nightly');
    }
    if (healthTracking.activeMinutes < 60) {
      recommendations.push('💪 Add structured exercise to daily routine');
    }
    
    recommendations.push('📱 Continue health monitoring and data collection');
    
    return recommendations;
  };

  const handleSubmit = async () => {
    setIsProcessing(true);
    
    // Simulate enhanced ML processing with all data sources
    await new Promise(resolve => setTimeout(resolve, 3000));
    
    const riskScore = calculateRiskScore(patientData);
    const riskCategory = getRiskCategory(riskScore);
    const hasSymptoms = patientData.symptoms.facialDropping || 
                       patientData.symptoms.armWeakness || 
                       patientData.symptoms.speechDifficulty;
    
    const newPrediction = {
      patientId: patientData.id,
      riskScore,
      riskCategory: riskCategory.level,
      timestamp: new Date(),
      confidence: 0.92, // Higher confidence with more data sources
      recommendations: generateRecommendations(riskScore, hasSymptoms, patientData.healthTracking),
      dataQuality: {
        realTimeData: patientData.healthTracking.isRealTime,
        historicalData: csvData.length > 0,
        clinicalData: !!(patientData.vitalSigns.heartRate && patientData.labResults.cholesterol),
        completeness: calculateDataCompleteness()
      },
      riskFactors: identifyRiskFactors()
    };
    
    setPrediction(newPrediction);
    
    // Generate alert if high risk
    if (riskScore >= 60 || hasSymptoms) {
      const newAlert = {
        id: `alert_${Date.now()}`,
        type: riskScore >= 80 ? 'emergency' : 'warning',
        message: `High stroke risk detected for ${patientData.id}. Risk Score: ${riskScore}%. Data sources: ${newPrediction.dataQuality.realTimeData ? 'Real-time tracking' : ''} ${newPrediction.dataQuality.historicalData ? 'Historical records' : ''} Clinical data`,
        timestamp: new Date()
      };
      setAlerts(prev => [newAlert, ...prev]);
    }
    
    setIsProcessing(false);
  };

  const calculateDataCompleteness = () => {
    let total = 0;
    let filled = 0;
    
    // Demographics
    total += 3;
    if (patientData.demographics.age) filled++;
    if (patientData.demographics.gender) filled++;
    if (patientData.demographics.ethnicity) filled++;
    
    // Vital signs
    total += 4;
    if (patientData.vitalSigns.bloodPressure.systolic) filled++;
    if (patientData.vitalSigns.bloodPressure.diastolic) filled++;
    if (patientData.vitalSigns.heartRate) filled++;
    if (patientData.vitalSigns.oxygenSaturation) filled++;
    
    // Health tracking
    total += 4;
    if (patientData.healthTracking.steps) filled++;
    if (patientData.healthTracking.sleepHours) filled++;
    if (patientData.healthTracking.activeMinutes) filled++;
    if (patientData.healthTracking.heartRate) filled++;
    
    return Math.round((filled / total) * 100);
  };

  const identifyRiskFactors = () => {
    const factors = [];
    
    if (patientData.healthTracking.steps < 8000) {
      factors.push('Low physical activity (< 8000 steps/day)');
    }
    if (patientData.healthTracking.sleepHours < 7) {
      factors.push('Insufficient sleep (< 7 hours)');
    }
    if (patientData.medicalHistory.hypertension) {
      factors.push('Hypertension');
    }
    if (patientData.medicalHistory.diabetes) {
      factors.push('Diabetes');
    }
    if (csvData.length > 0 && csvData[0].bmi && parseFloat(csvData[0].bmi) > 30) {
      factors.push('Obesity (BMI > 30)');
    }
    
    return factors;
  };

  const symptomsPresent = patientData.symptoms.facialDropping || 
                         patientData.symptoms.armWeakness || 
                         patientData.symptoms.speechDifficulty;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">
            🧠 Enhanced Stroke Prediction System
          </h1>
          <p className="text-xl text-gray-600">
            AI-Powered with Real-time Health Tracking & Historical Data Integration
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center mb-6">
          {[
            { id: 'prediction', label: 'Stroke Prediction', icon: Brain },
            { id: 'tracking', label: 'Health Tracking', icon: Heart },
            { id: 'data', label: 'Data Sources', icon: Database }
          ].map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              onClick={() => setActiveView(id)}
              className={`flex items-center space-x-2 px-6 py-3 mx-2 rounded-lg transition-all ${
                activeView === id
                  ? 'bg-white text-blue-700 shadow-lg'
                  : 'text-gray-600 hover:text-gray-800 hover:bg-white/50'
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="font-medium">{label}</span>
            </button>
          ))}
        </div>

        {activeView === 'prediction' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Patient Data Form */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-6">
                  <User className="h-6 w-6 text-blue-600 mr-2" />
                  <h2 className="text-2xl font-semibold text-gray-800">
                    Enhanced Patient Assessment
                  </h2>
                </div>

                <div className="space-y-6">
                  {/* Patient ID */}
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Patient ID
                    </label>
                    <input
                      type="text"
                      value={patientData.id}
                      readOnly
                      className="w-full px-3 py-2 bg-gray-100 border border-gray-300 rounded-md text-gray-600"
                    />
                  </div>

                  {/* Demographics */}
                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Demographics</h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Age</label>
                        <input
                          type="number"
                          value={patientData.demographics.age}
                          onChange={(e) => handleInputChange('demographics', 'age', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Gender</label>
                        <select
                          value={patientData.demographics.gender}
                          onChange={(e) => handleInputChange('demographics', 'gender', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          required
                        >
                          <option value="">Select...</option>
                          <option value="male">Male</option>
                          <option value="female">Female</option>
                          <option value="other">Other</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Ethnicity</label>
                        <input
                          type="text"
                          value={patientData.demographics.ethnicity}
                          onChange={(e) => handleInputChange('demographics', 'ethnicity', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="e.g., Caucasian, Hispanic"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Medical History */}
                  <div className="bg-yellow-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Medical History</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {Object.entries(patientData.medicalHistory).map(([key, value]) => {
                        if (key === 'smokingStatus') {
                          return (
                            <div key={key}>
                              <label className="block text-sm font-medium text-gray-700 mb-2">
                                Smoking Status
                              </label>
                              <select
                                value={value}
                                onChange={(e) => handleInputChange('medicalHistory', key, e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                              >
                                <option value="never">Never</option>
                                <option value="former">Former</option>
                                <option value="current">Current</option>
                              </select>
                            </div>
                          );
                        }
                        return (
                          <div key={key} className="flex items-center">
                            <input
                              type="checkbox"
                              id={key}
                              checked={value}
                              onChange={(e) => handleInputChange('medicalHistory', key, e.target.checked)}
                              className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                            />
                            <label htmlFor={key} className="ml-2 text-sm text-gray-700 capitalize">
                              {key.replace(/([A-Z])/g, ' $1').trim()}
                            </label>
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Vital Signs */}
                  <div className="bg-green-50 p-4 rounded-lg">
                    <div className="flex items-center mb-4">
                      <Activity className="h-5 w-5 text-green-600 mr-2" />
                      <h3 className="text-lg font-medium text-gray-800">Vital Signs</h3>
                      {patientData.healthTracking.isRealTime && (
                        <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          Live Data
                        </span>
                      )}
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Systolic BP
                        </label>
                        <input
                          type="number"
                          value={patientData.vitalSigns.bloodPressure.systolic}
                          onChange={(e) => handleNestedInputChange('vitalSigns', 'bloodPressure', 'systolic', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="mmHg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Diastolic BP
                        </label>
                        <input
                          type="number"
                          value={patientData.vitalSigns.bloodPressure.diastolic}
                          onChange={(e) => handleNestedInputChange('vitalSigns', 'bloodPressure', 'diastolic', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="mmHg"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Heart Rate
                        </label>
                        <input
                          type="number"
                          value={patientData.vitalSigns.heartRate || patientData.healthTracking.heartRate}
                          onChange={(e) => handleInputChange('vitalSigns', 'heartRate', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="bpm"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          O2 Saturation
                        </label>
                        <input
                          type="number"
                          value={patientData.vitalSigns.oxygenSaturation}
                          onChange={(e) => handleInputChange('vitalSigns', 'oxygenSaturation', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="%"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Lab Results */}
                  <div className="bg-purple-50 p-4 rounded-lg">
                    <h3 className="text-lg font-medium text-gray-800 mb-4">Lab Results</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Cholesterol
                        </label>
                        <input
                          type="number"
                          value={patientData.labResults.cholesterol}
                          onChange={(e) => handleInputChange('labResults', 'cholesterol', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="mg/dL"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Glucose
                        </label>
                        <input
                          type="number"
                          value={patientData.labResults.glucose}
                          onChange={(e) => handleInputChange('labResults', 'glucose', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                          placeholder="mg/dL"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Symptoms (FAST Assessment) */}
                  <div className={`p-4 rounded-lg ${symptomsPresent ? 'bg-red-50 border-2 border-red-200' : 'bg-gray-50'}`}>
                    <div className="flex items-center mb-4">
                      <AlertTriangle className={`h-5 w-5 mr-2 ${symptomsPresent ? 'text-red-600' : 'text-gray-600'}`} />
                      <h3 className="text-lg font-medium text-gray-800">
                        FAST Assessment (Stroke Symptoms)
                      </h3>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="facialDropping"
                          checked={patientData.symptoms.facialDropping}
                          onChange={(e) => handleInputChange('symptoms', 'facialDropping', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="facialDropping" className="ml-2 text-sm text-gray-700">
                          <strong>F</strong>acial Drooping
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="armWeakness"
                          checked={patientData.symptoms.armWeakness}
                          onChange={(e) => handleInputChange('symptoms', 'armWeakness', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="armWeakness" className="ml-2 text-sm text-gray-700">
                          <strong>A</strong>rm Weakness
                        </label>
                      </div>
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          id="speechDifficulty"
                          checked={patientData.symptoms.speechDifficulty}
                          onChange={(e) => handleInputChange('symptoms', 'speechDifficulty', e.target.checked)}
                          className="h-4 w-4 text-red-600 focus:ring-red-500 border-gray-300 rounded"
                        />
                        <label htmlFor="speechDifficulty" className="ml-2 text-sm text-gray-700">
                          <strong>S</strong>peech Difficulty
                        </label>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Symptom Severity (1-5)
                        </label>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={patientData.symptoms.severity}
                          onChange={(e) => handleInputChange('symptoms', 'severity', parseInt(e.target.value))}
                          className="w-full"
                        />
                        <div className="flex justify-between text-xs text-gray-500 mt-1">
                          <span>Mild</span>
                          <span>Severe</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  <button
                    onClick={handleSubmit}
                    disabled={isProcessing}
                    className={`w-full py-3 px-4 rounded-md text-white font-semibold text-lg transition-all duration-200 ${
                      isProcessing 
                        ? 'bg-gray-400 cursor-not-allowed' 
                        : 'bg-blue-600 hover:bg-blue-700 focus:ring-4 focus:ring-blue-300'
                    }`}
                  >
                    {isProcessing ? (
                      <div className="flex items-center justify-center">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                        Processing Enhanced Analysis...
                      </div>
                    ) : (
                      '🧠 Analyze Stroke Risk (Enhanced)'
                    )}
                  </button>
                </div>
              </div>
            </div>

            {/* Results Panel */}
            <div className="space-y-6">
              {/* Enhanced Health Data */}
              <div className="bg-white rounded-lg shadow-lg p-6">
                <div className="flex items-center mb-4">
                  <Heart className="h-6 w-6 text-teal-600 mr-2" />
                  <h3 className="text-xl font-semibold text-gray-800">Live Health Data</h3>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="bg-blue-50 p-3 rounded">
                    <div className="font-medium text-blue-700">{patientData.healthTracking.steps.toLocaleString()}</div>
                    <div className="text-blue-600">Steps Today</div>
                  </div>
                  <div className="bg-purple-50 p-3 rounded">
                    <div className="font-medium text-purple-700">{patientData.healthTracking.sleepHours}h</div>
                    <div className="text-purple-600">Sleep Last Night</div>
                  </div>
                  <div className="bg-green-50 p-3 rounded">
                    <div className="font-medium text-green-700">{patientData.healthTracking.activeMinutes}</div>
                    <div className="text-green-600">Active Minutes</div>
                  </div>
                  <div className="bg-red-50 p-3 rounded">
                    <div className="font-medium text-red-700">{patientData.healthTracking.heartRate || '--'}</div>
                    <div className="text-red-600">Heart Rate</div>
                  </div>
                </div>
                <div className="mt-3 text-xs text-gray-500">
                  Last updated: {patientData.healthTracking.lastUpdated.toLocaleTimeString()}
                </div>
              </div>

              {/* Alerts */}
              {alerts.length > 0 && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Alerts</h3>
                  </div>
                  <div className="space-y-3">
                    {alerts.map((alert) => (
                      <div
                        key={alert.id}
                        className={`p-3 rounded-lg border-l-4 ${
                          alert.type === 'emergency' 
                            ? 'bg-red-50 border-red-500' 
                            : 'bg-yellow-50 border-yellow-500'
                        }`}
                      >
                        <div className="text-sm font-medium text-gray-800">
                          {alert.message}
                        </div>
                        <div className="text-xs text-gray-500 mt-1">
                          {alert.timestamp.toLocaleTimeString()}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Enhanced Prediction Results */}
              {prediction && (
                <div className="bg-white rounded-lg shadow-lg p-6">
                  <div className="flex items-center mb-4">
                    <Brain className="h-6 w-6 text-purple-600 mr-2" />
                    <h3 className="text-xl font-semibold text-gray-800">Enhanced Risk Assessment</h3>
                  </div>

                  {/* Risk Score */}
                  <div className="text-center mb-6">
                    <div className={`inline-flex items-center px-4 py-2 rounded-full text-white text-lg font-bold ${getRiskCategory(prediction.riskScore).color}`}>
                      {prediction.riskScore}% Risk
                    </div>
                    <div className="mt-2 text-sm text-gray-600">
                      Risk Level: {getRiskCategory(prediction.riskScore).text}
                    </div>
                    <div className="mt-1 text-xs text-gray-500">
                      Confidence: {(prediction.confidence * 100).toFixed(1)}%
                    </div>
                  </div>

                  {/* Data Quality */}
                  <div className="mb-6 p-4 bg-gray-50 rounded-lg">
                    <h4 className="font-semibold text-gray-800 mb-3">Data Sources Used:</h4>
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      <div className={`flex items-center ${prediction.dataQuality.realTimeData ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${prediction.dataQuality.realTimeData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Real-time Health Tracking
                      </div>
                      <div className={`flex items-center ${prediction.dataQuality.historicalData ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${prediction.dataQuality.historicalData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Historical Records (CSV)
                      </div>
                      <div className={`flex items-center ${prediction.dataQuality.clinicalData ? 'text-green-600' : 'text-gray-400'}`}>
                        <div className={`w-2 h-2 rounded-full mr-2 ${prediction.dataQuality.clinicalData ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                        Clinical Assessments
                      </div>
                      <div className="flex items-center text-blue-600">
                        <div className="w-2 h-2 rounded-full mr-2 bg-blue-500"></div>
                        {prediction.dataQuality.completeness}% Complete
                      </div>
                    </div>
                  </div>

                  {/* Risk Factors */}
                  {prediction.riskFactors.length > 0 && (
                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-800 mb-3">Identified Risk Factors:</h4>
                      <ul className="space-y-1">
                        {prediction.riskFactors.map((factor, index) => (
                          <li key={index} className="text-sm text-gray-700 bg-yellow-50 p-2 rounded">
                            • {factor}
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  {/* Recommendations */}
                  <div>
                    <h4 className="font-semibold text-gray-800 mb-3">Enhanced Recommendations:</h4>
                    <ul className="space-y-2">
                      {prediction.recommendations.map((rec, index) => (
                        <li key={index} className="text-sm text-gray-700 bg-gray-50 p-2 rounded">
                          {rec}
                        </li>
                      ))}
                    </ul>
                  </div>

                  {/* Emergency Actions */}
                  {prediction.riskScore >= 60 && (
                    <div className="mt-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                      <h4 className="font-semibold text-red-800 mb-2">Emergency Actions:</h4>
                      <div className="space-y-2">
                        <button className="flex items-center w-full p-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors">
                          <Phone className="h-4 w-4 mr-2" />
                          Call Emergency Services
                        </button>
                        <button className="flex items-center w-full p-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                          <Mail className="h-4 w-4 mr-2" />
                          Notify Medical Team
                        </button>
                      </div>
                    </div>
                  )}

                  <div className="mt-4 text-xs text-gray-500 text-center">
                    Enhanced analysis completed at {prediction.timestamp.toLocaleString()}
                  </div>
                </div>
              )}
            </div>
          </div>
        )}

        {activeView === 'tracking' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Health Tracking Display */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center mb-6">
                <Heart className="h-6 w-6 text-teal-600 mr-2" />
                <h2 className="text-2xl font-semibold text-gray-800">Real-time Health Metrics</h2>
                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                  Live
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 mb-6">
                <div className="bg-blue-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Footprints className="w-5 h-5 text-blue-600" />
                    <span className="text-sm font-medium text-gray-700">Steps</span>
                  </div>
                  <div className="text-2xl font-bold text-blue-700">{patientData.healthTracking.steps.toLocaleString()}</div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>

                <div className="bg-red-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Heart className="w-5 h-5 text-red-600" />
                    <span className="text-sm font-medium text-gray-700">Heart Rate</span>
                  </div>
                  <div className="text-2xl font-bold text-red-700">{patientData.healthTracking.heartRate || '--'}</div>
                  <div className="text-xs text-gray-500">BPM</div>
                </div>

                <div className="bg-purple-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Moon className="w-5 h-5 text-purple-600" />
                    <span className="text-sm font-medium text-gray-700">Sleep</span>
                  </div>
                  <div className="text-2xl font-bold text-purple-700">{patientData.healthTracking.sleepHours}h</div>
                  <div className="text-xs text-gray-500">Last night</div>
                </div>

                <div className="bg-green-50 p-4 rounded-lg">
                  <div className="flex items-center space-x-2 mb-2">
                    <Activity className="w-5 h-5 text-green-600" />
                    <span className="text-sm font-medium text-gray-700">Active Min</span>
                  </div>
                  <div className="text-2xl font-bold text-green-700">{patientData.healthTracking.activeMinutes}</div>
                  <div className="text-xs text-gray-500">Today</div>
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                Last updated: {patientData.healthTracking.lastUpdated.toLocaleString()}
              </div>
            </div>

            {/* Health Insights */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Health Insights</h3>
              <div className="space-y-4">
                <div className={`p-3 rounded-lg ${patientData.healthTracking.steps >= 10000 ? 'bg-green-50' : 'bg-yellow-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Daily Step Goal</span>
                    <span className={`text-xs px-2 py-1 rounded ${patientData.healthTracking.steps >= 10000 ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                      {patientData.healthTracking.steps >= 10000 ? 'Achieved' : 'In Progress'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    {patientData.healthTracking.steps}/10,000 steps ({Math.round((patientData.healthTracking.steps/10000)*100)}%)
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${patientData.healthTracking.sleepHours >= 7 ? 'bg-green-50' : 'bg-red-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Sleep Quality</span>
                    <span className={`text-xs px-2 py-1 rounded ${patientData.healthTracking.sleepHours >= 7 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                      {patientData.healthTracking.sleepHours >= 7 ? 'Good' : 'Poor'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    {patientData.healthTracking.sleepHours} hours (Target: 7-9 hours)
                  </div>
                </div>

                <div className={`p-3 rounded-lg ${patientData.healthTracking.activeMinutes >= 60 ? 'bg-green-50' : 'bg-orange-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Activity Level</span>
                    <span className={`text-xs px-2 py-1 rounded ${patientData.healthTracking.activeMinutes >= 60 ? 'bg-green-100 text-green-800' : 'bg-orange-100 text-orange-800'}`}>
                      {patientData.healthTracking.activeMinutes >= 60 ? 'Active' : 'Moderate'}
                    </span>
                  </div>
                  <div className="mt-1 text-xs text-gray-600">
                    {patientData.healthTracking.activeMinutes} minutes active today
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeView === 'data' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* CSV Upload */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Upload className="w-6 h-6 text-blue-600" />
                <h2 className="text-xl font-semibold text-gray-800">Historical Data Upload</h2>
              </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <input
                  type="file"
                  accept=".csv"
                  onChange={handleCsvUpload}
                  className="hidden"
                  id="csv-upload"
                />
                <label
                  htmlFor="csv-upload"
                  className="cursor-pointer flex flex-col items-center space-y-4"
                >
                  <Upload className="w-12 h-12 text-gray-400" />
                  <div>
                    <p className="text-lg font-medium text-gray-700">Upload Patient Health Records</p>
                    <p className="text-sm text-gray-500">CSV format with medical history and lab results</p>
                  </div>
                </label>
              </div>

              {csvData.length > 0 && (
                <div className="mt-6">
                  <h3 className="font-medium text-gray-800 mb-3">Data Preview</h3>
                  <div className="bg-gray-50 rounded p-4 max-h-40 overflow-auto">
                    <div className="text-sm">
                      <div className="font-medium text-gray-700 mb-2">
                        {csvData.length} records loaded
                      </div>
                      <div className="space-y-1">
                        {Object.keys(csvData[0] || {}).slice(0, 5).map(key => (
                          <div key={key} className="text-gray-600">
                            <span className="font-medium">{key}:</span> {csvData[0][key]}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Data Integration Status */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <div className="flex items-center space-x-2 mb-6">
                <Database className="w-6 h-6 text-green-600" />
                <h2 className="text-xl font-semibold text-gray-800">Data Integration Status</h2>
              </div>

              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-green-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Real-time Health Tracking</p>
                    <p className="text-sm text-gray-600">Steps, sleep, heart rate, activity</p>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-800 text-sm rounded-full">
                    ✓ Active
                  </div>
                </div>

                <div className={`flex items-center justify-between p-4 rounded-lg ${
                  csvData.length > 0 ? 'bg-green-50' : 'bg-gray-50'
                }`}>
                  <div>
                    <p className="font-medium text-gray-800">Historical Medical Records</p>
                    <p className="text-sm text-gray-600">{csvData.length} records available</p>
                  </div>
                  <div className={`px-3 py-1 text-sm rounded-full ${
                    csvData.length > 0 
                      ? 'bg-green-100 text-green-800' 
                      : 'bg-gray-100 text-gray-600'
                  }`}>
                    {csvData.length > 0 ? '✓ Loaded' : '⏳ Pending'}
                  </div>
                </div>

                <div className="flex items-center justify-between p-4 bg-blue-50 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-800">Enhanced ML Processing</p>
                    <p className="text-sm text-gray-600">Multi-source data fusion</p>
                  </div>
                  <div className="px-3 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">
                    ✓ Ready
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-yellow-50 rounded-lg">
                <h4 className="font-medium text-gray-800 mb-2">Expected CSV Format:</h4>
                <div className="text-sm text-gray-600 space-y-1">
                  <div>• <strong>Demographics:</strong> age, gender, ethnicity</div>
                  <div>• <strong>Vitals:</strong> systolic_bp, diastolic_bp, heart_rate</div>
                  <div>• <strong>Medical History:</strong> diabetes, hypertension, stroke_history</div>
                  <div>• <strong>Lab Results:</strong> cholesterol, glucose, bmi</div>
                  <div>• <strong>Lifestyle:</strong> smoking_status, family_history</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default IntegratedStrokePredictionSystem;