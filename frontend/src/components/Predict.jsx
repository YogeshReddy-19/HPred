import React, { useState } from 'react';
import API from '../api';
import { Sliders, DollarSign, Loader2, Sparkles } from 'lucide-react';
import './Predict.css';

const Predict = () => {
    const [formData, setFormData] = useState({
        bedrooms: 3,
        bathrooms: 2.0,
        sqft_living: 1800,
        sqft_lot: 5000,
        floors: 1.0,
        waterfront: 0,
        view: 0,
        condition: 3,
        grade: 7,
        sqft_above: 1500,
        sqft_basement: 300,
        yr_built: 1980,
        yr_renovated: 0,
        lat: 47.5112,
        long: -122.257
    });

    const [loading, setLoading] = useState(false);
    const [price, setPrice] = useState(null);
    const [error, setError] = useState('');

    const handleInputChange = (field, value) => {
        setFormData(prev => ({
            ...prev,
            [field]: value === '' ? '' : Number(value)
        }));
    };

    const handlePredict = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setPrice(null);

        try {
            const response = await API.post('/predict', formData);
            
            if (response.data && response.data.predicted_price) {
                setPrice(response.data.predicted_price);
            } else {
                setError('Calculation vector processing error.');
            }
        } catch (err) {
            console.error(err);
            setError(err.response?.data?.error || 'Failed to establish transmission with backend engine.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="predict-viewport-container">
            <div className="predict-split-layout">
                
                <form className="predict-form-card" onSubmit={handlePredict}>
                    <h2 className="predict-section-title">Valuation Parameters</h2>
                    <p className="predict-section-subtitle">Provide geometric and architectural dimensions to run calculations.</p>

                    <div className="form-fields-grid">
                        <div className="form-group">
                            <label className="form-label">Bedrooms</label>
                            <input type="number" className="predict-input-select" value={formData.bedrooms} onChange={(e) => handleInputChange('bedrooms', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Bathrooms</label>
                            <input type="number" step="0.25" className="predict-input-select" value={formData.bathrooms} onChange={(e) => handleInputChange('bathrooms', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Living Space (Sqft)</label>
                            <input type="number" className="predict-input-select" value={formData.sqft_living} onChange={(e) => handleInputChange('sqft_living', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Lot Size (Sqft)</label>
                            <input type="number" className="predict-input-select" value={formData.sqft_lot} onChange={(e) => handleInputChange('sqft_lot', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Total Floors</label>
                            <input type="number" step="0.5" className="predict-input-select" value={formData.floors} onChange={(e) => handleInputChange('floors', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Waterfront View</label>
                            <select className="predict-input-select" value={formData.waterfront} onChange={(e) => handleInputChange('waterfront', e.target.value)}>
                                <option value={0}>No Waterfront</option>
                                <option value={1}>Waterfront Property</option>
                            </select>
                        </div>
                        <div className="form-group">
                            <label className="form-label">View Grade (0-4)</label>
                            <input type="number" min="0" max="4" className="predict-input-select" value={formData.view} onChange={(e) => handleInputChange('view', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Condition Index (1-5)</label>
                            <input type="number" min="1" max="5" className="predict-input-select" value={formData.condition} onChange={(e) => handleInputChange('condition', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Construction Grade (1-13)</label>
                            <input type="number" min="1" max="13" className="predict-input-select" value={formData.grade} onChange={(e) => handleInputChange('grade', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Above Ground (Sqft)</label>
                            <input type="number" className="predict-input-select" value={formData.sqft_above} onChange={(e) => handleInputChange('sqft_above', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Basement Space (Sqft)</label>
                            <input type="number" className="predict-input-select" value={formData.sqft_basement} onChange={(e) => handleInputChange('sqft_basement', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year Built</label>
                            <input type="number" className="predict-input-select" value={formData.yr_built} onChange={(e) => handleInputChange('yr_built', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Year Renovated</label>
                            <input type="number" className="predict-input-select" value={formData.yr_renovated} onChange={(e) => handleInputChange('yr_renovated', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Latitude Coordinate</label>
                            <input type="number" step="0.0001" className="predict-input-select" value={formData.lat} onChange={(e) => handleInputChange('lat', e.target.value)} required />
                        </div>
                        <div className="form-group">
                            <label className="form-label">Longitude Coordinate</label>
                            <input type="number" step="0.0001" className="predict-input-select" value={formData.long} onChange={(e) => handleInputChange('long', e.target.value)} required />
                        </div>
                    </div>

                    <button className="btn-predict-calculate" type="submit" disabled={loading}>
                        {loading ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
                        {loading ? 'Executing Evaluation...' : 'Run Valuation Model'}
                    </button>
                </form>

                <div className="predict-result-display">
                    {loading && (
                        <div>
                            <Loader2 style={{ color: 'var(--primary)' }} className="animate-spin" size={44} />
                            <p style={{ marginTop: '16px', fontWeight: '500' }}>Evaluating node weights...</p>
                        </div>
                    )}

                    {!loading && !price && !error && (
                        <>
                            <Sliders className="result-placeholder-icon" size={48} />
                            <p className="result-prompt-text">Awaiting Ingestion Parameters</p>
                            <p className="result-subtext">Fill out the structural metrics layout and execute the calculator to display real-time machine pricing projections.</p>
                        </>
                    )}

                    {error && (
                        <div style={{ color: '#ef4444' }}>
                            <p style={{ fontWeight: '600' }}>Inference Interrupted</p>
                            <p className="result-subtext">{error}</p>
                        </div>
                    )}

                    {price && (
                        <div className="valuation-badge-container">
                            <h3 className="valuation-heading">ESTIMATED MARKET VALUE</h3>
                            <div className="valuation-price">
                                <span style={{ fontSize: '1.75rem', marginRight: '4px', color: 'var(--text-muted)' }}>$</span>
                                {price.toLocaleString('en-US', { maximumFractionDigits: 0 })}
                            </div>
                            <span className="valuation-currency">USD Valuation (Note⚠️: This model is trained on Seattle data set other location's value may not be accurate)</span>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
};

export default Predict;