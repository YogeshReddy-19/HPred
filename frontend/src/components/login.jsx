import React, { useState } from 'react';
import API from '../api';
import { User, Lock, ShieldAlert, LogIn, UserPlus } from 'lucide-react';
import './Login.css';

const Login = ({ setUser, setView }) => {
    const [mode, setMode] = useState('login');
    
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState('buyer'); 
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');
    const [submitting, setSubmitting] = useState(false);

    const toggleMode = () => {
        setMode(mode === 'login' ? 'register' : 'login');
        setError('');
        setSuccess('');
        setUsername('');
        setPassword('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setSuccess('');
        setSubmitting(true);

        if (!username.trim() || !password.trim()) {
            setError('All parameters must be populated.');
            setSubmitting(false);
            return;
        }

        try {
            if (mode === 'login') {
            const response = await API.post('/auth/login', { username, password });
            const { token, user } = response.data;
            localStorage.setItem('token', token);
            setUser(user);    
            setView('home'); 
            } else {
                const response = await API.post('/auth/register', { username, password, role });
                
                setSuccess('Account registered successfully , redirecting to login');
                setTimeout(() => {
                    setMode('login');
                    setSuccess('');
                    setPassword('');
                }, 2000);
            }
        } catch (err) {
            console.error('Authentication layer communication failure:', err);
            setError(err.response?.data?.error || 'Target authentication transaction rejected.');
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="auth-viewport-wrapper">
            <div className="auth-card">
                
                <div className="auth-header">
                    <h2 className="auth-title">
                        {mode === 'login' ? 'LOGIN' : 'REGISTER'}
                    </h2>
                    <p className="auth-subtitle">
                        {mode === 'login' 
                            ? 'Provide credentials to verify session .' 
                            : 'Initialize a new system record profile.'}
                    </p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {error && (
                        <div className="auth-alert-error">
                            ⚠️ {error}
                        </div>
                    )}
                    {success && (
                        <div className="auth-alert-success">
                            ✨ {success}
                        </div>
                    )}

                    <div className="form-group">
                        <label className="form-label">Username</label>
                        <div className="input-field-wrapper">
                            <User className="input-icon" size={18} />
                            <input 
                                type="text"
                                className="auth-input"
                                placeholder="Enter username handle"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                    </div>

                    <div className="form-group">
                        <label className="form-label">Password</label>
                        <div className="input-field-wrapper">
                            <Lock className="input-icon" size={18} />
                            <input 
                                type="password"
                                className="auth-input"
                                placeholder="Enter secure password sequence"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={submitting}
                            />
                        </div>
                    </div>
                    {mode === 'register' && (
                        <div className="form-group">
                            <label className="form-label">Register User</label>
                            <div className="input-field-wrapper">
                                <ShieldAlert className="input-icon" size={18} />
                                <select 
                                    className="auth-input"
                                    style={{ appearance: 'none', cursor: 'pointer' }}
                                    value={role}
                                    onChange={(e) => setRole(e.target.value)}
                                    disabled={submitting}
                                >
                                    <option value="buyer">Buyer Profile</option>
                                    <option value="broker">Broker Account</option>
                                    <option value="analyst">Data Analyst Matrix</option>
                                </select>
                            </div>
                        </div>
                    )}

                    <button className="btn-auth-submit" type="submit" disabled={submitting}>
                        {submitting ? (
                            'Processing Transaction...'
                        ) : mode === 'login' ? (
                            <>
                                Authenticate <LogIn size={16} />
                            </>
                        ) : (
                            <>
                                Register Record <UserPlus size={16} />
                            </>
                        )}
                    </button>
                </form>

                <div className="auth-toggle-footer">
                    {mode === 'login' ? (
                        <p>
                            Doesnt have an Account?{' '}
                            <button className="auth-toggle-link" onClick={toggleMode}>
                                Register Here
                            </button>
                        </p>
                    ) : (
                        <p>
                            Already possess an Account?{' '}
                            <button className="auth-toggle-link" onClick={toggleMode}>
                                Login Here
                            </button>
                        </p>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Login;