import React from 'react';

import './bootstrap.css';

const Navigation = () => {
    return  (
        <div>
            <nav className="navbar navbar-light bg-light">
          <span className="navbar-brand mb-0 h1">Navbar</span>
        </nav>
        <div className="container">
          <div className="row justify-content-center my-2">
              <h1>Welcome to the Weather App</h1>
              <h3>Find out the weather anywhere in the continental USA</h3>
          </div>
        </div>
        </div>
    );
}

export default Navigation;