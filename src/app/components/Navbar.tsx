"use client";

import Link from 'next/link';
import { useState } from 'react';

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#222',
      color: '#fff',
      position: 'relative',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Karaoke App
      </div>
      {/* Hamburger for mobile */}
      <button
        onClick={() => setMenuOpen(!menuOpen)}
        style={{
          display: 'none',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          width: 32,
          height: 32,
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          zIndex: 2,
        }}
        aria-label="Toggle menu"
        className="navbar-hamburger"
      >
        <span style={{ width: 24, height: 3, background: '#fff', margin: 3, borderRadius: 2 }} />
        <span style={{ width: 24, height: 3, background: '#fff', margin: 3, borderRadius: 2 }} />
        <span style={{ width: 24, height: 3, background: '#fff', margin: 3, borderRadius: 2 }} />
      </button>
      {/* Links */}
      <div
        className="navbar-links"
        style={{
          display: 'flex',
          gap: '1.5rem',
        }}
      >
        <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link href="/submit" style={{ color: '#fff', textDecoration: 'none' }}>Submit Song</Link>
        <Link href="/queue" style={{ color: '#fff', textDecoration: 'none' }}>Queue</Link>
        <Link href="/maindisplay" style={{ color: '#fff', textDecoration: 'none' }}>Main Display</Link>
        <Link href="/qr" style={{ color: '#fff', textDecoration: 'none' }}>QR</Link>
      </div>
      <style jsx>{`
        @media (max-width: 768px) {
          .navbar-links {
            position: absolute;
            top: 100%;
            right: 0;
            background: #222;
            flex-direction: column;
            width: 200px;
            gap: 0;
            box-shadow: 0 2px 8px rgba(0,0,0,0.15);
            display: ${menuOpen ? 'flex' : 'none'};
            z-index: 1;
          }
          .navbar-links a {
            padding: 1rem 2rem;
            border-bottom: 1px solid #333;
          }
          .navbar-hamburger {
            display: flex !important;
          }
        }
      `}</style>
    </nav>
  );
};

export default Navbar; 