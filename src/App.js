import React, { useState, useEffect } from 'react';
import './App.css';
/* global chrome */

function App() {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('applications');
  const [stats, setStats] = useState({
    total: 0,
    thisWeek: 0,
    thisMonth: 0
  });

  useEffect(() => {
    loadApplications();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const loadApplications = () => {
    setLoading(true);
    chrome.runtime.sendMessage({ type: 'GET_APPLICATIONS' }, (response) => {
      if (response && response.applications) {
        setApplications(response.applications);
        calculateStats(response.applications);
      }
      setLoading(false);
    });
  };

  const calculateStats = (apps) => {
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneMonthAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    const thisWeek = apps.filter(app => new Date(app.timestamp) >= oneWeekAgo).length;
    const thisMonth = apps.filter(app => new Date(app.timestamp) >= oneMonthAgo).length;

    setStats({
      total: apps.length,
      thisWeek,
      thisMonth
    });
  };

  const deleteApplication = (id) => {
    chrome.runtime.sendMessage({ type: 'DELETE_APPLICATION', id }, (response) => {
      if (response && response.success) {
        loadApplications();
      }
    });
  };

  const clearAll = () => {
    if (window.confirm('Are you sure you want to clear all applications?')) {
      chrome.runtime.sendMessage({ type: 'CLEAR_ALL_APPLICATIONS' }, (response) => {
        if (response && response.success) {
          loadApplications();
        }
      });
    }
  };

  const exportData = () => {
    const dataStr = JSON.stringify(applications, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `job-applications-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
  };

  const formatDate = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="App">
      <header className="App-header">
        <div className="header-content">
          <h1>📋 Job Application Tracker</h1>
          <p className="subtitle">Keep track of all your applications</p>
        </div>
      </header>

      <div className="tabs">
        <button 
          className={`tab ${activeTab === 'applications' ? 'active' : ''}`}
          onClick={() => setActiveTab('applications')}
        >
          Applications
        </button>
        <button 
          className={`tab ${activeTab === 'stats' ? 'active' : ''}`}
          onClick={() => setActiveTab('stats')}
        >
          Statistics
        </button>
      </div>

      <div className="content">
        {activeTab === 'applications' && (
          <div className="applications-section">
            <div className="actions-bar">
              <button className="btn-secondary" onClick={loadApplications}>
                🔄 Refresh
              </button>
              {applications.length > 0 && (
                <>
                  <button className="btn-secondary" onClick={exportData}>
                    📥 Export
                  </button>
                  <button className="btn-danger" onClick={clearAll}>
                    🗑️ Clear All
                  </button>
                </>
              )}
            </div>

            {loading ? (
              <div className="loading">Loading...</div>
            ) : applications.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📄</div>
                <h3>No Applications Yet</h3>
                <p>Submit a job application on any job site to start tracking!</p>
                <div className="supported-sites">
                  <p className="sites-label">Supported Sites:</p>
                  <div className="sites">
                    <span>LinkedIn</span>
                    <span>Indeed</span>
                    <span>Glassdoor</span>
                    <span>Greenhouse</span>
                    <span>Lever</span>
                    <span>Workday</span>
                    <span>+ More</span>
                  </div>
                </div>
              </div>
            ) : (
              <div className="applications-list">
                {applications.map((app) => (
                  <div key={app.id} className="application-card">
                    <div className="card-header">
                      <h3 className="position">{app.position}</h3>
                      <button 
                        className="delete-btn"
                        onClick={() => deleteApplication(app.id)}
                        title="Delete"
                      >
                        ✕
                      </button>
                    </div>
                    <div className="company">{app.company}</div>
                    <div className="meta">
                      <span className="site">🌐 {app.site}</span>
                      <span className="date">📅 {formatDate(app.timestamp)}</span>
                    </div>
                    <a 
                      href={app.url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="view-link"
                    >
                      View Application →
                    </a>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {activeTab === 'stats' && (
          <div className="stats-section">
            <div className="stat-card">
              <div className="stat-icon">📊</div>
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Total Applications</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📅</div>
              <div className="stat-value">{stats.thisWeek}</div>
              <div className="stat-label">This Week</div>
            </div>
            <div className="stat-card">
              <div className="stat-icon">📆</div>
              <div className="stat-value">{stats.thisMonth}</div>
              <div className="stat-label">This Month</div>
            </div>
            
            {applications.length > 0 && (
              <div className="recent-activity">
                <h3>Recent Activity</h3>
                <div className="activity-list">
                  {applications.slice(0, 5).map((app) => (
                    <div key={app.id} className="activity-item">
                      <div className="activity-dot"></div>
                      <div className="activity-content">
                        <div className="activity-text">
                          Applied to <strong>{app.position}</strong> at <strong>{app.company}</strong>
                        </div>
                        <div className="activity-time">{formatDate(app.timestamp)}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      <footer className="App-footer">
        <p>🚀 Keep applying! You've got this!</p>
      </footer>
    </div>
  );
}

export default App;

