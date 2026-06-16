import React from 'react';
import { BlockchainProvider } from './context/BlockchainContext';
import Home from './pages/Home';
import Dashboard from './pages/Dashboard';
import './App.css';

function App() {
  const [currentPage, setCurrentPage] = React.useState('home');

  return (
    <BlockchainProvider>
      <div className="app">
        <nav className="navbar">
          <div className="nav-brand">
            <h1>Charity Tracker</h1>
          </div>
          <ul className="nav-links">
            <li>
              <button
                className={currentPage === 'home' ? 'active' : ''}
                onClick={() => setCurrentPage('home')}
              >
                Home
              </button>
            </li>
            <li>
              <button
                className={currentPage === 'dashboard' ? 'active' : ''}
                onClick={() => setCurrentPage('dashboard')}
              >
                Dashboard
              </button>
            </li>
          </ul>
        </nav>

        <main className="main-content">
          {currentPage === 'home' && <Home />}
          {currentPage === 'dashboard' && <Dashboard />}
        </main>

        <footer className="footer">
          <p>&copy; 2024 Charity Donation Tracker. All rights reserved.</p>
        </footer>
      </div>
    </BlockchainProvider>
  );
}

export default App;
