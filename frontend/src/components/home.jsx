import React from 'react';
import { LayoutGrid, Cpu, Database, ArrowRight } from 'lucide-react';
import '../index.css'; 

const Home = ({ user, setView, theme }) => {
    const isDark = theme === 'dark';

    return (
        <div className="wrapper">
            <header className="head">
                <span className="tag">DATA-DRIVEN HOUSE PRICE PREDICTOR</span>
                <h1 className="title">
                    Valuation Intelligence
                </h1>
                <p className="subtitle">
                    An enterprise-grade forecasting platform utilizing gradient-boosted decision trees to evaluate residential property parameters across the Seattle area.
                </p>
                
                <div className="group">
                    {user ? (
                        <button className="btn-primary" onClick={() => setView('predict')}>
                            Open Predictor <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                        </button>
                    ) : (
                        <>
                            <button className="btn-primary" onClick={() => setView('login')}>
                                Create an Account <ArrowRight size={16} style={{ marginLeft: '8px' }} />
                            </button>
                            <button className="btn-secondary" onClick={() => setView('login')}>
                                Sign In
                            </button>
                        </>
                    )}
                </div>
            </header>

            <section className="features-section">
                <div className="grid">
                    
                    <div className="card">
                        <div className="icon-box" style={{ backgroundColor: 'var(--bg-icon-cpu)' }}>
                            <Cpu size={20} color={isDark ? '#34D399' : '#16803d'} />
                        </div>
                        <h3 className="card-title">XGBoost Regression Model</h3>
                        <p className="card-text">
                            Processes structural correlations via hyperparameter-tuned pipelines to output optimized log-transformed pricing estimates.
                        </p>
                    </div>

                    <div className="card">
                        <div className="icon-box" style={{ backgroundColor: 'var(--bg-icon-grid)' }}>
                            <LayoutGrid size={20} color={isDark ? '#60A5FA' : '#1d4ed8'} />
                        </div>
                        <h3 className="card-title">Multi-Feature Ingestion</h3>
                        <p className="card-text">
                            Evaluates structural grades, exact latitudinal/longitudinal mapping coordinates, square footage arrays, and room distributions.
                        </p>
                    </div>

                    <div className="card">
                        <div className="icon-box" style={{ backgroundColor: 'var(--bg-icon-db)' }}>
                            <Database size={20} color={isDark ? '#FBBF24' : '#b45309'} />
                        </div>
                        <h3 className="card-title">Persistent Query Logs</h3>
                        <p className="card-text">
                            Securely links previous evaluations and calculations to your verified relational profile for real-time comparative dashboard analysis.
                        </p>
                    </div>
                </div>
            </section>

            <footer className="foot">
                <p>copyright ©️ Hpred@gmail.com - Yogeshreddy-19</p>
            </footer>
        </div>
    );
};

export default Home;