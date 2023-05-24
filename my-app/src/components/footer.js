import React from 'react';
import './Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          <div className="footer-column">
            <h3>About Us</h3>
            <p>This website is for an Deakin RapidX project</p>
          </div>
          <div className="footer-column">
            <h3>Contact</h3>
            <p>Deakin Uni, Melbourne, Australia</p>
            <p>Email: wangteng@deakin.edu.au</p>
            <p>GitHub: https://github.com/Knightwau2/CourseFlow?organization=Knightwau2&organization=Knightwau2</p>
          </div>
          <div className="footer-column">
            <h3>Links</h3>
            <ul className="footer-links">
              <li><a href="/timetable">Timetable View</a></li>
              <li><a href="/discovery">Discovery View</a></li>
              <li><a href="/">Analytics View</a></li>
              <li><a href="/wam">WAM calculator</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
