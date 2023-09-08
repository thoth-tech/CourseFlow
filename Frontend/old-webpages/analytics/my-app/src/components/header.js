import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
        </div>
        <nav className="navbar">
          <ul className="navbar-menu">
            <li><a href="/">Timetable</a></li>
            <li><a href="/">Discovery</a></li>
            <li><a href="/">Analytics</a></li>
          </ul>
        </nav>
        <div className="profile-button">

        </div>
      </div>
    </header>
  );
}

export default Header;
