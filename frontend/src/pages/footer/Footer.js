import React from 'react';
import '../../styles/footer/Footer.css';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-content">
        <p>&copy; {new Date().getFullYear()} Klækken Nettjenester. All rights reserved.</p>
        <div className="footer-links">
          <a href="/om-oss">Om oss</a>
          <a href="/personvern">Personvern</a>
          <a href="/vilkår">Vilkår</a>
          <a href="/kontakt">Kontakt</a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
