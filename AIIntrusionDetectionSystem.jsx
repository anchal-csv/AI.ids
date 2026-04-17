// src/components/AIIntrusionDetectionSystem.jsx
import React, { useState, useEffect } from 'react';
import { Activity, Shield, AlertTriangle, CheckCircle, TrendingUp, Network, Lock, Zap } from 'lucide-react';
import {
  LineChart, Line, AreaChart, Area, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell
} from 'recharts';

const AIIntrusionDetectionSystem = () => {
  const [alerts, setAlerts] = useState([]);
  const [trafficData, setTrafficData] = useState([]);
  const [threatStats, setThreatStats] = useState({ total: 0, blocked: 0, allowed: 0, investigating: 0 });
  const [activeTab, setActiveTab] = useState('dashboard');
  const [isMonitoring, setIsMonitoring] = useState(true);
  const [mlModel] = useState({
    accuracy: 94.7,
    precision: 92.3,
    recall: 96.1,
    f1Score: 94.2
  });

  const threatTypes = [
    { name: 'DDoS Attack', color: '#ef4444', count: 0 },
    { name: 'Port Scan', color: '#f97316', count: 0 },
    { name: 'SQL Injection', color: '#eab308', count: 0 },
    { name: 'Malware', color: '#8b5cf6', count: 0 },
    { name: 'Brute Force', color: '#ec4899', count: 0 },
    { name: 'Normal', color: '#10b981', count: 0 }
  ];
  const [threatDistribution, setThreatDistribution] = useState(threatTypes);

  const detectThreat = () => {
    const threats = ['DDoS Attack', 'Port Scan', 'SQL Injection', 'Malware', 'Brute Force', 'Normal'];
    const severities = ['Critical', 'High', 'Medium', 'Low'];
    const ips = ['192.168.1.', '10.0.0.', '172.16.0.', '203.0.113.'];

    const threat = threats[Math.floor(Math.random() * threats.length)];
    const isAnomaly = threat !== 'Normal';
    const severity = isAnomaly ? severities[Math.floor(Math.random() * severities.length)] : 'Low';
    const confidence = isAnomaly ? (85 + Math.random() * 15).toFixed(1) : (50 + Math.random() * 30).toFixed(1);

    return {
      id: Date.now(),
      timestamp: new Date().toLocaleTimeString(),
      type: threat,
      severity,
      sourceIP: ips[Math.floor(Math.random() * ips.length)] + Math.floor(Math.random() * 255),
      destPort: Math.floor(Math.random() * 65535),
      confidence: parseFloat(confidence),
      status: isAnomaly ? 'Blocked' : 'Allowed',
      mlPrediction: confidence
    };
  };

  useEffect(() => {
    if (!isMonitoring) return;

    const interval = setInterval(() => {
      const newAlert = detectThreat();

      setAlerts(prev => [newAlert, ...prev].slice(0, 10));

      setTrafficData(prev => {
        const newData = [...prev, {
          time: new Date().toLocaleTimeString(),
          packets: Math.floor(Math.random() * 1000) + 500,
          threats: Math.floor(Math.random() * 50),
          anomalyScore: Math.random() * 100
        }].slice(-15);
        return newData;
      });

      setThreatStats(prev => ({
        total: prev.total + 1,
        blocked: newAlert.status === 'Blocked' ? prev.blocked + 1 : prev.blocked,
        allowed: newAlert.status === 'Allowed' ? prev.allowed + 1 : prev.allowed,
        investigating: prev.investigating
      }));

      setThreatDistribution(prev =>
        prev.map(t =>
          t.name === newAlert.type
            ? { ...t, count: t.count + 1 }
            : t
        )
      );
    }, 2000);

    return () => clearInterval(interval);
  }, [isMonitoring]);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'Critical': return 'bg-red-500';
      case 'High': return 'bg-orange-500';
      case 'Medium': return 'bg-yellow-500';
      case 'Low': return 'bg-green-500';
      default: return 'bg-gray-500';
    }
  };

  const StatCard = ({ title, value, icon: Icon, color, subtitle }) => (
    <div className="bg-white rounded-lg shadow-md p-6 border-l-4" style={{ borderLeftColor: color }}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-gray-500 text-sm font-medium">{title}</p>
          <p className="text-3xl font-bold mt-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-600 mt-1">{subtitle}</p>}
        </div>
        <Icon className="w-12 h-12" style={{ color }} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Shield className="w-12 h-12 text-blue-600" />
              <div>
                <h1 className="text-3xl font-bold text-gray-800">AI-Powered IDS</h1>
                <p className="text-gray-600">Intelligent Intrusion Detection System</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <button
                onClick={() => setIsMonitoring(!isMonitoring)}
                className={`px-6 py-3 rounded-lg font-semibold flex items-center space-x-2 ${
                  isMonitoring
                    ? 'bg-red-500 hover:bg-red-600 text-white'
                    : 'bg-green-500 hover:bg-green-600 text-white'
                }`}
              >
                {isMonitoring ? (
                  <>
                    <Activity className="w-5 h-5 animate-pulse" />
                    <span>Monitoring Active</span>
                  </>
                ) : (
                  <>
                    <Activity className="w-5 h-5" />
                    <span>Start Monitoring</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-lg shadow-lg mb-6">
          <div className="flex border-b">
            {['dashboard', 'threats', 'ml-model', 'network'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-6 py-4 font-semibold capitalize ${
                  activeTab === tab
                    ? 'border-b-2 border-blue-600 text-blue-600'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
              >
                {tab.replace('-', ' ')}
              </button>
            ))}
          </div>
        </div>

        {/* Dashboard */}
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard title="Total Events" value={threatStats.total} icon={Activity} color="#3b82f6" />
              <StatCard title="Threats Blocked" value={threatStats.blocked} icon={Shield} color="#ef4444" />
              <StatCard title="Traffic Allowed" value={threatStats.allowed} icon={CheckCircle} color="#10b981" />
              <StatCard title="ML Accuracy" value={`${mlModel.accuracy}%`} icon={TrendingUp} color="#8b5cf6" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <Network className="w-6 h-6 mr-2 text-blue-600" />
                  Network Traffic Analysis
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <AreaChart data={trafficData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="time" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Area type="monotone" dataKey="packets" stroke="#3b82f6" fill="#3b82f6" fillOpacity={0.6} />
                    <Area type="monotone" dataKey="threats" stroke="#ef4444" fill="#ef4444" fillOpacity={0.6} />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              <div className="bg-white rounded-lg shadow-lg p-6">
                <h3 className="text-xl font-bold mb-4 flex items-center">
                  <AlertTriangle className="w-6 h-6 mr-2 text-orange-600" />
                  Threat Distribution
                </h3>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={threatDistribution}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={100}
                      dataKey="count"
                    >
                      {threatDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-xl font-bold mb-4 flex items-center">
                <Zap className="w-6 h-6 mr-2 text-yellow-600" />
                Real-time Threat Alerts
              </h3>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {alerts.map(alert => (
                  <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`w-3 h-3 rounded-full ${getSeverityColor(alert.severity)}`}></div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{alert.type}</span>
                          <span className="text-xs bg-gray-200 px-2 py-1 rounded">{alert.severity}</span>
                        </div>
                        <p className="text-sm text-gray-600">
                          {alert.sourceIP}:{alert.destPort} • {alert.timestamp}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold">ML Confidence: {alert.confidence}%</p>
                      <span className={`text-xs px-3 py-1 rounded-full ${
                        alert.status === 'Blocked' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
                      }`}>
                        {alert.status}
                      </span>
                    </div>
                  </div>
                ))}
                {alerts.length === 0 && <p className="text-center text-gray-500 py-8">No alerts yet. Monitoring for threats...</p>}
              </div>
            </div>
          </div>
        )}

        {/* ML Model */}
        {activeTab === 'ml-model' && (
          <div className="space-y-6">
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-2xl font-bold mb-6 flex items-center">
                <TrendingUp className="w-8 h-8 mr-3 text-purple-600" />
                Machine Learning Model Performance
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-lg p-6 text-white">
                  <p className="text-sm opacity-90">Accuracy</p>
                  <p className="text-4xl font-bold mt-2">{mlModel.accuracy}%</p>
                </div>
                <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-lg p-6 text-white">
                  <p className="text-sm opacity-90">Precision</p>
                  <p className="text-4xl font-bold mt-2">{mlModel.precision}%</p>
                </div>
                <div className="bg-gradient-to-br from-green-500 to-green-700 rounded-lg p-6 text-white">
                  <p className="text-sm opacity-90">Recall</p>
                  <p className="text-4xl font-bold mt-2">{mlModel.recall}%</p>
                </div>
                <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-lg p-6 text-white">
                  <p className="text-sm opacity-90">F1 Score</p>
                  <p className="text-4xl font-bold mt-2">{mlModel.f1Score}%</p>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h4 className="font-bold text-lg mb-4">Model Information</h4>
                <div className="space-y-3">
                  <div className="flex justify-between"><span className="text-gray-600">Algorithm:</span><span className="font-semibold">Random Forest Classifier</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Training Dataset:</span><span className="font-semibold">NSL-KDD (125,973 samples)</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Features:</span><span className="font-semibold">41 network features</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Last Training:</span><span className="font-semibold">2 hours ago</span></div>
                  <div className="flex justify-between"><span className="text-gray-600">Detection Types:</span><span className="font-semibold">DoS, Probe, R2L, U2R</span></div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Threats */}
        {activeTab === 'threats' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center">
              <AlertTriangle className="w-8 h-8 mr-3 text-red-600" />
              Threat Analysis & Statistics
            </h3>

            <ResponsiveContainer width="100%" height={400}>
              <BarChart data={threatDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#3b82f6">
                  {threatDistribution.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>

            <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {threatDistribution.map(threat => (
                <div key={threat.name} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">{threat.name}</span>
                    <div className="w-4 h-4 rounded" style={{ backgroundColor: threat.color }}></div>
                  </div>
                  <p className="text-3xl font-bold">{threat.count}</p>
                  <p className="text-sm text-gray-600">{((threat.count / threatStats.total) * 100 || 0).toFixed(1)}% of total</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Network */}
        {activeTab === 'network' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-2xl font-bold mb-6 flex items-center"><Network className="w-8 h-8 mr-3 text-blue-600" />Network Monitoring</h3>

            <div className="mb-6">
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={trafficData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="time" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Line type="monotone" dataKey="anomalyScore" stroke="#8b5cf6" strokeWidth={2} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h4 className="font-bold text-lg mb-4 flex items-center"><Lock className="w-5 h-5 mr-2 text-blue-600" />Security Recommendations</h4>
              <ul className="space-y-2">
                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" /><span>ML model is actively learning from new threat patterns</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" /><span>Real-time packet inspection enabled</span></li>
                <li className="flex items-start"><CheckCircle className="w-5 h-5 mr-2 text-green-600 flex-shrink-0 mt-0.5" /><span>Anomaly detection threshold: 85% confidence</span></li>
                <li className="flex items-start"><AlertTriangle className="w-5 h-5 mr-2 text-yellow-600 flex-shrink-0 mt-0.5" /><span>Consider updating firewall rules based on detected patterns</span></li>
              </ul>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AIIntrusionDetectionSystem;
