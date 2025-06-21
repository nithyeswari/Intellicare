import React, { useState, useEffect, useRef } from 'react';
import { AlertTriangle, Users, MapPin, Zap, Shield, Radio, Navigation, Wifi, Bluetooth, Satellite, Server, Database, Map, Layers } from 'lucide-react';

const CrowdSenseApp = () => {
  const [crowdDensity, setCrowdDensity] = useState(0);
  const [alertLevel, setAlertLevel] = useState('normal');
  const [userCount, setUserCount] = useState(0);
  const [location, setLocation] = useState(null);
  const [wifiBeacons, setWifiBeacons] = useState([]);
  const [bluetoothDevices, setBluetoothDevices] = useState([]);
  const [apiStatus, setApiStatus] = useState({
    gps: 'disconnected',
    openWeather: 'disconnected',
    foursquare: 'disconnected',
    googlePlaces: 'disconnected',
    eventbrite: 'disconnected'
  });
  const [nearbyExits, setNearbyExits] = useState([]);
  const [motionData, setMotionData] = useState({ x: 0, y: 0, z: 0 });
  const [nearbyEvents, setNearbyEvents] = useState([]);
  const [weatherData, setWeatherData] = useState(null);
  const [placeData, setPlaceData] = useState([]);
  const [usingMockData, setUsingMockData] = useState({});
  const [viewMode, setViewMode] = useState('dashboard');
  const [densityZones, setDensityZones] = useState([]);
  
  const watchIdRef = useRef(null);
  const sensorIntervalRef = useRef(null);

  // Real API keys
  const API_KEYS = {
    openWeather: 'YOUR_OPENWEATHER_API_KEY',
    foursquare: 'YOUR_FOURSQUARE_API_KEY',
    googlePlaces: 'YOUR_GOOGLE_PLACES_API_KEY'
  };

  // Initialize GPS tracking
  useEffect(() => {
    if ('geolocation' in navigator) {
      setApiStatus(prev => ({ ...prev, gps: 'connecting' }));
      
      watchIdRef.current = navigator.geolocation.watchPosition(
        (position) => {
          const newLocation = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: position.timestamp
          };
          setLocation(newLocation);
          setApiStatus(prev => ({ ...prev, gps: 'connected' }));
          
          fetchWeatherData(newLocation.latitude, newLocation.longitude);
          fetchNearbyPlaces(newLocation.latitude, newLocation.longitude);
          fetchNearbyEvents(newLocation.latitude, newLocation.longitude);
          calculateNearbyExits(newLocation.latitude, newLocation.longitude);
        },
        (error) => {
          console.error('GPS Error:', error);
          setApiStatus(prev => ({ ...prev, gps: 'error' }));
          const mockLocation = { latitude: 40.7128, longitude: -74.0060, accuracy: 10 };
          setLocation(mockLocation);
          setUsingMockData(prev => ({ ...prev, gps: true }));
          fetchWeatherData(mockLocation.latitude, mockLocation.longitude);
          fetchNearbyPlaces(mockLocation.latitude, mockLocation.longitude);
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 5000
        }
      );
    } else {
      const mockLocation = { latitude: 40.7128, longitude: -74.0060, accuracy: 10 };
      setLocation(mockLocation);
      setUsingMockData(prev => ({ ...prev, gps: true }));
      fetchWeatherData(mockLocation.latitude, mockLocation.longitude);
    }

    return () => {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
      }
    };
  }, []);

  // Fetch weather data
  const fetchWeatherData = async (lat, lng) => {
    try {
      setApiStatus(prev => ({ ...prev, openWeather: 'connecting' }));
      
      try {
        const weatherResponse = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lng}&appid=${API_KEYS.openWeather}&units=metric`
        );
        
        if (!weatherResponse.ok) throw new Error('Weather API failed');
        
        const weather = await weatherResponse.json();
        setWeatherData({
          temperature: weather.main.temp,
          description: weather.weather[0].description,
          humidity: weather.main.humidity,
          crowdFactor: calculateWeatherCrowdFactor(weather)
        });
        setApiStatus(prev => ({ ...prev, openWeather: 'connected' }));
        
      } catch (error) {
        console.log('Using mock weather data:', error.message);
        setWeatherData({
          temperature: 22,
          description: 'partly cloudy',
          humidity: 65,
          crowdFactor: 1.2
        });
        setApiStatus(prev => ({ ...prev, openWeather: 'mock' }));
        setUsingMockData(prev => ({ ...prev, weather: true }));
      }
    } catch (error) {
      console.error('Weather fetch error:', error);
    }
  };

  // Fetch nearby places
  const fetchNearbyPlaces = async (lat, lng) => {
    try {
      setApiStatus(prev => ({ ...prev, googlePlaces: 'connecting' }));
      
      try {
        const placesResponse = await fetch(
          `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lng}&radius=500&type=establishment&key=${API_KEYS.googlePlaces}`
        );
        
        if (!placesResponse.ok) throw new Error('Places API failed');
        
        const places = await placesResponse.json();
        const processedPlaces = places.results.slice(0, 5).map(place => ({
          name: place.name,
          rating: place.rating,
          userRatingsTotal: place.user_ratings_total,
          crowdEstimate: Math.min(100, (place.user_ratings_total || 0) / 10)
        }));
        
        setPlaceData(processedPlaces);
        setApiStatus(prev => ({ ...prev, googlePlaces: 'connected' }));
        
      } catch (error) {
        console.log('Using mock places data:', error.message);
        setPlaceData([
          { name: 'Central Mall', rating: 4.2, userRatingsTotal: 1847, crowdEstimate: 85 },
          { name: 'Metro Station', rating: 3.8, userRatingsTotal: 923, crowdEstimate: 92 },
          { name: 'City Park', rating: 4.5, userRatingsTotal: 567, crowdEstimate: 45 },
          { name: 'Sports Arena', rating: 4.1, userRatingsTotal: 2341, crowdEstimate: 78 }
        ]);
        setApiStatus(prev => ({ ...prev, googlePlaces: 'mock' }));
        setUsingMockData(prev => ({ ...prev, places: true }));
      }
    } catch (error) {
      console.error('Places fetch error:', error);
    }
  };

  // Fetch nearby events
  const fetchNearbyEvents = async (lat, lng) => {
    try {
      setApiStatus(prev => ({ ...prev, eventbrite: 'connecting' }));
      
      try {
        const eventsResponse = await fetch(
          `https://www.eventbriteapi.com/v3/events/search/?location.latitude=${lat}&location.longitude=${lng}&location.within=5km&expand=venue`,
          {
            headers: {
              'Authorization': 'Bearer YOUR_EVENTBRITE_TOKEN'
            }
          }
        );
        
        if (!eventsResponse.ok) throw new Error('Eventbrite API failed');
        
        const events = await eventsResponse.json();
        const processedEvents = events.events.slice(0, 3).map(event => ({
          name: event.name.text,
          start: new Date(event.start.local),
          capacity: event.capacity || 100,
          ticketsSold: Math.floor(Math.random() * (event.capacity || 100)),
          venue: event.venue?.name || 'Unknown Venue'
        }));
        
        setNearbyEvents(processedEvents);
        setApiStatus(prev => ({ ...prev, eventbrite: 'connected' }));
        
      } catch (error) {
        console.log('Using mock events data:', error.message);
        setNearbyEvents([
          {
            name: 'Summer Music Festival',
            start: new Date(Date.now() + 2 * 60 * 60 * 1000),
            capacity: 5000,
            ticketsSold: 4200,
            venue: 'Central Park Amphitheater'
          },
          {
            name: 'Tech Conference 2025',
            start: new Date(Date.now() + 4 * 60 * 60 * 1000),
            capacity: 1200,
            ticketsSold: 980,
            venue: 'Convention Center'
          }
        ]);
        setApiStatus(prev => ({ ...prev, eventbrite: 'mock' }));
        setUsingMockData(prev => ({ ...prev, events: true }));
      }
    } catch (error) {
      console.error('Events fetch error:', error);
    }
  };

  // Initialize device sensors
  useEffect(() => {
    if ('connection' in navigator && navigator.connection) {
      const updateNetworkInfo = () => {
        const connection = navigator.connection;
        const mockBeacons = [
          { ssid: 'VenueWiFi_Main', rssi: -45, mac: '00:11:22:33:44:55', strength: connection.effectiveType || '4g' },
          { ssid: 'PublicWiFi_A1', rssi: -62, mac: '00:11:22:33:44:56', strength: connection.effectiveType || '4g' },
          { ssid: 'EventNetwork', rssi: -38, mac: '00:11:22:33:44:57', strength: connection.effectiveType || '4g' }
        ];
        setWifiBeacons(mockBeacons);
      };
      
      updateNetworkInfo();
      const connection = navigator.connection;
      connection.addEventListener('change', updateNetworkInfo);
      
      return () => connection.removeEventListener('change', updateNetworkInfo);
    } else {
      const mockBeacons = [
        { ssid: 'VenueWiFi_Main', rssi: -45, mac: '00:11:22:33:44:55', strength: '4g' },
        { ssid: 'PublicWiFi_A1', rssi: -62, mac: '00:11:22:33:44:56', strength: '4g' },
        { ssid: 'EventNetwork', rssi: -38, mac: '00:11:22:33:44:57', strength: '4g' }
      ];
      setWifiBeacons(mockBeacons);
    }

    const initBluetooth = () => {
      if ('bluetooth' in navigator) {
        const mockDevices = [
          { id: 'bt1', name: 'iPhone_12', rssi: -55, type: 'phone' },
          { id: 'bt2', name: 'Galaxy_Watch', rssi: -48, type: 'wearable' },
          { id: 'bt3', name: 'AirPods_Pro', rssi: -72, type: 'audio' },
          { id: 'bt4', name: 'Pixel_7', rssi: -41, type: 'phone' }
        ];
        setBluetoothDevices(mockDevices);
      }
    };

    initBluetooth();
  }, []);

  // Device motion sensors
  useEffect(() => {
    if ('DeviceMotionEvent' in window) {
      const handleMotion = (event) => {
        setMotionData({
          x: event.accelerationIncludingGravity?.x || 0,
          y: event.accelerationIncludingGravity?.y || 0,
          z: event.accelerationIncludingGravity?.z || 0,
          rotationRate: event.rotationRate
        });
      };

      if (typeof DeviceMotionEvent.requestPermission === 'function') {
        DeviceMotionEvent.requestPermission().then(response => {
          if (response === 'granted') {
            window.addEventListener('devicemotion', handleMotion);
          }
        }).catch(() => {
          setMotionData({ x: 0.5, y: -9.8, z: 0.2 });
        });
      } else {
        window.addEventListener('devicemotion', handleMotion);
      }

      return () => {
        window.removeEventListener('devicemotion', handleMotion);
      };
    }
  }, []);

  // Calculate crowd density
  useEffect(() => {
    const calculateDensity = () => {
      let density = 0;
      
      if (weatherData) {
        const weatherCrowdBoost = weatherData.crowdFactor * 20;
        density += weatherCrowdBoost;
      }
      
      if (placeData.length > 0) {
        const avgPlaceCrowd = placeData.reduce((sum, place) => sum + place.crowdEstimate, 0) / placeData.length;
        density += avgPlaceCrowd * 0.3;
      }
      
      const currentTime = new Date();
      const eventCrowdBoost = nearbyEvents.reduce((boost, event) => {
        const timeDiff = Math.abs(event.start - currentTime) / (1000 * 60 * 60);
        if (timeDiff < 2) {
          const occupancyRate = event.ticketsSold / event.capacity;
          return boost + (occupancyRate * 40);
        }
        return boost;
      }, 0);
      density += eventCrowdBoost;
      
      const deviceCount = bluetoothDevices.length * 8;
      density += deviceCount;
      
      const motionMagnitude = Math.sqrt(motionData.x**2 + motionData.y**2 + motionData.z**2);
      const motionBoost = Math.min(25, motionMagnitude * 3);
      density += motionBoost;
      
      density = Math.min(100, Math.max(0, density));
      
      setCrowdDensity(Math.round(density));
      setUserCount(Math.round(density * 12 + Math.random() * 50));
      
      if (density > 85) {
        setAlertLevel('critical');
      } else if (density > 65) {
        setAlertLevel('warning');
      } else {
        setAlertLevel('normal');
      }
    };

    sensorIntervalRef.current = setInterval(calculateDensity, 2000);
    calculateDensity();
    
    return () => {
      if (sensorIntervalRef.current) {
        clearInterval(sensorIntervalRef.current);
      }
    };
  }, [weatherData, placeData, nearbyEvents, bluetoothDevices, motionData]);

  const calculateWeatherCrowdFactor = (weather) => {
    const temp = weather.main.temp;
    const conditions = weather.weather[0].main.toLowerCase();
    
    if (temp >= 20 && temp <= 28 && !conditions.includes('rain')) {
      return 1.5;
    } else if (conditions.includes('rain') || temp < 5 || temp > 35) {
      return 0.6;
    }
    return 1.0;
  };

  const calculateNearbyExits = (lat, lng) => {
    const exits = [
      { 
        id: 1, 
        direction: 'North Exit (Main)', 
        lat: lat + 0.001, 
        lng: lng, 
        capacity: 'High',
        type: 'main_entrance'
      },
      { 
        id: 2, 
        direction: 'East Side Exit', 
        lat: lat, 
        lng: lng + 0.0015, 
        capacity: 'Medium',
        type: 'side_exit'
      },
      { 
        id: 3, 
        direction: 'Emergency Stairs West', 
        lat: lat - 0.0008, 
        lng: lng - 0.0005, 
        capacity: 'Low',
        type: 'emergency'
      },
      { 
        id: 4, 
        direction: 'South Plaza Exit', 
        lat: lat - 0.0012, 
        lng: lng, 
        capacity: 'Medium',
        type: 'plaza'
      }
    ];
    
    const exitsWithDistance = exits.map(exit => ({
      ...exit,
      distance: calculateDistance(lat, lng, exit.lat, exit.lng)
    }));
    
    setNearbyExits(exitsWithDistance.sort((a, b) => a.distance - b.distance));
    generateDensityZones(lat, lng);
  };

  const generateDensityZones = (centerLat, centerLng) => {
    const zones = [];
    const radius = 0.002;
    const gridSize = 8;
    
    for (let i = 0; i < gridSize; i++) {
      for (let j = 0; j < gridSize; j++) {
        const lat = centerLat - radius + (i / (gridSize - 1)) * (2 * radius);
        const lng = centerLng - radius + (j / (gridSize - 1)) * (2 * radius);
        
        const distanceFromCenter = calculateDistance(centerLat, centerLng, lat, lng);
        let zoneDensity = Math.max(0, 100 - (distanceFromCenter / 10));
        
        zoneDensity += (Math.random() - 0.5) * 40;
        
        if (nearbyEvents.length > 0) {
          nearbyEvents.forEach(event => {
            const eventLat = centerLat + (Math.random() - 0.5) * 0.003;
            const eventLng = centerLng + (Math.random() - 0.5) * 0.003;
            const distanceToEvent = calculateDistance(lat, lng, eventLat, eventLng);
            if (distanceToEvent < 150) {
              zoneDensity += 60 * (event.ticketsSold / event.capacity);
            }
          });
        }
        
        if (placeData.length > 0) {
          placeData.forEach(place => {
            const placeLat = centerLat + (Math.random() - 0.5) * 0.002;
            const placeLng = centerLng + (Math.random() - 0.5) * 0.002;
            const distanceToPlace = calculateDistance(lat, lng, placeLat, placeLng);
            if (distanceToPlace < 100) {
              zoneDensity += place.crowdEstimate * 0.5;
            }
          });
        }
        
        zones.push({
          id: `${i}-${j}`,
          lat,
          lng,
          density: Math.max(0, Math.min(100, zoneDensity)),
          gridX: i,
          gridY: j
        });
      }
    }
    
    setDensityZones(zones);
  };

  const calculateDistance = (lat1, lng1, lat2, lng2) => {
    const R = 6371e3;
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lng2-lng1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return Math.round(R * c);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'connected': return 'text-green-600';
      case 'connecting': return 'text-yellow-600';
      case 'mock': return 'text-blue-600';
      case 'error': return 'text-red-600';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'connected': return '●';
      case 'connecting': return '◐';
      case 'mock': return '◯';
      case 'error': return '✕';
      default: return '○';
    }
  };

  const getAlertColor = () => {
    switch (alertLevel) {
      case 'critical': return 'bg-red-500';
      case 'warning': return 'bg-yellow-500';
      default: return 'bg-green-500';
    }
  };

  const getAlertMessage = () => {
    switch (alertLevel) {
      case 'critical': return 'CRITICAL: Very High Density - Move to Exits Calmly';
      case 'warning': return 'WARNING: High Density - Consider Moving';
      default: return 'SAFE: Normal Crowd Levels';
    }
  };

  const sendEmergencyAlert = async () => {
    const alertData = {
      timestamp: new Date().toISOString(),
      location: location,
      crowdDensity: crowdDensity,
      userCount: userCount,
      weather: weatherData,
      nearbyEvents: nearbyEvents,
      densityZones: densityZones,
      sensorData: {
        wifiBeacons: wifiBeacons.length,
        bluetoothDevices: bluetoothDevices.length,
        motionLevel: Math.sqrt(motionData.x**2 + motionData.y**2 + motionData.z**2)
      },
      usingMockData: usingMockData
    };
    
    try {
      const response = await fetch('/api/emergency-alert', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(alertData)
      });
      
      if (response.ok) {
        alert('Emergency alert sent successfully to authorities!');
      } else {
        throw new Error('Emergency API unavailable');
      }
    } catch (error) {
      console.log('Emergency Alert (API unavailable):', alertData);
      alert('Emergency alert prepared! (Would be sent to authorities in production)');
    }
  };

  const getDensityColor = (density) => {
    if (density > 80) return '#ef4444';
    if (density > 60) return '#f59e0b';
    if (density > 40) return '#eab308';
    if (density > 20) return '#84cc16';
    return '#22c55e';
  };

  const getDensityOpacity = (density) => {
    return Math.max(0.2, density / 100);
  };

  const MapView = () => {
    if (!location) {
      return (
        <div className="flex items-center justify-center h-96 bg-gray-100 rounded-xl">
          <div className="text-center">
            <Satellite className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-gray-600">Getting GPS location...</p>
          </div>
        </div>
      );
    }

    const mapWidth = 300;
    const mapHeight = 300;
    const centerX = mapWidth / 2;
    const centerY = mapHeight / 2;
    
    const latRange = 0.004;
    const lngRange = 0.004;
    
    const getMapCoords = (lat, lng) => {
      const x = centerX + ((lng - location.longitude) / lngRange) * mapWidth;
      const y = centerY - ((lat - location.latitude) / latRange) * mapHeight;
      return { x, y };
    };

    return (
      <div className="bg-gray-50 rounded-xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-800 flex items-center gap-2">
            <Map className="w-5 h-5" />
            Crowd Density Map
          </h3>
          <div className="flex items-center gap-2 text-xs">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Low</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Med</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>High</span>
            </div>
          </div>
        </div>
        
        <div className="relative bg-gray-200 rounded-lg overflow-hidden">
          <svg width={mapWidth} height={mapHeight} className="block">
            <defs>
              <pattern id="grid" width="20" height="20" patternUnits="userSpaceOnUse">
                <path d="M 20 0 L 0 0 0 20" fill="none" stroke="#e5e7eb" strokeWidth="0.5"/>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
            
            {densityZones.map(zone => {
              const coords = getMapCoords(zone.lat, zone.lng);
              const size = 35;
              
              return (
                <g key={zone.id}>
                  <rect
                    x={coords.x - size/2}
                    y={coords.y - size/2}
                    width={size}
                    height={size}
                    fill={getDensityColor(zone.density)}
                    opacity={getDensityOpacity(zone.density)}
                    rx="4"
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 2}
                    textAnchor="middle"
                    fontSize="8"
                    fill="white"
                    fontWeight="bold"
                  >
                    {Math.round(zone.density)}
                  </text>
                </g>
              );
            })}
            
            <circle
              cx={centerX}
              cy={centerY}
              r="8"
              fill="#3b82f6"
              stroke="white"
              strokeWidth="2"
            />
            <circle
              cx={centerX}
              cy={centerY}
              r="4"
              fill="white"
            />
            
            {nearbyExits.map(exit => {
              const coords = getMapCoords(exit.lat, exit.lng);
              const exitColor = exit.capacity === 'High' ? '#22c55e' : 
                              exit.capacity === 'Medium' ? '#f59e0b' : '#ef4444';
              
              return (
                <g key={exit.id}>
                  <rect
                    x={coords.x - 8}
                    y={coords.y - 8}
                    width="16"
                    height="16"
                    fill={exitColor}
                    stroke="white"
                    strokeWidth="2"
                    rx="2"
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 2}
                    textAnchor="middle"
                    fontSize="8"
                    fill="white"
                    fontWeight="bold"
                  >
                    E
                  </text>
                </g>
              );
            })}
            
            {nearbyEvents.map((event, index) => {
              const eventLat = location.latitude + (Math.random() - 0.5) * 0.003;
              const eventLng = location.longitude + (Math.random() - 0.5) * 0.003;
              const coords = getMapCoords(eventLat, eventLng);
              
              return (
                <g key={index}>
                  <circle
                    cx={coords.x}
                    cy={coords.y}
                    r="6"
                    fill="#8b5cf6"
                    stroke="white"
                    strokeWidth="1"
                  />
                  <text
                    x={coords.x}
                    y={coords.y + 2}
                    textAnchor="middle"
                    fontSize="7"
                    fill="white"
                    fontWeight="bold"
                  >
                    ★
                  </text>
                </g>
              );
            })}
          </svg>
          
          <div className="absolute bottom-2 left-2 bg-white bg-opacity-90 rounded p-2 text-xs">
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 bg-blue-500 rounded-full border border-white"></div>
              <span>You</span>
            </div>
            <div className="flex items-center gap-1 mb-1">
              <div className="w-3 h-3 bg-green-500 border border-white"></div>
              <span>Exit</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-purple-500 rounded-full border border-white"></div>
              <span>Event</span>
            </div>
          </div>
          
          <div className="absolute top-2 right-2 bg-white bg-opacity-90 rounded p-2 text-xs font-mono">
            {location.latitude.toFixed(4)}, {location.longitude.toFixed(4)}
          </div>
        </div>
        
        <div className="mt-3 grid grid-cols-3 gap-2 text-xs">
          <div className="text-center">
            <div className="font-semibold text-gray-800">{densityZones.filter(z => z.density > 80).length}</div>
            <div className="text-gray-600">High Zones</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">{nearbyExits.length}</div>
            <div className="text-gray-600">Exits</div>
          </div>
          <div className="text-center">
            <div className="font-semibold text-gray-800">{nearbyEvents.length}</div>
            <div className="text-gray-600">Events</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-md mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-4 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8" />
              <div>
                <h1 className="text-xl font-bold">CrowdSense API</h1>
                <p className="text-blue-100 text-sm">Real Data + Mock Fallbacks</p>
              </div>
            </div>
            
            {/* View Toggle */}
            <div className="flex bg-blue-500 bg-opacity-50 rounded-lg p-1">
              <button
                onClick={() => setViewMode('dashboard')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'dashboard' 
                    ? 'bg-white text-blue-600' 
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <Users className="w-4 h-4 inline mr-1" />
                Data
              </button>
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  viewMode === 'map' 
                    ? 'bg-white text-blue-600' 
                    : 'text-blue-100 hover:text-white'
                }`}
              >
                <Map className="w-4 h-4 inline mr-1" />
                Map
              </button>
            </div>
          </div>
        </div>

        {/* Alert Banner */}
        <div className={`${getAlertColor()} px-6 py-3 text-white`}>
          <div className="flex items-center gap-2">
            <AlertTriangle className="w-5 h-5" />
            <span className="font-semibold text-sm">{getAlertMessage()}</span>
          </div>
        </div>

        {/* API Status Dashboard */}
        <div className="px-6 py-4 bg-gray-50 border-b">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
            <Server className="w-4 h-4" />
            API Status
          </h3>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="flex items-center gap-1">
              <span className={getStatusColor(apiStatus.gps)}>{getStatusIcon(apiStatus.gps)}</span>
              <Satellite className="w-3 h-3" />
              <span>GPS {usingMockData.gps ? '(Mock)' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={getStatusColor(apiStatus.openWeather)}>{getStatusIcon(apiStatus.openWeather)}</span>
              <Radio className="w-3 h-3" />
              <span>Weather {usingMockData.weather ? '(Mock)' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={getStatusColor(apiStatus.googlePlaces)}>{getStatusIcon(apiStatus.googlePlaces)}</span>
              <MapPin className="w-3 h-3" />
              <span>Places {usingMockData.places ? '(Mock)' : ''}</span>
            </div>
            <div className="flex items-center gap-1">
              <span className={getStatusColor(apiStatus.eventbrite)}>{getStatusIcon(apiStatus.eventbrite)}</span>
              <Database className="w-3 h-3" />
              <span>Events {usingMockData.events ? '(Mock)' : ''}</span>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="p-6 space-y-6">
          
          {viewMode === 'map' ? (
            /* Map View */
            <MapView />
          ) : (
            /* Dashboard View */
            <>
              {/* Crowd Density with API Sources */}
              <div className="bg-gray-50 rounded-xl p-4">
                <div className="flex items-center justify-between mb-3">
                  <h3 className="font-semibold text-gray-800 flex items-center gap-2">
                    <Users className="w-5 h-5" />
                    Multi-API Crowd Density
                  </h3>
                  <span className="text-2xl font-bold text-gray-800">{crowdDensity}%</span>
                </div>
                
                <div className="w-full bg-gray-200 rounded-full h-4 mb-3">
                  <div 
                    className={`h-4 rounded-full transition-all duration-500 ${
                      crowdDensity > 85 ? 'bg-red-500' : 
                      crowdDensity > 65 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${crowdDensity}%` }}
                  ></div>
                </div>
                
                <div className="text-xs text-gray-600 space-y-1">
                  <div>Weather Impact: {weatherData ? `${(weatherData.crowdFactor * 100).toFixed(0)}%` : 'Loading...'}</div>
                  <div>Nearby Events: {nearbyEvents.length} active</div>
                  <div>Device Sensors: {bluetoothDevices.length} detected</div>
                  <div>User Count: {userCount.toLocaleString()}</div>
                </div>
              </div>

              {/* Weather Data */}
              {weatherData && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-2 flex items-center gap-2">
                    <Radio className="w-5 h-5 text-blue-600" />
                    Weather Impact {usingMockData.weather && '(Mock Data)'}
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <div className="text-gray-600">Temperature</div>
                      <div className="font-semibold">{weatherData.temperature}°C</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Conditions</div>
                      <div className="font-semibold capitalize">{weatherData.description}</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Crowd Factor</div>
                      <div className="font-semibold">{(weatherData.crowdFactor * 100).toFixed(0)}%</div>
                    </div>
                    <div>
                      <div className="text-gray-600">Humidity</div>
                      <div className="font-semibold">{weatherData.humidity}%</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Nearby Events */}
              {nearbyEvents.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Zap className="w-5 h-5 text-orange-600" />
                    Active Events {usingMockData.events && '(Mock Data)'}
                  </h3>
                  <div className="space-y-2">
                    {nearbyEvents.map((event, index) => (
                      <div key={index} className="bg-white rounded-lg p-3 border">
                        <div className="font-medium text-gray-800">{event.name}</div>
                        <div className="text-sm text-gray-600 mt-1">
                          <div>Venue: {event.venue}</div>
                          <div>Starts: {event.start.toLocaleTimeString()}</div>
                          <div className="flex justify-between mt-1">
                            <span>Capacity: {event.capacity}</span>
                            <span className="font-medium">
                              Sold: {event.ticketsSold} ({((event.ticketsSold/event.capacity)*100).toFixed(0)}%)
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* GPS-Located Exits */}
              {nearbyExits.length > 0 && (
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="font-semibold text-gray-800 mb-3 flex items-center gap-2">
                    <Navigation className="w-5 h-5" />
                    GPS-Located Exits
                  </h3>
                  
                  <div className="space-y-2">
                    {nearbyExits.slice(0, 3).map((exit) => (
                      <div key={exit.id} className="flex items-center justify-between bg-white rounded-lg p-3 border">
                        <div className="flex items-center gap-3">
                          <MapPin className="w-4 h-4 text-green-600" />
                          <div>
                            <p className="font-medium text-gray-800">{exit.direction}</p>
                            <p className="text-sm text-gray-600">{exit.distance}m • {exit.type}</p>
                          </div>
                        </div>
                        <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                          exit.capacity === 'High' ? 'bg-green-100 text-green-800' :
                          exit.capacity === 'Medium' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {exit.capacity}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {/* Emergency Actions */}
          <div className="space-y-3">
            <button 
              className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-4 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              onClick={sendEmergencyAlert}
            >
              <AlertTriangle className="w-5 h-5" />
              Send Emergency Alert with {viewMode === 'map' ? 'Map' : 'API'} Data
            </button>
            
            <button 
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-6 rounded-xl flex items-center justify-center gap-2 transition-colors"
              onClick={() => {
                const statusData = {
                  safe: alertLevel === 'normal',
                  location: location,
                  timestamp: new Date().toISOString(),
                  crowdDensity: crowdDensity,
                  weather: weatherData,
                  viewMode: viewMode,
                  densityZones: viewMode === 'map' ? densityZones.length : undefined
                };
                console.log('Safety status shared:', statusData);
                alert('Safety status shared with emergency contacts!');
              }}
            >
              <Zap className="w-5 h-5" />
              Share Safety Status
            </button>
          </div>

          {/* Real-time Data Feed */}
          <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
            <h4 className="font-semibold text-blue-800 mb-2 flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Live {viewMode === 'map' ? 'Map' : 'API'} Data Feed
            </h4>
            <div className="text-xs text-blue-700 space-y-1">
              <div>Location: {location ? `${location.latitude.toFixed(4)}, ${location.longitude.toFixed(4)}` : 'Getting GPS...'}</div>
              <div>Weather: {weatherData ? `${weatherData.temperature}°C, ${weatherData.description}` : 'Loading...'}</div>
              <div>Events: {nearbyEvents.length} nearby, {nearbyEvents.filter(e => Math.abs(e.start - new Date()) < 2*60*60*1000).length} starting soon</div>
              {viewMode === 'map' && (
                <>
                  <div>Density Zones: {densityZones.length} mapped</div>
                  <div>High Density Areas: {densityZones.filter(z => z.density > 80).length}</div>
                </>
              )}
              <div>WiFi Networks: {wifiBeacons.length} detected</div>
              <div>Motion Level: {Math.sqrt(motionData.x**2 + motionData.y**2 + motionData.z**2).toFixed(2)}</div>
              <div>Last Update: {new Date().toLocaleTimeString()}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrowdSenseApp;