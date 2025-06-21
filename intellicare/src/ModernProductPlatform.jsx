import React, { useState, useEffect } from 'react';
import { Plus, Target, Users, Zap, BarChart3, GitBranch, CheckCircle, AlertCircle, Clock, Eye, Edit3, Trash2, Shield, Activity, Code, TrendingUp, AlertTriangle, Cpu, Database, Lock, Settings, DollarSign, Copy, UserCheck, Crown, Filter, Search, Bell } from 'lucide-react';

const ModernProductPlatform = () => {
  const [activeView, setActiveView] = useState('dashboard');
  const [userRole, setUserRole] = useState('product-owner');
  const [roleJustChanged, setRoleJustChanged] = useState(false);
  const [stories, setStories] = useState([]);
  const [features, setFeatures] = useState([]);
  const [projects, setProjects] = useState([]);
  const [roadmapData, setRoadmapData] = useState({});
  const [teamResources, setTeamResources] = useState({});
  const [fundingScenarios, setFundingScenarios] = useState({});
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [createType, setCreateType] = useState('story');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterPriority, setFilterPriority] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [selectedQuarter, setSelectedQuarter] = useState('Q3-2025');
  const [copyFromFeature, setCopyFromFeature] = useState(null);
  const [showCopyOption, setShowCopyOption] = useState(false);
  const [costMetrics, setCostMetrics] = useState({
    totalBudget: 0,
    spentToDate: 0,
    projectedSpend: 0,
    costPerStoryPoint: 0,
    redundancyCost: 0,
    potentialSavings: 0
  });
  const [redundancyAlert, setRedundancyAlert] = useState(null);

  const [newItem, setNewItem] = useState({
    title: '',
    description: '',
    priority: 'medium',
    assignee: '',
    tags: '',
    storyPoints: 3,
    featureType: '',
    epic: '',
    costEstimate: 0
  });

  useEffect(() => {
    // Initialize stories
    setStories([
      {
        id: 1,
        title: "User Authentication System",
        description: "Implement secure login and registration functionality",
        status: "in-progress",
        priority: "high",
        assignee: "Sarah Chen",
        storyPoints: 8,
        tags: ["security", "backend"],
        featureType: "authentication",
        epic: "User Management",
        sprint: "Sprint 23",
        testResults: { passed: 12, failed: 2, coverage: 85, unit: 90, integration: 75, e2e: 60 },
        codeQuality: { complexity: 7.2, maintainability: 8.1, techDebt: 15, linesOfCode: 2840 },
        performance: { loadTime: 120, throughput: 850, memoryUsage: 45, cpuUsage: 23 },
        security: { vulnerabilities: { critical: 0, high: 1, medium: 3, low: 8 }, lastScan: "2025-06-17" },
        alignment: { business: 95, technical: 88, user: 92 },
        costEstimate: 12000,
        actualCost: 8500,
        dependencies: [],
        riskFactors: ["API Integration", "Third-party Auth"],
        acceptanceCriteria: [
          "Users can register with email/password",
          "Password strength validation", 
          "Email verification required",
          "Session management"
        ]
      },
      {
        id: 2,
        title: "Dashboard Analytics Widget",
        description: "Create interactive charts for user engagement metrics",
        status: "completed",
        priority: "medium",
        assignee: "Mike Rodriguez",
        storyPoints: 5,
        tags: ["frontend", "analytics"],
        featureType: "analytics",
        epic: "Business Intelligence",
        sprint: "Sprint 22",
        testResults: { passed: 18, failed: 0, coverage: 92, unit: 95, integration: 88, e2e: 85 },
        codeQuality: { complexity: 4.8, maintainability: 9.2, techDebt: 8, linesOfCode: 1650 },
        performance: { loadTime: 80, throughput: 1200, memoryUsage: 32, cpuUsage: 18 },
        security: { vulnerabilities: { critical: 0, high: 0, medium: 1, low: 2 }, lastScan: "2025-06-18" },
        alignment: { business: 78, technical: 95, user: 85 },
        costEstimate: 7500,
        actualCost: 6200,
        dependencies: [1],
        riskFactors: [],
        acceptanceCriteria: [
          "Real-time data visualization",
          "Multiple chart types",
          "Export functionality",
          "Mobile responsive"
        ]
      }
    ]);

    // Initialize features
    setFeatures([
      {
        id: 1,
        name: "User Authentication",
        description: "Complete user authentication and authorization system",
        stories: [1],
        status: "in-progress",
        totalStoryPoints: 8,
        progress: 45,
        costEstimate: 12000,
        actualCost: 8500,
        redundancyScore: 0,
        riskLevel: "medium"
      },
      {
        id: 2,
        name: "Business Intelligence",
        description: "Analytics and reporting capabilities",
        stories: [2],
        status: "completed",
        totalStoryPoints: 5,
        progress: 100,
        costEstimate: 7500,
        actualCost: 6200,
        redundancyScore: 0,
        riskLevel: "low"
      }
    ]);

    // Initialize cost metrics
    setCostMetrics({
      totalBudget: 500000,
      spentToDate: 142000,
      projectedSpend: 380000,
      costPerStoryPoint: 1580,
      redundancyCost: 8500,
      potentialSavings: 22000
    });

    // Initialize notifications
    setNotifications([
      { id: 1, type: 'warning', message: 'Story similarity detected', action: 'Review' },
      { id: 2, type: 'error', message: 'Security vulnerability found', action: 'Fix Now' },
      { id: 3, type: 'info', message: 'Sprint over budget', action: 'Review Costs' }
    ]);

    // Initialize team resources
    setTeamResources({
      totalDevelopers: 8,
      availableDevelopers: 6,
      velocityPerSprint: 42,
      sprintLength: 2,
      currentCapacity: 85,
      skillsets: {
        frontend: 3,
        backend: 4,
        fullstack: 2,
        devops: 1,
        qa: 2
      },
      timeAllocation: {
        newFeatures: 60,
        maintenance: 25,
        techDebt: 15
      }
    });

    // Initialize funding scenarios
    setFundingScenarios({
      conservative: {
        budget: 300000,
        timeline: '6 months',
        features: ['User Authentication', 'Basic Analytics'],
        confidence: 95
      },
      optimistic: {
        budget: 500000,
        timeline: '9 months', 
        features: ['User Authentication', 'Business Intelligence', 'Payment System'],
        confidence: 75
      },
      aggressive: {
        budget: 750000,
        timeline: '12 months',
        features: ['User Authentication', 'Business Intelligence', 'Payment System', 'Mobile App'],
        confidence: 45
      }
    });

    // Initialize roadmap data
    setRoadmapData({
      quarters: {
        'Q3-2025': {
          budget: 125000,
          capacity: 126,
          plannedFeatures: [
            { id: 1, name: 'User Authentication', storyPoints: 28, cost: 45000, priority: 'critical', roi: 8.5 },
            { id: 2, name: 'Dashboard Analytics', storyPoints: 15, cost: 25000, priority: 'high', roi: 6.2 }
          ],
          risks: ['Resource constraint on backend team', 'Dependencies on third-party auth'],
          milestones: ['Auth MVP', 'Analytics Beta']
        },
        'Q4-2025': {
          budget: 150000,
          capacity: 126,
          plannedFeatures: [
            { id: 3, name: 'Payment Integration', storyPoints: 35, cost: 65000, priority: 'critical', roi: 12.3 },
            { id: 4, name: 'Mobile Responsive', storyPoints: 20, cost: 30000, priority: 'medium', roi: 4.1 }
          ],
          risks: ['PCI compliance requirements', 'Mobile testing complexity'],
          milestones: ['Payment MVP', 'Mobile Launch']
        }
      },
      constraints: {
        maxBudgetPerQuarter: 200000,
        maxStoryPointsPerQuarter: 150
      },
      recommendations: [
        {
          type: 'resource',
          message: 'Consider hiring 1 additional backend developer for Q4',
          impact: 'high',
          cost: 35000
        },
        {
          type: 'budget',
          message: 'Current roadmap exceeds conservative budget by 23%',
          impact: 'high',
          shortfall: 85000
        }
      ]
    });
  }, []);

  // Permission system
  const hasPermission = (action) => {
    const permissions = {
      'product-owner': ['view', 'create', 'edit', 'cost-view', 'roadmap', 'strategic-planning', 'budget-approval', 'priority-setting'],
      'engineering-lead': ['view', 'create', 'edit', 'technical-edit', 'quality-gates', 'roadmap', 'team-management', 'architecture'],
      'developer': ['view', 'create', 'edit-assigned', 'run-tests', 'code-commits', 'time-tracking'],
      'stakeholder': ['view', 'cost-view', 'roadmap', 'reports'],
      'scrum-master': ['view', 'create', 'edit', 'roadmap', 'sprint-planning', 'velocity-tracking', 'team-coordination'],
      'qa-engineer': ['view', 'create', 'edit-assigned', 'technical-edit', 'quality-gates', 'test-management', 'bug-tracking'],
      'devops-engineer': ['view', 'technical-edit', 'pipeline-management', 'infrastructure', 'deployment-tracking'],
      'business-analyst': ['view', 'create', 'edit', 'roadmap', 'requirements-analysis', 'story-writing', 'documentation']
    };
    return permissions[userRole]?.includes(action) || false;
  };

  // Handle role changes and redirect if needed
  const handleRoleChange = (newRole) => {
    setUserRole(newRole);
    setRoleJustChanged(true);
    
    // Hide the indicator after 2 seconds
    setTimeout(() => setRoleJustChanged(false), 2000);
    
    // Check if current view is accessible to new role
    const availableTabs = [
      { id: 'dashboard', roles: ['product-owner', 'engineering-lead', 'stakeholder', 'scrum-master', 'business-analyst'] },
      { id: 'stories', roles: ['product-owner', 'engineering-lead', 'developer', 'scrum-master', 'qa-engineer', 'devops-engineer', 'business-analyst'] },
      { id: 'roadmap', roles: ['product-owner', 'engineering-lead', 'stakeholder', 'scrum-master', 'business-analyst'] },
      { id: 'access', roles: ['product-owner', 'engineering-lead', 'developer', 'stakeholder', 'scrum-master', 'qa-engineer', 'devops-engineer', 'business-analyst'] }
    ];
    
    const currentTabAllowed = availableTabs.find(tab => tab.id === activeView)?.roles.includes(newRole);
    
    if (!currentTabAllowed) {
      // Redirect to first available tab for this role
      const firstAvailableTab = availableTabs.find(tab => tab.roles.includes(newRole));
      if (firstAvailableTab) {
        setActiveView(firstAvailableTab.id);
      }
    }
  };

  // Smart feature detection and redundancy checking
  const detectSimilarFeatures = (featureType, title, description) => {
    if (!featureType && !title) return;
    
    const similarStories = stories.filter(story => {
      const typeMatch = story.featureType === featureType?.toLowerCase();
      const titleSimilarity = calculateSimilarity(title, story.title);
      const descSimilarity = calculateSimilarity(description, story.description);
      
      return typeMatch || titleSimilarity > 0.7 || descSimilarity > 0.6;
    });
    
    if (similarStories.length > 0) {
      setCopyFromFeature({
        type: featureType,
        stories: similarStories,
        count: similarStories.length,
        potentialCost: similarStories.reduce((acc, s) => acc + (s.costEstimate || 0), 0),
        redundancyRisk: calculateRedundancyRisk(similarStories, { title, description, featureType })
      });
      setShowCopyOption(true);
    } else {
      setShowCopyOption(false);
      setCopyFromFeature(null);
    }
  };

  const calculateSimilarity = (str1, str2) => {
    if (!str1 || !str2) return 0;
    const words1 = str1.toLowerCase().split(' ');
    const words2 = str2.toLowerCase().split(' ');
    const commonWords = words1.filter(word => words2.includes(word));
    return commonWords.length / Math.max(words1.length, words2.length);
  };

  const calculateRedundancyRisk = (existingStories, newStory) => {
    return Math.min(existingStories.length * 25, 85);
  };

  const createNewItem = () => {
    if (createType === 'story') {
      const story = {
        id: Date.now(),
        ...newItem,
        tags: newItem.tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        featureType: newItem.featureType.toLowerCase(),
        status: 'backlog',
        testResults: { passed: 0, failed: 0, coverage: 0, unit: 0, integration: 0, e2e: 0 },
        codeQuality: { complexity: 0, maintainability: 0, techDebt: 0, linesOfCode: 0 },
        performance: { loadTime: 0, throughput: 0, memoryUsage: 0, cpuUsage: 0 },
        security: { vulnerabilities: { critical: 0, high: 0, medium: 0, low: 0 }, lastScan: null },
        alignment: { business: 75, technical: 75, user: 75 },
        actualCost: 0,
        dependencies: [],
        riskFactors: copyFromFeature ? ['Similar to existing stories'] : [],
        acceptanceCriteria: []
      };
      
      setStories([...stories, story]);
    } else if (createType === 'feature') {
      const feature = {
        id: Date.now(),
        name: newItem.title,
        description: newItem.description,
        stories: [],
        status: 'planning',
        totalStoryPoints: 0,
        progress: 0,
        costEstimate: newItem.costEstimate,
        actualCost: 0,
        redundancyScore: 0,
        riskLevel: 'low'
      };
      setFeatures([...features, feature]);
    }
    
    resetModal();
  };

  const resetModal = () => {
    setNewItem({ 
      title: '', 
      description: '', 
      priority: 'medium', 
      assignee: '', 
      tags: '', 
      storyPoints: 3,
      featureType: '',
      epic: '',
      costEstimate: 0
    });
    setShowCreateModal(false);
    setShowCopyOption(false);
    setCopyFromFeature(null);
  };

  const runStoryTests = (storyId) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const testResults = {
          passed: Math.floor(Math.random() * 20) + 10,
          failed: Math.floor(Math.random() * 3),
          coverage: Math.floor(Math.random() * 15) + 85,
          unit: Math.floor(Math.random() * 15) + 85,
          integration: Math.floor(Math.random() * 20) + 70,
          e2e: Math.floor(Math.random() * 25) + 60
        };
        return { ...story, testResults };
      }
      return story;
    }));
  };

  const runSecurityScan = (storyId) => {
    setStories(stories.map(story => {
      if (story.id === storyId) {
        const security = {
          vulnerabilities: {
            critical: Math.floor(Math.random() * 2),
            high: Math.floor(Math.random() * 4),
            medium: Math.floor(Math.random() * 8),
            low: Math.floor(Math.random() * 12)
          },
          lastScan: new Date().toISOString().split('T')[0]
        };
        return { ...story, security };
      }
      return story;
    }));
  };

  const getRiskLevel = (story) => {
    const { codeQuality, security, performance, testResults, riskFactors } = story;
    let riskScore = 0;
    
    if (codeQuality.complexity > 8) riskScore += 3;
    if (codeQuality.maintainability < 7) riskScore += 3;
    if (codeQuality.techDebt > 20) riskScore += 2;
    
    riskScore += security.vulnerabilities.critical * 5;
    riskScore += security.vulnerabilities.high * 3;
    riskScore += security.vulnerabilities.medium * 1;
    
    if (performance.loadTime > 150) riskScore += 2;
    if (performance.memoryUsage > 60) riskScore += 2;
    
    if (testResults.coverage < 80) riskScore += 3;
    
    riskScore += riskFactors.length * 2;
    
    if (riskScore >= 10) return { level: 'high', color: 'text-red-600', bg: 'bg-red-50' };
    if (riskScore >= 5) return { level: 'medium', color: 'text-yellow-600', bg: 'bg-yellow-50' };
    return { level: 'low', color: 'text-green-600', bg: 'bg-green-50' };
  };

  const getStatusColor = (status) => {
    const colors = {
      'backlog': 'bg-gray-100 text-gray-700',
      'in-progress': 'bg-blue-100 text-blue-700',
      'completed': 'bg-green-100 text-green-700',
      'blocked': 'bg-red-100 text-red-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'low': 'border-l-green-400',
      'medium': 'border-l-yellow-400',
      'high': 'border-l-red-400',
      'critical': 'border-l-purple-400'
    };
    return colors[priority] || 'border-l-gray-400';
  };

  const filteredStories = stories.filter(story => {
    const matchesSearch = searchTerm === '' || (
      story.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      story.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (story.assignee && story.assignee.toLowerCase().includes(searchTerm.toLowerCase()))
    );
    const matchesPriority = filterPriority === 'all' || story.priority === filterPriority;
    return matchesSearch && matchesPriority;
  });

  const ExecutiveDashboard = () => (
    <div className="space-y-6">
      {/* Role-specific welcome message */}
      <div className={`p-4 rounded-lg border-l-4 ${
        userRole === 'product-owner' ? 'bg-blue-50 border-blue-400' :
        userRole === 'engineering-lead' ? 'bg-green-50 border-green-400' :
        userRole === 'stakeholder' ? 'bg-purple-50 border-purple-400' :
        'bg-gray-50 border-gray-400'
      }`}>
        <h3 className="font-semibold mb-2">
          {userRole === 'product-owner' && '👑 Product Owner Dashboard'}
          {userRole === 'engineering-lead' && '💻 Engineering Lead Dashboard'}
          {userRole === 'developer' && '👥 Developer Dashboard'}
          {userRole === 'stakeholder' && '👁️ Stakeholder Dashboard'}
          {userRole === 'scrum-master' && '⚡ Scrum Master Dashboard'}
          {userRole === 'qa-engineer' && '✅ QA Engineer Dashboard'}
          {userRole === 'devops-engineer' && '⚙️ DevOps Engineer Dashboard'}
          {userRole === 'business-analyst' && '📊 Business Analyst Dashboard'}
        </h3>
        <p className="text-sm">
          {userRole === 'product-owner' && 'Monitor strategic metrics, budget health, and delivery confidence. Make data-driven decisions for product success.'}
          {userRole === 'engineering-lead' && 'Track technical quality, team velocity, and system health. Ensure engineering excellence and delivery.'}
          {userRole === 'developer' && 'Focus on your assigned work, code quality, and testing progress. Track your contribution to team goals.'}
          {userRole === 'stakeholder' && 'View high-level progress, costs, and ROI metrics. Stay informed on project health and timelines.'}
          {userRole === 'scrum-master' && 'Monitor team velocity, sprint health, and process metrics. Facilitate continuous improvement.'}
          {userRole === 'qa-engineer' && 'Track quality metrics, test coverage, and defect trends. Ensure product quality standards.'}
          {userRole === 'devops-engineer' && 'Monitor system reliability, deployment success, and infrastructure health. Ensure operational excellence.'}
          {userRole === 'business-analyst' && 'Analyze requirements, track story completion, and validate business value delivery.'}
        </p>
      </div>

      {/* Role-specific metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {/* Show different metrics based on role */}
        {(userRole === 'product-owner' || userRole === 'stakeholder') && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Delivery Risk</p>
                <p className="text-2xl font-bold text-red-600">
                  {stories.filter(s => getRiskLevel(s).level === 'high').length}
                </p>
              </div>
              <AlertTriangle className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">High-risk stories</p>
          </div>
        )}
        
        {(userRole === 'product-owner' || userRole === 'stakeholder') && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Budget Health</p>
                <p className="text-2xl font-bold text-green-600">
                  {costMetrics.spentToDate && costMetrics.totalBudget ? 
                    Math.round((costMetrics.spentToDate / costMetrics.totalBudget) * 100) : 0}%
                </p>
              </div>
              <DollarSign className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Budget utilized</p>
          </div>
        )}
        
        {userRole === 'product-owner' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Redundancy Cost</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${costMetrics.redundancyCost ? (costMetrics.redundancyCost / 1000).toFixed(0) : 0}k
                </p>
              </div>
              <Copy className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Potential waste</p>
          </div>
        )}
        
        {(userRole === 'engineering-lead' || userRole === 'qa-engineer' || userRole === 'developer') && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Quality Gate</p>
                <p className="text-2xl font-bold text-blue-600">
                  {stories.length > 0 ? Math.round(stories.reduce((acc, s) => acc + s.testResults.coverage, 0) / stories.length) : 0}%
                </p>
              </div>
              <CheckCircle className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Avg test coverage</p>
          </div>
        )}

        {(userRole === 'engineering-lead' || userRole === 'devops-engineer') && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Security Issues</p>
                <p className="text-2xl font-bold text-red-600">
                  {stories.reduce((acc, s) => acc + s.security.vulnerabilities.critical + s.security.vulnerabilities.high, 0)}
                </p>
              </div>
              <Shield className="h-8 w-8 text-red-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Critical + High CVEs</p>
          </div>
        )}

        {(userRole === 'scrum-master' || userRole === 'engineering-lead') && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Team Velocity</p>
                <p className="text-2xl font-bold text-purple-600">
                  {teamResources.velocityPerSprint || 42}
                </p>
              </div>
              <Activity className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Story points/sprint</p>
          </div>
        )}

        {userRole === 'developer' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">My Stories</p>
                <p className="text-2xl font-bold text-green-600">
                  {stories.filter(s => s.assignee && s.assignee.includes('Sarah') || s.assignee && s.assignee.includes('Mike')).length}
                </p>
              </div>
              <Target className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-1">Assigned to me</p>
          </div>
        )}
      </div>

      {/* Role-specific content sections */}
      {(userRole === 'product-owner' || userRole === 'stakeholder') && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Cost Analysis</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Total Budget</span>
                <span className="font-semibold">${costMetrics.totalBudget ? costMetrics.totalBudget.toLocaleString() : '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Spent to Date</span>
                <span className="font-semibold text-blue-600">${costMetrics.spentToDate ? costMetrics.spentToDate.toLocaleString() : '0'}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Projected Spend</span>
                <span className="font-semibold text-orange-600">${costMetrics.projectedSpend ? costMetrics.projectedSpend.toLocaleString() : '0'}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div 
                  className="bg-blue-500 h-3 rounded-full" 
                  style={{ width: `${costMetrics.spentToDate && costMetrics.totalBudget ? (costMetrics.spentToDate / costMetrics.totalBudget) * 100 : 0}%` }}
                />
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Feature Portfolio</h3>
            <div className="space-y-3">
              {features.map(feature => (
                <div key={feature.id} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                  <div>
                    <div className="font-medium">{feature.name}</div>
                    <div className="text-sm text-gray-600">{feature.stories.length} stories</div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-500">
                      ${feature.actualCost ? feature.actualCost.toLocaleString() : '0'} / ${feature.costEstimate ? feature.costEstimate.toLocaleString() : '0'}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {(userRole === 'engineering-lead' || userRole === 'qa-engineer') && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Quality Metrics Overview</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {stories.map(story => (
              <div key={story.id} className="border rounded-lg p-4">
                <h4 className="font-medium mb-2">{story.title}</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Coverage:</span>
                    <span className={story.testResults.coverage >= 80 ? 'text-green-600' : 'text-red-600'}>
                      {story.testResults.coverage}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Complexity:</span>
                    <span>{story.codeQuality.complexity}/10</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Security:</span>
                    <span className={story.security.vulnerabilities.critical === 0 ? 'text-green-600' : 'text-red-600'}>
                      {story.security.vulnerabilities.critical + story.security.vulnerabilities.high} issues
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole === 'developer' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">My Work</h3>
          <div className="space-y-3">
            {stories.filter(story => story.assignee === 'Sarah Chen' || story.assignee === 'Mike Rodriguez').map(story => (
              <div key={story.id} className="flex items-center justify-between p-3 bg-blue-50 rounded">
                <div>
                  <div className="font-medium">{story.title}</div>
                  <div className="text-sm text-gray-600">{story.description}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-2 py-1 rounded text-xs ${getStatusColor(story.status)}`}>
                    {story.status}
                  </span>
                  <span className="text-sm font-medium">{story.storyPoints} pts</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {userRole === 'scrum-master' && (
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Sprint Health</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h4 className="font-medium mb-3">Current Sprint Progress</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Completed:</span>
                  <span className="font-medium text-green-600">
                    {stories.filter(s => s.status === 'completed').length} stories
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>In Progress:</span>
                  <span className="font-medium text-blue-600">
                    {stories.filter(s => s.status === 'in-progress').length} stories
                  </span>
                </div>
                <div className="flex justify-between">
                  <span>Blocked:</span>
                  <span className="font-medium text-red-600">
                    {stories.filter(s => s.status === 'blocked').length} stories
                  </span>
                </div>
              </div>
            </div>
            <div>
              <h4 className="font-medium mb-3">Team Metrics</h4>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span>Velocity:</span>
                  <span className="font-medium">{teamResources.velocityPerSprint} pts/sprint</span>
                </div>
                <div className="flex justify-between">
                  <span>Capacity:</span>
                  <span className="font-medium">{teamResources.currentCapacity}%</span>
                </div>
                <div className="flex justify-between">
                  <span>Available Devs:</span>
                  <span className="font-medium">{teamResources.availableDevelopers}/{teamResources.totalDevelopers}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const EnhancedStoriesView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">
          {userRole === 'product-owner' && 'Product Stories & Features'}
          {userRole === 'engineering-lead' && 'Technical Stories & Quality'}
          {userRole === 'developer' && 'My Assigned Work'}
          {userRole === 'stakeholder' && 'Project Progress'}
          {userRole === 'scrum-master' && 'Sprint Stories'}
          {userRole === 'qa-engineer' && 'Stories & Testing'}
          {userRole === 'devops-engineer' && 'Infrastructure Stories'}
          {userRole === 'business-analyst' && 'Requirements & Stories'}
        </h2>
        <div className="flex items-center gap-4">
          {hasPermission('create') && (
            <div className="flex gap-2">
              <button 
                onClick={() => { setCreateType('story'); setShowCreateModal(true); }}
                className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
              >
                <Plus className="w-4 h-4" />
                New Story
              </button>
              {(userRole === 'product-owner' || userRole === 'business-analyst') && (
                <button 
                  onClick={() => { setCreateType('feature'); setShowCreateModal(true); }}
                  className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
                >
                  <Plus className="w-4 h-4" />
                  New Feature
                </button>
              )}
            </div>
          )}
        </div>
      </div>

      {/* Role-specific filtering message */}
      <div className={`p-3 rounded-lg border-l-4 ${
        userRole === 'developer' ? 'bg-blue-50 border-blue-400' :
        userRole === 'stakeholder' ? 'bg-purple-50 border-purple-400' :
        'bg-gray-50 border-gray-400'
      }`}>
        <p className="text-sm">
          {userRole === 'product-owner' && 'You can view and edit all stories. Create new features and manage priorities.'}
          {userRole === 'engineering-lead' && 'Focus on technical quality, architecture decisions, and team management.'}
          {userRole === 'developer' && 'Showing your assigned stories. You can update progress and run tests.'}
          {userRole === 'stakeholder' && 'View-only access to track progress and understand project status.'}
          {userRole === 'scrum-master' && 'Manage sprint planning, track velocity, and coordinate team work.'}
          {userRole === 'qa-engineer' && 'Focus on quality metrics, testing, and defect management.'}
          {userRole === 'devops-engineer' && 'View infrastructure-related stories and deployment tasks.'}
          {userRole === 'business-analyst' && 'Manage requirements, write user stories, and validate acceptance criteria.'}
        </p>
      </div>

      <div className="bg-white p-4 rounded-lg shadow-sm">
        <div className="flex gap-4 items-center">
          <div className="flex-1">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder={
                  userRole === 'developer' ? 'Search your assigned stories...' :
                  userRole === 'stakeholder' ? 'Search project progress...' :
                  'Search stories, features, or assignees...'
                }
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          <div>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priorities</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredStories
          .filter(story => {
            // Role-based story filtering
            if (userRole === 'developer') {
              return story.assignee === 'Sarah Chen' || story.assignee === 'Mike Rodriguez';
            }
            if (userRole === 'devops-engineer') {
              return story.tags.includes('devops') || story.tags.includes('infrastructure') || story.featureType === 'infrastructure';
            }
            if (userRole === 'qa-engineer') {
              return story.testResults.coverage < 90 || story.security.vulnerabilities.critical > 0;
            }
            return true; // Other roles see all stories
          })
          .map(story => {
          const risk = getRiskLevel(story);
          return (
            <div key={story.id} className={`bg-white rounded-lg shadow-sm border-l-4 ${getPriorityColor(story.priority)} p-4 hover:shadow-md transition-shadow`}>
              <div className="flex justify-between items-start mb-2">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-gray-900">{story.title}</h3>
                    {story.featureType && (
                      <span className="px-2 py-1 bg-indigo-100 text-indigo-700 rounded text-xs font-medium">
                        {story.featureType}
                      </span>
                    )}
                    {userRole === 'developer' && (story.assignee === 'Sarah Chen' || story.assignee === 'Mike Rodriguez') && (
                      <span className="px-2 py-1 bg-green-100 text-green-700 rounded text-xs font-medium">
                        Mine
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-500 mb-2">{story.epic} • {story.sprint}</div>
                </div>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(story.status)}`}>
                  {story.status.replace('-', ' ')}
                </span>
              </div>
              
              <p className="text-gray-600 text-sm mb-3">{story.description}</p>
              
              <div className="flex flex-wrap gap-1 mb-3">
                {story.tags.map(tag => (
                  <span key={tag} className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs">
                    {tag}
                  </span>
                ))}
              </div>
              
              {/* Show different metrics based on role */}
              <div className="grid grid-cols-2 gap-4 mb-3 text-sm">
                {(userRole === 'engineering-lead' || userRole === 'qa-engineer' || userRole === 'developer') && (
                  <div>
                    <div className="text-gray-500 mb-1">Quality Score</div>
                    <div className={`font-medium ${
                      story.testResults.coverage >= 80 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {story.testResults.coverage}% coverage
                    </div>
                  </div>
                )}
                
                {(userRole === 'engineering-lead' || userRole === 'devops-engineer') && (
                  <div>
                    <div className="text-gray-500 mb-1">Security</div>
                    <div className={`font-medium ${
                      story.security.vulnerabilities.critical === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {story.security.vulnerabilities.critical + story.security.vulnerabilities.high} issues
                    </div>
                  </div>
                )}
                
                {(userRole === 'product-owner' || userRole === 'stakeholder') && (
                  <div>
                    <div className="text-gray-500 mb-1">Cost</div>
                    <div className={`font-medium ${
                      story.actualCost <= story.costEstimate ? 'text-green-600' : 'text-red-600'
                    }`}>
                      ${story.actualCost ? story.actualCost.toLocaleString() : '0'}
                    </div>
                  </div>
                )}
                
                <div>
                  <div className="text-gray-500 mb-1">
                    {userRole === 'scrum-master' ? 'Sprint Points' : 'Risk Level'}
                  </div>
                  {userRole === 'scrum-master' ? (
                    <div className="font-medium text-blue-600">
                      {story.storyPoints} pts
                    </div>
                  ) : (
                    <div className={`font-medium ${risk.color}`}>
                      {risk.level}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex justify-between items-center text-sm text-gray-500 mb-3">
                <span>{story.assignee}</span>
                <span>{story.storyPoints} pts</span>
              </div>
              
              {/* Role-specific action buttons */}
              <div className="flex gap-2">
                {(userRole === 'engineering-lead' || userRole === 'qa-engineer' || userRole === 'developer') && (
                  <button 
                    onClick={() => runStoryTests(story.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs hover:bg-blue-200"
                  >
                    <Zap className="w-3 h-3" />
                    Test
                  </button>
                )}
                {(userRole === 'engineering-lead' || userRole === 'devops-engineer') && (
                  <button 
                    onClick={() => runSecurityScan(story.id)}
                    className="flex items-center gap-1 px-2 py-1 bg-red-100 text-red-700 rounded text-xs hover:bg-red-200"
                  >
                    <Shield className="w-3 h-3" />
                    Scan
                  </button>
                )}
                {userRole === 'stakeholder' && (
                  <span className="text-xs text-gray-500 px-2 py-1 bg-gray-100 rounded">
                    View Only
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Show message if no stories match role filter */}
      {filteredStories
        .filter(story => {
          if (userRole === 'developer') {
            return story.assignee === 'Sarah Chen' || story.assignee === 'Mike Rodriguez';
          }
          if (userRole === 'devops-engineer') {
            return story.tags.includes('devops') || story.tags.includes('infrastructure');
          }
          return true;
        }).length === 0 && (
        <div className="text-center py-8">
          <div className="text-gray-500">
            {userRole === 'developer' && 'No stories assigned to you yet.'}
            {userRole === 'devops-engineer' && 'No infrastructure-related stories found.'}
          </div>
        </div>
      )}
    </div>
  );

  const RoadmapView = () => {
    const currentQuarter = roadmapData.quarters?.[selectedQuarter] || {};
    const allQuarters = Object.keys(roadmapData.quarters || {});
    
    // Role-based access control for roadmap
    if (!['product-owner', 'engineering-lead', 'stakeholder', 'scrum-master', 'business-analyst'].includes(userRole)) {
      return (
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <Lock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Roadmap Access Restricted</h3>
            <p className="text-gray-600">
              Strategic roadmap access is limited to Product Owners, Engineering Leads, Stakeholders, Scrum Masters, and Business Analysts.
            </p>
            <p className="text-sm text-gray-500 mt-2">
              Your role ({userRole.replace('-', ' ')}) focuses on execution rather than strategic planning.
            </p>
          </div>
        </div>
      );
    }
    
    return (
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold">
            {userRole === 'product-owner' && 'Strategic Roadmap & Resource Planning'}
            {userRole === 'engineering-lead' && 'Technical Roadmap & Capacity Planning'}
            {userRole === 'stakeholder' && 'Project Roadmap & Milestones'}
            {userRole === 'scrum-master' && 'Sprint Planning & Team Roadmap'}
            {userRole === 'business-analyst' && 'Requirements Roadmap & Feature Planning'}
          </h2>
          <div className="flex items-center gap-4">
            <select
              value={selectedQuarter}
              onChange={(e) => setSelectedQuarter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
            >
              {allQuarters.map(quarter => (
                <option key={quarter} value={quarter}>{quarter}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Role-specific roadmap description */}
        <div className={`p-4 rounded-lg border-l-4 ${
          userRole === 'product-owner' ? 'bg-blue-50 border-blue-400' :
          userRole === 'engineering-lead' ? 'bg-green-50 border-green-400' :
          userRole === 'stakeholder' ? 'bg-purple-50 border-purple-400' :
          'bg-gray-50 border-gray-400'
        }`}>
          <p className="text-sm">
            {userRole === 'product-owner' && 'Manage strategic planning, resource allocation, and funding scenarios. Make informed decisions on feature prioritization and budget optimization.'}
            {userRole === 'engineering-lead' && 'Plan technical capacity, assess architectural needs, and coordinate development resources across quarters.'}
            {userRole === 'stakeholder' && 'Track high-level progress, understand delivery timelines, and monitor ROI on strategic initiatives.'}
            {userRole === 'scrum-master' && 'Plan sprints, allocate team capacity, and coordinate cross-team dependencies for smooth delivery.'}
            {userRole === 'business-analyst' && 'Track requirements delivery, validate business value, and ensure feature completeness across roadmap.'}
          </p>
        </div>

        {/* Show funding scenarios only for product owners and stakeholders */}
        {(userRole === 'product-owner' || userRole === 'stakeholder') && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {Object.entries(fundingScenarios).map(([scenario, data]) => (
              <div key={scenario} className={`bg-white p-6 rounded-lg shadow-sm border-2 ${
                scenario === 'optimistic' ? 'border-blue-300 bg-blue-50' : 'border-gray-200'
              }`}>
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold capitalize">{scenario} Scenario</h3>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    data.confidence >= 80 ? 'bg-green-100 text-green-700' :
                    data.confidence >= 60 ? 'bg-yellow-100 text-yellow-700' :
                    'bg-red-100 text-red-700'
                  }`}>
                    {data.confidence}% confidence
                  </span>
                </div>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Budget:</span>
                    <span className="font-medium">${data.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timeline:</span>
                    <span className="font-medium">{data.timeline}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Features:</span>
                    <span className="font-medium">{data.features.length}</span>
                  </div>
                </div>
                
                <div className="mt-4">
                  <div className="text-xs text-gray-500 mb-2">Key Features:</div>
                  <div className="space-y-1">
                    {data.features.slice(0, 3).map(feature => (
                      <div key={feature} className="text-xs bg-white rounded px-2 py-1">
                        • {feature}
                      </div>
                    ))}
                    {data.features.length > 3 && (
                      <div className="text-xs text-gray-500">+ {data.features.length - 3} more</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Team capacity - visible to engineering leads and scrum masters */}
          {(userRole === 'engineering-lead' || userRole === 'scrum-master' || userRole === 'product-owner') && (
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <h3 className="text-lg font-semibold mb-4">Team Capacity & Resources</h3>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Available Developers</span>
                  <span className="font-semibold">{teamResources.availableDevelopers}/{teamResources.totalDevelopers}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Sprint Velocity</span>
                  <span className="font-semibold">{teamResources.velocityPerSprint} points/{teamResources.sprintLength}w</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Current Capacity</span>
                  <span className={`font-semibold ${
                    teamResources.currentCapacity > 90 ? 'text-red-600' :
                    teamResources.currentCapacity > 75 ? 'text-yellow-600' : 'text-green-600'
                  }`}>
                    {teamResources.currentCapacity}%
                  </span>
                </div>
                
                {(userRole === 'engineering-lead' || userRole === 'scrum-master') && (
                  <div className="pt-4 border-t">
                    <div className="text-sm text-gray-600 mb-2">Team Skills Distribution:</div>
                    <div className="space-y-2">
                      {Object.entries(teamResources.skillsets || {}).map(([skill, count]) => (
                        <div key={skill} className="flex justify-between text-sm">
                          <span className="capitalize">{skill}:</span>
                          <span className="font-medium">{count} devs</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Quarter planning - adapted by role */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">
              {userRole === 'stakeholder' ? `${selectedQuarter} Milestones` : `${selectedQuarter} Planning`}
            </h3>
            
            <div className="grid grid-cols-1 gap-4 mb-6">
              {(userRole === 'product-owner' || userRole === 'stakeholder') && (
                <div className="text-center p-4 bg-blue-50 rounded-lg">
                  <div className="text-2xl font-bold text-blue-600">${currentQuarter.budget?.toLocaleString() || '0'}</div>
                  <div className="text-sm text-blue-700">Quarter Budget</div>
                </div>
              )}
              {(userRole === 'engineering-lead' || userRole === 'scrum-master') && (
                <div className="text-center p-4 bg-green-50 rounded-lg">
                  <div className="text-2xl font-bold text-green-600">{currentQuarter.capacity || 0}</div>
                  <div className="text-sm text-green-700">Available Story Points</div>
                </div>
              )}
            </div>

            <div className="space-y-3">
              {currentQuarter.plannedFeatures?.map(feature => (
                <div key={feature.id} className="p-3 bg-gray-50 rounded">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{feature.name}</h4>
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      feature.priority === 'critical' ? 'bg-red-100 text-red-700' :
                      feature.priority === 'high' ? 'bg-orange-100 text-orange-700' :
                      'bg-yellow-100 text-yellow-700'
                    }`}>
                      {feature.priority}
                    </span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-600">
                    {(userRole === 'engineering-lead' || userRole === 'scrum-master') && (
                      <span>{feature.storyPoints} pts</span>
                    )}
                    {(userRole === 'product-owner' || userRole === 'stakeholder') && (
                      <span>${feature.cost.toLocaleString()}</span>
                    )}
                    {(userRole === 'product-owner' || userRole === 'business-analyst') && (
                      <span className="font-medium text-green-600">{feature.roi}x ROI</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Product Owner recommendations - only for PO */}
        {userRole === 'product-owner' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Strategic Recommendations</h3>
            <div className="space-y-4">
              {roadmapData.recommendations?.map((rec, index) => (
                <div key={index} className={`p-4 rounded-lg border-l-4 ${
                  rec.impact === 'high' ? 'bg-red-50 border-red-400' :
                  rec.impact === 'medium' ? 'bg-yellow-50 border-yellow-400' :
                  'bg-blue-50 border-blue-400'
                }`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          rec.type === 'resource' ? 'bg-blue-100 text-blue-700' :
                          rec.type === 'budget' ? 'bg-green-100 text-green-700' :
                          'bg-purple-100 text-purple-700'
                        }`}>
                          {rec.type.toUpperCase()}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs ${
                          rec.impact === 'high' ? 'bg-red-100 text-red-700' :
                          rec.impact === 'medium' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-green-100 text-green-700'
                        }`}>
                          {rec.impact} impact
                        </span>
                      </div>
                      <p className="text-sm text-gray-700">{rec.message}</p>
                    </div>
                    <div className="text-right ml-4">
                      {rec.cost && (
                        <div className="text-sm font-medium text-red-600">
                          +${rec.cost.toLocaleString()}
                        </div>
                      )}
                      {rec.savings && (
                        <div className="text-sm font-medium text-green-600">
                          -${rec.savings.toLocaleString()}
                        </div>
                      )}
                      {rec.shortfall && (
                        <div className="text-sm font-medium text-orange-600">
                          ${rec.shortfall.toLocaleString()} gap
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Simplified milestone view for stakeholders */}
        {userRole === 'stakeholder' && (
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <h3 className="text-lg font-semibold mb-4">Key Milestones & Progress</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-medium mb-3">Upcoming Milestones</h4>
                <div className="space-y-2">
                  {currentQuarter.milestones?.map((milestone, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <Clock className="w-4 h-4 text-blue-500" />
                      <span className="text-sm">{milestone}</span>
                    </div>
                  ))}
                </div>
              </div>
              
              <div>
                <h4 className="font-medium mb-3">Potential Risks</h4>
                <div className="space-y-2">
                  {currentQuarter.risks?.map((risk, index) => (
                    <div key={index} className="flex items-center gap-3">
                      <AlertTriangle className="w-4 h-4 text-yellow-500" />
                      <span className="text-sm">{risk}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };

  const AccessControlView = () => (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">Access Controls & Permissions</h2>
        <div className="text-sm text-gray-600">
          Click "Switch to This Role" below to try different user perspectives
        </div>
      </div>
      
      {/* Role Switching Instructions */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <UserCheck className="w-4 h-4 text-blue-600" />
          </div>
          <div>
            <h3 className="font-medium text-blue-900">Role Switching Demo</h3>
            <p className="text-sm text-blue-700">
              Try switching between different roles to see how the platform adapts. Use the dropdown in the header or click the buttons below.
            </p>
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Role Management</h3>
          <div className="space-y-4">
            {[
              { 
                role: 'product-owner', 
                label: 'Product Owner', 
                icon: Crown, 
                permissions: ['Full platform access', 'Cost management', 'Strategic roadmap planning', 'Resource allocation', 'Story creation & editing', 'Budget approval', 'Priority setting', 'Stakeholder reporting'] 
              },
              { 
                role: 'engineering-lead', 
                label: 'Engineering Lead', 
                icon: Code, 
                permissions: ['Technical metrics access', 'Quality gates management', 'Code review oversight', 'Team capacity planning', 'Roadmap visibility', 'Architecture decisions', 'Performance monitoring', 'Security scanning'] 
              },
              { 
                role: 'developer', 
                label: 'Developer', 
                icon: Users, 
                permissions: ['View assigned stories', 'Update work progress', 'Run tests & scans', 'Code commits', 'Comment on stories', 'Time tracking', 'Bug reporting', 'Technical documentation'] 
              },
              { 
                role: 'stakeholder', 
                label: 'Stakeholder', 
                icon: Eye, 
                permissions: ['Dashboard visibility', 'Cost transparency', 'Progress tracking', 'Roadmap viewing', 'Executive reports', 'ROI metrics', 'Risk assessment', 'Timeline updates'] 
              },
              { 
                role: 'scrum-master', 
                label: 'Scrum Master', 
                icon: Activity, 
                permissions: ['Sprint planning', 'Velocity tracking', 'Impediment management', 'Team coordination', 'Ceremony facilitation', 'Burndown charts', 'Story estimation', 'Process improvement'] 
              },
              { 
                role: 'qa-engineer', 
                label: 'QA Engineer', 
                icon: CheckCircle, 
                permissions: ['Test case management', 'Quality metrics', 'Bug tracking', 'Test automation', 'Coverage reports', 'Performance testing', 'Security testing', 'Release validation'] 
              },
              { 
                role: 'devops-engineer', 
                label: 'DevOps Engineer', 
                icon: Settings, 
                permissions: ['CI/CD pipeline management', 'Infrastructure monitoring', 'Deployment tracking', 'Security scanning', 'Performance metrics', 'System reliability', 'Automation tools', 'Environment management'] 
              },
              { 
                role: 'business-analyst', 
                label: 'Business Analyst', 
                icon: BarChart3, 
                permissions: ['Requirements analysis', 'User story writing', 'Acceptance criteria', 'Process mapping', 'Data analysis', 'Stakeholder interviews', 'Documentation', 'Solution design'] 
              }
            ].map(({ role, label, icon: Icon, permissions }) => (
              <div key={role} className={`border rounded-lg p-4 transition-all ${
                userRole === role ? 'border-blue-300 bg-blue-50' : 'border-gray-200 hover:border-gray-300'
              }`}>
                <div className="flex items-center gap-3 mb-3">
                  <Icon className={`w-5 h-5 ${userRole === role ? 'text-blue-600' : 'text-gray-600'}`} />
                  <div className="flex-1">
                    <h4 className="font-medium">{label}</h4>
                    <button
                      onClick={() => handleRoleChange(role)}
                      className={`text-sm px-4 py-2 rounded-lg font-medium transition-colors mt-1 ${
                        userRole === role 
                          ? 'bg-green-600 text-white cursor-default' 
                          : 'bg-blue-600 text-white hover:bg-blue-700 cursor-pointer'
                      }`}
                    >
                      {userRole === role ? '✓ Current Role' : 'Switch to This Role'}
                    </button>
                  </div>
                  {userRole === role && (
                    <div className="px-3 py-1 bg-green-100 text-green-700 rounded-lg text-sm font-medium">
                      Active
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-1 gap-1">
                  {permissions.map((permission, index) => (
                    <div key={index} className="text-sm text-gray-600 flex items-center gap-2">
                      <CheckCircle className="w-3 h-3 text-green-500 flex-shrink-0" />
                      <span>{permission}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-sm">
          <h3 className="text-lg font-semibold mb-4">Current Role Capabilities</h3>
          
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <div className="flex items-center gap-3 mb-2">
              {userRole === 'product-owner' && <Crown className="w-5 h-5 text-blue-600" />}
              {userRole === 'engineering-lead' && <Code className="w-5 h-5 text-blue-600" />}
              {userRole === 'developer' && <Users className="w-5 h-5 text-blue-600" />}
              {userRole === 'stakeholder' && <Eye className="w-5 h-5 text-blue-600" />}
              {userRole === 'scrum-master' && <Activity className="w-5 h-5 text-blue-600" />}
              {userRole === 'qa-engineer' && <CheckCircle className="w-5 h-5 text-blue-600" />}
              {userRole === 'devops-engineer' && <Settings className="w-5 h-5 text-blue-600" />}
              {userRole === 'business-analyst' && <BarChart3 className="w-5 h-5 text-blue-600" />}
              <span className="font-semibold text-blue-900 capitalize">
                {userRole.replace('-', ' ')} View
              </span>
            </div>
            <p className="text-sm text-blue-700">
              {userRole === 'product-owner' && 'You have full access to all platform features including strategic planning, budget management, and roadmap control.'}
              {userRole === 'engineering-lead' && 'You can access technical metrics, manage quality gates, and view roadmap details for technical planning.'}
              {userRole === 'developer' && 'You can view and update your assigned stories, run tests, and track your work progress.'}
              {userRole === 'stakeholder' && 'You have read-only access to dashboards, costs, progress tracking, and executive reports.'}
              {userRole === 'scrum-master' && 'You can manage sprints, track velocity, facilitate ceremonies, and coordinate team activities.'}
              {userRole === 'qa-engineer' && 'You can manage test cases, track quality metrics, run automated tests, and validate releases.'}
              {userRole === 'devops-engineer' && 'You can manage CI/CD pipelines, monitor infrastructure, track deployments, and maintain system reliability.'}
              {userRole === 'business-analyst' && 'You can analyze requirements, write user stories, create acceptance criteria, and design solutions.'}
            </p>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="font-medium mb-2">Available Actions</h4>
              <div className="space-y-2">
                {hasPermission('create') && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Create new stories and features
                  </div>
                )}
                {hasPermission('edit') && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Edit stories and project details
                  </div>
                )}
                {hasPermission('cost-view') && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    View cost and budget information
                  </div>
                )}
                {hasPermission('roadmap') && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Access strategic roadmap
                  </div>
                )}
                {hasPermission('technical-edit') && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Run tests and security scans
                  </div>
                )}
                {hasPermission('quality-gates') && (
                  <div className="flex items-center gap-2 text-sm text-green-600">
                    <CheckCircle className="w-4 h-4" />
                    Manage quality gates and metrics
                  </div>
                )}
              </div>
            </div>

            <div className="pt-4 border-t">
              <h4 className="font-medium mb-2">Data Integration Status</h4>
              <div className="space-y-3">
                {[
                  { name: 'GitHub Actions', status: 'connected', lastSync: '2 min ago', roles: ['engineering-lead', 'developer', 'devops-engineer'] },
                  { name: 'Jira Sync', status: 'connected', lastSync: '15 min ago', roles: ['product-owner', 'scrum-master', 'business-analyst'] },
                  { name: 'SonarQube', status: 'connected', lastSync: '1 hour ago', roles: ['engineering-lead', 'qa-engineer'] },
                  { name: 'Snyk Security', status: 'warning', lastSync: '2 hours ago', roles: ['engineering-lead', 'devops-engineer'] },
                  { name: 'New Relic APM', status: 'disconnected', lastSync: 'Never', roles: ['engineering-lead', 'devops-engineer'] }
                ].filter(integration => integration.roles.includes(userRole) || userRole === 'product-owner').map(integration => (
                  <div key={integration.name} className="flex items-center justify-between p-3 bg-gray-50 rounded">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${
                        integration.status === 'connected' ? 'bg-green-500' :
                        integration.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'
                      }`} />
                      <span className="font-medium text-sm">{integration.name}</span>
                    </div>
                    <div className="text-xs text-gray-500">
                      {integration.lastSync}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-3">
              <GitBranch className="w-8 h-8 text-blue-600" />
              <h1 className="text-2xl font-bold text-gray-900">Modern Product Platform</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="relative">
                <Bell className="w-5 h-5 text-gray-600" />
                {notifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                    {notifications.length}
                  </span>
                )}
              </div>
              
              <div className="flex items-center gap-2 px-3 py-1 bg-blue-100 text-blue-700 rounded-full">
                <UserCheck className="w-4 h-4" />
                <span className="text-sm font-medium capitalize">
                  {userRole === 'product-owner' && 'Product Owner'}
                  {userRole === 'engineering-lead' && 'Engineering Lead'}
                  {userRole === 'developer' && 'Developer'}
                  {userRole === 'stakeholder' && 'Stakeholder'}
                  {userRole === 'scrum-master' && 'Scrum Master'}
                  {userRole === 'qa-engineer' && 'QA Engineer'}
                  {userRole === 'devops-engineer' && 'DevOps Engineer'}
                  {userRole === 'business-analyst' && 'Business Analyst'}
                </span>
              </div>
            </div>
          </div>
          
          <nav className="flex gap-1 pb-4">
            {[
              { id: 'dashboard', label: 'Executive Dashboard', icon: BarChart3, roles: ['product-owner', 'engineering-lead', 'stakeholder', 'scrum-master', 'business-analyst'] },
              { id: 'stories', label: 'Stories & Features', icon: Target, roles: ['product-owner', 'engineering-lead', 'developer', 'scrum-master', 'qa-engineer', 'devops-engineer', 'business-analyst'] },
              { id: 'roadmap', label: 'Strategic Roadmap', icon: TrendingUp, roles: ['product-owner', 'engineering-lead', 'stakeholder', 'scrum-master', 'business-analyst'] },
              { id: 'access', label: 'Access Controls', icon: Settings, roles: ['product-owner', 'engineering-lead', 'developer', 'stakeholder', 'scrum-master', 'qa-engineer', 'devops-engineer', 'business-analyst'] }
            ].filter(nav => nav.roles.includes(userRole)).map(nav => (
              <button
                key={nav.id}
                onClick={() => setActiveView(nav.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-colors ${
                  activeView === nav.id 
                    ? 'bg-blue-100 text-blue-700' 
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <nav.icon className="w-4 h-4" />
                {nav.label}
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role change indicator */}
        {roleJustChanged && (
          <div className="mb-6">
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg flex items-center gap-3">
              <CheckCircle className="w-5 h-5" />
              <span>
                Platform view updated for {userRole.replace('-', ' ')} role. Content and permissions have been adapted.
              </span>
            </div>
          </div>
        )}

        {/* Notifications Bar */}
        {notifications.length > 0 && (
          <div className="mb-6 space-y-2">
            {notifications.slice(0, 2).map(notification => (
              <div key={notification.id} className={`p-3 rounded-lg border-l-4 ${
                notification.type === 'error' ? 'bg-red-50 border-red-400' :
                notification.type === 'warning' ? 'bg-yellow-50 border-yellow-400' :
                'bg-blue-50 border-blue-400'
              }`}>
                <div className="flex justify-between items-center">
                  <span className="text-sm">{notification.message}</span>
                  <button className="text-sm font-medium text-blue-600 hover:underline">
                    {notification.action}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeView === 'dashboard' && <ExecutiveDashboard />}
        {activeView === 'stories' && <EnhancedStoriesView />}
        {activeView === 'roadmap' && <RoadmapView />}
        {activeView === 'access' && <AccessControlView />}
      </div>

      {showCreateModal && hasPermission('create') && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <h3 className="text-lg font-semibold mb-4">
              Create New {createType === 'story' ? 'Story' : 'Feature'}
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {createType === 'story' ? 'Story Title' : 'Feature Name'}
                </label>
                <input
                  type="text"
                  value={newItem.title}
                  onChange={(e) => {
                    setNewItem({...newItem, title: e.target.value});
                    if (createType === 'story') {
                      detectSimilarFeatures(newItem.featureType, e.target.value, newItem.description);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter title..."
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={newItem.description}
                  onChange={(e) => {
                    setNewItem({...newItem, description: e.target.value});
                    if (createType === 'story') {
                      detectSimilarFeatures(newItem.featureType, newItem.title, e.target.value);
                    }
                  }}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder="Enter description..."
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Priority</label>
                  <select
                    value={newItem.priority}
                    onChange={(e) => setNewItem({...newItem, priority: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>
                
                {createType === 'story' && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Story Points</label>
                    <input
                      type="number"
                      value={newItem.storyPoints}
                      onChange={(e) => setNewItem({...newItem, storyPoints: parseInt(e.target.value) || 1})}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      min="1"
                      max="21"
                    />
                  </div>
                )}
              </div>
              
              {createType === 'story' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Feature Type</label>
                  <input
                    type="text"
                    value={newItem.featureType}
                    onChange={(e) => {
                      setNewItem({...newItem, featureType: e.target.value});
                      detectSimilarFeatures(e.target.value, newItem.title, newItem.description);
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="authentication, analytics, payments..."
                  />
                </div>
              )}
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {createType === 'story' ? 'Assignee' : 'Team Lead'}
                  </label>
                  <input
                    type="text"
                    value={newItem.assignee}
                    onChange={(e) => setNewItem({...newItem, assignee: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Enter name..."
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Cost Estimate</label>
                  <input
                    type="number"
                    value={newItem.costEstimate}
                    onChange={(e) => setNewItem({...newItem, costEstimate: parseInt(e.target.value) || 0})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="0"
                  />
                </div>
              </div>
              
              {showCopyOption && copyFromFeature && (
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <AlertTriangle className="w-4 h-4 text-blue-600" />
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-sm font-medium text-blue-900 mb-1">
                        Potential Redundancy Detected ({copyFromFeature.redundancyRisk}% similarity)
                      </h4>
                      <p className="text-sm text-blue-700 mb-3">
                        Found {copyFromFeature.count} similar stories. Estimated cost: ${copyFromFeature.potentialCost ? copyFromFeature.potentialCost.toLocaleString() : '0'}
                      </p>
                      <div className="space-y-2">
                        {copyFromFeature.stories.slice(0, 3).map(story => (
                          <div key={story.id} className="text-xs text-blue-600 bg-white rounded px-2 py-1">
                            • {story.title} (${story.costEstimate ? story.costEstimate.toLocaleString() : '0'})
                          </div>
                        ))}
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <input
                          type="checkbox"
                          id="copyStories"
                          defaultChecked={false}
                          className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                        />
                        <label htmlFor="copyStories" className="text-sm text-blue-700">
                          Copy similar stories as templates (Review recommended to avoid redundancy)
                        </label>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <div className="flex gap-3 mt-6">
              <button
                onClick={createNewItem}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 font-medium"
              >
                Create {createType === 'story' ? 'Story' : 'Feature'}
              </button>
              <button
                onClick={resetModal}
                className="flex-1 bg-gray-100 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-200 font-medium"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModernProductPlatform;