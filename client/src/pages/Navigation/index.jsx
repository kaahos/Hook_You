import "./navigation.css";
import React from "react";

function Navigation(props) {
  return (
    <nav className="nav">
        <a href="/" className="brand">Hook You!</a>
        <ul className="nav__menu">
            <li className="nav__item"><a href="/analyse" className="nav__link">Analyse with Hook You!</a></li>
            <li className="nav__item"><a href="/profile" className="nav__link">Profile</a></li>
            <li className="nav__item"><a href="/about" className="nav__link">About</a></li>
        </ul>
        <div className="nav__toggler">
            <div className="line1"></div>
            <div className="line2"></div>
            <div className="line3"></div>
        </div>
    </nav>
  );
};
export default Navigation;