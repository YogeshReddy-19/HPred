import React, { useState, useEffect } from 'react';
import API from '../api';
import { Database, UserCheck, Calendar, BarChart3, Loader2 } from 'lucide-react';
import './Profile.css';

const Profile = () => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchDashboardData = async () => {
            try {
                const response = await API.get('/profile');
                setProfileData(response.data);
            } catch (err) {
                console.error('Failed to resolve profile matrix:', err);
                setError('Failed to extract historical transaction records.');
            } finally {
                setLoading(false);
            }
        };

        fetchDashboardData();
    }, []);

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '300px', gap: '12px' }}>
                <Loader2 className="animate-spin" color="var(--primary)" size={24} />
                <span style={{ color: 'var(--text-muted)', fontWeight: 500 }}>Retrieving profile ledger...</span>
            </div>
        );
    }

    if (error) {
        return (
            <div className="profile-viewport-container" style={{ textAlign: 'center', color: '#ef4444', padding: '40px' }}>
                <h3>Pipeline Error Interrupted</h3>
                <p>{error}</p>
            </div>
        );
    }

    const { user, prediction_history } = profileData;

    return (
        <div className="profile-viewport-container">
            <div className="profile-meta-banner">
                <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    <div style={{ padding: '12px', borderRadius: '50%', backgroundColor: 'var(--bg-tag)', color: 'var(--primary)' }}>
                        <UserCheck size={28} />
                    </div>
                    <div>
                        <h2 className="user-badge-title">{user.username}</h2>
                        <p className="user-badge-sub">Account Access Level: {user.role}</p>
                    </div>
                </div>
                <div className="profile-stat-counter">
                    <div className="stat-number">{prediction_history ? prediction_history.length : 0}</div>
                    <div className="stat-label">Calculations Executed</div>
                </div>
            </div>

            <h3 className="history-section-title">Valuation Query Ledger</h3>

            {!prediction_history || prediction_history.length === 0 ? (
                <div className="history-empty-box">
                    <Database className="result-placeholder-icon" size={40} style={{ opacity: 0.3, marginBottom: '12px' }} />
                    <p className="empty-prompt-text">No Historical Ingestion Reruns Logged</p>
                    <p className="empty-subtext">Run real estate matrix transformations inside the Predict panel to log entries here.</p>
                </div>
            ) : (
                <div className="table-responsive-wrapper">
                    <table className="history-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Beds</th>
                                <th>Baths</th>
                                <th>Living (sqft)</th>
                                <th>Lot (sqft)</th>
                                <th>Floors</th>
                                <th>Estimated Value</th>
                            </tr>
                        </thead>
                        <tbody>
                            {prediction_history.map((record) => (
                                <tr key={record.id}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: '8px', color: 'var(--text-light)' }}>
                                        <Calendar size={14} />
                                        {new Date(record.created_at).toLocaleDateString('en-US', {
                                            month: 'short',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </td>
                                    <td>{record.bedrooms}</td>
                                    <td>{record.bathrooms}</td>
                                    <td>{Number(record.sqft_living).toLocaleString()}</td>
                                    <td>{Number(record.sqft_lot).toLocaleString()}</td>
                                    <td>{record.floors}</td>
                                    <td className="price-cell-highlight">
                                        ${Number(record.predicted_price).toLocaleString('en-US', { maximumFractionDigits: 0 })}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Profile;