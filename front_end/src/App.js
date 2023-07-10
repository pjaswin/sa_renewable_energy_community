import React from 'react';
import './App.css';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';

import LandingPage from "./pages/LandingPage";
import LoginPage from "./pages/LoginPage.js";
import RegisterPage from "./pages/RegisterPage.js";
import HomePage from "./pages/HomePage.js";

function App() {
  return (
    <div className='vh-100 gradient-custom'>
      <div className='container-fluid'>
        <Router>
          <nav className='navbar navbar-expand-lg navbar-dark bg-dark mb-4'>
            <div className='container-fluid'>
              <Link to='/' className='navbar-brand'>
                <h3 className='lead'>Palakkad Renewable Energy Community</h3>
              </Link>
              <button
                className='navbar-toggler'
                type='button'
                data-bs-toggle='collapse'
                data-bs-target='#navbarNav'
                aria-controls='navbarNav'
                aria-expanded='false'
                aria-label='Toggle navigation'
              >
                <span className='navbar-toggler-icon'></span>
              </button>
              <div className='collapse navbar-collapse' id='navbarNav'>
                <ul className='navbar-nav ms-auto'>
                  <li className='nav-item'>
                    <Link to='/' className='nav-link'>
                      Home
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/login' className='nav-link'>
                      Logout
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/register' className='nav-link'>
                      Register
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/contact' className='nav-link'>
                      Contact
                    </Link>
                  </li>
                  <li className='nav-item'>
                    <Link to='/about' className='nav-link'>
                      About
                    </Link>
                  </li>
                </ul>
              </div>
            </div>
          </nav>

          <Routes>
            <Route path='/' element={<LandingPage />} />
            <Route path='/login' element={<LoginPage />} />
            <Route path='/register' element={<RegisterPage />} />
            <Route path='/home' element={<HomePage />} />
          </Routes>
        </Router>
      </div>
    </div>
  );
}

export default App;
