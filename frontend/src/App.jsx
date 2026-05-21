import React, { useState, useEffect } from 'react';
import Home from './components/home';
import Login from './components/login';
import Predict from './components/Predict';
import Profile from './components/Profile';
import API from './api';
import { Sun, Moon, Home as HomeIcon, Cpu, User } from 'lucide-react';
import './index.css';  
import './App.css';    

function App() {
  const [view, setView] = useState('home'); 
  const [user, setUser] = useState(null);    
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('app-theme') || 'light';
  });

  useEffect(() => {
    const checkUserAuth = async () => {
      const storedToken = localStorage.getItem('token');
      if (!storedToken) {
        setLoading(false);
        return;
      }
      try {
        const response = await API.get('/auth/status');
        if (response.data.loggedIn) {
          setUser(response.data.user);
        } else {
          localStorage.removeItem('token');
        }
      } catch (error) {
        console.error("Authentication session check failed:", error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    const responseInterceptor = API.interceptors.response.use(
      (response) => response, 
      (error) => {
        if (error.response && (error.response.status === 401 || error.response.status === 403)) {
          console.warn("Session token expired or compromised. Expelling active profile memory...");
          localStorage.removeItem('token');
          setUser(null);
          setView('login');
        }
        return Promise.reject(error);
      }
    );

    checkUserAuth();
    return () => {
      API.interceptors.response.eject(responseInterceptor);
    };
  }, []);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    localStorage.setItem('app-theme', nextTheme);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setUser(null);
    setView('home');
  };
  if (loading) {
    return (
      <div className="app-loading-screen">
        <div>Loading Application State Matrix...</div>
      </div>
    );
  }

  return (
    <div className={`app-root-shell theme-${theme}`}>
      <nav className="app-navbar">
        <div className="nav-brand" onClick={() => setView('home')}>🏡 HPred</div>
        
        <div className="nav-links-cluster">
          <span 
            className={`nav-item ${view === 'home' ? 'nav-item-active' : ''}`} 
            onClick={() => setView('home')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <HomeIcon size={14} /> Home
            </div>
          </span>
          <span 
            className={`nav-item ${view === 'predict' ? 'nav-item-active' : ''}`} 
            onClick={() => setView('predict')}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Cpu size={14} /> Predict Price
            </div>
          </span>
          
          {user ? (
            <>
              <span 
                className={`nav-item ${view === 'profile' ? 'nav-item-active' : ''}`} 
                onClick={() => setView('profile')}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <User size={14} /> Dashboard ({user.username})
                </div>
              </span>
              <button onClick={handleLogout} className="btn-nav-logout">
                Logout
              </button>
            </>
          ) : (
            <button onClick={() => setView('login')} className="btn-nav-login">
              Sign In
            </button>
          )}
          <button onClick={toggleTheme} className="btn-theme-toggle" title="Toggle Theme mode">
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
        </div>
      </nav>
      <main className="app-main-viewport">
        {view === 'home' && <Home user={user} setView={setView} theme={theme} />}
        {view === 'login' && <Login setUser={setUser} setView={setView} />}
        {view === 'predict' && <Predict />}
        {view === 'profile' && <Profile />}
      </main>
    </div>
  );
}

export default App;