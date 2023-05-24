import React from 'react';
import './Header.css';

const Header = () => {
  return (
    <header className="header">
      <div className="container">
        <div className="logo">
        <img src="../img/logo.png" alt="Logo"></img>
        </div>
        <nav className="navbar">
          <ul className="navbar-menu">
            <li><a href="/">Home</a></li>
            <li><a href="/dashboard">Dashboard</a></li>
            <li><a href="/settings">Settings</a></li>
            <li><a href="/logout">Logout</a></li>
          </ul>
        </nav>
      </div>
    </header>
  );
}

export default Header;
