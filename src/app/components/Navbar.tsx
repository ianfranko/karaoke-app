import Link from 'next/link';

const Navbar = () => {
  return (
    <nav style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '1rem 2rem',
      background: '#222',
      color: '#fff',
    }}>
      <div style={{ fontWeight: 'bold', fontSize: '1.5rem' }}>
        Karaoke App
      </div>
      <div style={{ display: 'flex', gap: '1.5rem' }}>
        <Link href="/" style={{ color: '#fff', textDecoration: 'none' }}>Home</Link>
        <Link href="/submit" style={{ color: '#fff', textDecoration: 'none' }}>Submit Song</Link>
        <Link href="/queue" style={{ color: '#fff', textDecoration: 'none' }}>Queue</Link>
        <Link href="/maindisplay" style={{ color: '#fff', textDecoration: 'none' }}>Main Display</Link>
        <Link href="/admin" style={{ color: '#fff', textDecoration: 'none' }}>Admin</Link>
        <Link href="/qr" style={{ color: '#fff', textDecoration: 'none' }}>QR</Link>
      </div>
    </nav>
  );
};

export default Navbar; 